
export interface Category {
  id: string;
  name: string;
  budgets: string[];
  total: number;
  spent: number;
  description: string;
}

export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
  carriedOver: number; // Now required to match database model
  dashboardId: string; // Maintenant obligatoire
}
