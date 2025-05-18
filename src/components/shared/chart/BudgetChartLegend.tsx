
import React from "react";
import { Legend } from "recharts";
import { ChartLegendItem } from "./ChartLegendItem";
import { isBudgetData, truncateName } from "./BudgetChartUtils";

/**
 * Component for rendering the chart legend with customized formatting
 */
export const BudgetChartLegend: React.FC = () => {
  return (
    <Legend
      formatter={(value, entry) => {
        // Safely access the payload and cast only if it matches our expected structure
        const payload = entry && 
                        entry.payload && 
                        typeof entry.payload === 'object' ? 
                          entry.payload : undefined;
                          
        // Get the name to display, using type guard to ensure type safety
        const displayName = isBudgetData(payload) ? 
          truncateName(payload.name) : 
          (typeof value === 'string' ? truncateName(value) : 'Unknown');
        
        // Get full name for tooltip
        const fullName = isBudgetData(payload) ? 
          payload.name : 
          (typeof value === 'string' ? value : 'Unknown');

        return (
          <ChartLegendItem 
            name={fullName} 
            displayName={displayName} 
          />
        );
      }}
      iconType="circle"
      iconSize={8}
      layout="vertical"
      verticalAlign="middle"
      align="right"
      wrapperStyle={{
        paddingTop: "10px",
        maxWidth: "40%", // Limit legend width
        overflowX: "hidden"
      }}
    />
  );
};
