import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Calendar, TrendingUp, Dumbbell, Download, FileText } from "lucide-react";
import { getLoginUrl } from "@/const";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Progress() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: sessions, isLoading } = trpc.progress.getSessions.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: workoutDays } = trpc.workout.getDays.useQuery();
  const { data: allExercises } = trpc.workout.getExercises.useQuery(
    { dayId: 1 },
    { enabled: !!workoutDays && workoutDays.length > 0 }
  );

  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

  // Get progress data for selected exercise
  const { data: progressData } = trpc.progress.getExerciseProgress.useQuery(
    { exerciseId: selectedExerciseId! },
    { enabled: !!selectedExerciseId && isAuthenticated }
  );

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!progressData || progressData.length === 0) return [];

    return progressData.map((item) => ({
      date: new Date(item.date).toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      }),
      peso: item.maxWeight,
      volumen: item.totalVolume,
    }));
  }, [progressData]);

  const exportToCSV = () => {
    if (!sessions || sessions.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const csvContent = [
      ["Fecha", "Día de Entrenamiento", "Notas"].join(","),
      ...sessions.map((session) =>
        [
          new Date(session.sessionDate).toLocaleDateString("es-ES"),
          session.workoutDayId,
          (session.notes || "N/A").replace(/,/g, ";"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hypertrophy_tracker_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Datos exportados a CSV");
  };

  const exportToPDF = () => {
    if (!sessions || sessions.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Hypertrophy Tracker - Progreso", 14, 20);

    // User info
    doc.setFontSize(12);
    doc.text(`Usuario: ${user?.name || "Usuario"}`, 14, 30);
    doc.text(`Fecha de reporte: ${new Date().toLocaleDateString("es-ES")}`, 14, 37);
    doc.text(`Total de sesiones: ${sessions.length}`, 14, 44);

    // Sessions table
    const tableData = sessions.map((session) => {
      const workoutDay = workoutDays?.find((day) => day.id === session.workoutDayId);
      return [
        new Date(session.sessionDate).toLocaleDateString("es-ES"),
        workoutDay?.dayName || `Día ${session.workoutDayId}`,
        session.notes || "N/A",
      ];
    });

    autoTable(doc, {
      head: [["Fecha", "Entrenamiento", "Notas"]],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Save PDF
    doc.save(`hypertrophy_tracker_${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Reporte PDF generado");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-300">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Inicia Sesión</CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu progreso de entrenamiento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Iniciar Sesión</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Mi Progreso
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {sessions?.length || 0} sesiones registradas
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Charts */}
        {sessions && sessions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progresión de Peso por Ejercicio</CardTitle>
              <CardDescription>Selecciona un ejercicio para ver tu evolución de peso y volumen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Select
                  value={selectedExerciseId?.toString() || ""}
                  onValueChange={(value) => setSelectedExerciseId(Number(value))}
                >
                  <SelectTrigger className="w-full md:w-[400px]">
                    <SelectValue placeholder="Selecciona un ejercicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {allExercises?.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id.toString()}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedExerciseId && chartData.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                      <XAxis
                        dataKey="date"
                        className="text-slate-600 dark:text-slate-400"
                        tick={{ fill: "currentColor" }}
                      />
                      <YAxis
                        yAxisId="left"
                        className="text-slate-600 dark:text-slate-400"
                        tick={{ fill: "currentColor" }}
                        label={{ value: "Peso (kg)", angle: -90, position: "insideLeft" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        className="text-slate-600 dark:text-slate-400"
                        tick={{ fill: "currentColor" }}
                        label={{ value: "Volumen (kg)", angle: 90, position: "insideRight" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="peso"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", r: 6 }}
                        activeDot={{ r: 8 }}
                        name="Peso Máximo (kg)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volumen"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", r: 6 }}
                        activeDot={{ r: 8 }}
                        name="Volumen Total (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : selectedExerciseId && chartData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos registrados para este ejercicio</p>
                    <p className="text-sm mt-2">Completa una sesión de entrenamiento para ver tu progreso</p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un ejercicio para ver tu progresión</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sessions History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Historial de Sesiones</h2>
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => {
              const workoutDay = workoutDays?.find((day) => day.id === session.workoutDayId);
              return (
                <Card key={session.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(session.sessionDate).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{workoutDay?.dayName || `Día ${session.workoutDayId}`}</CardTitle>
                        {session.notes && (
                          <CardDescription className="mt-2">{session.notes}</CardDescription>
                        )}
                      </div>
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg">
                        {workoutDay?.dayNumber || session.workoutDayId}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Dumbbell className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">No has registrado ninguna sesión todavía</p>
                <Link href="/">
                  <Button variant="outline">Ir al Plan de Entrenamiento</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
