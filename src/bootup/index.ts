import { REHYDRATE } from 'redux-persist';
import { call, put, select, take } from 'saga-query';

import { fetchCurrentToken } from '@app/auth';
import { thunks } from '@app/api';
import {
  fetchOrganizations,
  selectOrganizationSelected,
} from '@app/organizations';
import { ApiGen, Organization } from '@app/types';
import { selectAccessToken } from '@app/token';
import { fetchUsers } from '@app/users';
import {
  fetchEnvironments,
  fetchStacks,
  fetchApps,
  fetchDatabases,
} from '@app/deploy';

export const bootup = thunks.create(
  'bootup',
  function* onBootup(_, next): ApiGen {
    // wait for redux-persist to rehydrate redux store
    yield take(REHYDRATE);
    yield call(fetchCurrentToken.run, fetchCurrentToken());
    const token: string = yield select(selectAccessToken);
    if (!token) return;

    yield call(fetchData);

    yield next();
  },
);

function* fetchData(): ApiGen {
  yield call(fetchOrganizations.run, fetchOrganizations());
  const org: Organization = yield select(selectOrganizationSelected);
  yield put(fetchUsers({ orgId: org.id }));
  yield put(fetchStacks());
  yield put(fetchEnvironments());
  yield put(fetchApps());
  yield put(fetchDatabases());
}
