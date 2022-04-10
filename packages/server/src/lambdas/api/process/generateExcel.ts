import * as excel from 'excel4node';
import { ProcessType } from '@beyond/lib/enums';
import { ValidAny } from '@beyond/lib/types';
import AWS from 'aws-sdk';
import moment from 'moment';
import { EDUCATION_OPTIONS, SENIORITY_OPTIONS } from '@beyond/lib/constants';
import {
  buildMetaQuery,
  DynamoUpdateAction,
  buildMetaUpdateSetItem,
  buildTransactionItem,
  buildTransaction,
  DynamoUpdateItem,
} from '../../../shared/util/DynamoMeta';
import { queryItem, insertTransaction } from '../../../shared/util/DynamoIO';
import { TransactionActions } from '../../../shared/constants';
import getCoachs from '../../../shared/api/coach/getCoachs';
import { FinishedAnswersCoach } from './common';
import { sendEmail } from '../../../shared/services/SimpleEmailService';

const styles = {
  defaultStyle: {
    defaultFont: {
      size: 10,
      name: 'Arial',
      color: '000000',
    },
  },
  numberStyle: {
    alignment: {
      horizontal: 'center',
      shrinkToFit: true,
      vertical: 'top',
    },
  },
  sectionStyle: {
    font: {
      name: 'Calibri',
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#FFFF00',
      fgColor: '#FFFF00',
    },
  },
  questionAnswerStyle: {
    font: {
      name: 'Arial',
      size: 10,
    },
    alignment: {
      wrapText: true,
      vertical: 'top',
    },
  },
  titleStyle: {
    font: {
      name: 'Arial',
      size: 11,
      bold: true,
    },
    alignment: {
      wrapText: true,
      vertical: 'top',
    },
  },
  descriptionStyle: {
    font: {
      name: 'Arial',
      size: 10,
    },
    alignment: {
      wrapText: true,
      vertical: 'top',
    },
  },
};

const getCoachee = async (email: string): Promise<ValidAny> => {
  const queryToProcess = buildMetaQuery(email, 'COACHEE');
  const coachee = await queryItem(queryToProcess);
  if (!coachee) {
    throw new Error('El coachee no existe');
  }
  return coachee;
};

const getQuestionnarie = async (type: string): Promise<ValidAny> => {
  // eslint-disable-next-line
  type = type === 'equipo' ? 'team' : type;
  const queryToProcess = buildMetaQuery(type.toUpperCase(), 'FORMS', 'v0');
  const questionnarie = await queryItem(queryToProcess);
  if (!questionnarie) {
    throw new Error('El cuestionario no existe');
  }
  return questionnarie;
};

