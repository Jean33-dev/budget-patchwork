import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BudgetData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";  // Updated to include "budget"
}

interface BudgetChartProps {
  data: BudgetData[];
}

const COLORS = {
  income: ["#10B981", "#34D399", "#6EE7B7"],
  expense: ["#EF4444", "#F87171", "#FCA5A5"],
  budget: ["#3B82F6", "#60A5FA", "#93C5FD"],  // Added colors for budget type
};

export const BudgetChart = ({ data }: BudgetChartProps) => {
  // Filter out budget type entries before rendering
  const filteredData = data.filter(item => item.type !== "budget");

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.type][index % COLORS[entry.type].length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)} €`, "Montant"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};