import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

interface RestTimerProps {
  onClose: () => void;
  defaultSeconds?: number;
}

export function RestTimer({ onClose, defaultSeconds = 60 }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(defaultSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success("¡Descanso terminado! Hora de la siguiente serie", {
              duration: 5000,
            });
            // Play a notification sound (browser notification API)
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Hypertrophy Tracker", {
                body: "¡Descanso terminado! Hora de la siguiente serie",
                icon: "/favicon.ico",
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const handleStart = () => {
    if (seconds === 0) {
      setSeconds(initialSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const handlePreset = (presetSeconds: number) => {
    setSeconds(presetSeconds);
    setInitialSeconds(presetSeconds);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-2xl border-2 border-blue-500 bg-white dark:bg-slate-800 z-50 animate-in slide-in-from-bottom-5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Temporizador de Descanso</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {formatTime(seconds)}
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset(60)}
            className={initialSeconds === 60 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}
          >
            60s
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset(90)}
            className={initialSeconds === 90 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}
          >
            90s
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreset(120)}
            className={initialSeconds === 120 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}
          >
            120s
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
          Selecciona un preset o usa los controles
        </p>
      </CardContent>
    </Card>
  );
}
