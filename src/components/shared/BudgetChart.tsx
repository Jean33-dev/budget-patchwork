
import React from "react";
import { PieChart, ResponsiveContainer } from "recharts";
import { BudgetPieChart } from "./chart/BudgetPieChart";
import { BudgetTooltip } from "./chart/BudgetTooltip";
import { BudgetChartLegend } from "./chart/BudgetChartLegend";
import { processChartData } from "./chart/BudgetChartUtils";

interface BudgetData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";
  displayName?: string; // Optional property for display purposes
}

interface BudgetChartProps {
  data: BudgetData[];
  totalIncome?: number;
  addUnallocated?: boolean;
}

export const BudgetChart = ({ data, totalIncome = 0, addUnallocated = false }: BudgetChartProps) => {
  // Process the chart data (add unallocated budget if needed and truncate names)
  const chartData = processChartData(data, totalIncome, addUnallocated);
  
  // Dimensions for a thicker and more readable ring
  const innerRadius = 70;
  const outerRadius = 110;

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <BudgetPieChart 
            chartData={chartData} 
            innerRadius={innerRadius} 
            outerRadius={outerRadius} 
          />
          <BudgetTooltip chartData={chartData} totalIncome={totalIncome} />
          <BudgetChartLegend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
