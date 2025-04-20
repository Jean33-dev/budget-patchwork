
import { dashboardTableQueries } from './table';
import { dashboardGetQueries } from './get';

export const dashboardQueries = {
  createTable: dashboardTableQueries.createTable,
  getAll: dashboardGetQueries.getAll,
  getById: dashboardGetQueries.getById
};
