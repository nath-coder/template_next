import { NextRequest, NextResponse } from "next/server";
import { mockSnapshot } from "@/lib/mockData";
import { Snapshot, TaskUpdate, LinkUpdate } from "@/lib/types";

// Simular base de datos en memoria para demo
const currentSnapshot: Snapshot = { ...mockSnapshot };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Filtrar tareas por rango de fechas si se proporcionan
    const filteredSnapshot = { ...currentSnapshot };
    
    if (startDate || endDate) {
      filteredSnapshot.tasks = currentSnapshot.tasks.filter(task => {
        const taskStart = new Date(task.start);
        const taskEnd = new Date(task.end);
        
        let include = true;
        
        if (startDate) {
          const filterStart = new Date(startDate);
          include = include && taskEnd >= filterStart;
        }
        
        if (endDate) {
          const filterEnd = new Date(endDate);
          include = include && taskStart <= filterEnd;
        }
        
        return include;
      });
      
      // Filtrar links que referencian tareas filtradas
      const taskIds = new Set(filteredSnapshot.tasks.map(t => t.id));
      filteredSnapshot.links = currentSnapshot.links.filter(link =>
        taskIds.has(link.source) && taskIds.has(link.target)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredSnapshot,
      message: "Snapshot obtenido exitosamente"
    });
  } catch (error) {
    console.error("Error al obtener snapshot:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Partial<Snapshot> = await request.json();
    
    // Validación básica
    if (body.tasks) {
      currentSnapshot.tasks = body.tasks;
    }
    
    if (body.links) {
      currentSnapshot.links = body.links;
    }
    
    if (body.version) {
      currentSnapshot.version = body.version;
    }
    
    return NextResponse.json({
      success: true,
      data: currentSnapshot,
      message: "Snapshot actualizado exitosamente"
    });
  } catch (error) {
    console.error("Error al actualizar snapshot:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { taskId: string; updates: TaskUpdate } = await request.json();
    const { taskId, updates } = body;
    
    // Actualizar tarea específica
    const taskIndex = currentSnapshot.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Tarea no encontrada"
        },
        { status: 404 }
      );
    }
    
    currentSnapshot.tasks[taskIndex] = {
      ...currentSnapshot.tasks[taskIndex],
      ...updates
    };
    
    return NextResponse.json({
      success: true,
      data: currentSnapshot.tasks[taskIndex],
      message: "Tarea actualizada exitosamente"
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor"
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body: { linkId: string; updates: LinkUpdate } = await request.json();
    const { linkId, updates } = body;
    
    // Actualizar enlace específico
    const linkIndex = currentSnapshot.links.findIndex(link => link.id === linkId);
    if (linkIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Enlace no encontrado"
        },
        { status: 404 }
      );
    }
    
    currentSnapshot.links[linkIndex] = {
      ...currentSnapshot.links[linkIndex],
      ...updates
    };
    
    return NextResponse.json({
      success: true,
      data: currentSnapshot.links[linkIndex],
      message: "Enlace actualizado exitosamente"
    });
  } catch (error) {
    console.error("Error al actualizar enlace:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor"
      },
      { status: 500 }
    );
  }
}