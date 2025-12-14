import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Dumbbell, Clock, Zap, Timer } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { RestTimer } from "@/components/RestTimer";

export default function WorkoutDay() {
  const [, params] = useRoute("/workout/:dayId");
  const dayId = params?.dayId ? parseInt(params.dayId) : 0;
  const { user, isAuthenticated } = useAuth();

  const { data: workoutDays } = trpc.workout.getDays.useQuery();
  const { data: exercises, isLoading } = trpc.workout.getExercises.useQuery({ dayId });

  const currentDay = workoutDays?.find((d) => d.id === dayId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<Record<number, { setNumber: number; reps: number; weight: number }[]>>({});
  const [showTimer, setShowTimer] = useState(false);

  const createSessionMutation = trpc.progress.createSession.useMutation();
  const logExerciseMutation = trpc.progress.logExercise.useMutation();

  const handleStartSession = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setIsDialogOpen(true);
  };

  const handleLogSet = (exerciseId: number, setNumber: number, reps: number, weight: number) => {
    setSessionLogs((prev) => ({
      ...prev,
      [exerciseId]: [
        ...(prev[exerciseId] || []),
        { setNumber, reps, weight },
      ],
    }));
  };

  const handleSaveSession = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Debes iniciar sesión para guardar tu progreso");
      return;
    }

    try {
      const { sessionId } = await createSessionMutation.mutateAsync({
        workoutDayId: dayId,
        sessionDate: new Date(),
      });

      for (const [exerciseId, logs] of Object.entries(sessionLogs)) {
        for (const log of logs) {
          await logExerciseMutation.mutateAsync({
            sessionId,
            exerciseId: parseInt(exerciseId),
            setNumber: log.setNumber,
            reps: log.reps,
            weight: log.weight,
          });
        }
      }

      toast.success("¡Sesión guardada exitosamente!");
      setIsDialogOpen(false);
      setSessionLogs({});
    } catch (error) {
      toast.error("Error al guardar la sesión");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-300">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg">
                    {currentDay?.dayNumber}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {currentDay?.dayName}
                  </h1>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 ml-13">
                  {currentDay?.focus}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowTimer(!showTimer)} variant="outline" className="gap-2">
                <Timer className="w-4 h-4" />
                Temporizador
              </Button>
              <Button onClick={handleStartSession} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md gap-2">
                <Zap className="w-4 h-4" />
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {exercises?.map((exercise, index) => (
            <Card
              key={exercise.id}
              className={`${
                exercise.isSuperset
                  ? "border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
                  : "bg-white dark:bg-slate-800"
              } hover:shadow-lg transition-all duration-200`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        #{index + 1}
                      </span>
                      {exercise.isSuperset ? (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          Superserie
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-lg mb-2">{exercise.name}</CardTitle>
                    {exercise.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {exercise.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Series</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{exercise.sets}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reps</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{exercise.reps}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">RIR</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{exercise.rir}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Duración Estimada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Esta sesión de entrenamiento está diseñada para completarse en <strong>60-90 minutos</strong>.
              Respeta los tiempos de descanso indicados para mantener la alta densidad del entrenamiento.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Log Session Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Sesión de Entrenamiento</DialogTitle>
            <DialogDescription>
              Registra tus series, repeticiones y peso para cada ejercicio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {exercises?.map((exercise) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <CardTitle className="text-base">{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <Label className="text-xs">Serie {setIndex + 1}</Label>
                        </div>
                        <div>
                          <Label className="text-xs">Reps</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            onChange={(e) => {
                              const logs = sessionLogs[exercise.id] || [];
                              const existingLog = logs.find((l) => l.setNumber === setIndex + 1);
                              if (existingLog) {
                                existingLog.reps = parseInt(e.target.value) || 0;
                                setSessionLogs({ ...sessionLogs });
                              } else {
                                handleLogSet(exercise.id, setIndex + 1, parseInt(e.target.value) || 0, 0);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Peso (kg)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            onChange={(e) => {
                              const logs = sessionLogs[exercise.id] || [];
                              const existingLog = logs.find((l) => l.setNumber === setIndex + 1);
                              if (existingLog) {
                                existingLog.weight = parseInt(e.target.value) || 0;
                                setSessionLogs({ ...sessionLogs });
                              } else {
                                const reps = logs.find((l) => l.setNumber === setIndex + 1)?.reps || 0;
                                handleLogSet(exercise.id, setIndex + 1, reps, parseInt(e.target.value) || 0);
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSession} disabled={createSessionMutation.isPending}>
              {createSessionMutation.isPending ? "Guardando..." : "Guardar Sesión"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest Timer */}
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
