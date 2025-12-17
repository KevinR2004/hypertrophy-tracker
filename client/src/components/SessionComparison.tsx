import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ExerciseLog {
  exerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
}

interface SessionComparisonProps {
  currentLogs: ExerciseLog[];
  previousLogs: ExerciseLog[];
  exerciseNames: Record<number, string>;
}

export function SessionComparison({
  currentLogs,
  previousLogs,
  exerciseNames,
}: SessionComparisonProps) {
  // Group logs by exercise
  const groupByExercise = (logs: ExerciseLog[]) => {
    return logs.reduce(
      (acc, log) => {
        if (!acc[log.exerciseId]) {
          acc[log.exerciseId] = [];
        }
        acc[log.exerciseId].push(log);
        return acc;
      },
      {} as Record<number, ExerciseLog[]>
    );
  };

  const currentByExercise = groupByExercise(currentLogs);
  const previousByExercise = groupByExercise(previousLogs);

  const getMaxWeight = (logs: ExerciseLog[]) => {
    return Math.max(...logs.map((l) => l.weight), 0);
  };

  const getTotalVolume = (logs: ExerciseLog[]) => {
    return logs.reduce((sum, log) => sum + log.weight * log.reps, 0);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="text-lg">Comparación con Sesión Anterior</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(currentByExercise).map(([exerciseId, currentLogs]) => {
            const exId = Number(exerciseId);
            const previousLogs = previousByExercise[exId] || [];
            const exerciseName = exerciseNames[exId] || `Ejercicio ${exId}`;

            const currentMaxWeight = getMaxWeight(currentLogs);
            const previousMaxWeight = getMaxWeight(previousLogs);
            const currentVolume = getTotalVolume(currentLogs);
            const previousVolume = getTotalVolume(previousLogs);

            const weightDiff = currentMaxWeight - previousMaxWeight;
            const volumeDiff = currentVolume - previousVolume;

            return (
              <div
                key={exerciseId}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg space-y-2"
              >
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {exerciseName}
                </h4>

                {/* Weight Comparison */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Peso máximo:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {previousMaxWeight > 0
                        ? `${previousMaxWeight}kg → ${currentMaxWeight}kg`
                        : `${currentMaxWeight}kg`}
                    </span>
                    {previousMaxWeight > 0 && (
                      <>
                        {weightDiff > 0 && (
                          <Badge className="bg-green-500 text-white gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{weightDiff}kg
                          </Badge>
                        )}
                        {weightDiff < 0 && (
                          <Badge className="bg-red-500 text-white gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {weightDiff}kg
                          </Badge>
                        )}
                        {weightDiff === 0 && (
                          <Badge variant="outline" className="gap-1">
                            <Minus className="w-3 h-3" />
                            Igual
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Volume Comparison */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Volumen total:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {previousVolume > 0
                        ? `${previousVolume} → ${currentVolume}`
                        : `${currentVolume}`}
                    </span>
                    {previousVolume > 0 && (
                      <>
                        {volumeDiff > 0 && (
                          <Badge className="bg-green-500 text-white gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{volumeDiff}
                          </Badge>
                        )}
                        {volumeDiff < 0 && (
                          <Badge className="bg-red-500 text-white gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {volumeDiff}
                          </Badge>
                        )}
                        {volumeDiff === 0 && (
                          <Badge variant="outline" className="gap-1">
                            <Minus className="w-3 h-3" />
                            Igual
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
