
import { useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";

export type ChartType = "budget" | "category";

interface Envelope {
  id: string;
  title: string;
  budget: number;
  spent: number;
  type: string; // Changed from union type to allow both database values
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
  
  const budgetChartData = useMemo(() => 
    envelopes
      .filter(env => env.type === "budget")
      .map((env) => ({
        name: env.title,
        value: env.budget,
        type: env.type as "budget",
      })), [envelopes]
  );

  const categoryChartData = useMemo(() => 
    categories.map(category => ({
      name: category.name,
      value: category.total,
      type: "budget" as const,
    }))
  , [categories]);

  const getChartData = (chartType: ChartType) => {
    const chartData = chartType === "budget" ? budgetChartData : categoryChartData.filter(item => item.value > 0);

    console.log(`Données du graphique (${chartType}):`, chartData);
    
    return {
      data: chartData,
      total: totalIncome,
      addUnallocated: true
    };
  };

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