const buildQuestionnaireSection = (
  worksheet: ValidAny,
  form: ValidAny,
  process: ValidAny,
): ValidAny => {
  // Set widths
  worksheet.column(1).setWidth(4);
  worksheet.column(2).setWidth(70);
  worksheet.column(3).setWidth(42);
  worksheet.column(4).setWidth(42);
  worksheet.column(5).setWidth(42);
  worksheet.column(6).setWidth(42);
  worksheet.column(7).setWidth(42);
  worksheet.column(8).setWidth(42);

  // Freeze Panel
  worksheet.row(1).freeze();
  worksheet.column(2).freeze();

  worksheet.cell(1, 1).string('#');

  let row = 3;
  let questionNum = 1;
  form.questionnaire.forEach((item: ValidAny) => {
    // Section
    worksheet.cell(row, 1).string('').style(styles.sectionStyle);
    worksheet.cell(row, 2).string(item.category.replace(/_/g, ' ')).style(styles.sectionStyle);
    row += 1;
    // Questions
    item.questions.forEach((question: ValidAny) => {
      worksheet.cell(row, 1).number(questionNum).style(styles.numberStyle);
      if (item.onlyEvaluator) {
        worksheet.cell(row, 2).string(question.evaluator).style(styles.questionAnswerStyle);
      } else {
        worksheet.cell(row, 2).string(question.question).style(styles.questionAnswerStyle);
      }
      row += 1;
      questionNum += 1;
    });
  });

  // Coachee
  worksheet.cell(1, 3).string('Coachee');
  worksheet.cell(2, 3).string(`${process.personalInfo.fullName} / ${process.coachees[0].email}`);
  row = 3;
  form.questionnaire.forEach((item: ValidAny) => {
    const answers = process.questionnaire[item.category];
    row += 1;
    if (answers) {
      answers.forEach((answerItem: ValidAny) => {
        worksheet.cell(row, 3).number(answerItem.value).style(styles.numberStyle);
        row += 1;
      });
    }
  });

  // Evaluators
  let column = 4;
  const collaborators = process.collaborators.filter(
    (coachee: ValidAny) => coachee.email !== process.owner,
  );
  collaborators.forEach((collaborator: ValidAny, i: number) => {
    row = 3;
    worksheet.cell(1, column).string(`Evaluador Nro.${i + 1}`);
    worksheet.cell(2, column).string(`${collaborator.email} / ${collaborator.role}`);
    if (collaborator.answers) {
      form.questionnaire.forEach((item: ValidAny) => {
        const answers = collaborator.answers[item.category];
        row += 1;
        answers.forEach((answerItem: ValidAny) => {
          if (typeof answerItem.value === 'number') {
            worksheet.cell(row, column).number(answerItem.value).style(styles.numberStyle);
          } else {
            worksheet.cell(row, column).string(answerItem.value).style(styles.questionAnswerStyle);
          }
          row += 1;
        });
      });
    }
    column += 1;
  });
};

const buildCoacheeDetailSection = (
  worksheet: ValidAny,
  process: ValidAny,
  coachee: ValidAny,
): ValidAny => {
  // Set widths
  worksheet.column(1).setWidth(42);
  worksheet.column(2).setWidth(103);

  // Titles
  worksheet.cell(1, 1).string('Nombre y Apellido').style(styles.titleStyle);
  worksheet.cell(2, 1).string('Fecha de nacimiento').style(styles.titleStyle);
  worksheet.cell(3, 1).string('Hora de nacimiento').style(styles.titleStyle);
  worksheet.cell(4, 1).string('Ciudad de nacimiento').style(styles.titleStyle);
  worksheet.cell(5, 1).string('Pais de nacimiento').style(styles.titleStyle);
  worksheet.cell(6, 1).string('Compania').style(styles.titleStyle);
  worksheet.cell(7, 1).string('Rol').style(styles.titleStyle);
  worksheet.cell(8, 1).string('Formación').style(styles.titleStyle);
  worksheet.cell(9, 1).string('Tiempo en el rol').style(styles.titleStyle);
  worksheet.cell(10, 1).string('Que le gustaría lograr con el proceso').style(styles.titleStyle);

  // Details
  const {
    fullName,
    birthDate,
    birthTime,
    city,
    country,
    role,
    education,
    seniority,
    company,
  } = process.personalInfo;
  worksheet.cell(1, 2).string(fullName).style(styles.descriptionStyle);
  worksheet.cell(2, 2).string(birthDate).style(styles.descriptionStyle);
  worksheet.cell(3, 2).string(birthTime).style(styles.descriptionStyle);
  worksheet.cell(4, 2).string(city).style(styles.descriptionStyle);
  worksheet.cell(5, 2).string(country).style(styles.descriptionStyle);
  worksheet.cell(6, 2).string(company).style(styles.descriptionStyle);
  worksheet.cell(7, 2).string(role).style(styles.descriptionStyle);
  let educationText = '';
  // eslint-disable-next-line
  Object.entries(EDUCATION_OPTIONS).map(([key, value]) => {
    if (key === education) {
      educationText = value;
    }
  });
  worksheet.cell(8, 2).string(educationText).style(styles.descriptionStyle);
  let duration = '';
  // eslint-disable-next-line
  Object.entries(SENIORITY_OPTIONS).map(([key, value]) => {
    if (key === seniority) {
      duration = value;
    }
  });
  worksheet.cell(9, 2).string(duration).style(styles.descriptionStyle);
  worksheet
    .cell(10, 2)
    .string(process.expectation || '')
    .style(styles.descriptionStyle);
};

