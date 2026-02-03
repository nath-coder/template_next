// Mock data para diferentes vistas del Gantt

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