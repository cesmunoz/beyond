import { ProcessType, ProcessStatus } from '@beyond/lib/enums';
import { ValidAny } from '@beyond/lib/types';
import { CoacheeProcessFormData } from '@beyond/lib/types/processes';

import BaseModel from './BaseModel';

export class Process extends BaseModel {
  public processId!: string;

  public type!: ProcessType;

  public formVersion?: number;

  public coachees!: CoacheeProcessFormData[];

  public status!: ProcessStatus;

  public form?: [];

  public collaborators?: ValidAny[];

  public createdDate!: string;

  public owner?: string;
}
