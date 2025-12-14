import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Pill, Clock, Coffee, Dumbbell, Moon, Utensils, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Supplements() {
  const supplementSchedule = [
    {
      time: "7:30 AM",
      activity: "Desayuno",
      supplements: [
        { name: "Creatina", dose: "5g", icon: Dumbbell },
        { name: "Omega-3", dose: "1 cápsula", icon: Pill },
      ],
      notes: "Mezcla la creatina con agua o jugo. Toma el Omega-3 con la comida.",
      meal: "3 Huevos + 150g Papa + Té",
      macros: "25g P / 35g C / 15g G",
    },
    {
      time: "10:00 AM",
      activity: "Snack 1",
      supplements: [],
      notes: "",
      meal: "Plátano + 30g Almendras",
      macros: "5g P / 30g C / 15g G",
    },
    {
      time: "1:00 PM",
      activity: "Almuerzo",
      supplements: [
        { name: "Omega-3", dose: "1 cápsula", icon: Pill },
      ],
      notes: "Toma con la comida.",
      meal: "250g Pollo + 200g Arroz + Verduras",
      macros: "55g P / 60g C / 5g G",
    },
    {
      time: "4:00 PM",
      activity: "Snack 2",
      supplements: [],
      notes: "",
      meal: "200g Yogur Griego + Granola",
      macros: "25g P / 30g C / 5g G",
    },
    {
      time: "5:00 PM",
      activity: "Pre-Entrenamiento (Comida)",
      supplements: [],
      notes: "",
      meal: "Plátano + 20g Mantequilla Maní",
      macros: "5g P / 30g C / 8g G",
    },
    {
      time: "5:30 PM",
      activity: "Pre-Entrenamiento (Suplementos)",
      supplements: [
        { name: "Citrulina Malato", dose: "6-8g (2-3 scoops)", icon: Coffee },
        { name: "Cafeína (Opcional)", dose: "0-50mg", icon: Coffee },
      ],
      notes: "⚠️ Cafeína opcional: puede interferir con el sueño. Usa solo si necesitas energía extra.",
      meal: "",
      macros: "",
      highlight: true,
    },
    {
      time: "6:00-7:00 PM",
      activity: "Entrenamiento",
      supplements: [],
      notes: "¡A entrenar con máximo bombeo!",
      meal: "",
      macros: "",
      highlight: true,
    },
    {
      time: "7:15 PM",
      activity: "Post-Entrenamiento",
      supplements: [
        { name: "Isopure", dose: "40g", icon: Dumbbell },
      ],
      notes: "Ventana anabólica. Recuperación muscular.",
      meal: "40g Isopure + Plátano + 50g Avena",
      macros: "40g P / 50g C / 5g G",
      highlight: true,
    },
    {
      time: "9:00 PM",
      activity: "Cena",
      supplements: [
        { name: "Omega-3", dose: "1 cápsula", icon: Pill },
      ],
      notes: "Toma con la comida.",
      meal: "250g Pollo + 200g Pasta + Verduras",
      macros: "55g P / 60g C / 5g G",
    },
    {
      time: "11:00 PM",
      activity: "Pre-Dormir",
      supplements: [
        { name: "Restore", dose: "1 cápsula", icon: Moon },
      ],
      notes: "Toma con un vaso de agua para mejorar la calidad del sueño.",
      meal: "",
      macros: "",
    },
  ];

  const dailyTotals = {
    protein: "210g",
    carbs: "295g",
    fats: "58g",
    calories: "~2600 kcal",
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Suplementación y Nutrición
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Protocolo optimizado para entrenamiento 6-7 PM
              </p>
            </div>
            <Link href="/reminders">
              <Button variant="outline" className="gap-2">
                <BellRing className="w-4 h-4" />
                Recordatorios
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Daily Totals Card */}
        <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Utensils className="w-6 h-6 text-green-600" />
              Totales Diarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Proteína</p>
                <p className="text-2xl font-bold text-green-600">{dailyTotals.protein}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Carbohidratos</p>
                <p className="text-2xl font-bold text-blue-600">{dailyTotals.carbs}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Grasas</p>
                <p className="text-2xl font-bold text-orange-600">{dailyTotals.fats}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Calorías</p>
                <p className="text-2xl font-bold text-purple-600">{dailyTotals.calories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Timeline */}
        <div className="space-y-4">
          {supplementSchedule.map((item, index) => (
            <Card
              key={index}
              className={`${
                item.highlight
                  ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                  : "bg-white dark:bg-slate-800"
              } hover:shadow-lg transition-all duration-200`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {item.time}
                      </div>
                      {item.highlight && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Crítico
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mb-2">{item.activity}</CardTitle>
                    
                    {/* Supplements */}
                    {item.supplements.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {item.supplements.map((supp, suppIndex) => {
                          const Icon = supp.icon;
                          return (
                            <div
                              key={suppIndex}
                              className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                            >
                              <Icon className="w-5 h-5 text-green-600" />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                  {supp.name}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {supp.dose}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Meal */}
                    {item.meal && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Comida:
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.meal}</p>
                        {item.macros && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {item.macros}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <CardDescription className="text-sm mt-2">
                        {item.notes}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              ⚠️ Consideraciones Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div>
              <p className="font-semibold mb-1">1. Cafeína en la Tarde</p>
              <p>
                Tomar cafeína a las 5:30 PM puede interferir con tu sueño (te acuestas a las 12:00 AM).
                Usa solo si realmente necesitas energía extra, o mejor aún, evítala y confía en la
                Citrulina Malato + comida pre-entrenamiento.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. Hidratación</p>
              <p>
                Bebe mínimo <strong>3 litros de agua</strong> durante el día. La Citrulina aumenta el
                flujo sanguíneo, así que la hidratación es crítica.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. Sueño y Recuperación</p>
              <p>
                Entrenar a las 6-7 PM puede elevar tu temperatura corporal. Toma una ducha tibia después
                del entrenamiento y evita pantallas 1 hora antes de dormir. El Restore a las 11:00 PM te
                ayudará.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. Días con Clases Hasta las 7:00 PM</p>
              <p>
                Los martes tienes clases hasta las 7:00 PM. Opciones: entrena después (8:00-9:00 PM),
                entrena en la mañana, o descansa ese día y entrena el sábado.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
