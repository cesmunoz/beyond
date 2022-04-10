import R from 'ramda';
import { ProcessType } from '@beyond/lib/enums';

export const mapToFE = (entity: object | null): object => R.omit(['PK', 'SK'], entity);

export const buildProcessTypeText = (processType: string): string =>
  `${processType === ProcessType.TEAM ? 'de ' : ''}${processType}`;
