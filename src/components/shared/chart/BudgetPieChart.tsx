
import React from "react";
import { Pie, Cell, Label } from "recharts";
import { PieChartLabel } from "./PieChartLabel";
import { CHART_COLORS, UNALLOCATED_COLOR } from "./BudgetChartUtils";

interface BudgetPieChartProps {
  chartData: Array<any>;
  innerRadius: number;
  outerRadius: number;
}

/**
 * Component for rendering the pie chart with cells and central label
 */
export const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ 
  chartData, 
  innerRadius, 
  outerRadius 
}) => {
  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Pie
      data={chartData}
      cx="50%"
      cy="50%"
      labelLine={false}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      fill="#8884d8"
      dataKey="value"
      paddingAngle={2} // Spacing between segments for a more modern look
      cornerRadius={4} // Rounded corners for a more elegant look
      stroke="transparent" // Remove borders for a cleaner look
      nameKey="displayName" // Use the truncated name for display
    >
      {chartData.length > 0 && (
        <Label
          position="center"
          content={({ viewBox }) => (
            <PieChartLabel 
              viewBox={viewBox as { cx: number; cy: number }} 
              totalValue={totalValue} 
            />
          )}
        />
      )}
      {chartData.map((entry, index) => {
        // Special color for unallocated budget
        if (entry.name === "Budget non alloué") {
          return <Cell key={`cell-${index}`} fill={UNALLOCATED_COLOR} />;
        }
        
        // Normal colors for other items
        return (
          <Cell
            key={`cell-${index}`}
            fill={CHART_COLORS[entry.type][index % CHART_COLORS[entry.type].length]}
            style={{ filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))' }} // Subtle shadow effect
          />
        );
      })}
    </Pie>
  );
};
