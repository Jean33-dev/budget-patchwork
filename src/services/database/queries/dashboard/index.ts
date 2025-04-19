
import { dashboardTableQueries } from './table';
import { dashboardGetQueries } from './get';
import { dashboardMutationQueries } from './mutations';

export const dashboardQueries = {
  ...dashboardTableQueries,
  ...dashboardGetQueries,
  ...dashboardMutationQueries
};
