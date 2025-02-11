
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BudgetData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";
}

interface BudgetChartProps {
  data: BudgetData[];
  totalIncome?: number;
}

const COLORS = {
  income: ["#10B981", "#34D399", "#6EE7B7"],
  expense: ["#EF4444", "#F87171", "#FCA5A5"],
  budget: [
    "#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#F2FCE2", 
    "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2", "#FDE1D3",
  ],
};

export const BudgetChart = ({ data, totalIncome = 0 }: BudgetChartProps) => {
  // Calculer le total des budgets alloués
  const totalAllocated = data.reduce((sum, item) => sum + item.value, 0);
  
  // Ajouter le budget non alloué aux données
  const remainingBudget = totalIncome - totalAllocated;
  const chartData = [
    ...data,
    {
      name: "Budget non alloué",
      value: remainingBudget > 0 ? remainingBudget : 0,
      type: "budget" as const,
    },
  ];

  // Calculer les pourcentages
  const getPercentage = (value: number) => {
    return ((value / totalIncome) * 100).toFixed(1);
  };

  return (
    <div className="relative w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
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
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