const buildProcessAnalysis = (
  worksheet: ValidAny,
  worksheetResume: ValidAny,
  form: ValidAny,
  process: ValidAny,
): ValidAny => {
  // Set widths
  worksheet.column(1).setWidth(16);
  worksheet.column(2).setWidth(71);
  worksheet.column(3).setWidth(16);
  worksheet.column(4).setWidth(16);
  worksheet.column(5).setWidth(16);

  worksheet.cell(1, 3).string('Propio');
  worksheet.cell(1, 4).string('Promedio');
  worksheet.cell(1, 5).string('Rango');

  // Set widths
  worksheetResume.column(1).setWidth(16);
  worksheetResume.column(2).setWidth(71);
  worksheetResume.column(3).setWidth(16);
  worksheetResume.column(4).setWidth(16);
  worksheetResume.column(5).setWidth(16);

  worksheetResume.cell(1, 3).string('Propio');
  worksheetResume.cell(1, 4).string('Promedio');
  worksheetResume.cell(1, 5).string('Rango');

  let row = 2;
  let rowResume = 2;
  let questionNum = 1;
  form.questionnaire.forEach((item: ValidAny) => {
    // Section
    worksheet.cell(row, 1).string('').style(styles.sectionStyle);
    worksheet.cell(row, 2).string(item.category).style(styles.sectionStyle);

    worksheetResume.cell(rowResume, 1).string('').style(styles.sectionStyle);
    worksheetResume.cell(rowResume, 2).string(item.category).style(styles.sectionStyle);

    row += 1;
    rowResume += 1;
    // Questions
    item.questions.forEach((question: ValidAny) => {
      worksheet.cell(row, 1).number(questionNum).style(styles.numberStyle);
      worksheet.cell(row, 2).string(question.question).style(styles.questionAnswerStyle);
      row += 1;
      questionNum += 1;
    });
  });

  row = 2;
  rowResume = 2;
  Object.keys(process.questionnaire).forEach((item: ValidAny) => {
    const answers = process.questionnaire[item];
    worksheet.cell(row, 3).formula(`SUM(C${row + 1}:C${answers.length + row})`);
    worksheet.cell(row, 4).formula(`SUM(D${row + 1}:D${answers.length + row})`);
    worksheet.cell(row, 5).formula(`SUM(E${row + 1}:E${answers.length + row})`);

    worksheetResume.cell(rowResume, 3).formula(`Analisis!C${row}`);
    worksheetResume.cell(rowResume, 4).formula(`Analisis!D${row}`);
    worksheetResume.cell(rowResume, 5).formula(`Analisis!E${row}`);

    row += 1;
    rowResume += 1;
    answers.forEach((answerItem: ValidAny) => {
      worksheet.cell(row, 3).number(answerItem.value).style(styles.numberStyle);
      const range = `Encuestas!D${row + 1}:M${row + 1}`;
      worksheet.cell(row, 4).formula(`IF(COUNT(${range}), AVERAGE(${range}), 0)`);
      worksheet.cell(row, 5).formula(`MAX(${range}) - MIN(${range})`);
      row += 1;
    });
  });
};

