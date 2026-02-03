import { AlertTriangle, Wifi, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  type?: "network" | "general" | "cors";
}

export function ErrorState({ title, message, onRetry, type = "general" }: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case "network":
        return <Wifi className="h-8 w-8 text-red-500" />;
      case "cors":
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
    }
  };

  const getErrorMessage = () => {
    if (type === "cors") {
      return "Error de CORS detectado. La aplicación está intentando acceder a la API a través de un proxy seguro.";
    }
    return message;
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {getIcon()}
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {getErrorMessage()}
            </p>
            {type === "cors" && (
              <p className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-200">
                💡 Las API routes están configuradas para evitar problemas de CORS en desarrollo
              </p>
            )}
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}