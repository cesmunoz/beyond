import User from './User';
import { COACHEE } from '../constants';
import { UserType } from '../types';

export default class Coachee extends User {
  userType: UserType = COACHEE;
}
