
import React from "react";
import { Tooltip } from "recharts";
import { getPercentage } from "./BudgetChartUtils";

interface BudgetTooltipProps {
  chartData: Array<any>;
  totalIncome: number;
}

/**
 * Component for rendering the chart tooltip with customized styling
 */
export const BudgetTooltip: React.FC<BudgetTooltipProps> = ({ chartData, totalIncome }) => {
  return (
    <Tooltip
      formatter={(value: number, name: string, props: any) => [
        `${value.toFixed(2)} € (${getPercentage(value, totalIncome, chartData)}%)`,
        props.payload.name // Use original full name in tooltip
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
      cursor={{ fill: "transparent" }} // Disable hovering over sections
    />
  );
};
