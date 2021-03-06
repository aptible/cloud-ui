import { api } from '@app/api';
import { defaultEntity } from '@app/hal';
import {
  createReducerMap,
  createTable,
  mustSelectEntity,
} from '@app/slice-helpers';
import type { AppState, DeployService } from '@app/types';

import { CONTAINER_PROFILES, GB } from '../app/utils';
import { selectDeploy } from '../slice';

export const DEFAULT_INSTANCE_CLASS = 'm4';

export const deserializeDeployService = (payload: any): DeployService => {
  return {
    id: `${payload.id}`,
    handle: payload.handle,
    dockerRepo: payload.docker_repo,
    dockerRef: payload.docker_ref,
    processType: payload.process_type,
    command: payload.command,
    containerCount: payload.container_count,
    containerMemoryLimitMb: payload.container_memory_limit_mb,
    instanceClass: payload.instance_class || DEFAULT_INSTANCE_CLASS,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
};

export const defaultDeployService = (
  s: Partial<DeployService> = {},
): DeployService => {
  const now = new Date().toISOString();
  return {
    id: '',
    handle: '',
    dockerRef: '',
    dockerRepo: '',
    processType: '',
    command: '',
    containerCount: 0,
    containerMemoryLimitMb: 0,
    instanceClass: DEFAULT_INSTANCE_CLASS,
    createdAt: now,
    updatedAt: now,
    ...s,
  };
};

export const calcServiceMetrics = (service: DeployService) => {
  const containerProfile =
    CONTAINER_PROFILES[service.instanceClass || DEFAULT_INSTANCE_CLASS];
  const containerSizeGB = service.containerMemoryLimitMb / GB;
  const cpuShare = service.containerMemoryLimitMb / containerProfile.cpuShare;

  const estimatedCostInCents = () => {
    const hoursPerMonth = 731;
    const { costPerContainerHourInCents } = containerProfile;
    return (
      hoursPerMonth *
      service.containerCount *
      containerSizeGB *
      costPerContainerHourInCents
    );
  };
  const estimatedCostInDollars =
    '$' + (estimatedCostInCents() / 100).toFixed(2);

  return {
    containerProfile,
    containerSizeGB,
    cpuShare,
    estimatedCostInCents,
    estimatedCostInDollars,
  };
};

export const DEPLOY_SERVICE_NAME = 'services';
const slice = createTable<DeployService>({
  name: DEPLOY_SERVICE_NAME,
});
const { add: addDeployServices } = slice.actions;
const selectors = slice.getSelectors(
  (s: AppState) => selectDeploy(s)[DEPLOY_SERVICE_NAME],
);
const initService = defaultDeployService();
const must = mustSelectEntity(initService);
export const selectServiceById = must(selectors.selectById);
export const selectServicesByIds = selectors.selectByIds;
export const { selectTableAsList: selectServicesAsList } = selectors;
export const hasDeployService = (a: DeployService) => a.id != '';
export const serviceReducers = createReducerMap(slice);

export const fetchService = api.get<{ id: string }>('/services/:id');

export const serviceEntities = {
  service: defaultEntity({
    id: 'service',
    deserialize: deserializeDeployService,
    save: addDeployServices,
  }),
};
