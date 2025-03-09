
export type Expense = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "expense";
  linkedBudgetId?: string;
  date: string;
};

export type Budget = {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
};

export type ExpenseDialogState = {
  addDialogOpen: boolean;
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  isDeleting: boolean;
};

export type ExpenseEditState = {
  selectedExpense: Expense | null;
  editTitle: string;
  editBudget: number;
  editDate: string;
};
