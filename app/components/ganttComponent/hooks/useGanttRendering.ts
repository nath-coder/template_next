import { useCallback } from "react";
import { Snapshot, TimeScale } from "@/lib/types";
import { 
  GanttColors, 
  HierarchicalTask, 
  TaskBarConfig, 
  GanttConfig, 
  PanelConfig 
} from "../types/ganttTypes";
import { truncateText, calculateDuration } from "../utils/ganttUtils";

interface UseGanttRenderingProps {
  snapshot: Snapshot;
  timeScale: TimeScale;
  theme: string | undefined;
  colors: GanttColors;
  config: GanttConfig;
  panelConfig: PanelConfig;
  selectedTask: string | null;
  getTimeIntervals: () => string[];
  getTimeHeaderTop: () => string[];
  getTimelineWidth: (minCellWidth: number) => number;
  getDateRange: () => { startDate: Date; endDate: Date };
  getTimePosition: (dateStr: string, startDate: Date, minCellWidth: number) => number;
}

export const useGanttRendering = (props: UseGanttRenderingProps) => {
  const {
    snapshot,
    timeScale,
    theme,
    colors,
    config,
    panelConfig,
    selectedTask,
    getTimeIntervals,
    getTimeHeaderTop,
    getTimelineWidth,
    getDateRange,
    getTimePosition
  } = props;

  // Función para dibujar milestone
  const drawMilestone = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, completed: boolean) => {
    const size = config.milestoneSize;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    
    ctx.fillStyle = completed ? colors.milestone : colors.progressBg;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    
    ctx.fillRect(-size/2, -size/2, size, size);
    ctx.strokeRect(-size/2, -size/2, size, size);
    
    ctx.restore();
  }, [colors, config]);

  // Función para dibujar barra de tarea
  const drawTaskBar = useCallback((ctx: CanvasRenderingContext2D, bar: TaskBarConfig) => {
    // Barra de fondo
    ctx.fillStyle = bar.selected ? colors.selectedColor + "30" : colors.progressBg;
    ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
    
    // Barra de progreso
    const progressWidth = bar.width * bar.progress;
    
    if (bar.type === "Summary") {
      // Summary task con patrón especial
      ctx.fillStyle = colors.summary;
      ctx.fillRect(bar.x, bar.y, progressWidth, bar.height);
      
      // Patrón de líneas para summary
      ctx.strokeStyle = colors.background;
      ctx.lineWidth = 1;
      for (let i = 0; i < progressWidth; i += 8) {
        ctx.beginPath();
        ctx.moveTo(bar.x + i, bar.y);
        ctx.lineTo(bar.x + i, bar.y + bar.height);
        ctx.stroke();
      }
    } else {
      // Task normal
      ctx.fillStyle = colors.progressFill;
      ctx.fillRect(bar.x, bar.y, progressWidth, bar.height);
    }
    
    // Borde
    ctx.strokeStyle = bar.selected ? colors.selectedColor : colors.border;
    ctx.lineWidth = bar.selected ? 2 : 1;
    ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
    
    // Texto de porcentaje si hay espacio
    if (bar.width > 50) {
      ctx.fillStyle = colors.text;
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${Math.round(bar.progress * 100)}%`,
        bar.x + bar.width / 2,
        bar.y + bar.height / 2 + 3
      );
    }
  }, [colors]);

  // Función para dibujar flecha
  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = colors.arrowColor;
    ctx.fillStyle = colors.arrowColor;
    ctx.lineWidth = 2;
    
    // Línea principal
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Punta de flecha
    const arrowLength = 8;
    const arrowAngle = Math.PI / 6;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle - arrowAngle),
      y2 - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.lineTo(
      x2 - arrowLength * Math.cos(angle + arrowAngle),
      y2 - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.closePath();
    ctx.fill();
  }, [colors]);

  // Función para dibujar header de tiempo
  const drawTimeHeader = useCallback((ctx: CanvasRenderingContext2D) => {
    const timelineWidth = getTimelineWidth(config.minCellWidth);

    // Dibujar fondo del header
    ctx.fillStyle = colors.background;
    ctx.fillRect(config.leftPanelWidth, 0, timelineWidth, config.headerHeight);
    
    // Línea divisoria principal
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(config.leftPanelWidth, config.headerHeight);
    ctx.lineTo(config.leftPanelWidth + timelineWidth, config.headerHeight);
    ctx.stroke();

    const intervals = getTimeIntervals();
    const cellWidth = config.minCellWidth;

    // Si es escala de minutos u horas, mostrar fechas en la parte superior
    if (timeScale === "minute" || timeScale === "hour") {
      const headerTop = getTimeHeaderTop();
      ctx.fillStyle = colors.text;
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "left";
      
      // Calcular cuántos intervalos corresponden a cada día
      const intervalsPerDay = timeScale === "minute" ? 48 : 24;
      const dayWidth = cellWidth * intervalsPerDay;
      
      headerTop.forEach((dateText, dayIndex) => {
        const x = config.leftPanelWidth + (dayIndex * dayWidth);
        if (x < config.leftPanelWidth + timelineWidth) {
          ctx.fillText(dateText, x + 5, 20);
        }
      });
      
      // Línea divisoria
      ctx.strokeStyle = colors.gridLineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(config.leftPanelWidth, 30);
      ctx.lineTo(config.leftPanelWidth + timelineWidth, 30);
      ctx.stroke();
    }

    // Si es escala de días, mostrar mes arriba
    if (timeScale === "day") {
      const headerTop = getTimeHeaderTop();
      ctx.fillStyle = colors.text;
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "left";
      
      // Mostrar mes al inicio de cada grupo de días
      let currentMonth = "";
      intervals.forEach((dayText, index) => {
        const x = config.leftPanelWidth + (index * cellWidth);
        const dateRange = getDateRange();
        const date = new Date(dateRange.startDate.getTime() + index * 24 * 60 * 60 * 1000);
        const monthStr = date.toLocaleDateString("es-ES", { month: "short" });
        
        if (monthStr !== currentMonth && index < headerTop.length) {
          currentMonth = monthStr;
          ctx.fillText(headerTop[index], x + 5, 20);
        }
      });
      
      // Línea divisoria para días
      ctx.strokeStyle = colors.gridLineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(config.leftPanelWidth, 30);
      ctx.lineTo(config.leftPanelWidth + timelineWidth, 30);
      ctx.stroke();
    }

    // Dibujar intervalos de tiempo principales
    ctx.fillStyle = colors.text;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    
    intervals.forEach((interval, index) => {
      const x = config.leftPanelWidth + (index * cellWidth);
      
      // Línea vertical
      ctx.strokeStyle = colors.gridLineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const startY = (timeScale === "minute" || timeScale === "hour" || timeScale === "day") ? 30 : 0;
      ctx.moveTo(x, startY);
      ctx.lineTo(x, config.headerHeight);
      ctx.stroke();
      
      // Texto del intervalo con mejor espaciado
      const textY = (timeScale === "minute" || timeScale === "hour" || timeScale === "day") ? 60 : config.headerHeight / 2 + 4;
      ctx.fillStyle = colors.text;
      
      // Verificar que hay suficiente espacio para el texto
      if (cellWidth > 40) {
        ctx.fillText(interval, x + cellWidth / 2, textY);
      }
    });

    // Línea vertical final
    ctx.strokeStyle = colors.gridLineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(config.leftPanelWidth + timelineWidth, 0);
    ctx.lineTo(config.leftPanelWidth + timelineWidth, config.headerHeight);
    ctx.stroke();
    
    // Restablecer textAlign
    ctx.textAlign = "left";
  }, [colors, config, getTimeIntervals, getTimeHeaderTop, getTimelineWidth, timeScale, getDateRange]);

  // Función para dibujar la grilla de fondo
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, tasks: HierarchicalTask[], canvas: HTMLCanvasElement) => {
    // Dibujar líneas verticales de tiempo
    const intervals = getTimeIntervals();
    
    ctx.strokeStyle = colors.gridLineColor;
    ctx.lineWidth = 1;
    
    intervals.forEach((_, index) => {
      const x = config.leftPanelWidth + (index * config.minCellWidth);
      ctx.beginPath();
      ctx.moveTo(x, config.headerHeight);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    });
    
    // Dibujar líneas horizontales de tareas
    tasks.forEach((_, index) => {
      const y = config.headerHeight + ((index + 1) * config.rowHeight);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    });
    
    // Línea vertical separadora del panel izquierdo
    ctx.strokeStyle = colors.gridLineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(config.leftPanelWidth, 0);
    ctx.lineTo(config.leftPanelWidth, canvas.height);
    ctx.stroke();
  }, [colors, config, getTimeIntervals]);

  // Función para dibujar panel izquierdo con nombres de tareas
  const drawLeftPanel = useCallback((ctx: CanvasRenderingContext2D, tasks: HierarchicalTask[]) => {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, config.leftPanelWidth, ctx.canvas.height);
    
    // Línea divisoria vertical
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(config.leftPanelWidth, 0);
    ctx.lineTo(config.leftPanelWidth, ctx.canvas.height);
    ctx.stroke();

    // Dibujar headers de columnas
    ctx.fillStyle = colors.text;
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    
    const headerY = config.headerHeight / 2;
    ctx.fillText("Nombre", panelConfig.nameWidth / 2, headerY);
    ctx.fillText("Código", panelConfig.nameWidth + panelConfig.codeWidth / 2, headerY);
    ctx.fillText("Inicio", panelConfig.nameWidth + panelConfig.codeWidth + panelConfig.startDateWidth / 2, headerY);
    ctx.fillText("Fin", panelConfig.nameWidth + panelConfig.codeWidth + panelConfig.startDateWidth + panelConfig.endDateWidth / 2, headerY);
    ctx.fillText("Duración", panelConfig.nameWidth + panelConfig.codeWidth + panelConfig.startDateWidth + panelConfig.endDateWidth + panelConfig.durationWidth / 2, headerY);
    
    // Líneas divisorias de headers
    ctx.strokeStyle = colors.gridLineColor;
    ctx.lineWidth = 1;
    let xPos = panelConfig.nameWidth;
    
    [panelConfig.codeWidth, panelConfig.startDateWidth, panelConfig.endDateWidth, panelConfig.durationWidth].forEach(width => {
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, ctx.canvas.height);
      ctx.stroke();
      xPos += width;
    });

    tasks.forEach((task, index) => {
      const y = config.headerHeight + (index * config.rowHeight);
      
      // Fondo de fila (alternado)
      if (index % 2 === 0) {
        ctx.fillStyle = theme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(249, 250, 251, 0.8)';
        ctx.fillRect(0, y, config.leftPanelWidth, config.rowHeight);
      }

      const indent = task.level * 20;
      const rowCenterY = y + config.rowHeight / 2 + 4;
      
      // Área para icono de collapse/expand (solo Summary)
      if (task.type === "Summary") {
        const iconX = 10 + indent;
        const iconY = y + config.rowHeight / 2;
        
        ctx.fillStyle = colors.text;
        ctx.font = "12px Arial";
        const icon = task.open !== false ? "▼" : "▶";
        ctx.fillText(icon, iconX, iconY + 3);
      }
      
      // Icono de tipo de tarea
      const typeIconX = 30 + indent;
      ctx.fillStyle = colors.text;
      ctx.font = "14px Arial";
      let typeIcon = "";
      
      if (task.type === "Task") {
        typeIcon = "■";
      } else if (task.type === "Milestone") {
        typeIcon = "♦";
      }
      
      if (typeIcon) {
        ctx.fillText(typeIcon, typeIconX, rowCenterY);
      }
      
      // Columna NOMBRE
      ctx.fillStyle = selectedTask === task.id ? colors.selectedColor : colors.text;
      ctx.font = task.type === "Summary" ? "bold 12px Arial" : "12px Arial";
      ctx.textAlign = "left";
      const nameX = 50 + indent;
      const nameMaxWidth = panelConfig.nameWidth - nameX - 10;
      const truncatedName = truncateText(ctx, task.nombre || task.text, nameMaxWidth);
      ctx.fillText(truncatedName, nameX, rowCenterY);
      
      // Columna CÓDIGO
      ctx.fillStyle = colors.text;
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      const codeX = panelConfig.nameWidth + panelConfig.codeWidth / 2;
      ctx.fillText(task.code || "-", codeX, rowCenterY);
      
      // Columna INICIO
      ctx.textAlign = "center";
      const startX = panelConfig.nameWidth + panelConfig.codeWidth + panelConfig.startDateWidth / 2;
      const startDateStr = new Date(task.start).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
      ctx.fillText(startDateStr, startX, rowCenterY);
      
      // Columna FIN
      const endX = panelConfig.nameWidth + panelConfig.codeWidth + panelConfig.startDateWidth + panelConfig.endDateWidth / 2;
      const endDateStr = new Date(task.end).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
      ctx.fillText(endDateStr, endX, rowCenterY);
      
      // Columna DURACIÓN
      const durationX = panelConfig.nameWidth + panelConfig.codeWidth + panelConfig.startDateWidth + panelConfig.endDateWidth + panelConfig.durationWidth / 2;
      const duration = calculateDuration(task.start, task.end);
      ctx.fillText(duration, durationX, rowCenterY);
      
      // Línea horizontal
      ctx.strokeStyle = colors.gridLineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y + config.rowHeight);
      ctx.lineTo(config.leftPanelWidth, y + config.rowHeight);
      ctx.stroke();
    });
  }, [colors, config, selectedTask, theme, panelConfig]);

  // Función para dibujar barras de tareas
  const drawTaskBars = useCallback((ctx: CanvasRenderingContext2D, tasks: HierarchicalTask[]) => {
    const dateRange = getDateRange();
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;

    // Filtrar tareas que están dentro del rango de fechas visible
    const visibleTasks = tasks.filter(task => {
      const taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);
      
      // Mostrar la tarea si se superpone con el rango visible
      return taskEnd >= startDate && taskStart <= endDate;
    });

    visibleTasks.forEach((task) => {
      // Usar el índice original para mantener la posición vertical correcta
      const originalIndex = tasks.findIndex(t => t.id === task.id);
      const y = config.headerHeight + (originalIndex * config.rowHeight) + (config.rowHeight - config.taskHeight) / 2;
      
      const taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);
      
      // Calcular posiciones, pero ajustar para el rango visible
      const rawStartX = config.leftPanelWidth + getTimePosition(task.start, startDate, config.minCellWidth);
      const rawEndX = config.leftPanelWidth + getTimePosition(task.end, startDate, config.minCellWidth);
      
      // Ajustar startX: si la tarea empieza antes del rango visible, empezar desde el borde izquierdo del timeline
      const startX = taskStart < startDate ? config.leftPanelWidth : rawStartX;
      
      // Ajustar endX: si la tarea termina después del rango visible, terminar en el borde derecho del timeline
      const timelineWidth = getTimelineWidth(config.minCellWidth);
      const maxEndX = config.leftPanelWidth + timelineWidth;
      const endX = taskEnd > endDate ? maxEndX : rawEndX;
      
      const width = Math.max(endX - startX, 2);

      if (task.type === "Milestone") {
        // Para milestones, usar la posición original si está visible
        const milestoneX = taskStart >= startDate && taskStart <= endDate ? rawStartX : startX;
        drawMilestone(ctx, milestoneX, y + config.taskHeight / 2, task.progress === 1.0);
      } else {
        // Dibujar barra de tarea ajustada
        drawTaskBar(ctx, {
          x: startX,
          y: y,
          width: width,
          height: config.taskHeight,
          progress: task.progress,
          type: task.type,
          selected: selectedTask === task.id
        });
      }
    });
  }, [config, getTimePosition, selectedTask, drawMilestone, drawTaskBar, getDateRange, getTimelineWidth]);

  // Función para dibujar flechas de enlaces (e2s)
  const drawLinks = useCallback((ctx: CanvasRenderingContext2D, tasks: HierarchicalTask[]) => {
    const dateRange = getDateRange();
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;
    
    // Filtrar tareas visibles dentro del rango de fechas
    const visibleTaskIds = new Set(
      tasks.filter(task => {
        const taskStart = new Date(task.start);
        const taskEnd = new Date(task.end);
        return taskEnd >= startDate && taskStart <= endDate;
      }).map(task => task.id)
    );
    
    snapshot.links.forEach(link => {
      const sourceTask = tasks.find(t => t.id === link.source);
      const targetTask = tasks.find(t => t.id === link.target);
      
      // Solo dibujar enlaces si ambas tareas están visibles en el rango actual
      if (!sourceTask || !targetTask || 
          !visibleTaskIds.has(sourceTask.id) || 
          !visibleTaskIds.has(targetTask.id)) return;
      
      const sourceIndex = tasks.findIndex(t => t.id === link.source);
      const targetIndex = tasks.findIndex(t => t.id === link.target);
      
      const sourceX = config.leftPanelWidth + getTimePosition(sourceTask.end, startDate, config.minCellWidth);
      const sourceY = config.headerHeight + (sourceIndex * config.rowHeight) + config.rowHeight / 2;
      
      const targetX = config.leftPanelWidth + getTimePosition(targetTask.start, startDate, config.minCellWidth);
      const targetY = config.headerHeight + (targetIndex * config.rowHeight) + config.rowHeight / 2;
      
      drawArrow(ctx, sourceX, sourceY, targetX, targetY);
    });
  }, [config, getTimePosition, snapshot.links, drawArrow, getDateRange]);

  return {
    drawMilestone,
    drawTaskBar,
    drawArrow,
    drawTimeHeader,
    drawGrid,
    drawLeftPanel,
    drawTaskBars,
    drawLinks
  };
};