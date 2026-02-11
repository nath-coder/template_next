// Mock data para diferentes vistas del Gantt
import { Snapshot } from "./types";

// MockData específico para el Gantt personalizado
export const mockSnapshot: Snapshot = {
  version: 1,
  tasks: [
    { id: "S1", text: "Línea A (Summary)", nombre: "Línea de Producción A", code: "LP-A01", start: "2026-02-10 08:00:00", end: "2026-02-14 20:00:00", parent: null, type: "Summary", progress: 0.35, open: true },
    { id: "T1", text: "Corte/Prep", nombre: "Corte y Preparación", code: "CT-001", start: "2026-02-10 08:00:00", end: "2026-02-10 10:39:00", parent: "S1", type: "Task", progress: 0.65 },
    { id: "T2", text: "Montaje PCB", nombre: "Montaje Circuito", code: "MT-002", start: "2026-02-10 10:30:00", end: "2026-02-10 13:10:00", parent: "S1", type: "Task", progress: 0.20 },
    { id: "T3", text: "Prueba funcional", nombre: "Test Funcional", code: "TF-003", start: "2026-02-10 13:10:00", end: "2026-02-10 15:00:00", parent: "S1", type: "Task", progress: 0.00 },
    { id: "M1", text: "Hito QA", nombre: "Milestone QA", code: "QA-001", start: "2026-02-10 15:00:00", end: "2026-02-10 15:00:00", parent: "S1", type: "Milestone", progress: 1.0 },

    { id: "S2", text: "Línea B (Summary)", nombre: "Línea de Producción B", code: "LP-B01", start: "2026-02-10 09:00:00", end: "2026-02-10 19:00:00", parent: null, type: "Summary", progress: 0.55, open: true },
    { id: "T4", text: "Setup", nombre: "Configuración", code: "ST-004", start: "2026-02-10 09:00:00", end: "2026-02-10 10:00:00", parent: "S2", type: "Task", progress: 1.0 },
    { id: "T5", text: "Producción", nombre: "Proceso Principal", code: "PR-005", start: "2026-02-10 10:00:00", end: "2026-02-10 17:30:00", parent: "S2", type: "Task", progress: 0.45 },
    { id: "T6", text: "Empaque", nombre: "Empaque Final", code: "EP-006", start: "2026-02-10 17:30:00", end: "2026-02-10 19:00:00", parent: "S2", type: "Task", progress: 0.10 },
  ],
  links: [
    { id: "L1", source: "T1", target: "T2", type: "e2s" },
    { id: "L2", source: "T2", target: "T3", type: "e2s" },
    { id: "L3", source: "T3", target: "M1", type: "e2s" },
    { id: "L4", source: "T4", target: "T5", type: "e2s" },
    { id: "L5", source: "T5", target: "T6", type: "e2s" },
  ],
};

export type Task = {
  id: number | string;
  text: string;
  start?: Date;
  end?: Date;
  duration?: number;
  progress?: number;
  parent?: number | string;
  type?: string;
  open?: boolean;
  color?: string;
  assignee?: {
    name: string;
    avatar?: string;
    email?: string;
  };
};
export type TaskAssignee = {
    name: string;
    avatar?: string;
    email?: string;
};
export type Link = {
  id: number | string;
  source: number | string;
  target: number | string;
  type: "s2s" | "s2e" | "e2s" | "e2e";
};

export type GanttData = {
  tasks: Task[];
  links: Link[];
  title?: string;
  description?: string;
};

