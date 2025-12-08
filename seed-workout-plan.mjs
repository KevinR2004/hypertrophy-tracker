import { drizzle } from "drizzle-orm/mysql2";
import { workoutDays, exercises } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const workoutPlan = [
  {
    dayNumber: 1,
    dayName: "Push (Pectoral y HSPU)",
    focus: "Pectoral, Hombro, Tríceps",
    exercises: [
      { name: "Progresión de Planche (Habilidad)", sets: 3, reps: "5-10 seg", rir: "1-2", notes: "Hacer primero. Tuck Planche o Pica con pies elevados. (10 min)", isSuperset: 0 },
      { name: "Press de Banca Inclinado", sets: 3, reps: "6-8", rir: "1-2", notes: "Énfasis en el pectoral superior. Descanso 90-120s.", isSuperset: 0 },
      { name: "Press Militar con Mancuernas", sets: 3, reps: "8-10", rir: "2", notes: "Hombro anterior y medio. Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Aperturas en Polea", sets: 3, reps: "12-15", rir: "1", notes: "SS: Pectoral y Hombro Medio (V-Taper). Descanso 60s.", isSuperset: 1 },
      { name: "SS: Elevaciones Laterales", sets: 3, reps: "12-15", rir: "1", notes: "SS: Pectoral y Hombro Medio (V-Taper). Descanso 60s.", isSuperset: 1 },
      { name: "SS: Extensión de Tríceps en Polea", sets: 3, reps: "10-12", rir: "1", notes: "SS: Tríceps. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Press Francés", sets: 3, reps: "10-12", rir: "1", notes: "SS: Tríceps. Descanso 60s.", isSuperset: 1 },
      { name: "HSPU Progresión", sets: 3, reps: "5-8", rir: "1-2", notes: "HSPU (Pica con pies elevados o asistida). Descanso 60s.", isSuperset: 0 },
    ],
  },
  {
    dayNumber: 2,
    dayName: "Pull (Espalda y Dominadas)",
    focus: "Espalda, Bíceps, Trapecio",
    exercises: [
      { name: "Progresión de Front Lever (Habilidad)", sets: 3, reps: "5-10 seg", rir: "1-2", notes: "Hacer primero. Tuck Front Lever o Negativas. (10 min)", isSuperset: 0 },
      { name: "Remo con Barra (Pendlay)", sets: 3, reps: "6-8", rir: "1-2", notes: "Espalda media y grosor. Descanso 90-120s.", isSuperset: 0 },
      { name: "Jalón al Pecho (Agarre Ancho)", sets: 3, reps: "8-10", rir: "2", notes: "Énfasis en el dorsal ancho (V-Taper). Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Remo en Máquina", sets: 3, reps: "10-12", rir: "1", notes: "SS: Espalda media y Hombro Posterior. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Face Pulls", sets: 3, reps: "10-12", rir: "1", notes: "SS: Espalda media y Hombro Posterior. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Curl de Bíceps con Barra Z", sets: 3, reps: "8-12", rir: "1", notes: "SS: Bíceps y Braquial. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Curl Martillo", sets: 3, reps: "8-12", rir: "1", notes: "SS: Bíceps y Braquial. Descanso 60s.", isSuperset: 1 },
      { name: "Dominadas con Lastre", sets: 3, reps: "5-8", rir: "1-2", notes: "Dominadas (Progresión de fuerza). Descanso 60s.", isSuperset: 0 },
    ],
  },
  {
    dayNumber: 3,
    dayName: "Legs (Cuádriceps)",
    focus: "Cuádriceps, Femorales, Gemelos",
    exercises: [
      { name: "Sentadilla con Barra", sets: 3, reps: "6-8", rir: "1-2", notes: "Movimiento principal. Profundidad controlada. Descanso 120-180s.", isSuperset: 0 },
      { name: "Prensa de Piernas", sets: 3, reps: "10-12", rir: "1", notes: "Énfasis en el cuádriceps. Pies bajos. Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Extensión de Cuádriceps", sets: 3, reps: "12-20", rir: "0-1", notes: "SS: Cuádriceps y Femorales. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Curl Femoral Sentado", sets: 3, reps: "12-20", rir: "0-1", notes: "SS: Cuádriceps y Femorales. Descanso 60s.", isSuperset: 1 },
      { name: "Peso Muerto Rumano", sets: 3, reps: "8-10", rir: "1", notes: "Femorales y glúteos. Énfasis en el estiramiento. Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Elevación de Gemelos Sentado", sets: 3, reps: "15-20", rir: "1", notes: "SS: Gemelos y Core. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Rueda Abdominal", sets: 3, reps: "15-20", rir: "1", notes: "SS: Gemelos y Core. Descanso 60s.", isSuperset: 1 },
    ],
  },
  {
    dayNumber: 4,
    dayName: "Upper (Volumen)",
    focus: "Pectoral, Espalda, Hombro, Brazos",
    exercises: [
      { name: "Progresión de L-Sit (Habilidad)", sets: 3, reps: "10-15 seg", rir: "1-2", notes: "Hacer primero. L-Sit en paralelas o suelo. (10 min)", isSuperset: 0 },
      { name: "Press de Banca Plano con Mancuernas", sets: 3, reps: "8-10", rir: "1", notes: "Pectoral general. Descanso 90-120s.", isSuperset: 0 },
      { name: "Remo con Mancuerna a una Mano", sets: 3, reps: "10-12", rir: "1", notes: "Espalda media y dorsal. Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Press Inclinado en Máquina", sets: 3, reps: "10-15", rir: "1", notes: "SS: Pectoral superior y Dorsal. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Jalón al Pecho", sets: 3, reps: "10-15", rir: "1", notes: "SS: Pectoral superior y Dorsal. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Curl de Bíceps en Banco Predicador", sets: 3, reps: "10-15", rir: "1", notes: "SS: Brazos. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Extensión de Tríceps", sets: 3, reps: "10-15", rir: "1", notes: "SS: Brazos. Descanso 60s.", isSuperset: 1 },
      { name: "Elevaciones Laterales en Polea", sets: 3, reps: "15-20", rir: "0", notes: "Al fallo. Hombro medio (V-Taper). Descanso 60s.", isSuperset: 0 },
    ],
  },
  {
    dayNumber: 5,
    dayName: "Lower (Femorales)",
    focus: "Femorales, Cuádriceps, Glúteos",
    exercises: [
      { name: "Peso Muerto Convencional", sets: 3, reps: "5-8", rir: "1-2", notes: "Movimiento principal. Femorales y glúteos. Descanso 120-180s.", isSuperset: 0 },
      { name: "Zancadas con Mancuernas", sets: 3, reps: "10-12", rir: "1", notes: "Cuádriceps y glúteos. Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Curl Femoral Tumbado", sets: 3, reps: "10-15", rir: "1", notes: "SS: Femorales y Cuádriceps. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Extensión de Cuádriceps", sets: 3, reps: "10-15", rir: "1", notes: "SS: Femorales y Cuádriceps. Descanso 60s.", isSuperset: 1 },
      { name: "Hip Thrust (Empuje de Cadera)", sets: 3, reps: "15-20", rir: "1", notes: "Glúteos. Descanso 90-120s.", isSuperset: 0 },
      { name: "SS: Elevación de Gemelos de Pie", sets: 3, reps: "15-20", rir: "1", notes: "SS: Gemelos y Core. Descanso 60s.", isSuperset: 1 },
      { name: "SS: Elevación de Piernas Colgado", sets: 3, reps: "15-20", rir: "1", notes: "SS: Gemelos y Core. Descanso 60s.", isSuperset: 1 },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding workout plan...");

  for (const day of workoutPlan) {
    const [insertedDay] = await db.insert(workoutDays).values({
      dayNumber: day.dayNumber,
      dayName: day.dayName,
      focus: day.focus,
    });

    const dayId = Number(insertedDay.insertId);

    for (let i = 0; i < day.exercises.length; i++) {
      const exercise = day.exercises[i];
      await db.insert(exercises).values({
        workoutDayId: dayId,
        orderIndex: i + 1,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rir: exercise.rir,
        notes: exercise.notes,
        isSuperset: exercise.isSuperset,
      });
    }

    console.log(`✅ Day ${day.dayNumber}: ${day.dayName} (${day.exercises.length} exercises)`);
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
