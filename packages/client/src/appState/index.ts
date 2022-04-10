import { combineReducers } from 'redux';
import authReducer from './auth';
import apiReducer from './requests';
import loadingReducer from './loading';
import processesReducer from './processes';
import coacheesReducer from './coachees';
import formReducer from './form';
import mobileReducer from './mobile';
import questionnairesReducer from './questionnaires';
import summaryReducer from './summary';

export default combineReducers({
  auth: authReducer,
  api: apiReducer,
  coachees: coacheesReducer,
  form: formReducer,
  loading: loadingReducer,
  mobile: mobileReducer,
  processes: processesReducer,
  questionnaires: questionnairesReducer,
  summary: summaryReducer,
});
