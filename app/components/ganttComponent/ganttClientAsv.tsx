"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Gantt, Willow } from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Task, Link, GanttData, TaskAssignee } from "@/lib/mockData";

// Componente super bonito para mostrar el asignado
const AssigneeComponent = ({ assignee }: { assignee: TaskAssignee }) => {
  return (
    <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gradient-to-r bg-gray-200 tr dark:bg-gray-700 ansition-all duration-200">
     
      
      {/* Información del asignado */}
      <div className="flex flex-col min-w-0">
        <span className="font-medium text-sm dark:text-slate-700 light: leading-tight truncate">
          {assignee.name}
        </span>
        <span className="text-xs dark:text-slate-500 leading-tight truncate">
          {assignee.email}
        </span>
      </div>
      
      {/* Indicador de estado */}
      <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm flex-shrink-0"></div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AssigneeCell = (props: any) => {
  const task = props.row;
  const assignee: TaskAssignee | undefined = task?.assignee;

  if (!assignee) return null;

  return <AssigneeComponent assignee={assignee} />;
};
const columns = [
  
  {
    id: "assignee", 
    header: "Responsable", 
    width: 280, 
    align: "center" as const,
    cell: AssigneeCell,
  },
  { id: "text", header: "Tarea", width: 250 },
  { id: "start", header: "Inicio", width: 100, align: "center" as const },
  { id: "duration", header: "Duración (hrs)", width: 120, align: "center" as const },
  { id: "add-task", header: "", width: 40, align: "center" as const },
];
type GanttClientAsvProps = {
  data?: GanttData;
  className?: string;
};

export default function GanttClientAsv({ data, className = "" }: GanttClientAsvProps) {
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  const initialTasks = useMemo(() => data?.tasks || [], [data]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const links = useMemo(() => data?.links || [], [data]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  // Escalas mejoradas para mejor visualización de fechas
  const scales = useMemo(
    () => [
      { 
        unit: "month", 
        step: 1, 
        format: "MMMM yyyy" 
      },
      { 
        unit: "week", 
        step: 1, 
        format: "'Semana' w" 
      },
      { 
        unit: "day", 
        step: 1, 
        format: "d MMM" 
      },
    ],
    []
  );

  const onTaskChange = useCallback((updated: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
    );
  }, []);

  // No renderizar el Gantt hasta que el componente esté completamente cargado en el cliente
  if (!isClientLoaded || !data || tasks.length === 0) {
    return (
      <div className={`h-screen w-full border border-border flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground">Cargando Gantt...</div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full ${className}`}>
      {data?.title && (
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{data.title}</h2>
              {data.description && (
                <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
              )}
            </div>
          
          </div>
        </div>
      )}
      <div className="demo" style={{ height: data?.title ? 'calc(100vh - 120px)' : '100vh' }}>
        <div className="flex-1 min-h-0">
      <Willow>
        <div
          className="demo h-full"
        >
          <Gantt
            tasks={tasks}
            links={links}
            scales={scales}
            onTaskChange={onTaskChange}
            columns={columns}
          />
        </div>
      </Willow>
    </div>
      </div>
    </div>
  );
}