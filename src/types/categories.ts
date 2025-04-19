
import { Category } from "@/services/database/models/category";

export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
  categoryId?: string;
  carriedOver?: number;
  dashboardId?: string;
}

// Re-export the Category type from the models folder
export type { Category };
