import { AppState } from '@app/types';

import { CURRENT_USER_NAME, USERS_NAME } from './constants';
import { defaultUser } from './serializers';
import { users } from './slice';

export const selectCurrentUser = (state: AppState) =>
  state[CURRENT_USER_NAME] || defaultUser();

const selectors = users.getSelectors((state: AppState) => state[USERS_NAME]);
export const { selectTable: selectUsers } = selectors;
