import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import type { Middleware, Store } from '@reduxjs/toolkit';
// import { BATCH } from 'redux-batched-actions';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { prepareStore } from 'saga-query';

import type { AppState } from '@app/types';
import { resetReducer } from '@app/reset-store';
import { TOKEN_NAME, ELEVATED_TOKEN_NAME } from '@app/token';
import { THEME_NAME } from '@app/theme';

import { sagas, reducers } from './packages';

interface Props {
  initState?: Partial<AppState>;
}

interface AppStore<State> {
  store: Store<State>;
  persistor: any;
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [TOKEN_NAME, ELEVATED_TOKEN_NAME, THEME_NAME],
};

export function setupStore({ initState }: Props): AppStore<AppState> {
  const middleware: Middleware[] = [];

  if (import.meta.env.VITE_DEBUG === 'true') {
    /* const logger = (store: any) => (next: any) => (action: any) => {
      if (action.type === BATCH) {
        console.log('== BATCH ==');
        action.payload.forEach(console.log);
        console.log('== END BATCH ==');
      } else {
        console.log('ACTION', action);
      }
      next(action);
      console.log('NEXT STATE', store.getState());
    };
    middleware.push(logger); */
  }

  const prepared = prepareStore({
    reducers,
    sagas,
  });

  middleware.push(...prepared.middleware);

  // we need this baseReducer so we can wipe the localStorage cache as well as
  // reset the store when a user logs out
  const baseReducer = resetReducer(prepared.reducer, persistConfig);
  const persistedReducer = persistReducer(persistConfig, baseReducer);

  const store = createStore(
    persistedReducer,
    initState as AppState & PersistPartial,
    applyMiddleware(...middleware),
  );
  const persistor = persistStore(store);

  prepared.run();

  return { store, persistor };
}
