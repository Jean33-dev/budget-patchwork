
import React from "react";

interface ChartLegendItemProps {
  name: string;
  displayName: string;
}

/**
 * Component for rendering a chart legend item with truncated text and tooltip
 */
export const ChartLegendItem: React.FC<ChartLegendItemProps> = ({ name, displayName }) => {
  return (
    <span 
      style={{ 
        color: "#4A5568", 
        fontSize: "13px", 
        paddingLeft: "4px",
        maxWidth: "120px",
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}
      title={name} // Show full name on hover
    >
      {displayName}
    </span>
  );
};
