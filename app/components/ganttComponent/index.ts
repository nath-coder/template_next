// Exportar el componente principal refactorizado
export { default } from './CustomGanttChartRefactored';

// Exportar tipos para uso externo si es necesario
export type { 
  GanttColors,
  TooltipState,
  HierarchicalTask,
  TaskBarConfig,
  GanttConfig,
  PanelConfig 
} from './types/ganttTypes';

// Exportar utilidades para uso externo
export { 
  parseDate,
  calculateDuration,
  truncateText,
  getGanttColors 
} from './utils/ganttUtils';

// Exportar configuraciones
export { PANEL_CONFIG, getGanttConfig } from './constants/ganttConfig';