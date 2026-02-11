// Función para convertir fecha string a objeto Date
export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr.replace(/-/g, '/'));
};

// Función para calcular duración entre dos fechas
export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const diffMs = end.getTime() - start.getTime();
  
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
};

// Función para truncar texto si es muy largo
export const truncateText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string => {
  const metrics = ctx.measureText(text);
  if (metrics.width <= maxWidth) return text;
  
  let truncated = text;
  while (ctx.measureText(truncated + "...").width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "...";
};

// Función para obtener colores según el tema
export const getGanttColors = (isDark: boolean) => {
  return {
    summary: isDark ? "#374151" : "#1f2937",
    task: isDark ? "#4b5563" : "#374151",
    milestone: isDark ? "#ffffff" : "#000000",
    progressFill: isDark ? "#059669" : "#10b981",
    progressBg: isDark ? "#374151" : "#e5e7eb",
    border: isDark ? "#6b7280" : "#6b7280",
    text: isDark ? "#d1d5db" : "#1f2937",
    background: isDark ? "#111827" : "#ffffff",
    selectedColor: isDark ? "#60a5fa" : "#3b82f6",
    gridLineColor: isDark ? "#374151" : "#e5e7eb",
    arrowColor: isDark ? "#9ca3af" : "#6b7280"
  };
};