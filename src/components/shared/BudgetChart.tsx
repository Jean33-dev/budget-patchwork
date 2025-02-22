
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
            innerRadius={60}
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
            contentStyle={{
              backgroundColor: "#1A1F2C",
              border: "none",
              borderRadius: "8px",
              color: "white"
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
