import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const MEAL_TYPES = [
  { value: "desayuno", label: "Desayuno" },
  { value: "snack1", label: "Snack 1" },
  { value: "almuerzo", label: "Almuerzo" },
  { value: "snack2", label: "Snack 2" },
  { value: "pre_entrenamiento", label: "Pre-Entrenamiento" },
  { value: "post_entrenamiento", label: "Post-Entrenamiento" },
  { value: "cena", label: "Cena" },
];

const MACRO_GOALS = {
  protein: 167,
  carbs: 240,
  fats: 40,
  calories: 2600,
};

export default function Meals() {
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: meals, refetch } = trpc.meals.getByDate.useQuery(
    { date: selectedDate },
    { enabled: isAuthenticated }
  );

  const createMealMutation = trpc.meals.create.useMutation({
    onSuccess: () => {
      toast.success("Comida registrada exitosamente");
      refetch();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la comida");
    },
  });

  const deleteMealMutation = trpc.meals.delete.useMutation({
    onSuccess: () => {
      toast.success("Comida eliminada");
      refetch();
    },
  });

  const [formData, setFormData] = useState({
    description: "",
    mealType: "desayuno",
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    createMealMutation.mutate({
      ...formData,
      mealType: formData.mealType as any,
      date: selectedDate,
    });
  };

  const totalMacros = meals?.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
      calories: acc.calories + meal.calories,
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  ) || { protein: 0, carbs: 0, fats: 0, calories: 0 };

  const progress = {
    protein: (totalMacros.protein / MACRO_GOALS.protein) * 100,
    carbs: (totalMacros.carbs / MACRO_GOALS.carbs) * 100,
    fats: (totalMacros.fats / MACRO_GOALS.fats) * 100,
    calories: (totalMacros.calories / MACRO_GOALS.calories) * 100,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Inicia sesión para ver tus comidas</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = getLoginUrl())} className="w-full">
              Iniciar Sesión
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-blue-600" />
                  Registro de Comidas
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedDate.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md gap-2">
              <Plus className="w-4 h-4" />
              Agregar Comida
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Macro Goals Summary */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Progreso Diario de Macros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Protein */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Proteína</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {totalMacros.protein}g / {MACRO_GOALS.protein}g
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                    style={{ width: `${Math.min(progress.protein, 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Carbohidratos</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {totalMacros.carbs}g / {MACRO_GOALS.carbs}g
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                    style={{ width: `${Math.min(progress.carbs, 100)}%` }}
                  />
                </div>
              </div>

              {/* Fats */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Grasas</span>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {totalMacros.fats}g / {MACRO_GOALS.fats}g
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
                    style={{ width: `${Math.min(progress.fats, 100)}%` }}
                  />
                </div>
              </div>

              {/* Calories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Calorías</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {totalMacros.calories} / {MACRO_GOALS.calories}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${Math.min(progress.calories, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals List */}
        <div className="space-y-4">
          {meals && meals.length > 0 ? (
            meals.map((meal) => (
              <Card key={meal.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {MEAL_TYPES.find((t) => t.value === meal.mealType)?.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{meal.description}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMealMutation.mutate({ mealId: meal.id })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Proteína</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{meal.protein}g</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Carbos</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{meal.carbs}g</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Grasas</p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{meal.fats}g</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Calorías</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{meal.calories}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">No has registrado comidas para hoy</p>
                <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                  Agregar Primera Comida
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add Meal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Comida</DialogTitle>
            <DialogDescription>Agrega los detalles de tu comida para seguir tus macros diarios.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Descripción</Label>
              <Input
                placeholder="Ej: 3 Huevos + 150g Papa"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Tipo de Comida</Label>
              <Select value={formData.mealType} onValueChange={(value) => setFormData({ ...formData, mealType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Proteína (g)</Label>
                <Input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Carbohidratos (g)</Label>
                <Input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Grasas (g)</Label>
                <Input
                  type="number"
                  value={formData.fats}
                  onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Calorías</Label>
                <Input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createMealMutation.isPending}>
              {createMealMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
