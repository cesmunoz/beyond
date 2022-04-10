import { RootState } from 'store';
import { UserType } from '@beyond/lib/types';

export const getRoleSelector = (state: RootState): UserType => state.auth.role;
