"use client";

import { useState } from "react";
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

  // Función para actualizar una tarea (solo local)
  const handleTaskUpdate = (taskId: string, updates: TaskUpdate) => {
    setSnapshot(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  // Función para actualizar un enlace (solo local)
  const handleLinkUpdate = (linkId: string, updates: LinkUpdate) => {
    setSnapshot(prev => ({
      ...prev,
      links: prev.links.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    }));
  };

  // Función para resetear datos
  const handleResetData = () => {
    setSnapshot(mockSnapshot);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header simplificado */}
      <div className="border-b bg-background p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtros de fecha */}
          <div className="flex items-center gap-2">
            <Label htmlFor="start-date" className="text-sm font-medium">Inicio:</Label>
            <Input
              id="start-date"
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({
                ...prev,
                startDate: e.target.value
              }))}
              className="w-40 h-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="end-date" className="text-sm font-medium">Fin:</Label>
            <Input
              id="end-date"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({
                ...prev,
                endDate: e.target.value
              }))}
              className="w-40 h-8"
            />
          </div>

          {/* Escala de tiempo */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Escala:</Label>
            <Select value={timeScale} onValueChange={(value: TimeScale) => setTimeScale(value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minute">Minuto</SelectItem>
                <SelectItem value="hour">Hora</SelectItem>
                <SelectItem value="day">Día</SelectItem>
                <SelectItem value="month">Mes</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <Button 
            onClick={handleResetData}
            variant="outline"
            size="sm"
          >
            Reset Datos
          </Button>

          {/* Badge de estadísticas */}
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="secondary" className="text-xs">
              {snapshot.tasks.length} tareas
            </Badge>
            <Badge variant="outline" className="text-xs">
              📊 Mock Data
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