const generateSingleReport = async (process: ValidAny): Promise<ValidAny> => {
  console.log('GENERATE SINGLE REPORT');
  const questionnarie = await getQuestionnarie(process.formType);
  const coachee = await getCoachee(process.coachees[0].email);
  const workbook = new excel.Workbook(styles.defaultStyle);

  const wsQuestionnaire = workbook.addWorksheet('Encuestas');
  const wsCoachee = workbook.addWorksheet('Datos Coachee');
  const wsAnalysis = workbook.addWorksheet('Analisis');
  const wsShortAnalysis = workbook.addWorksheet('Analisis Resumido');

  buildQuestionnaireSection(wsQuestionnaire, questionnarie, process);
  buildCoacheeDetailSection(wsCoachee, process, coachee);
  buildProcessAnalysis(wsAnalysis, wsShortAnalysis, questionnarie, process);
  return workbook;
};

// ====== TEAM =====
const buildTeamQuestionnaireSections = async (
  workbook: ValidAny,
  form: ValidAny,
  process: ValidAny,
) => {
  const worksheet = workbook.addWorksheet('Encuestas');
  // Set widths
  worksheet.column(1).setWidth(4);
  worksheet.column(2).setWidth(70);
  worksheet.column(3).setWidth(42);
  worksheet.column(4).setWidth(42);
  worksheet.column(5).setWidth(42);
  worksheet.column(6).setWidth(42);
  worksheet.column(7).setWidth(42);
  worksheet.column(8).setWidth(42);

  // Freeze Panel
  worksheet.row(1).freeze();
  worksheet.column(2).freeze();

  worksheet.cell(1, 1).string('#');

  let row = 3;
  let questionNum = 1;

  form.questionnaire.forEach((item: ValidAny) => {
    // Section
    worksheet.cell(row, 1).string('').style(styles.sectionStyle);
    worksheet.cell(row, 2).string(item.category.replace(/_/g, ' ')).style(styles.sectionStyle);
    row += 1;
    // Questions
    item.questions.forEach((question: ValidAny) => {
      worksheet.cell(row, 1).number(questionNum).style(styles.numberStyle);
      worksheet.cell(row, 2).string(question.question).style(styles.questionAnswerStyle);
      row += 1;
      questionNum += 1;
    });
  });

  // Principal
  const owner = process.collaborators.find((coachee: ValidAny) => coachee.email === process.owner);
  worksheet.cell(1, 3).string('Miembro 1 / Principal');
  worksheet.cell(2, 3).string(`${owner.email}`);
  row = 3;
  form.questionnaire.forEach((item: ValidAny) => {
    row += 1;
    owner.answers[item.category].forEach((answerItem: ValidAny) => {
      worksheet.cell(row, 3).number(answerItem.value).style(styles.numberStyle);
      row += 1;
    });
  });

  // Collaborators
  let column = 4;
  const collaborators = process.collaborators.filter(
    (coachee: ValidAny) => coachee.email !== process.owner,
  );
  collaborators.forEach((collaborator: ValidAny, i: number) => {
    row = 3;
    worksheet.cell(1, column).string(`Miembro ${i + 2}`);
    worksheet.cell(2, column).string(`${collaborator.email}`);
    form.questionnaire.forEach((item: ValidAny) => {
      row += 1;
      collaborator.answers[item.category].forEach((answerItem: ValidAny) => {
        worksheet.cell(row, column).number(answerItem.value).style(styles.numberStyle);
        row += 1;
      });
    });
    column += 1;
  });
};

