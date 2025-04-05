import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BudgetData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";
}

interface BudgetChartProps {
  data: BudgetData[];
  totalIncome?: number;
  addUnallocated?: boolean;
}

const COLORS = {
  income: ["#1A1F2C", "#221F26", "#2C2436"],
  expense: ["#ea384c", "#d41d31", "#b31929"],
  budget: [
    "#8B5CF6", // Vivid Purple
    "#D946EF", // Magenta Pink
    "#F97316", // Bright Orange
    "#7E69AB", // Secondary Purple
    "#6E59A5", // Tertiary Purple
    "#ea384c", // Red
  ],
};

export const BudgetChart = ({ data, totalIncome = 0, addUnallocated = false }: BudgetChartProps) => {
  let chartData = [...data];
  
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

  const getPercentage = (value: number) => {
    if (totalIncome <= 0) {
      // Si pas de revenu total, calcule le pourcentage basé sur la somme de tous les budgets
      const totalBudgetSum = chartData.reduce((sum, item) => sum + item.value, 0);
      return totalBudgetSum > 0 ? ((value / totalBudgetSum) * 100).toFixed(1) : "0.0";
    }
    // Calcul normal basé sur le revenu total
    return ((value / totalIncome) * 100).toFixed(1);
  };

  // Calculate the new thickness by increasing the original thickness by 35%
  // Original: innerRadius=60, outerRadius=80, difference=20
  // 20 * 1.35 = 27, so new thickness should be 27
  // Keep innerRadius at 60 and increase outerRadius to 87
  const innerRadius = 60;
  const outerRadius = 87;  // Increased from 80 to 87 (35% thicker)

  return (
    <div className="relative w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.type][index % COLORS[entry.type].length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)} € (${getPercentage(value)}%)`,
              name
            ]}
            contentStyle={{
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              color: "#1A1F2C",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            labelStyle={{
              color: "#1A1F2C",
              fontWeight: "bold"
            }}
          />
          <Legend
            formatter={(value) => <span style={{ color: "#4A5568" }}>{value}</span>}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
