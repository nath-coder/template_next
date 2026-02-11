"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { Snapshot, TaskUpdate, LinkUpdate, TimeScale } from "@/lib/types";

// Importar tipos, hooks, componentes y utilidades
import { TooltipState } from "./types/ganttTypes";
import { getGanttColors } from "./utils/ganttUtils";
import { PANEL_CONFIG, getGanttConfig } from "./constants/ganttConfig";
import { useGanttLogic } from "./hooks/useGanttLogic";
import { useGanttRendering } from "./hooks/useGanttRendering";
import { useGanttInteractions } from "./hooks/useGanttInteractions";
import { GanttTooltip } from "./components/GanttTooltip";

interface CustomGanttChartProps {
  snapshot: Snapshot;
  timeScale: TimeScale;
  onTaskUpdate: (taskId: string, updates: TaskUpdate) => void;
  onLinkUpdate: (linkId: string, updates: LinkUpdate) => void;
}

export default function CustomGanttChart({
  snapshot,
  timeScale,
  onTaskUpdate,
}: CustomGanttChartProps) {
  const { theme } = useTheme();
  
  // Referencias
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  
  // Estado local
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    task: null,
  });
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Configuraciones
  const colors = useMemo(() => getGanttColors(theme === 'dark'), [theme]);
  const config = useMemo(() => getGanttConfig(PANEL_CONFIG.totalWidth), []);

  // Hooks personalizados para lógica
  const {
    getDateRange,
    createTaskHierarchy,
    getTimeIntervals,
    getTimelineWidth,
    getTimePosition,
    getTimeHeaderTop
  } = useGanttLogic(snapshot, timeScale);

  // Calcular dimensiones del contenido usando useMemo
  const contentDimensions = useMemo(() => {
    const hierarchicalTasks = createTaskHierarchy();
    const timelineWidth = getTimelineWidth(config.minCellWidth);
    const totalWidth = config.leftPanelWidth + timelineWidth;
    const totalHeight = config.headerHeight + (hierarchicalTasks.length * config.rowHeight) + 50;
    
    return {
      width: totalWidth,
      height: totalHeight
    };
  }, [snapshot.tasks, timeScale, createTaskHierarchy, getTimelineWidth, config]);

  // Hook para renderizado
  const renderingFunctions = useGanttRendering({
    snapshot,
    timeScale,
    theme,
    colors,
    config,
    panelConfig: PANEL_CONFIG,
    selectedTask,
    getTimeIntervals,
    getTimeHeaderTop,
    getTimelineWidth,
    getDateRange,
    getTimePosition
  });

  // Hook para interacciones
  const { handleCanvasClick, handleMouseMove } = useGanttInteractions({
    createTaskHierarchy,
    onTaskUpdate,
    config,
    setSelectedTask,
    setTooltip
  });

  // Función principal de renderizado (sin setState para evitar cascadas)
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Obtener jerarquía de tareas para calcular altura necesaria
    const hierarchicalTasks = createTaskHierarchy();
    
    // Calcular ancho total incluyendo timeline para permitir scroll horizontal
    const timelineWidth = getTimelineWidth(config.minCellWidth);
    const totalWidth = config.leftPanelWidth + timelineWidth;
    
    // Calcular altura total necesaria para todas las tareas
    const totalHeight = config.headerHeight + (hierarchicalTasks.length * config.rowHeight) + 50;
    
    // Ajustar tamaño del canvas (sin setState)
    canvas.width = Math.max(container.clientWidth, totalWidth);
    canvas.height = Math.max(container.clientHeight, totalHeight);
    
    // Configurar fondo usando el color del tema
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Configurar el texto antes de las operaciones de dibujo
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Dibujar componentes con el orden correcto
    renderingFunctions.drawTimeHeader(ctx);
    renderingFunctions.drawGrid(ctx, hierarchicalTasks, canvas);
    renderingFunctions.drawLeftPanel(ctx, hierarchicalTasks);
    renderingFunctions.drawTaskBars(ctx, hierarchicalTasks);
    renderingFunctions.drawLinks(ctx, hierarchicalTasks);
    
  }, [
    colors, 
    createTaskHierarchy, 
    renderingFunctions, 
    config, 
    getTimelineWidth
  ]);

  // Wrappers para las funciones de interacción
  const wrappedHandleCanvasClick = useCallback((event: MouseEvent) => {
    handleCanvasClick(event, canvasRef, containerRef);
  }, [handleCanvasClick]);

  const wrappedHandleMouseMove = useCallback((event: MouseEvent) => {
    handleMouseMove(event, canvasRef, containerRef);
  }, [handleMouseMove]);



  // Efecto para renderizar el canvas
  useEffect(() => {
    render();
  }, [render, selectedTask, theme]);

  // Event listeners para interacciones
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.addEventListener("click", wrappedHandleCanvasClick);
    canvas.addEventListener("mousemove", wrappedHandleMouseMove);
    
    return () => {
      canvas.removeEventListener("click", wrappedHandleCanvasClick);
      canvas.removeEventListener("mousemove", wrappedHandleMouseMove);
    };
  }, [wrappedHandleCanvasClick, wrappedHandleMouseMove]);

  // Efecto para resize
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(render);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [render]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background overflow-auto">
      {/* Elemento invisible que define el área de scroll */}
      <div 
        style={{
          width: contentDimensions.width,
          height: contentDimensions.height,
          pointerEvents: 'none'
        }}
      />
      
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 cursor-pointer"
        style={{ 
          minWidth: '100%',
          minHeight: '100%' 
        }}
      />
      
      {/* Tooltip como componente separado */}
      <GanttTooltip tooltip={tooltip} theme={theme} />
    </div>
  );
}