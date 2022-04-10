import { Reducer } from 'redux';
import { PayloadAction } from 'utils/actionTypes';

export const SET_MOBILE = '@ui/SET_MOBILE';

type SetMobileAction = PayloadAction<typeof SET_MOBILE, boolean>;

export function setMobile(value: boolean): SetMobileAction {
  return {
    type: SET_MOBILE,
    payload: value,
  };
}

const mobileReducer: Reducer<boolean, SetMobileAction> = (
  state = false,
  action: SetMobileAction,
): boolean => {
  switch (action.type) {
    case SET_MOBILE:
      return action.payload;
    default:
      return state;
  }
};

export default mobileReducer;
