import { APIGatewayProxyResult } from 'aws-lambda';
import {
  ProcessAnswersRequest,
  ProcessFormData,
  CollaboratorRequest,
} from '@beyond/lib/types/processes';
import { COACHEE, COACH } from '@beyond/lib/constants';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ProcessStatus, ProcessType } from '@beyond/lib/enums';
import { ValidAny } from '@beyond/lib/types';
import moment from 'moment';
import { saveUserAnswers } from '../../../shared/api/process/saveEvaluatorAnswers';
import createProcess from '../../../shared/api/process/create';
import { TransactionActions } from '../../../shared/constants';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import {
  buildTransactionItem,
  buildTransaction,
  DynamoUpdateItem,
  DynamoUpdateAction,
  buildMetaUpdateSetItem,
  getKeyValue,
  buildMetaQuery,
  buildMetaPutItem,
} from '../../../shared/util/DynamoMeta';
import { insertTransaction, queryItem } from '../../../shared/util/DynamoIO';
import { getBody, getId } from '../../../shared/util/AwsLambda';
import {
  ok,
  error,
  success,
  created,
  badRequest,
  ApplicationResponse,
} from '../../../shared/util/HttpResponse';
import withAuth, { AuthAPIGatewayProxyEvent } from '../../../shared/middlewares/withAuth';
import { validateAnswers, updateProcessForUser } from './common';
import {
  buildProcessForUser,
  collaboratorProcessEmailTemplate,
  newProcessEmailTemplate,
  updateCoacheePersonalInfo,
} from '../../../shared/api/process/common';
import getCoachs from '../../../shared/api/coach/getCoachs';
import { getCoachee } from '../../../shared/api/coachee/get';
import { createCoachee } from '../../../shared/api/coachee/create';
import { sendEmail } from '../../../shared/services/SimpleEmailService';

const isProcessFullyAnswered = (process: ProcessAnswersRequest): boolean =>
  !!process.collaborators.length;

const getProcessStatus = (process: ProcessAnswersRequest): ProcessStatus => {
  if (isProcessFullyAnswered(process)) {
    return ProcessStatus.WaitingEvaluators;
  }

  return ProcessStatus.PartialAnswered;
};

const buildProcessForCoachee = (
  processId: string,
  payload: ProcessFormData,
  collaborators?: CollaboratorRequest[],
): DocumentClient.TransactWriteItem => {
  const [coachee] = payload.coachees;

  const dynamoItem = buildProcessForUser(processId, payload, COACHEE, coachee.email, collaborators);
  const item = buildMetaPutItem(dynamoItem);
  return buildTransactionItem(item, TransactionActions.Put);
};

const processUpdateIndividualAnswers = (
  id: string,
  model: ProcessAnswersRequest,
  coacheeEmail: string,
): DocumentClient.UpdateItemInput => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'updatedDate', value: moment.utc().format() },
        { name: 'status', value: getProcessStatus(model) },
        { name: 'personalInfo', value: model.personalInfo },
        { name: 'expectation', value: model.expectation },
        { name: 'formType', value: model.formType },
        { name: 'formVersion', value: model.formVersion },
        { name: 'questionnaire', value: model.questionnaire },
        {
          name: 'collaborators',
          value: model.collaborators,
        },
        {
          name: 'coacheeInfo',
          explicit: `coachees[0]`,
          value: {
            fullName: model.personalInfo.fullName,
            company: model.personalInfo.company,
            email: coacheeEmail,
          },
        },
      ],
    },
  ];

  const key = {
    PK: `PROCESS#${id}`,
    SK: `#METADATA#${id}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

const processUpdateTeamAnswers = (
  id: string,
  model: ProcessAnswersRequest,
): DocumentClient.UpdateItemInput => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'updatedDate', value: moment.utc().format() },
        { name: 'status', value: getProcessStatus(model) },
        { name: 'formType', value: model.formType },
        { name: 'formVersion', value: model.formVersion },
        {
          name: 'collaborators',
          value: model.collaborators,
        },
      ],
    },
  ];

  const key = {
    PK: `PROCESS#${id}`,
    SK: `#METADATA#${id}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

const sanitizeBody = (body: ProcessAnswersRequest): ProcessAnswersRequest => ({
  ...body,
  collaborators: body.collaborators.map(c => ({ ...c, email: c.email.toLowerCase() })),
});

const createIndividualAnswers = async (
  email: string,
  id: string,
  body: ProcessAnswersRequest,
): Promise<ApplicationResponse | ApplicationError> => {
  if (!validateAnswers(body)) {
    return badRequest('Invalid process information');
  }

  const sanitizedBody = sanitizeBody(body);

  const processStatus = getProcessStatus(sanitizedBody);

  const itemToProcess = processUpdateIndividualAnswers(id, sanitizedBody, email);
  const updateItem = buildTransactionItem(itemToProcess, TransactionActions.Update);
  const transactions = [updateItem];

  const coachs = await getCoachs();

  coachs.forEach(coach => {
    const coachEmail = getKeyValue(coach.PK);
    transactions.push(
      updateCoacheePersonalInfo(
        `COACH#${coachEmail}`,
        `COACHEE#${email}`,
        sanitizedBody.personalInfo,
      ),
    );
    transactions.push(updateProcessForUser(COACH, coachEmail, id, processStatus));
  });

  transactions.push(
    updateCoacheePersonalInfo(`COACHEE#${email}`, `#METADATA#${email}`, sanitizedBody.personalInfo),
  );
  transactions.push(updateProcessForUser(COACHEE, email, id, processStatus));

  const transaction = buildTransaction(transactions);
  await insertTransaction(transaction);

  // eslint-disable-next-line
  for (const collaborator of sanitizedBody.collaborators) {
    try {
      // eslint-disable-next-line
      await sendEmail(collaboratorProcessEmailTemplate, collaborator.email, {
        email: collaborator.email,
        process: id,
        coachee: sanitizedBody.personalInfo.fullName,
        dueDate: moment.utc().add('weeks', 2).format('DD-MM-YYYY'),
      });
    } catch (ex) {
      console.log('ERROR SENDING EMAIL', ex.message);
    }
  }

  return created(body);
};

