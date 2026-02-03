"use client";

import GanttClient from "@/app/components/ganttComponent/ganttClient";
import { TaskGroup } from "@/app/components/ganttComponent/ganttClient";
import GanttClientAsv from "@/app/components/ganttComponent/ganttClientAsv";
import { operatorMockData, adminMockData } from "@/lib/mockData";
import { useState } from "react";

export default function Page() {
  const [currentView, setCurrentView] = useState<'custom' | 'operator' | 'admin'>('operator');


  return (
    <div className="h-screen flex flex-col">
      {/* Header con navegación mejorado */}
      <div className="border-b border-border bg-background p-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Planificación de Producción</h1>
              <p className="text-muted-foreground">
                Gestiona y visualiza el cronograma de tareas del proyecto
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="text-right">
                <div>Fecha actual: <span className="font-medium">2 de Febrero, 2026</span></div>
                <div className="mt-1">
                  Vista: <span className="font-medium capitalize">
                    {currentView === 'operator' ? 'Operador' : 
                     currentView === 'admin' ? 'Administrador' : 'Personalizada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selector de vista mejorado */}
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView('operator')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                currentView === 'operator' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm'
              }`}
            >
              👨‍🔧 Vista Operador
              {currentView === 'operator' && <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-xs">Activo</span>}
            </button>
            <button 
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                currentView === 'admin' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm'
              }`}
            >
              👥 Vista Administrador
              {currentView === 'admin' && <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-xs">Activo</span>}
            </button>
           
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        {currentView === 'operator' && (
          <GanttClientAsv data={operatorMockData} />
        )}
        
        {currentView === 'admin' && (
          <GanttClientAsv data={adminMockData} />
        )}
        
       
      </div>
    </div>
  );
  
}
