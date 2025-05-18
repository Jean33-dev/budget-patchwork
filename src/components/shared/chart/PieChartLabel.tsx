
import React from "react";

interface PieChartLabelProps {
  viewBox: {
    cx: number;
    cy: number;
  };
  totalValue: number;
}

/**
 * Component for rendering the center label of the pie chart
 */
export const PieChartLabel: React.FC<PieChartLabelProps> = ({ viewBox, totalValue }) => {
  const { cx, cy } = viewBox;
  
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
};
