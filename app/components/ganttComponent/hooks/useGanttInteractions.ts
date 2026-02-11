import { useCallback, Dispatch, SetStateAction } from "react";
import { TaskUpdate } from "@/lib/types";
import { TooltipState, GanttConfig, HierarchicalTask } from "../types/ganttTypes";

interface UseGanttInteractionsProps {
  createTaskHierarchy: () => HierarchicalTask[];
  onTaskUpdate: (taskId: string, updates: TaskUpdate) => void;
  config: GanttConfig;
  setSelectedTask: Dispatch<SetStateAction<string | null>>;
  setTooltip: Dispatch<SetStateAction<TooltipState>>;
}

export const useGanttInteractions = ({
  createTaskHierarchy,
  onTaskUpdate,
  config,
  setSelectedTask,
  setTooltip
}: UseGanttInteractionsProps) => {
  
  // Manejar click en canvas
  const handleCanvasClick = useCallback((
    event: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    containerRef: React.RefObject<HTMLDivElement>
  ) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Posición del mouse relativa al canvas considerando scroll
    const mouseX = event.clientX - rect.left + container.scrollLeft;
    const mouseY = event.clientY - rect.top + container.scrollTop;
    
    // Posición del mouse relativa al contenedor (para verificar si está dentro)
    const containerMouseX = event.clientX - containerRect.left;
    const containerMouseY = event.clientY - containerRect.top;
    
    // Verificar si el mouse está dentro del área visible del contenedor
    const isInsideContainer = containerMouseX >= 0 && 
                             containerMouseX <= container.clientWidth &&
                             containerMouseY >= 0 && 
                             containerMouseY <= container.clientHeight;
    
    // Verificar si el click fue en el panel izquierdo (nombres de tareas)
    if (isInsideContainer && mouseX < config.leftPanelWidth && mouseY > config.headerHeight) {
      const taskIndex = Math.floor((mouseY - config.headerHeight) / config.rowHeight);
      const hierarchicalTasks = createTaskHierarchy();
      const task = hierarchicalTasks[taskIndex];
      
      // Verificar que el taskIndex está dentro del rango válido
      if (task && taskIndex < hierarchicalTasks.length) {
        // Toggle selección
        setSelectedTask(prev => prev === task.id ? null : task.id);
        
        // Toggle para summary tasks (expandir/contraer)
        if (task.type === "Summary") {
          const newOpenState = task.open === false ? true : false; // Toggle explícito
          onTaskUpdate(task.id, { open: newOpenState });
        }
      }
    }
  }, [createTaskHierarchy, onTaskUpdate, config.headerHeight, config.leftPanelWidth, config.rowHeight, setSelectedTask]);

  // Manejar mouse move para tooltips
  const handleMouseMove = useCallback((
    event: MouseEvent,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    containerRef: React.RefObject<HTMLDivElement>
  ) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Posición del mouse relativa al canvas considerando scroll
    const mouseX = event.clientX - rect.left + container.scrollLeft;
    const mouseY = event.clientY - rect.top + container.scrollTop;
    
    // Posición del mouse relativa al contenedor (para verificar si está dentro)
    const containerMouseX = event.clientX - containerRect.left;
    const containerMouseY = event.clientY - containerRect.top;
    
    // Verificar si el mouse está dentro del área visible del contenedor (más flexible)
    const isInsideContainer = containerMouseX >= 0 && 
                             containerMouseX <= container.clientWidth &&
                             containerMouseY >= 0 && 
                             containerMouseY <= container.clientHeight;
    
    // También verificar si el mouse está sobre el canvas (incluye área de scroll)
    const isOverCanvas = event.clientX >= rect.left && 
                        event.clientX <= rect.right &&
                        event.clientY >= rect.top && 
                        event.clientY <= rect.bottom;
    
    if ((isInsideContainer || isOverCanvas) && mouseY > config.headerHeight) {
      const taskIndex = Math.floor((mouseY - config.headerHeight) / config.rowHeight);
      const hierarchicalTasks = createTaskHierarchy();
      
      // Verificar que el taskIndex está dentro del rango válido
      if (taskIndex >= 0 && taskIndex < hierarchicalTasks.length) {
        const task = hierarchicalTasks[taskIndex];
        
        if (task && mouseX > config.leftPanelWidth) {
          setTooltip({
            visible: true,
            x: event.clientX, // Usar posición de pantalla para el tooltip
            y: event.clientY, // Usar posición de pantalla para el tooltip
            task: task
          });
        } else {
          setTooltip(prev => ({ ...prev, visible: false }));
        }
      } else {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  }, [createTaskHierarchy, config.headerHeight, config.leftPanelWidth, config.rowHeight, setTooltip]);

  return {
    handleCanvasClick,
    handleMouseMove
  };
};