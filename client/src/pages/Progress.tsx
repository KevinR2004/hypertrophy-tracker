import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Calendar, TrendingUp, Dumbbell } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Progress() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: sessions, isLoading } = trpc.progress.getSessions.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: workoutDays } = trpc.workout.getDays.useQuery();

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
            <CardDescription>
              Debes iniciar sesión para ver tu progreso de entrenamiento.
            </CardDescription>
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
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mi Progreso
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Historial de entrenamientos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => {
              const workoutDay = workoutDays?.find((d) => d.id === session.workoutDayId);
              return (
                <Card key={session.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">
                          {workoutDay?.dayName || `Día ${session.workoutDayId}`}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.sessionDate).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-lg">
                        {workoutDay?.dayNumber}
                      </div>
                    </div>
                  </CardHeader>
                  {session.notes && (
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{session.notes}</p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Aún no has registrado ninguna sesión
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Comienza a registrar tus entrenamientos para ver tu progreso aquí.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Ver Plan de Entrenamiento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
