
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
        value: env.budget, // On utilise bien budget et non spent
        type: env.type,
      })), [envelopes]
  );

  const categoryTotals = useMemo(() => {
    // Debug log pour voir les calculs
    const totals = {
      necessaire: envelopes
        .filter(env => env.category === "necessaire")
        .reduce((sum, env) => {
          console.log("Budget nécessaire:", env.title, env.budget);
          return sum + env.budget;
        }, 0),
      plaisir: envelopes
        .filter(env => env.category === "plaisir")
        .reduce((sum, env) => {
          console.log("Budget plaisir:", env.title, env.budget);
          return sum + env.budget;
        }, 0),
      epargne: envelopes
        .filter(env => env.category === "epargne")
        .reduce((sum, env) => {
          console.log("Budget épargne:", env.title, env.budget);
          return sum + env.budget;
        }, 0)
    };
    
    console.log("Totaux par catégorie:", totals);
    return totals;
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
