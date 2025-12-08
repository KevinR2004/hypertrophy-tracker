import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Dumbbell, TrendingUp, Calendar } from "lucide-react";

export default function WorkoutPlan() {
  const { data: workoutDays, isLoading } = trpc.workout.getDays.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-300">Cargando plan de entrenamiento...</p>
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
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hypertrophy Tracker
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Plan de Alta Densidad</p>
              </div>
            </div>
            <Link href="/progress">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Mi Progreso
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Plan de Entrenamiento
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Rutina de hipertrofia de 5 días con superseries para maximizar el crecimiento muscular en 60-90 minutos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workoutDays?.map((day) => (
            <Card
              key={day.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-500/50 bg-white dark:bg-slate-800"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
                    {day.dayNumber}
                  </div>
                  <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {day.dayName}
                </CardTitle>
                <CardDescription className="text-sm">
                  {day.focus}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/workout/${day.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md">
                    Ver Ejercicios
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Maximizar la hipertrofia en piernas, pectoral, brazos y espalda con énfasis en la estética V-Taper.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Frecuencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                5 días por semana (Push-Pull-Legs-Upper-Lower) con 2 días de descanso.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Duración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                60-90 minutos por sesión utilizando superseries y descansos optimizados.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
