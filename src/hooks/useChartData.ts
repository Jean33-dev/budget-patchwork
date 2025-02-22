
import { useMemo } from "react";

export type ChartType = "budget" | "category" | "type";

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
  // Debug logs pour voir les enveloppes et leurs catégories
  console.log("Enveloppes reçues:", envelopes);
  
  const budgetChartData = useMemo(() => 
    envelopes
      .filter(env => env.type === "budget")
      .map((env) => ({
        name: env.title,
        value: env.budget,
        type: env.type,
      })), [envelopes]
  );

  const categoryTotals = useMemo(() => {
    const budgetEnvelopes = envelopes.filter(env => env.type === "budget");
    const categories = ["necessaire", "plaisir", "epargne"] as const;
    
    return categories.reduce((acc, category) => {
      const categoryTotal = budgetEnvelopes
        .filter(env => env.category === category)
        .reduce((sum, env) => sum + env.budget, 0);
      
      console.log(`Total ${category}:`, categoryTotal);
      return { ...acc, [category]: categoryTotal };
    }, {
      necessaire: 0,
      plaisir: 0,
      epargne: 0
    });
  }, [envelopes]);

  const categoryChartData = useMemo(() => [
    {
      name: "Nécessaire",
      value: categoryTotals.necessaire,
      type: "budget" as const,
    },
    {
      name: "Plaisir",
      value: categoryTotals.plaisir,
      type: "budget" as const,
    },
    {
      name: "Épargne",
      value: categoryTotals.epargne,
      type: "budget" as const,
    }
  ], [categoryTotals]);

  const getChartData = (chartType: ChartType) => {
    const chartData = (() => {
      switch (chartType) {
        case "budget":
          return budgetChartData;
        case "category":
        case "type":
          return categoryChartData.filter(item => item.value > 0);
        default:
          return [];
      }
    })();

    console.log(`Données du graphique (${chartType}):`, chartData);
    
    return {
      data: chartData,
      total: totalIncome,
      addUnallocated: chartType !== "type"
    };
  };

  const getChartTitle = (chartType: ChartType) => {
    switch (chartType) {
      case "budget":
        return "Répartition des Budgets";
      case "category":
        return "Répartition par Catégories";
      case "type":
        return "Répartition par Type de Catégorie";
      default:
        return "Répartition";
    }
  };

  return {
    getChartData,
    getChartTitle
  };
};
