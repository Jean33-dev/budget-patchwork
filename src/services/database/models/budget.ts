
export interface Budget {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "budget";
  categoryId?: string;
  carriedOver?: number;
  dashboardId?: string; // Ajout de l'ID du tableau de bord
}
