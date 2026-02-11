"use client";

import { useState, useEffect, useCallback } from "react";
import { useWebSocketGantt } from "@/app/hooks/useWebSocketGantt";
import { mockSnapshot } from "@/lib/mockData";
import { Snapshot, TimeScale, DateFilter, TaskUpdate, LinkUpdate } from "@/lib/types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import CustomGanttChart from "@/app/components/ganttComponent/CustomGanttChart";

export default function CustomGanttPage() {
  const [snapshot, setSnapshot] = useState<Snapshot>(mockSnapshot);
  const [timeScale, setTimeScale] = useState<TimeScale>("hour");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: "2026-02-10",
    endDate: "2026-02-11"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection
  const { isConnected, lastMessage, sendMessage } = useWebSocketGantt({
    url: process.env.NODE_ENV === "development" 
      ? "wss://localhost:3000/ws" 
      : "wss://your-production-url/ws",
    onSnapshotUpdate: (newSnapshot) => {
      setSnapshot(newSnapshot);
    },
    onConnectionChange: (connected) => {
      console.log("WebSocket connection:", connected);
    }
  });

  // Función para cargar datos desde la API
  const fetchSnapshot = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (dateFilter.startDate) params.append('startDate', dateFilter.startDate);
      if (dateFilter.endDate) params.append('endDate', dateFilter.endDate);
      
      const response = await fetch(`/api/gantt?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setSnapshot(result.data);
      } else {
        setError(result.message || "Error al cargar datos");
      }
    } catch (err) {
      setError("Error de conexión con la API");
      console.error("Error fetching snapshot:", err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter.startDate, dateFilter.endDate]);

  // Función para actualizar una tarea
  const handleTaskUpdate = async (taskId: string, updates: TaskUpdate) => {
    try {
      const response = await fetch('/api/gantt', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId, updates })
      });
      
      const result = await response.json();
      if (result.success) {
        // Actualizar estado local inmediatamente
        setSnapshot(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        }));
        
        // Enviar actualización por WebSocket
        sendMessage({
          type: "task_update",
          data: { taskId, updates },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error al actualizar tarea");
    }
  };

  // Función para actualizar un enlace
  const handleLinkUpdate = async (linkId: string, updates: LinkUpdate) => {
    try {
      const response = await fetch('/api/gantt', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ linkId, updates })
      });
      
      const result = await response.json();
      if (result.success) {
        // Actualizar estado local
        setSnapshot(prev => ({
          ...prev,
          links: prev.links.map(link =>
            link.id === linkId ? { ...link, ...updates } : link
          )
        }));
        
        // Enviar actualización por WebSocket
        sendMessage({
          type: "link_update",
          data: { linkId, updates },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error updating link:", error);
      setError("Error al actualizar enlace");
    }
  };

  // Procesar mensajes WebSocket
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case "task_update":
          const { taskId, updates } = lastMessage.data;
          setSnapshot(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
              task.id === taskId 
                ? { ...task, progress: Math.min((task.progress || 0) + (updates.progress || 0), 1) }
                : task
            )
          }));
          break;
        case "link_update":
          // Manejar actualizaciones de enlaces
          break;
        case "snapshot_update":
          // Ya se maneja en onSnapshotUpdate
          break;
      }
    }
  }, [lastMessage]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchSnapshot();
  }, [dateFilter.startDate, dateFilter.endDate, fetchSnapshot]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Compacto */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gantt Personalizado
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistema de Producción en Tiempo Real
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Indicador de carga */}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-muted-foreground">Cargando...</span>
              </div>
            )}
            {/* Indicador WebSocket */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Controles con shadcn/ui */}
        <div className="flex flex-wrap gap-4 items-end p-3 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Escala de Tiempo</Label>
            <Select value={timeScale} onValueChange={(value: TimeScale) => setTimeScale(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Seleccionar escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minute">Minutos</SelectItem>
                <SelectItem value="hour">Horas</SelectItem>
                <SelectItem value="day">Días</SelectItem>
                <SelectItem value="month">Meses</SelectItem>
                <SelectItem value="quarter">Trimestres</SelectItem>
                <SelectItem value="year">Años</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha Inicio</Label>
            <Input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({
                ...prev,
                startDate: e.target.value
              }))}
              className="w-40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Fecha Fin</Label>
            <Input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({
                ...prev,
                endDate: e.target.value
              }))}
              className="w-40"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setSnapshot(mockSnapshot)}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Reset Datos
            </Button>

            <Button 
              onClick={fetchSnapshot}
              size="sm"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Actualizar"}
            </Button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Badge de estadísticas */}
            <Badge variant="secondary" className="text-xs">
              {snapshot.tasks.length} tareas
            </Badge>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="flex-1 overflow-hidden">
        <CustomGanttChart
          snapshot={snapshot}
          timeScale={timeScale}
          dateFilter={dateFilter}
          onTaskUpdate={handleTaskUpdate}
          onLinkUpdate={handleLinkUpdate}
        />
      </div>
    </div>
  );
}