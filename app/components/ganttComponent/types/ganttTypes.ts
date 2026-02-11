import { GanttTask } from "@/lib/types";

export interface GanttColors {
  summary: string;
  task: string;
  milestone: string;
  progressFill: string;
  progressBg: string;
  border: string;
  text: string;
  background: string;
  selectedColor: string;
  gridLineColor: string;
  arrowColor: string;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  task: GanttTask | null;
}

export interface HierarchicalTask extends GanttTask {
  children: string[];
  level: number;
}

export interface TaskBarConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  progress: number;
  type: string;
  selected: boolean;
}

export interface GanttConfig {
  rowHeight: number;
  taskHeight: number;
  milestoneSize: number;
  leftPanelWidth: number;
  headerHeight: number;
  timeHeaderHeight: number;
  minCellWidth: number;
  gridLineColor: string;
  selectedColor: string;
  arrowColor: string;
}

export interface PanelConfig {
  nameWidth: number;
  startDateWidth: number;
  endDateWidth: number;
  durationWidth: number;
  codeWidth: number;
  totalWidth: number;
}