# Gantt Personalizado - Documentación

## Descripción General

Este es un diagrama de Gantt personalizado construido desde cero sin librerías externas como SVAR Gantt o Modern Gantt. Utiliza Canvas para renderizar gráficos personalizados con funcionalidades avanzadas.

## Características Principales

### ✅ Renderizado con Canvas
- Gráficos dibujados nativamente con HTML5 Canvas
- Rendimiento optimizado para grandes conjuntos de datos
- Control total sobre el diseño visual

### ✅ Jerarquías y Tipos de Tareas
- **Summary**: Tareas padre que agrupan otras tareas
- **Task**: Tareas individuales con progreso
- **Milestone**: Hitos importantes (diamantes)

### ✅ Enlaces end-to-start (e2s)
- Flechas que conectan el fin de una tarea con el inicio de otra
- Visualización clara de dependencias

### ✅ Escalas de Tiempo Variables
- Minutos, Horas, Días, Meses, Trimestres, Años
- Cambio dinámico de escala de tiempo

### ✅ Filtros de Fecha
- Fecha inicio y fecha fin configurables
- Filtrado automático de tareas

### ✅ WebSocket en Tiempo Real
- Actualizaciones automáticas de progreso
- Sincronización entre múltiples usuarios
- Reconexión automática

### ✅ Barras de Progreso Avanzadas
- Colores diferenciados por tipo de tarea
- Patrones especiales para Summary tasks
- Indicadores de porcentaje

### ✅ Tooltips Informativos
- Información detallada al hacer hover
- Fechas, progreso, tipo de tarea

### ✅ Edición Interactiva
- Click para seleccionar tareas
- Toggle de Summary tasks (expandir/colapsar)
- Actualización en tiempo real

### ✅ Diseño Black & White
- Esquema de colores profesional
- Contraste óptimo para legibilidad
- Tema consistente

## Estructura de Archivos

```
app/
├── dashboard/production/gantt-custom/
│   └── page.tsx                    # Página principal del Gantt
├── components/ganttComponent/
│   └── CustomGanttChart.tsx        # Componente Canvas principal
├── hooks/
│   └── useWebSocketGantt.ts        # Hook para WebSocket
├── api/gantt/
│   └── route.ts                    # API endpoints REST
└── lib/
    ├── types.ts                    # Interfaces TypeScript
    └── mockData.ts                 # Datos de ejemplo
```

## Configuración de Datos

### Formato Snapshot
```typescript
interface Snapshot {
  version: number;
  tasks: GanttTask[];
  links: GanttLink[];
}
```

### Formato de Fecha
Las fechas deben estar en formato UTC local: `"YYYY-MM-DD HH:mm:ss"`

### Ejemplo de Datos
```typescript
export const mockSnapshot: Snapshot = {
  version: 1,
  tasks: [
    { 
      id: "S1", 
      text: "Línea A (Summary)", 
      start: "2026-02-10 08:00:00", 
      end: "2026-02-10 20:00:00", 
      parent: null, 
      type: "Summary", 
      progress: 0.35, 
      open: true 
    },
    // ... más tareas
  ],
  links: [
    { id: "L1", source: "T1", target: "T2", type: "e2s" },
    // ... más enlaces
  ]
};
```

## API Endpoints

### GET /api/gantt
Obtener snapshot completo con filtros opcionales.

**Parámetros de consulta:**
- `startDate`: Fecha de inicio (YYYY-MM-DD)
- `endDate`: Fecha de fin (YYYY-MM-DD)

### PUT /api/gantt
Actualizar una tarea específica.

**Body:**
```json
{
  "taskId": "T1",
  "updates": {
    "progress": 0.75,
    "text": "Nuevo nombre"
  }
}
```

### PATCH /api/gantt
Actualizar un enlace específico.

**Body:**
```json
{
  "linkId": "L1",
  "updates": {
    "type": "e2s"
  }
}
```

## WebSocket Events

