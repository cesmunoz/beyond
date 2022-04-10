import { createStore, Store, Action, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './appState';

const DEVTOOLS_CONFIG = {
  name: 'Beyond',
  trace: true,
  traceLimit: 15,
};

export type RootState = ReturnType<typeof rootReducer>;

export const configureStore = (initialState: RootState): Store<RootState, Action> => {
  const composeEnhancers = composeWithDevTools(DEVTOOLS_CONFIG);
  const middleWares = applyMiddleware(thunk);

  return createStore(rootReducer, initialState, composeEnhancers(middleWares));
};
