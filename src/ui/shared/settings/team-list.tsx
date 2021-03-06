import { useQuery } from 'saga-query/react';
import { useSelector } from 'react-redux';

import { fetchUsers, selectUsersAsList } from '@app/users';
import { selectOrganizationSelected } from '@app/organizations';

import { LoadResources } from '../../shared';
import { TeamListView } from './team-list-view';

export function TeamList() {
  const org = useSelector(selectOrganizationSelected);
  const orgId = org.id;
  const query = useQuery(fetchUsers({ orgId }));
  const users = useSelector(selectUsersAsList);

  return (
    <LoadResources query={query} isEmpty={users.length === 0}>
      <TeamListView users={users} />
    </LoadResources>
  );
}
