
/**
 * Palette of modern colors for a better visual experience
 */
export const CHART_COLORS = {
  income: ["#1A1F2C", "#221F26", "#2C2436"],
  expense: ["#ea384c", "#d41d31", "#b31929"],
  budget: [
    "#8B5CF6", // Violet
    "#F97316", // Orange
    "#10B981", // Vert
    "#0EA5E9", // Bleu
    "#D946EF", // Rose
    "#EF4444", // Rouge
    "#F59E0B", // Jaune doré
    "#06B6D4", // Cyan
    "#6366F1", // Indigo
    "#EC4899", // Rose vif
    "#14B8A6", // Turquoise
    "#6D28D9", // Violet foncé
    "#84CC16", // Vert lime
    "#3B82F6", // Bleu ciel
  ],
};

// Distinct color for unallocated budget
export const UNALLOCATED_COLOR = "#64748B"; // Bluish gray

/**
 * Truncate text if needed
 */
export const truncateName = (name: string, maxLength = 20) => {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
};

/**
 * Type guard to check if an object has the required BudgetData properties
 */
export const isBudgetData = (obj: any): obj is { name: string; type: string; value: number } => {
  return obj && typeof obj === 'object' && 'name' in obj && 'type' in obj;
};

/**
 * Calculate percentage based on value and total
 */
export const getPercentage = (value: number, totalIncome: number, chartData: Array<any>): string => {
  if (totalIncome <= 0) {
    // If no total income, calculate percentage based on sum of all budgets
    const totalBudgetSum = chartData.reduce((sum, item) => sum + item.value, 0);
    return totalBudgetSum > 0 ? ((value / totalBudgetSum) * 100).toFixed(1) : "0.0";
  }
  // Normal calculation based on total income
  return ((value / totalIncome) * 100).toFixed(1);
};

/**
 * Process raw chart data and add unallocated budget if needed
 */
export const processChartData = (data: Array<any>, totalIncome = 0, addUnallocated = false) => {
  let chartData = [...data];
  
  // Add unallocated budget entry if needed
  if (addUnallocated) {
    const totalAllocated = data.reduce((sum, item) => sum + item.value, 0);
    const remainingBudget = totalIncome - totalAllocated;
    if (remainingBudget > 0) {
      chartData.push({
        name: "Budget non alloué",
        value: remainingBudget,
        type: "budget" as const,
      });
    }
  }

  // Map data to ensure names aren't too long
  return chartData.map(item => ({
    ...item,
    displayName: truncateName(item.name), // For display purposes
    name: item.name // Keep original name for tooltips
  }));
};
