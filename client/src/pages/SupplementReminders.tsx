import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Bell, BellRing, Clock, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Reminder {
  id: string;
  time: string;
  supplement: string;
  dose: string;
  enabled: boolean;
}

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "creatine",
    time: "07:30",
    supplement: "Creatina",
    dose: "5g con desayuno",
    enabled: true,
  },
  {
    id: "citrulline",
    time: "17:30",
    supplement: "Citrulina Malato",
    dose: "6-8g (30-45 min antes del entrenamiento)",
    enabled: true,
  },
  {
    id: "caffeine",
    time: "17:30",
    supplement: "Cafeína",
    dose: "100mg (junto con Citrulina)",
    enabled: true,
  },
  {
    id: "restore",
    time: "23:00",
    supplement: "Restore",
    dose: "1 cápsula (1 hora antes de dormir)",
    enabled: true,
  },
];

export default function SupplementReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("supplement_reminders");
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and permission status
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  useEffect(() => {
    // Save reminders to localStorage whenever they change
    localStorage.setItem("supplement_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    // Check reminders every minute
    const interval = setInterval(() => {
      if (!notificationsEnabled) return;

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      reminders.forEach((reminder) => {
        if (reminder.enabled && reminder.time === currentTime) {
          // Show notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`⏰ Hora de tomar ${reminder.supplement}`, {
              body: reminder.dose,
              icon: "/icon-192.png",
              tag: reminder.id,
            });
          }

          // Also show toast
          toast.success(`⏰ Hora de tomar ${reminder.supplement}`, {
            description: reminder.dose,
            duration: 10000,
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, notificationsEnabled]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Tu navegador no soporta notificaciones");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("Notificaciones activadas");
        
        // Show test notification
        new Notification("✅ Notificaciones activadas", {
          body: "Recibirás recordatorios para tomar tus suplementos",
          icon: "/icon-192.png",
        });
      } else {
        toast.error("Permiso de notificaciones denegado");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Error al activar notificaciones");
    }
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
      )
    );
  };

  const testNotification = (reminder: Reminder) => {
    if (!notificationsEnabled) {
      toast.error("Primero activa las notificaciones");
      return;
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`⏰ Prueba: ${reminder.supplement}`, {
        body: reminder.dose,
        icon: "/icon-192.png",
        tag: `test-${reminder.id}`,
      });
    }

    toast.success(`Notificación de prueba enviada: ${reminder.supplement}`);
  };

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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BellRing className="w-6 h-6 text-blue-600" />
                Recordatorios de Suplementos
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configura notificaciones para no olvidar tus suplementos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Notification Permission Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Activar Notificaciones
            </CardTitle>
            <CardDescription>
              Permite que el navegador te envíe notificaciones para recordarte tomar tus suplementos en el horario correcto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!notificationsEnabled ? (
              <Button onClick={requestNotificationPermission} className="w-full gap-2">
                <BellRing className="w-4 h-4" />
                Activar Notificaciones
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">Notificaciones activadas</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Horario de Suplementos</h2>
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold shadow-lg">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reminder.supplement}</CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {reminder.time}
                        </p>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{reminder.dose}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                    />
                    {notificationsEnabled && reminder.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testNotification(reminder)}
                        className="text-xs"
                      >
                        Probar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Cómo Funcionan los Recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 dark:text-blue-200 space-y-2">
            <p>• Los recordatorios se activan automáticamente a la hora configurada</p>
            <p>• Recibirás una notificación del navegador y un mensaje en la aplicación</p>
            <p>• Puedes activar/desactivar cada recordatorio individualmente</p>
            <p>• Los recordatorios funcionan incluso si la aplicación está en segundo plano</p>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-4">
              💡 Tip: Mantén la pestaña abierta en segundo plano para recibir notificaciones
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
