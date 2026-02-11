import { useState, useEffect, useRef, useCallback } from "react";
import { Snapshot, WebSocketMessage } from "@/lib/types";

interface UseWebSocketGanttProps {
  url: string;
  onSnapshotUpdate?: (snapshot: Snapshot) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export const useWebSocketGantt = ({
  url,
  onSnapshotUpdate,
  onConnectionChange
}: UseWebSocketGanttProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  const connect = useCallback(() => {
    const connectWebSocket = () => {
      try {
        // Para desarrollo, usar WebSocket simulado
        if (process.env.NODE_ENV === "development") {
          // Simular conexión WebSocket
          setIsConnected(true);
          onConnectionChange?.(true);
          
          // Simular mensajes periódicos
          const interval = setInterval(() => {
            const mockMessage: WebSocketMessage = {
              type: "task_update",
              data: {
                taskId: "T" + Math.floor(Math.random() * 6 + 1),
                updates: {
                  progress: Math.random() * 0.1 // Pequeño incremento
                }
              },
              timestamp: new Date().toISOString()
            };
            setLastMessage(mockMessage);
          }, 5000);

          return () => {
            clearInterval(interval);
            setIsConnected(false);
            onConnectionChange?.(false);
          };
        }

        // WebSocket real para producción
        wsRef.current = new WebSocket(url);

        wsRef.current.onopen = () => {
          console.log("WebSocket conectado");
          setIsConnected(true);
          onConnectionChange?.(true);
          reconnectAttempts.current = 0;
        };

        wsRef.current.onclose = (event) => {
          console.log("WebSocket desconectado", event.code, event.reason);
          setIsConnected(false);
          onConnectionChange?.(false);
          
          // Intentar reconexión
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Backoff exponencial
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttempts.current++;
              connectWebSocket();
            }, delay);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error("Error en WebSocket:", error);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setLastMessage(message);
            
            if (message.type === "snapshot_update" && onSnapshotUpdate) {
              onSnapshotUpdate(message.data);
            }
          } catch (error) {
            console.error("Error al parsear mensaje WebSocket:", error);
          }
        };

      } catch (error) {
        console.error("Error al conectar WebSocket:", error);
        setIsConnected(false);
        onConnectionChange?.(false);
      }
    };

    return connectWebSocket();
  }, [url, onSnapshotUpdate, onConnectionChange]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket no está conectado");
    }
  }, []);

  useEffect(() => {
    const cleanup = connect();
    
    return () => {
      if (cleanup) {
        cleanup();
      } else {
        disconnect();
      }
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
};