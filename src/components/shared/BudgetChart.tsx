import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BudgetData {
  name: string;
  value: number;
  type: "income" | "expense" | "budget";
}

interface BudgetChartProps {
  data: BudgetData[];
}

const COLORS = {
  income: ["#10B981", "#34D399", "#6EE7B7"],
  expense: ["#EF4444", "#F87171", "#FCA5A5"],
  budget: ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
};

export const BudgetChart = ({ data }: BudgetChartProps) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toFixed(2)} €`}
          >
            {data.map((entry, index) => (
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