const createTeamAnswers = async (
  process: ValidAny,
  email: string,
  body: ProcessAnswersRequest,
): Promise<ApplicationResponse> => {
  const id = process.processId;

  const sanitizedBody = sanitizeBody(body);

  if (process.owner === email) {
    const transactions = [];

    /* eslint-disable */
    for (const collaborator of sanitizedBody.collaborators) {
      let coachee = await getCoachee(collaborator.email);

      if (!coachee.email) {
        coachee = (await createCoachee({ email: collaborator.email })) as ValidAny;

        if (!coachee.confirmHash) {
          throw new Error(`Error creating coachee with email ${collaborator}.`);
        }
      }

      collaborator.fullName = coachee.fullName;
      collaborator.company = coachee.company;

      if (
        !coachee.lastProcessDate ||
        (coachee.lastProcessDate &&
          Math.abs(moment(coachee.lastProcessDate).diff(moment.now(), 'days')) > 60)
      ) {
        await createProcess({
          type: ProcessType.SINGLE,
          coachees: [
            { email: coachee.email, fullName: coachee.fullName, company: coachee.company },
          ],
        });
      }
    }

    const fullCollaborators = [
      ...sanitizedBody.collaborators,
      {
        email: process.owner,
        personalInfo: body.personalInfo,
        answers: body.questionnaire,
        role: '',
      },
    ] as ValidAny[];

    const excludeOwnerCollab = fullCollaborators.filter(c => c.email !== email);

    for (const collaborator of excludeOwnerCollab) {
      const coacheeTeamProcessTransaction = buildProcessForCoachee(
        id,
        {
          type: ProcessType.TEAM,
          coachees: [
            {
              email: collaborator.email,
              fullName: collaborator.fullName,
              company: collaborator.company,
            },
          ],
        },
        fullCollaborators.map(({ email, role }) => ({ email, role })),
      );

      transactions.push(coacheeTeamProcessTransaction);

      await sendEmail(newProcessEmailTemplate, collaborator.email, {
        email: collaborator.email,
        process: id,
        dueDate: moment.utc().add('weeks', 2).format('DD-MM-YYYY'),
        text: 'Tómate tu tiempo para contestar.',
        processType: ProcessType.TEAM,
      });
    }

    const itemToProcess = processUpdateTeamAnswers(id, {
      ...body,
      collaborators: fullCollaborators,
    });
    const updateItem = buildTransactionItem(itemToProcess, TransactionActions.Update);
    transactions.push(updateItem);

    const coachs = await getCoachs();

    coachs.forEach(coach => {
      const coachEmail = getKeyValue(coach.PK);
      transactions.push(
        updateProcessForUser(
          COACH,
          coachEmail,
          id,
          ProcessStatus.PendingAnswers,
          fullCollaborators,
        ),
      );
      transactions.push(
        updateCoacheePersonalInfo(
          `COACH#${coachEmail}`,
          `COACHEE#${email}`,
          sanitizedBody.personalInfo,
        ),
      );
    });

    transactions.push(
      updateCoacheePersonalInfo(
        `COACHEE#${email}`,
        `#METADATA#${email}`,
        sanitizedBody.personalInfo,
      ),
    );

    const transaction = buildTransaction(transactions);
    await insertTransaction(transaction);

    return created({});
  }
  /* eslint-enable */

  const result = await saveUserAnswers(sanitizedBody, process, email, {
    ...sanitizedBody.personalInfo,
    expectation: sanitizedBody.expectation,
  });

  return ok(result);
};

const process = async (
  event: AuthAPIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const body = getBody(event) as ProcessAnswersRequest;
  const id = getId(event);

  const queryToProcess = buildMetaQuery(id, 'PROCESS');
  const queryResult = await queryItem(queryToProcess);

  if (queryResult.type === ProcessType.SINGLE) {
    return createIndividualAnswers(event.email, id, body);
  }

  return createTeamAnswers(queryResult, event.email, body);
};

export const createHandler = async (
  event: AuthAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => process(event).then(success).catch(error);

export const handler = withAuth(createHandler, [COACHEE]);
