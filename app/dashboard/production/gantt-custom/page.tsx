"use client";

import { useState } from "react";
import { mockSnapshot } from "@/lib/mockData";
import { Snapshot, TimeScale, DateFilter, TaskUpdate, LinkUpdate } from "@/lib/types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import CustomGanttChart from "@/app/components/ganttComponent/CustomGanttChartRefactored";

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

  // Función para obtener escalas apropiadas según el rango de fechas
  const getAvailableTimeScales = (): Array<{value: TimeScale, label: string}> => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      return [
        { value: "minute", label: "Minuto" },
        { value: "hour", label: "Hora" },
        { value: "day", label: "Día" },
        { value: "month", label: "Mes" },
        { value: "quarter", label: "Trimestre" },
        { value: "year", label: "Año" }
      ];
    }

    const start = new Date(dateFilter.startDate);
    const end = new Date(dateFilter.endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const allScales = [
      { value: "minute" as TimeScale, label: "Minuto", maxDays: 2 },
      { value: "hour" as TimeScale, label: "Hora", maxDays: 15 },
      { value: "day" as TimeScale, label: "Día", maxDays: 90 },
      { value: "month" as TimeScale, label: "Mes", maxDays: 730 }, // ~2 años
      { value: "quarter" as TimeScale, label: "Trimestre", maxDays: 1460 }, // ~4 años
      { value: "year" as TimeScale, label: "Año", maxDays: Infinity }
    ];

    return allScales.filter(scale => diffDays <= scale.maxDays);
  };

  const availableScales = getAvailableTimeScales();

  // Asegurar que la escala actual esté disponible
  const handleDateFilterChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilter = { ...dateFilter, [field]: value };
    setDateFilter(newFilter);
    
    // Verificar si la escala actual sigue siendo válida con el nuevo rango
    if (newFilter.startDate && newFilter.endDate) {
      const start = new Date(newFilter.startDate);
      const end = new Date(newFilter.endDate);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      const currentScaleValid = availableScales.some(scale => scale.value === timeScale);
      if (!currentScaleValid) {
        // Seleccionar la primera escala disponible que sea apropiada
        if (diffDays <= 2) setTimeScale("minute");
        else if (diffDays <= 15) setTimeScale("hour");
        else if (diffDays <= 90) setTimeScale("day");
        else if (diffDays <= 730) setTimeScale("month");
        else if (diffDays <= 1460) setTimeScale("quarter");
        else setTimeScale("year");
      }
    }
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
              onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
              className="w-40 h-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="end-date" className="text-sm font-medium">Fin:</Label>
            <Input
              id="end-date"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
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
                {availableScales.map(scale => (
                  <SelectItem key={scale.value} value={scale.value}>
                    {scale.label}
                  </SelectItem>
                ))}
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