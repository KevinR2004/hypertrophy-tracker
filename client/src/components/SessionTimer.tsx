import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

interface SessionTimerProps {
  onDurationChange?: (minutes: number) => void;
}

export function SessionTimer({ onDurationChange }: SessionTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          const minutes = Math.floor(newSeconds / 60);
          onDurationChange?.(minutes);
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onDurationChange]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Duración de Sesión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold text-slate-900 dark:text-white font-mono">
            {String(minutes).padStart(2, "0")}:{String(displaySeconds).padStart(2, "0")}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Iniciar
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