const buildCoacheesDetailSections = async (workbook: ValidAny, process: ValidAny) => {
  let i = 0;
  // eslint-disable-next-line
  const collaborators = process.collaborators.filter(
    (collaborator: ValidAny) => collaborator.email !== process.owner,
  );
  const principal = process.collaborators.filter(
    (collaborator: ValidAny) => collaborator.email === process.owner,
  );

  const members = principal.concat(collaborators);

  // eslint-disable-next-line no-restricted-syntax
  for (const item of members) {
    i += 1;
    // eslint-disable-next-line
    const coachee = item.personalInfo; //item.email === process.owner ? await getCoachee(item.email) : item.personalInfo;
    const worksheet = workbook.addWorksheet(`Datos Miembro ${i}`);
    // Set widths
    worksheet.column(1).setWidth(42);
    worksheet.column(2).setWidth(103);

    // Titles
    worksheet.cell(1, 1).string('Nombre y Apellido').style(styles.titleStyle);
    worksheet.cell(2, 1).string('Fecha de nacimiento').style(styles.titleStyle);
    worksheet.cell(3, 1).string('Hora de nacimiento').style(styles.titleStyle);
    worksheet.cell(4, 1).string('Ciudad de nacimiento').style(styles.titleStyle);
    worksheet.cell(5, 1).string('Pais de nacimiento').style(styles.titleStyle);
    worksheet.cell(6, 1).string('Compania').style(styles.titleStyle);
    worksheet.cell(7, 1).string('Rol').style(styles.titleStyle);
    worksheet.cell(8, 1).string('Formación').style(styles.titleStyle);
    worksheet.cell(9, 1).string('Tiempo en el rol').style(styles.titleStyle);
    worksheet.cell(10, 1).string('Que le gustaría lograr con el proceso').style(styles.titleStyle);

    // Details
    const {
      fullName,
      birthDate,
      birthTime,
      city,
      company,
      country,
      role,
      education,
      seniority,
      expectation,
    } = coachee;
    worksheet
      .cell(1, 2)
      .string(fullName || '')
      .style(styles.descriptionStyle);
    worksheet
      .cell(2, 2)
      .string(birthDate || '')
      .style(styles.descriptionStyle);
    worksheet
      .cell(3, 2)
      .string(birthTime || '')
      .style(styles.descriptionStyle);
    worksheet
      .cell(4, 2)
      .string(city || '')
      .style(styles.descriptionStyle);
    worksheet
      .cell(5, 2)
      .string(country || '')
      .style(styles.descriptionStyle);
    worksheet
      .cell(6, 2)
      .string(company || '')
      .style(styles.descriptionStyle);
    worksheet
      .cell(7, 2)
      .string(role || '')
      .style(styles.descriptionStyle);

    let educationText = '';
    // eslint-disable-next-line
    Object.entries(EDUCATION_OPTIONS).map(([key, value]) => {
      if (key === education) {
        educationText = value;
      }
    });
    worksheet.cell(8, 2).string(educationText).style(styles.descriptionStyle);
    let duration = '';
    // eslint-disable-next-line
    Object.entries(SENIORITY_OPTIONS).map(([key, value]) => {
      if (key === seniority) {
        duration = value;
      }
    });
    worksheet.cell(9, 2).string(duration).style(styles.descriptionStyle);
    worksheet
      .cell(10, 2)
      .string(expectation || '')
      .style(styles.descriptionStyle);
  }
};

const buildProcessesAnalysis = async (workbook: ValidAny, form: ValidAny, process: ValidAny) => {
  let i = 0;
  // eslint-disable-next-line
  for (const item of process.collaborators) {
    i += 1;
    const worksheet = workbook.addWorksheet(`Analisis Miembro ${i}`);
    // Set widths
    worksheet.column(1).setWidth(16);
    worksheet.column(2).setWidth(71);
    worksheet.column(3).setWidth(16);
    worksheet.column(4).setWidth(16);
    worksheet.column(5).setWidth(16);

    worksheet.cell(1, 3).string('Propio');
    worksheet.cell(1, 4).string('Promedio');
    worksheet.cell(1, 5).string('Rango');

    let row = 2;
    let questionNum = 1;
    form.questionnaire.forEach((question: ValidAny) => {
      // Section
      worksheet.cell(row, 1).string('').style(styles.sectionStyle);
      worksheet
        .cell(row, 2)
        .string(question.category.replace(/_/g, ' '))
        .style(styles.sectionStyle);

      row += 1;
      // Questions
      question.questions.forEach((questionItem: ValidAny) => {
        worksheet.cell(row, 1).number(questionNum).style(styles.numberStyle);
        worksheet.cell(row, 2).string(questionItem.question).style(styles.questionAnswerStyle);
        row += 1;
        questionNum += 1;
      });
    });

    row = 2;
    const coachee = process.collaborators.find((c: ValidAny) => c.email === item.email);

    Object.keys(coachee.answers).forEach((answersSection: ValidAny) => {
      const answers = coachee.answers[answersSection];
      worksheet.cell(row, 3).formula(`SUM(C${row + 1}:C${answers.length + row})`);
      worksheet.cell(row, 4).formula(`SUM(D${row + 1}:D${answers.length + row})`);
      worksheet.cell(row, 5).formula(`SUM(E${row + 1}:E${answers.length + row})`);

      row += 1;
      answers.forEach((answerItem: ValidAny) => {
        worksheet.cell(row, 3).number(answerItem.value).style(styles.numberStyle);
        const range = `Encuestas!D${row + 1}:M${row + 1}`;
        worksheet.cell(row, 4).formula(`IF(COUNT(${range}), AVERAGE(${range}), 0)`);
        worksheet.cell(row, 5).formula(`MAX(${range}) - MIN(${range})`);
        row += 1;
      });
    });
  }
};

