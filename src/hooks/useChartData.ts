
import { useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";

export type ChartType = "budget" | "category";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: "income" | "expense" | "budget";
  category?: string;
}

interface ChartData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";
}

export const useChartData = (envelopes: Envelope[], totalIncome: number) => {
  const { categories } = useCategories();
  console.log("Enveloppes reçues:", envelopes);
  console.log("Catégories disponibles:", categories);
  
  // Générer les données du graphique pour les budgets
  // Filtrer les enveloppes avec budget > 0 pour éviter les sections inutiles
  const budgetChartData = useMemo(() => 
    envelopes
      .filter(env => env.type === "budget" && env.budget > 0)
      .map((env) => ({
        name: env.title,
        value: env.budget,
        type: env.type,
      })), [envelopes]
  );

  // Générer les données du graphique pour les catégories
  const categoryChartData = useMemo(() => 
    categories.map(category => ({
      name: category.name,
      value: category.total,
      type: "budget" as const,
    }))
  , [categories]);

  // Fonction pour obtenir les données du graphique selon le type sélectionné
  const getChartData = (chartType: ChartType) => {
    // Utiliser le type de graphique approprié et filtrer les valeurs nulles
    const chartData = chartType === "budget" 
      ? budgetChartData 
      : categoryChartData.filter(item => item.value > 0);

    console.log(`Données du graphique (${chartType}):`, chartData);
    
    return {
      data: chartData,
      total: totalIncome,
      addUnallocated: chartType === "budget" // Ajouter le budget non alloué uniquement pour le graphique de budget
    };
  };

  // Fonction pour obtenir le titre du graphique selon le type
  const getChartTitle = (chartType: ChartType) => {
    switch (chartType) {
      case "budget":
        return "Répartition des Budgets";
      case "category":
        return "Répartition par Catégories";
      default:
        return "Répartition";
    }
  };

  return {
    getChartData,
    getChartTitle
  };
};
