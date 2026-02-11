// Tipos para la aplicación

export interface Customer {
  _id: string;
  name: string;
  email: string;
  image_url: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Interfaces para el Gantt personalizado
export interface GanttTask {
  id: string;
  text: string;
  nombre?: string;  // Campo nombre adicional
  code?: string;    // Campo código adicional
  start: string; // Formato: "YYYY-MM-DD HH:mm:ss"
  end: string;   // Formato: "YYYY-MM-DD HH:mm:ss"
  parent: string | null;
  type: "Summary" | "Task" | "Milestone";
  progress: number; // 0.0 a 1.0
  open?: boolean;  // Solo para Summary tasks
  color?: string;
}

export interface GanttLink {
  id: string;
  source: string;
  target: string;
  type: "e2s"; // end-to-start (solo e2s por requerimiento)
}

export interface Snapshot {
  version: number;
  tasks: GanttTask[];
  links: GanttLink[];
}

// Tipos para escalas de tiempo
export type TimeScale = "minute" | "hour" | "day" | "month" | "quarter" | "year";

// Interface para filtros de fecha
export interface DateFilter {
  startDate?: string;
  endDate?: string;
}

// Interface para configuración del Gantt
export interface GanttConfig {
  timeScale: TimeScale;
  dateFilter: DateFilter;
  showTooltips: boolean;
  allowEdit: boolean;
  theme: "light" | "dark";
}

// Tipos para actualizaciones
export interface TaskUpdate {
  progress?: number;
  start?: string;
  end?: string;
  text?: string;
  parent?: string | null;
  type?: "Summary" | "Task" | "Milestone";
  open?: boolean;
}

export interface LinkUpdate {
  source?: string;
  target?: string;
  type?: "e2s";
}

// WebSocket message types
export interface WebSocketTaskUpdateMessage {
  type: "task_update";
  data: {
    taskId: string;
    updates: TaskUpdate;
  };
  timestamp: string;
}

export interface WebSocketLinkUpdateMessage {
  type: "link_update";
  data: {
    linkId: string;
    updates: LinkUpdate;
  };
  timestamp: string;
}

export interface WebSocketSnapshotUpdateMessage {
  type: "snapshot_update";
  data: Snapshot;
  timestamp: string;
}

export type WebSocketMessage = 
  | WebSocketTaskUpdateMessage 
  | WebSocketLinkUpdateMessage 
  | WebSocketSnapshotUpdateMessage;

// Tipos para eventos del Canvas
export interface CanvasClickEvent {
  x: number;
  y: number;
  taskId?: string;
}

export interface CanvasMouseEvent {
  x: number;
  y: number;
  taskId?: string;
  task?: GanttTask;
}