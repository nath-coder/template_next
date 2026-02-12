import { useCallback } from "react";
import { Snapshot, TimeScale, DateFilter } from "@/lib/types";
import { HierarchicalTask } from "../types/ganttTypes";
import { parseDate } from "../utils/ganttUtils";

export const useGanttLogic = (snapshot: Snapshot, timeScale: TimeScale, dateFilter?: DateFilter) => {
  // Función para calcular el rango de fechas - usar filtro si está disponible
  const getDateRange = useCallback(() => {
    // Si hay filtro de fechas, usarlo
    if (dateFilter?.startDate && dateFilter?.endDate) {
      return {
        startDate: new Date(dateFilter.startDate),
        endDate: new Date(dateFilter.endDate)
      };
    }
    
    // Si no hay filtro, calcular automáticamente desde las tareas
    if (snapshot.tasks.length === 0) {
      const today = new Date();
      return {
        startDate: today,
        endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      };
    }

    let minDate = new Date(snapshot.tasks[0].start);
    let maxDate = new Date(snapshot.tasks[0].end);

    snapshot.tasks.forEach(task => {
      const taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);
      
      if (taskStart < minDate) minDate = taskStart;
      if (taskEnd > maxDate) maxDate = taskEnd;
    });

    // Agregar margen según la escala de tiempo
    let marginMs = 0;
    switch (timeScale) {
      case "minute":
      case "hour":
        marginMs = 2 * 60 * 60 * 1000; // 2 horas
        break;
      case "day":
        marginMs = 24 * 60 * 60 * 1000; // 1 día
        break;
      case "month":
        marginMs = 30 * 24 * 60 * 60 * 1000; // 1 mes
        break;
      case "quarter":
      case "year":
        marginMs = 365 * 24 * 60 * 60 * 1000; // 1 año
        break;
    }

    return {
      startDate: new Date(minDate.getTime() - marginMs),
      endDate: new Date(maxDate.getTime() + marginMs)
    };
  }, [snapshot.tasks, timeScale, dateFilter]);

  // Función para crear jerarquía de tareas con visibilidad
  const createTaskHierarchy = useCallback((): HierarchicalTask[] => {
    const taskMap = new Map<string, HierarchicalTask>();
    
    // Inicializar todas las tareas
    snapshot.tasks.forEach(task => {
      taskMap.set(task.id, {
        ...task,
        children: [],
        level: 0
      });
    });

    // Construir jerarquía
    snapshot.tasks.forEach(task => {
      if (task.parent) {
        const parent = taskMap.get(task.parent);
        if (parent) {
          parent.children.push(task.id);
        }
      }
    });

    // Calcular niveles
    const calculateLevel = (taskId: string, level: number = 0): void => {
      const task = taskMap.get(taskId);
      if (task) {
        task.level = level;
        task.children.forEach(childId => {
          calculateLevel(childId, level + 1);
        });
      }
    };

    // Calcular niveles para tareas raíz
    snapshot.tasks.forEach(task => {
      if (!task.parent) {
        calculateLevel(task.id, 0);
      }
    });

    // Filtrar tareas visibles (expandir/contraer)
    const getVisibleTasks = (taskId: string): HierarchicalTask[] => {
      const task = taskMap.get(taskId);
      if (!task) return [];
      
      const result = [task];
      
      // Si es Summary y está abierto (o si está undefined, asumir abierto), mostrar hijos
      if (task.type === "Summary" && task.open !== false) {
        task.children.forEach(childId => {
          result.push(...getVisibleTasks(childId));
        });
      }
      
      return result;
    };

    // Obtener todas las tareas raíz y sus visibles
    const visibleTasks: HierarchicalTask[] = [];
    snapshot.tasks.forEach(task => {
      if (!task.parent) {
        visibleTasks.push(...getVisibleTasks(task.id));
      }
    });

    // Si no hay tareas visibles, mostrar TODAS las tareas (fallback)
    if (visibleTasks.length === 0) {
      return Array.from(taskMap.values()).sort((a, b) => {
        // Ordenar por orden de aparición en el snapshot
        const aIndex = snapshot.tasks.findIndex(t => t.id === a.id);
        const bIndex = snapshot.tasks.findIndex(t => t.id === b.id);
        return aIndex - bIndex;
      });
    }

    return visibleTasks;
  }, [snapshot.tasks]);

  // Función para obtener intervalos de tiempo según la escala
  const getTimeIntervals = useCallback((): string[] => {
    const dateRange = getDateRange();
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;
    
    switch (timeScale) {
      case "minute":
        // Generar intervalos de 30 minutos para el rango de fechas
        const minuteIntervals: string[] = [];
        const totalMinutes = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        const minuteStep = 30; // Cada 30 minutos
        
        for (let i = 0; i < totalMinutes; i += minuteStep) {
          const currentTime = new Date(startDate.getTime() + i * 60 * 1000);
          const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
          minuteIntervals.push(timeStr);
        }
        return minuteIntervals;
        
      case "hour":
        // Generar intervalos de 1 hora para el rango de fechas
        const hourIntervals: string[] = [];
        const totalHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
        
        for (let i = 0; i < totalHours; i++) {
          const currentTime = new Date(startDate.getTime() + i * 60 * 60 * 1000);
          const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:00`;
          hourIntervals.push(timeStr);
        }
        return hourIntervals;
        
      case "day":
        // Generar días del mes según el rango
        const dayIntervals: string[] = [];
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        for (let i = 0; i < Math.min(totalDays, 31); i++) {
          const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          dayIntervals.push(String(currentDate.getDate()));
        }
        return dayIntervals;
        
      case "month":
        // Generar meses según el rango
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthIntervals: string[] = [];
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const endYear = endDate.getFullYear();
        const endMonth = endDate.getMonth();
        
        for (let year = startYear; year <= endYear; year++) {
          const startM = year === startYear ? startMonth : 0;
          const endM = year === endYear ? endMonth : 11;
          
          for (let month = startM; month <= endM; month++) {
            monthIntervals.push(monthNames[month]);
          }
        }
        return monthIntervals;
        
      case "quarter":
        return ["Q1", "Q2", "Q3", "Q4"];
        
      case "year":
        return Array.from({ length: 10 }, (_, i) => String(startDate.getFullYear() + i));
        
      default:
        return [];
    }
  }, [getDateRange, timeScale]);

  // Función para calcular ancho total del timeline
  const getTimelineWidth = useCallback((minCellWidth: number): number => {
    const intervals = getTimeIntervals();
    const totalWidth = intervals.length * minCellWidth;
    
    // Siempre usar el ancho calculado para permitir scroll horizontal
    return totalWidth;
  }, [getTimeIntervals]);

  // Función para calcular posición X basada en fecha y escala de tiempo
  const getTimePosition = useCallback((dateStr: string, startDate: Date, minCellWidth: number) => {
    const date = parseDate(dateStr);
    const cellWidth = minCellWidth;
    
    let position = 0;
    
    switch (timeScale) {
      case "minute": {
        // Intervalos de 30 minutos - calcular posición exacta dentro del intervalo
        const diffMinutes = (date.getTime() - startDate.getTime()) / (1000 * 60);
        const intervalIndex = Math.floor(diffMinutes / 30); // Qué intervalo de 30min
        const minutesInInterval = diffMinutes % 30; // Minutos dentro del intervalo
        position = intervalIndex * cellWidth + (minutesInInterval / 30) * cellWidth;
        break;
      }
      
      case "hour": {
        // Intervalos de 1 hora - calcular posición exacta dentro de la hora
        const diffHours = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const intervalIndex = Math.floor(diffHours); // Qué hora
        const fractionalHour = diffHours - intervalIndex; // Fracción dentro de la hora
        position = intervalIndex * cellWidth + fractionalHour * cellWidth;
        break;
      }
      
      case "day": {
        // Intervalos de 1 día - calcular posición exacta dentro del día
        const diffDays = (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000);
        const intervalIndex = Math.floor(diffDays); // Qué día
        const fractionalDay = diffDays - intervalIndex; // Fracción dentro del día
        position = intervalIndex * cellWidth + fractionalDay * cellWidth;
        break;
      }
      
      case "month": {
        // Intervalos de 1 mes - calcular posición exacta
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const dateYear = date.getFullYear();
        const dateMonth = date.getMonth();
        
        const monthDiff = (dateYear - startYear) * 12 + (dateMonth - startMonth);
        
        // Calcular la fracción dentro del mes
        const daysInMonth = new Date(dateYear, dateMonth + 1, 0).getDate();
        const dayOfMonth = date.getDate();
        const startDayOfMonth = startDate.getDate();
        
        let fractionalMonth = 0;
        if (monthDiff === 0) {
          // Mismo mes - calcular fracción desde startDate
          fractionalMonth = (dayOfMonth - startDayOfMonth) / daysInMonth;
        } else {
          // Mes diferente - usar posición en el mes
          fractionalMonth = dayOfMonth / daysInMonth;
        }
        
        position = monthDiff * cellWidth + fractionalMonth * cellWidth;
        break;
      }
      
      case "quarter": {
        // Intervalos de trimestre
        const startQuarter = Math.floor(startDate.getMonth() / 3);
        const dateQuarter = Math.floor(date.getMonth() / 3);
        const yearDiff = date.getFullYear() - startDate.getFullYear();
        const quarterDiff = yearDiff * 4 + (dateQuarter - startQuarter);
        
        // Calcular fracción dentro del trimestre
        const monthInQuarter = date.getMonth() % 3;
        const dayInMonth = date.getDate();
        const fractionalQuarter = (monthInQuarter + dayInMonth / 30) / 3;
        
        position = quarterDiff * cellWidth + fractionalQuarter * cellWidth;
        break;
      }
      
      case "year": {
        // Intervalos de 1 año - calcular posición exacta
        const yearDiff = date.getFullYear() - startDate.getFullYear();
        
        // Calcular la fracción dentro del año
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const daysInYear = new Date(date.getFullYear(), 11, 31).getDate() === 31 ? 
          (new Date(date.getFullYear(), 1, 29).getDate() === 29 ? 366 : 365) : 365;
        const fractionalYear = dayOfYear / daysInYear;
        
        position = yearDiff * cellWidth + fractionalYear * cellWidth;
        break;
      }
    }

    return position;
  }, [timeScale]);

  // Función para obtener header superior
  const getTimeHeaderTop = useCallback((): string[] => {
    const dateRange = getDateRange();
    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;
    
    if (timeScale === "day") {
      // Para días, mostrar los meses correspondientes al rango
      const dates: string[] = [];
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < Math.min(totalDays, 31); i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const monthStr = date.toLocaleDateString("es-ES", { month: "short" });
        dates.push(monthStr);
      }
      return dates;
    }
    
    if (timeScale === "hour" || timeScale === "minute") {
      // Para horas y minutos, mostrar las fechas
      const dates: string[] = [];
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString("es-ES", { 
          day: '2-digit', 
          month: 'short' 
        });
        dates.push(dateStr);
      }
      return dates;
    }
    
    return [];
  }, [getDateRange, timeScale]);

  return {
    getDateRange,
    createTaskHierarchy,
    getTimeIntervals,
    getTimelineWidth,
    getTimePosition,
    getTimeHeaderTop
  };
};