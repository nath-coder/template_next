import React from "react";
import { TooltipState } from "../types/ganttTypes";

interface GanttTooltipProps {
  tooltip: TooltipState;
  theme: string | undefined;
}

export const GanttTooltip: React.FC<GanttTooltipProps> = ({ tooltip, theme }) => {
  if (!tooltip.visible || !tooltip.task) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 p-3 rounded-lg text-sm pointer-events-none shadow-lg border ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white border-gray-600' 
          : 'bg-white text-black border-gray-300'
      }`}
      style={{ 
        left: tooltip.x + 10, 
        top: tooltip.y - 30,
        transform: 'translateZ(0)' // Forzar aceleración hardware
      }}
    >
      <div className="font-semibold mb-1">{tooltip.task.nombre || tooltip.task.text}</div>
      <div className="text-xs space-y-1">
        <div>Código: {tooltip.task.code || 'N/A'}</div>
        <div>Inicio: {tooltip.task.start}</div>
        <div>Fin: {tooltip.task.end}</div>
        <div>Progreso: {Math.round(tooltip.task.progress * 100)}%</div>
        <div>Tipo: {tooltip.task.type}</div>
      </div>
    </div>
  );
};