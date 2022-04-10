import User from './User';
import { COACH } from '../constants';
import { UserType } from '../types';

export default class Coach extends User {
  userType: UserType = COACH;

  coachId!: string;

  fullName!: string;
}
