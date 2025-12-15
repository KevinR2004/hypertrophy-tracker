import { trpc } from "@/lib/trpc";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Dumbbell, Clock, Zap, Timer, Check, Save, ChevronDown, ChevronUp, History, Wifi, WifiOff, StickyNote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { RestTimer } from "@/components/RestTimer";

interface ExerciseLog {
  setNumber: number;
  reps: number;
  weight: number;
  saved: boolean;
}

interface ExerciseState {
  logs: ExerciseLog[];
  expanded: boolean;
  completed: boolean;
  note: string;
}

interface PendingLog {
  exerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
  timestamp: number;
}

interface OfflineSession {
  sessionId: number | null;
  workoutDayId: number;
  pendingLogs: PendingLog[];
  exerciseNotes: Record<number, string>;
}

const OFFLINE_STORAGE_KEY = "hypertrophy_offline_session";

export default function WorkoutDay() {
  const [, params] = useRoute("/workout/:dayId");
  const dayId = params?.dayId ? parseInt(params.dayId) : 0;
  const { user, isAuthenticated } = useAuth();

  const { data: workoutDays } = trpc.workout.getDays.useQuery();
  const { data: exercises, isLoading } = trpc.workout.getExercises.useQuery({ dayId });
  const { data: lastWeights } = trpc.progress.getLastWeights.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const currentDay = workoutDays?.find((d) => d.id === dayId);

  const [showTimer, setShowTimer] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [exerciseStates, setExerciseStates] = useState<Record<number, ExerciseState>>({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingSync, setHasPendingSync] = useState(false);

  const createSessionMutation = trpc.progress.createSession.useMutation();
  const logExerciseMutation = trpc.progress.logExercise.useMutation();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Conexión restaurada");
      syncPendingData();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Sin conexión - Los datos se guardarán localmente");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check for pending offline data on mount
  useEffect(() => {
    const offlineData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (offlineData) {
      setHasPendingSync(true);
      if (isOnline) {
        syncPendingData();
      }
    }
  }, [isOnline]);

  // Initialize exercise states when exercises load
  useEffect(() => {
    if (exercises) {
      const initialStates: Record<number, ExerciseState> = {};
      exercises.forEach((exercise, index) => {
        // Pre-fill with last used weight if available
        const lastWeight = lastWeights?.[exercise.id];
        
        initialStates[exercise.id] = {
          logs: Array.from({ length: exercise.sets }, (_, i) => ({
            setNumber: i + 1,
            reps: 0,
            weight: lastWeight?.weight || 0,
            saved: false,
          })),
          expanded: index === 0,
          completed: false,
          note: "",
        };
      });
      setExerciseStates(initialStates);
    }
  }, [exercises, lastWeights]);

  const saveToOfflineStorage = useCallback((data: OfflineSession) => {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(data));
    setHasPendingSync(true);
  }, []);

  const syncPendingData = useCallback(async () => {
    const offlineData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!offlineData) return;

    try {
      const data: OfflineSession = JSON.parse(offlineData);
      
      // If we have pending logs but no session ID, we need to create a session first
      if (data.pendingLogs.length > 0) {
        let syncSessionId = data.sessionId;
        
        if (!syncSessionId) {
          const { sessionId: newSessionId } = await createSessionMutation.mutateAsync({
            workoutDayId: data.workoutDayId,
            sessionDate: new Date(data.pendingLogs[0].timestamp),
          });
          syncSessionId = newSessionId;
        }

        // Sync all pending logs
        for (const log of data.pendingLogs) {
          await logExerciseMutation.mutateAsync({
            sessionId: syncSessionId,
            exerciseId: log.exerciseId,
            setNumber: log.setNumber,
            reps: log.reps,
            weight: log.weight,
          });
        }

        toast.success(`${data.pendingLogs.length} registros sincronizados`);
      }

      // Clear offline storage
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      setHasPendingSync(false);
    } catch (error) {
      console.error("Error syncing offline data:", error);
      toast.error("Error al sincronizar datos offline");
    }
  }, [createSessionMutation, logExerciseMutation]);

  const handleStartSession = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (isOnline) {
      try {
        const { sessionId: newSessionId } = await createSessionMutation.mutateAsync({
          workoutDayId: dayId,
          sessionDate: new Date(),
        });
        setSessionId(newSessionId);
        setIsSessionActive(true);
        toast.success("¡Sesión iniciada! Registra tus ejercicios conforme los completes.");
      } catch (error) {
        toast.error("Error al iniciar la sesión");
        console.error(error);
      }
    } else {
      // Start offline session
      setIsSessionActive(true);
      saveToOfflineStorage({
        sessionId: null,
        workoutDayId: dayId,
        pendingLogs: [],
        exerciseNotes: {},
      });
      toast.info("Sesión iniciada en modo offline");
    }
  };

  const handleUpdateLog = (exerciseId: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        logs: prev[exerciseId].logs.map((log, i) =>
          i === setIndex ? { ...log, [field]: value } : log
        ),
      },
    }));
  };

  const handleUpdateNote = (exerciseId: number, note: string) => {
    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        note,
      },
    }));

    // Save note to localStorage for persistence
    const savedNotes = JSON.parse(localStorage.getItem("exercise_notes") || "{}");
    savedNotes[exerciseId] = note;
    localStorage.setItem("exercise_notes", JSON.stringify(savedNotes));
  };

  // Load saved notes on mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("exercise_notes") || "{}");
    if (Object.keys(savedNotes).length > 0 && exercises) {
      setExerciseStates((prev) => {
        const updated = { ...prev };
        Object.entries(savedNotes).forEach(([exerciseId, note]) => {
          if (updated[Number(exerciseId)]) {
            updated[Number(exerciseId)] = {
              ...updated[Number(exerciseId)],
              note: note as string,
            };
          }
        });
        return updated;
      });
    }
  }, [exercises]);

  const handleSaveSet = async (exerciseId: number, setIndex: number) => {
    if (!isSessionActive) {
      toast.error("Primero inicia una sesión de entrenamiento");
      return;
    }

    const log = exerciseStates[exerciseId]?.logs[setIndex];
    if (!log || log.reps === 0) {
      toast.error("Ingresa al menos las repeticiones");
      return;
    }

    if (isOnline && sessionId) {
      try {
        await logExerciseMutation.mutateAsync({
          sessionId,
          exerciseId,
          setNumber: log.setNumber,
          reps: log.reps,
          weight: log.weight,
        });

        markSetAsSaved(exerciseId, setIndex);
        toast.success(`Serie ${log.setNumber} guardada`);
      } catch (error) {
        // If online save fails, save offline
        saveSetOffline(exerciseId, log);
        toast.warning("Guardado localmente (sin conexión)");
      }
    } else {
      // Save offline
      saveSetOffline(exerciseId, log);
      markSetAsSaved(exerciseId, setIndex);
      toast.success(`Serie ${log.setNumber} guardada localmente`);
    }
  };

  const saveSetOffline = (exerciseId: number, log: ExerciseLog) => {
    const offlineData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    const data: OfflineSession = offlineData
      ? JSON.parse(offlineData)
      : { sessionId, workoutDayId: dayId, pendingLogs: [], exerciseNotes: {} };

    data.pendingLogs.push({
      exerciseId,
      setNumber: log.setNumber,
      reps: log.reps,
      weight: log.weight,
      timestamp: Date.now(),
    });

    saveToOfflineStorage(data);
  };

  const markSetAsSaved = (exerciseId: number, setIndex: number) => {
    setExerciseStates((prev) => {
      const updatedLogs = prev[exerciseId].logs.map((l, i) =>
        i === setIndex ? { ...l, saved: true } : l
      );
      const allSetsSaved = updatedLogs.every((l) => l.saved);

      return {
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          logs: updatedLogs,
          completed: allSetsSaved,
          expanded: allSetsSaved ? false : prev[exerciseId].expanded,
        },
      };
    });

    // Auto-expand next exercise if all sets saved
    const state = exerciseStates[exerciseId];
    const updatedLogs = state.logs.map((l, i) => (i === setIndex ? { ...l, saved: true } : l));
    const allSetsSaved = updatedLogs.every((l) => l.saved);

    if (allSetsSaved && exercises) {
      const currentIndex = exercises.findIndex((e) => e.id === exerciseId);
      const nextExercise = exercises[currentIndex + 1];
      if (nextExercise) {
        setExerciseStates((prev) => ({
          ...prev,
          [nextExercise.id]: {
            ...prev[nextExercise.id],
            expanded: true,
          },
        }));
      }
    }
  };

  const handleSaveAllSets = async (exerciseId: number) => {
    if (!isSessionActive) {
      toast.error("Primero inicia una sesión de entrenamiento");
      return;
    }

    const logs = exerciseStates[exerciseId]?.logs || [];
    const unsavedLogs = logs.filter((log) => !log.saved && log.reps > 0);

    if (unsavedLogs.length === 0) {
      toast.error("No hay series para guardar");
      return;
    }

    let savedCount = 0;

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (!log.saved && log.reps > 0) {
        if (isOnline && sessionId) {
          try {
            await logExerciseMutation.mutateAsync({
              sessionId,
              exerciseId,
              setNumber: log.setNumber,
              reps: log.reps,
              weight: log.weight,
            });
            savedCount++;
          } catch (error) {
            saveSetOffline(exerciseId, log);
          }
        } else {
          saveSetOffline(exerciseId, log);
          savedCount++;
        }
      }
    }

    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        logs: prev[exerciseId].logs.map((l) => (l.reps > 0 ? { ...l, saved: true } : l)),
        completed: true,
        expanded: false,
      },
    }));

    toast.success(`¡${savedCount} series guardadas!`);

    // Auto-expand next exercise
    if (exercises) {
      const currentIndex = exercises.findIndex((e) => e.id === exerciseId);
      const nextExercise = exercises[currentIndex + 1];
      if (nextExercise) {
        setExerciseStates((prev) => ({
          ...prev,
          [nextExercise.id]: {
            ...prev[nextExercise.id],
            expanded: true,
          },
        }));
      }
    }
  };

  const toggleExerciseExpanded = (exerciseId: number) => {
    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        expanded: !prev[exerciseId]?.expanded,
      },
    }));
  };

  const handleEndSession = () => {
    const completedCount = Object.values(exerciseStates).filter((s) => s.completed).length;
    const totalCount = exercises?.length || 0;

    if (hasPendingSync && isOnline) {
      syncPendingData();
    }

    if (completedCount < totalCount) {
      toast.info(`Sesión finalizada. Completaste ${completedCount}/${totalCount} ejercicios.`);
    } else {
      toast.success("¡Excelente! Completaste todos los ejercicios. ¡Buen trabajo!");
    }

    setIsSessionActive(false);
    setSessionId(null);
  };

  const useLastWeight = (exerciseId: number) => {
    const lastWeight = lastWeights?.[exerciseId];
    if (lastWeight) {
      setExerciseStates((prev) => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          logs: prev[exerciseId].logs.map((log) => ({
            ...log,
            weight: lastWeight.weight,
          })),
        },
      }));
      toast.success(`Peso anterior aplicado: ${lastWeight.weight}kg`);
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

  const completedExercises = Object.values(exerciseStates).filter((s) => s.completed).length;
  const totalExercises = exercises?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
            <div className="flex gap-2 items-center">
              {/* Online/Offline indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              }`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? "Online" : "Offline"}
              </div>
              
              {hasPendingSync && (
                <Button
                  onClick={syncPendingData}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-orange-600 border-orange-300"
                  disabled={!isOnline}
                >
                  <Save className="w-3 h-3" />
                  Sincronizar
                </Button>
              )}

              <Button onClick={() => setShowTimer(!showTimer)} variant="outline" className="gap-2">
                <Timer className="w-4 h-4" />
                Temporizador
              </Button>
              {!isSessionActive ? (
                <Button
                  onClick={handleStartSession}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md gap-2"
                  disabled={createSessionMutation.isPending}
                >
                  <Zap className="w-4 h-4" />
                  {createSessionMutation.isPending ? "Iniciando..." : "Iniciar Sesión"}
                </Button>
              ) : (
                <Button
                  onClick={handleEndSession}
                  variant="outline"
                  className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Check className="w-4 h-4" />
                  Finalizar ({completedExercises}/{totalExercises})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Session Progress Bar */}
      {isSessionActive && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Progreso de la sesión
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {completedExercises}/{totalExercises} ejercicios completados
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedExercises / totalExercises) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {exercises?.map((exercise, index) => {
            const state = exerciseStates[exercise.id];
            const isExpanded = state?.expanded ?? false;
            const isCompleted = state?.completed ?? false;
            const lastWeight = lastWeights?.[exercise.id];

            return (
              <Card
                key={exercise.id}
                className={`${
                  isCompleted
                    ? "border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10"
                    : exercise.isSuperset
                    ? "border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
                    : "bg-white dark:bg-slate-800"
                } hover:shadow-lg transition-all duration-200`}
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => isSessionActive && toggleExerciseExpanded(exercise.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          #{index + 1}
                        </span>
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <Check className="w-3 h-3 mr-1" />
                            Completado
                          </Badge>
                        )}
                        {exercise.isSuperset && !isCompleted && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Superserie
                          </Badge>
                        )}
                        {/* Last weight indicator */}
                        {lastWeight && !isCompleted && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <History className="w-3 h-3 mr-1" />
                            Último: {lastWeight.weight}kg × {lastWeight.reps}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mb-2">{exercise.name}</CardTitle>
                      {exercise.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {exercise.notes}
                        </p>
                      )}
                      {/* Show saved note if exists */}
                      {state?.note && !isExpanded && (
                        <div className="mt-2 flex items-start gap-1 text-sm text-amber-700 dark:text-amber-400">
                          <StickyNote className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="italic">{state.note}</span>
                        </div>
                      )}
                    </div>
                    {isSessionActive && (
                      <Button variant="ghost" size="icon">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Exercise Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
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

                  {/* Logging Form - Only show when session is active and expanded */}
                  {isSessionActive && isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                      {/* Use last weight button */}
                      {lastWeight && (
                        <div className="mb-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <History className="w-4 h-4" />
                            <span>
                              Última sesión: <strong>{lastWeight.weight}kg × {lastWeight.reps} reps</strong>
                              <span className="text-blue-500 ml-2">
                                ({new Date(lastWeight.date).toLocaleDateString("es-ES")})
                              </span>
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => useLastWeight(exercise.id)}
                            className="text-blue-600 border-blue-300"
                          >
                            Usar peso
                          </Button>
                        </div>
                      )}

                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Registrar Series
                      </h4>
                      <div className="space-y-3">
                        {state?.logs.map((log, setIndex) => (
                          <div
                            key={setIndex}
                            className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg ${
                              log.saved
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "bg-slate-50 dark:bg-slate-700/30"
                            }`}
                          >
                            <div className="col-span-2">
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Serie {setIndex + 1}
                              </span>
                            </div>
                            <div className="col-span-3">
                              <Label className="text-xs text-slate-500">Reps</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={log.reps || ""}
                                onChange={(e) =>
                                  handleUpdateLog(exercise.id, setIndex, "reps", parseInt(e.target.value) || 0)
                                }
                                disabled={log.saved}
                                className="h-9"
                              />
                            </div>
                            <div className="col-span-3">
                              <Label className="text-xs text-slate-500">Peso (kg)</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={log.weight || ""}
                                onChange={(e) =>
                                  handleUpdateLog(exercise.id, setIndex, "weight", parseInt(e.target.value) || 0)
                                }
                                disabled={log.saved}
                                className="h-9"
                              />
                            </div>
                            <div className="col-span-4 flex justify-end">
                              {log.saved ? (
                                <Badge className="bg-green-500 text-white">
                                  <Check className="w-3 h-3 mr-1" />
                                  Guardado
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveSet(exercise.id, setIndex)}
                                  disabled={logExerciseMutation.isPending || log.reps === 0}
                                  className="gap-1"
                                >
                                  <Save className="w-3 h-3" />
                                  Guardar
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Notes section */}
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-2">
                          <StickyNote className="w-4 h-4" />
                          Notas personales
                        </Label>
                        <Textarea
                          placeholder="Ej: Subir peso próxima vez, dolor en hombro, cambiar agarre..."
                          value={state?.note || ""}
                          onChange={(e) => handleUpdateNote(exercise.id, e.target.value)}
                          className="h-20 resize-none"
                        />
                      </div>

                      {/* Save All Button */}
                      {state?.logs.some((l) => !l.saved && l.reps > 0) && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => handleSaveAllSets(exercise.id)}
                            disabled={logExerciseMutation.isPending}
                            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
                          >
                            <Save className="w-4 h-4" />
                            Guardar Todas las Series
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
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

      {/* Rest Timer */}
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