// Datos mock para vista de operador
export const operatorMockData: GanttData = {
  title: "Tareas del Operador - Juan Pérez",
  description: "Vista específica de tareas asignadas al operador de turno",
  tasks: [
    {
      id: 1,
      text: "Operaciones de Turno Mañana",
      start: new Date(2026, 1, 3),
      duration: 8,
      type: "summary",
      open: true,
      progress: 60,
      parent: 0,
      color: "#2563EB",
      assignee: {
        name: "Juan Pérez",
        avatar: "JP",
        email: "juan.perez@empresa.com"
      }
    },
    {
      id: 2,
      text: "Inspección de Máquina A",
      start: new Date(2026, 1, 3),
      duration: 1,
      parent: 1,
      progress: 100,
      type: "task",
      color: "#16A34A",
      assignee: {
        name: "Juan Pérez",
        avatar: "JP",
        email: "juan.perez@empresa.com"
      }
    },
    {
      id: 3,
      text: "Producción Pieza #001",
      start: new Date(2026, 1, 3, 9),
      duration: 3,
      parent: 1,
      progress: 75,
      type: "task",
      color: "#DC2626",
      assignee: {
        name: "Juan Pérez",
        avatar: "JP",
        email: "juan.perez@empresa.com"
      }
    },
    {
      id: 4,
      text: "Mantenimiento Preventivo",
      start: new Date(2026, 1, 3, 13),
      duration: 2,
      parent: 1,
      progress: 30,
      type: "task",
      color: "#EA580C",
      assignee: {
        name: "Carlos Técnico",
        avatar: "CT",
        email: "carlos.tecnico@empresa.com"
      }
    },
    {
      id: 5,
      text: "Limpieza y Cierre",
      start: new Date(2026, 1, 3, 15),
      duration: 1,
      parent: 1,
      progress: 0,
      type: "task",
      color: "#7C3AED",
      assignee: {
        name: "Juan Pérez",
        avatar: "JP",
        email: "juan.perez@empresa.com"
      }
    },
  ],
  links: [
    { id: 1, source: 2, target: 3, type: "e2s" },
    { id: 2, source: 3, target: 4, type: "e2s" },
    { id: 3, source: 4, target: 5, type: "e2s" },
  ]
};

// Datos mock para vista de administrador
export const adminMockData: GanttData = {
  title: "Vista Administrador - Gestión de Piezas",
  description: "Planificación general de producción y gestión de recursos",
  tasks: [
    {
      id: 1,
      text: "Línea de Producción A",
      start: new Date(2026, 1, 3),
      duration: 21,
      type: "summary",
      open: true,
      progress: 45,
      parent: 0,
      color: "#0F172A",
      assignee: {
        name: "María Supervisor",
        avatar: "MS",
        email: "maria.supervisor@empresa.com"
      }
    },
    {
      id: 2,
      text: "Pieza Motor #M001",
      start: new Date(2026, 1, 3),
      duration: 5,
      parent: 1,
      progress: 80,
      type: "task",
      color: "#0EA5E9",
      assignee: {
        name: "Pedro Operador",
        avatar: "PO",
        email: "pedro.operador@empresa.com"
      }
    },
    {
      id: 3,
      text: "Pieza Chasis #C001",
      start: new Date(2026, 1, 8),
      duration: 7,
      parent: 1,
      progress: 60,
      type: "task",
      color: "#F59E0B",
      assignee: {
        name: "Ana Especialista",
        avatar: "AE",
        email: "ana.especialista@empresa.com"
      }
    },
    {
      id: 4,
      text: "Ensamblaje Final",
      start: new Date(2026, 1, 15),
      duration: 4,
      parent: 1,
      progress: 20,
      type: "task",
      color: "#10B981",
      assignee: {
        name: "Luis Ensamblador",
        avatar: "LE",
        email: "luis.ensamblador@empresa.com"
      }
    },
    {
      id: 5,
      text: "Control de Calidad",
      start: new Date(2026, 1, 19),
      duration: 2,
      parent: 1,
      progress: 0,
      type: "task",
      color: "#F97316",
      assignee: {
        name: "Rosa QA",
        avatar: "RQ",
        email: "rosa.qa@empresa.com"
      }
    },
    {
      id: 6,
      text: "Empaque y Distribución",
      start: new Date(2026, 1, 21),
      duration: 3,
      parent: 1,
      progress: 0,
      type: "task",
      color: "#8B5CF6",
      assignee: {
        name: "Miguel Logística",
        avatar: "ML",
        email: "miguel.logistica@empresa.com"
      }
    },
  ],
  links: [
    { id: 1, source: 2, target: 3, type: "e2s" },
    { id: 2, source: 3, target: 4, type: "e2s" },
    { id: 3, source: 4, target: 5, type: "e2s" },
    { id: 4, source: 5, target: 6, type: "e2s" },
  ]
};