import { ValidAny } from '@beyond/lib/types';
import { CoacheeModel } from '../../models/CoacheeModel';
import { buildMetaQuery } from '../../util/DynamoMeta';
import { queryItem } from '../../util/DynamoIO';
import { getProcessesByCoachee } from './common';

const mapItemToCoach = (item: CoacheeModel): object => {
  const { PK, SK, ...rest } = item;
  return rest;
};

export const getCoachee = async (id: string, includeProcesses = false): Promise<ValidAny> => {
  const queryToProcess = buildMetaQuery(id, 'COACHEE', `#METADATA#${id}`);
  const queryResult = await queryItem(queryToProcess);
  const result: ValidAny = mapItemToCoach(queryResult);

  if (includeProcesses) {
    const processes = await getProcessesByCoachee(id);
    result.processes = process === undefined || process === null ? [] : processes;
  }

  return result;
};
