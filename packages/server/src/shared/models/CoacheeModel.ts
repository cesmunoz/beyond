import BaseModel from './BaseModel';

export class CoacheeModel extends BaseModel {
  public coachId!: string;

  public email!: string;

  public fullName?: string;

  public company?: string;

  public processes!: Array<object>;

  public ttl?: number;

  public confirmHash?: string;
}
