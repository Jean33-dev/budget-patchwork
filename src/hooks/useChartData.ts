
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
  const budgetChartData = useMemo(() => 
    envelopes
      .filter(env => env.type === "budget")
      .map((env) => ({
        name: env.title,
        value: env.budget,
        type: env.type,
      })), [envelopes]
  );

  const categoryTotals = useMemo(() => ({
    necessaire: envelopes
      .filter(env => env.type === "budget" && env.category === "necessaire")
      .reduce((sum, env) => sum + env.budget, 0),
    plaisir: envelopes
      .filter(env => env.type === "budget" && env.category === "plaisir")
      .reduce((sum, env) => sum + env.budget, 0),
    epargne: envelopes
      .filter(env => env.type === "budget" && env.category === "epargne")
      .reduce((sum, env) => sum + env.budget, 0)
  }), [envelopes]);

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
    switch (chartType) {
      case "budget":
        return { data: budgetChartData, total: totalIncome, addUnallocated: true };
      case "category":
        return { data: categoryChartData, total: totalIncome, addUnallocated: true };
      case "type":
        return { data: categoryChartData, total: totalIncome, addUnallocated: false };
      default:
        return { data: [], total: 0, addUnallocated: false };
    }
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