### Mensajes Entrantes
```typescript
interface WebSocketMessage {
  type: "task_update" | "link_update" | "snapshot_update";
  data: any;
  timestamp: string;
}
```

### Ejemplo de Actualización de Tarea
```typescript
{
  type: "task_update",
  data: {
    taskId: "T1",
    updates: { progress: 0.80 }
  },
  timestamp: "2026-02-10T15:30:00Z"
}
```

## Configuración de Escalas

| Escala     | Unidad Base | Intervalos Mostrados |
|------------|-------------|---------------------|
| minute     | 60 min      | 00:00, 01:00, ...  |
| hour       | 1 hora      | 00:00, 01:00, ...  |
| day        | 1 día       | 1/2, 2/2, ...      |
| month      | 1 mes       | Ene, Feb, ...       |
| quarter    | 3 meses     | Q1, Q2, Q3, Q4      |
| year       | 1 año       | 2026, 2027, ...     |

## Controles de Usuario

### Interacciones del Mouse
- **Click en tarea**: Seleccionar/deseleccionar
- **Click en Summary**: Expandir/colapsar
- **Hover en barra**: Mostrar tooltip

### Controles de Interfaz
- **Escala de tiempo**: Dropdown para cambiar granularidad
- **Filtros de fecha**: Inputs de fecha inicio/fin
- **Botón Resetear**: Volver a datos originales
- **Botón Actualizar**: Recargar desde API

## Personalización

### Colores del Tema
```typescript
const colors: GanttColors = {
  summary: "#1f2937",     // Gris oscuro para summary
  task: "#374151",        // Gris medio para tasks
  milestone: "#000000",   // Negro para milestones
  progressFill: "#10b981", // Verde para progreso
  progressBg: "#e5e7eb",  // Gris claro para fondo
  border: "#6b7280",      // Bordes
  text: "#1f2937",        // Texto
  background: "#ffffff"   // Fondo
};
```

### Configuración de Canvas
```typescript
const config = {
  rowHeight: 40,          // Altura de cada fila
  taskHeight: 24,         // Altura de barras de tarea
  milestoneSize: 12,      // Tamaño de diamantes
  leftPanelWidth: 250,    // Ancho del panel izquierdo
  headerHeight: 60,       // Altura del header temporal
};
```

## Uso

### 1. Navegar a la página
```
/dashboard/production/gantt-custom
```

### 2. Configurar filtros y escala
- Seleccionar escala de tiempo apropiada
- Configurar rango de fechas si es necesario

### 3. Interactuar con el diagrama
- Hacer click en tareas para seleccionarlas
- Expandir/colapsar Summary tasks
- Observar actualizaciones en tiempo real

## Desarrollo

### Agregar nuevos tipos de tarea
1. Actualizar `type` en `GanttTask` interface
2. Agregar lógica de renderizado en `drawTaskBars`
3. Actualizar iconos en `drawLeftPanel`

### Personalizar escalas de tiempo
1. Agregar nueva escala en `TimeScale` type
2. Implementar lógica en `getTimeIntervals`
3. Ajustar cálculos en `getTimePosition`

### Integrar con backend real
1. Configurar WebSocket server
2. Actualizar URLs en `useWebSocketGantt`
3. Implementar autenticación si es necesario

## Rendimiento

- **Canvas optimizado**: Redibujado solo cuando es necesario
- **WebSocket eficiente**: Reconexión automática con backoff
- **Filtrado inteligente**: Solo cargar datos necesarios
- **Memoria optimizada**: Limpieza automática de event listeners

## Compatibilidad

- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Dispositivos**: Desktop y tablet (touch básico)
- **Resoluciones**: Responsive design

## Próximas Funcionalidades

- [ ] Arrastrar y soltar para editar fechas
- [ ] Zoom y pan en timeline
- [ ] Exportar a PDF/PNG
- [ ] Más tipos de enlaces (s2s, e2e, s2e)
- [ ] Campos personalizados en tareas
- [ ] Plantillas de proyectos
- [ ] Notificaciones push