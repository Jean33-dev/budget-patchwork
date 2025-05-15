
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts";

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

// Palette de couleurs modernes pour une meilleure expérience visuelle
const COLORS = {
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

// Couleur distincte pour le budget non alloué
const UNALLOCATED_COLOR = "#64748B"; // Gris bleuté

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

  // Dimensions ajustées pour un anneau plus épais et plus lisible
  const innerRadius = 70;
  const outerRadius = 110;

  return (
    <div className="relative w-full h-full min-h-[300px]">
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
            paddingAngle={2} // Espacement entre les segments pour un look plus moderne
            cornerRadius={4} // Coins arrondis pour un aspect plus élégant
            stroke="transparent" // Suppression des bordures pour un aspect plus propre
          >
            {chartData.length > 0 && (
              <Label
                position="center"
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-muted-foreground font-medium text-sm"
                      >
                        Total
                      </text>
                      <text
                        x={cx}
                        y={cy + 15}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-foreground font-bold text-base"
                      >
                        {totalValue.toFixed(2)} €
                      </text>
                    </g>
                  );
                }}
              />
            )}
            {chartData.map((entry, index) => {
              // Couleur spéciale pour le budget non alloué
              if (entry.name === "Budget non alloué") {
                return <Cell key={`cell-${index}`} fill={UNALLOCATED_COLOR} />;
              }
              
              // Couleurs normales pour les autres éléments
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.type][index % COLORS[entry.type].length]}
                  style={{ filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))' }} // Effet subtil d'ombre
                />
              );
            })}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)} € (${getPercentage(value)}%)`,
              name
            ]}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              color: "#1A1F2C",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              padding: "10px 14px",
              fontSize: "13px"
            }}
            labelStyle={{
              color: "#1A1F2C",
              fontWeight: "bold",
              marginBottom: "4px"
            }}
            wrapperStyle={{
              outline: "none"
            }}
            cursor={{ fill: "transparent" }} // Désactiver le survol des sections
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#4A5568", fontSize: "13px", paddingLeft: "4px" }}>
                {value}
              </span>
            )}
            iconType="circle"
            iconSize={8}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingTop: "10px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