const generateTeamReport = async (process: ValidAny): Promise<ValidAny> => {
  console.log('GENERATE TEAM REPORT');
  const questionnarie = await getQuestionnarie(process.formType);
  const workbook = new excel.Workbook(styles.defaultStyle);

  await buildTeamQuestionnaireSections(workbook, questionnarie, process);
  await buildCoacheesDetailSections(workbook, process);
  await buildProcessesAnalysis(workbook, questionnarie, process);
  return workbook;
};

const processUpdateAnswers = (id: string, reportUrl: string): object => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [{ name: 'report', value: reportUrl }],
    },
  ];

  const key = {
    PK: `PROCESS#${id}`,
    SK: `#METADATA#${id}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

type GenerateExcelEvent = {
  processId: string;
};

const sendEmailsToCoachs = async (process: ValidAny) => {
  const coachs = await getCoachs();
  // eslint-disable-next-line
  for (const item of coachs) {
    // eslint-disable-next-line
    await sendEmail(FinishedAnswersCoach, item.email, {
      email: item.email,
      coachee: process.coachees[0].fullName,
      process: process.processId,
      dueDate: moment.utc().add('weeks', 2).format('DD-MM-YYYY'),
      processType: process.type,
    });
  }
};

export const handler = async (event: GenerateExcelEvent): Promise<void> => {
  const id = event.processId;
  const queryToProcess = buildMetaQuery(id, 'PROCESS');
  const coacheeProcess = await queryItem(queryToProcess);

  if (!coacheeProcess) {
    throw new Error(`No se encontro el proceso con id ${id} `);
  }

  const generateExcel: ValidAny =
    coacheeProcess.formType === ProcessType.SINGLE ? generateSingleReport : generateTeamReport;
  const xls = await generateExcel(coacheeProcess);

  const buffer = await xls.writeToBuffer();

  console.log(`UPLOADING REPORT FOR ${coacheeProcess.processId}`);

  const excelKey = `${coacheeProcess.coachees[0].email}/${
    coacheeProcess.processId
  }/Proceso-respuestas-${coacheeProcess.coachees[0].email}-${moment().format('DD-MM-YYYY')}.xls`;
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  await s3
    .upload({
      Bucket: 'beyond-processes',
      Key: excelKey,
      Body: buffer,
    })
    .promise();

  console.log(`FINISH UPLOADING REPORT FOR ${coacheeProcess.processId}`);

  const itemToProcess = processUpdateAnswers(id, excelKey);
  const updateItem = buildTransactionItem(itemToProcess, TransactionActions.Update);
  const transactions = [updateItem];
  const transaction = buildTransaction(transactions);
  await insertTransaction(transaction);

  await sendEmailsToCoachs(coacheeProcess);
};
