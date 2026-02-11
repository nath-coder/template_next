import { GanttConfig, PanelConfig } from "../types/ganttTypes";

export const PANEL_CONFIG: PanelConfig = {
  nameWidth: 200,
  startDateWidth: 100,
  endDateWidth: 100,
  durationWidth: 80,
  codeWidth: 80,
  totalWidth: 560 // nameWidth + startDateWidth + endDateWidth + durationWidth + codeWidth
};

export const getGanttConfig = (panelTotalWidth: number): GanttConfig => ({
  rowHeight: 50,
  taskHeight: 30,
  milestoneSize: 16,
  leftPanelWidth: panelTotalWidth,
  headerHeight: 90,
  timeHeaderHeight: 45,
  minCellWidth: 80,
  gridLineColor: "#e5e7eb",
  selectedColor: "#3b82f6",
  arrowColor: "#6b7280"
});