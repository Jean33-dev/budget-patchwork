
import { expenseTableQueries } from './table';
import { expenseGetQueries } from './get';
import { expenseMutationQueries } from './mutations';

export const expenseQueries = {
  ...expenseTableQueries,
  ...expenseGetQueries,
  ...expenseMutationQueries
};
