import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const vacationPlan = [
  {
    dayNumber: 1,
    dayName: "Día 1: Push en Casa",
    focus: "Pectoral, Hombro, Tríceps",
    difficulty: "moderado",
    exercises: [
      { name: "Flexiones (Push-ups)", sets: 4, reps: "12-15", rir: "2", equipment: "Peso corporal" },
      { name: "Flexiones Diamante", sets: 3, reps: "8-12", rir: "2", equipment: "Peso corporal" },
      { name: "Pike Push-ups", sets: 3, reps: "10-12", rir: "2", equipment: "Peso corporal" },
      { name: "Fondos en Silla", sets: 3, reps: "10-15", rir: "2", equipment: "Silla" },
      { name: "Flexiones Inclinadas", sets: 3, reps: "12-15", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 2,
    dayName: "Día 2: Pull en Casa",
    focus: "Espalda, Bíceps",
    difficulty: "moderado",
    exercises: [
      { name: "Dominadas (o Flexiones Invertidas)", sets: 4, reps: "8-12", rir: "2", equipment: "Barra o Puerta" },
      { name: "Flexiones Invertidas en Silla", sets: 3, reps: "10-15", rir: "2", equipment: "Silla" },
      { name: "Remo Invertido", sets: 3, reps: "10-12", rir: "2", equipment: "Barra o Puerta" },
      { name: "Curl de Bíceps con Botellas", sets: 3, reps: "12-15", rir: "1", equipment: "Botellas de agua" },
    ]
  },
  {
    dayNumber: 3,
    dayName: "Día 3: Descanso Activo",
    focus: "Movilidad y Flexibilidad",
    difficulty: "fácil",
    exercises: [
      { name: "Caminata Ligera", sets: 1, reps: "30 min", rir: "1", equipment: "Peso corporal" },
      { name: "Estiramientos Dinámicos", sets: 1, reps: "15 min", rir: "1", equipment: "Peso corporal" },
      { name: "Yoga Ligero", sets: 1, reps: "20 min", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 4,
    dayName: "Día 4: Piernas en Casa",
    focus: "Cuádriceps, Glúteos, Isquiotibiales",
    difficulty: "difícil",
    exercises: [
      { name: "Sentadillas Corporales", sets: 4, reps: "15-20", rir: "2", equipment: "Peso corporal" },
      { name: "Sentadillas Búlgaras", sets: 3, reps: "12-15", rir: "2", equipment: "Silla" },
      { name: "Estocadas", sets: 3, reps: "12-15 c/pierna", rir: "2", equipment: "Peso corporal" },
      { name: "Puente de Glúteos", sets: 3, reps: "15-20", rir: "1", equipment: "Peso corporal" },
      { name: "Elevaciones de Pantorrilla", sets: 3, reps: "20-25", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 5,
    dayName: "Día 5: Push Volumen",
    focus: "Pectoral, Hombro, Tríceps (Mayor Volumen)",
    difficulty: "difícil",
    exercises: [
      { name: "Flexiones Amplias", sets: 4, reps: "12-15", rir: "2", equipment: "Peso corporal" },
      { name: "Flexiones Cerradas", sets: 3, reps: "10-12", rir: "2", equipment: "Peso corporal" },
      { name: "Flexiones Explosivas", sets: 3, reps: "8-10", rir: "2", equipment: "Peso corporal" },
      { name: "Fondos Profundos", sets: 3, reps: "8-12", rir: "2", equipment: "Silla" },
      { name: "Planchas", sets: 3, reps: "45-60 seg", rir: "2", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 6,
    dayName: "Día 6: Pull Volumen",
    focus: "Espalda, Bíceps (Mayor Volumen)",
    difficulty: "difícil",
    exercises: [
      { name: "Dominadas Amplias", sets: 4, reps: "6-10", rir: "2", equipment: "Barra o Puerta" },
      { name: "Dominadas Cerradas", sets: 3, reps: "8-12", rir: "2", equipment: "Barra o Puerta" },
      { name: "Remo Invertido Profundo", sets: 3, reps: "8-12", rir: "2", equipment: "Barra o Puerta" },
      { name: "Curl Concentrado con Botellas", sets: 3, reps: "12-15", rir: "1", equipment: "Botellas de agua" },
      { name: "Planchas Invertidas", sets: 3, reps: "30-45 seg", rir: "2", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 7,
    dayName: "Día 7: Descanso Completo",
    focus: "Recuperación Total",
    difficulty: "fácil",
    exercises: [
      { name: "Descanso Activo Ligero", sets: 1, reps: "Según se sienta", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 8,
    dayName: "Día 8: Push Explosivo",
    focus: "Potencia en Pecho y Hombro",
    difficulty: "difícil",
    exercises: [
      { name: "Flexiones Clapping", sets: 3, reps: "5-8", rir: "3", equipment: "Peso corporal" },
      { name: "Flexiones Explosivas", sets: 3, reps: "8-10", rir: "2", equipment: "Peso corporal" },
      { name: "Pike Push-ups Explosivos", sets: 3, reps: "6-8", rir: "2", equipment: "Peso corporal" },
      { name: "Fondos Explosivos", sets: 3, reps: "6-10", rir: "2", equipment: "Silla" },
      { name: "Flexiones Inclinadas Rápidas", sets: 3, reps: "15-20", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 9,
    dayName: "Día 9: Pull Explosivo",
    focus: "Potencia en Espalda y Bíceps",
    difficulty: "difícil",
    exercises: [
      { name: "Dominadas Explosivas", sets: 3, reps: "5-8", rir: "3", equipment: "Barra o Puerta" },
      { name: "Remo Invertido Explosivo", sets: 3, reps: "8-10", rir: "2", equipment: "Barra o Puerta" },
      { name: "Flexiones Invertidas Rápidas", sets: 3, reps: "12-15", rir: "1", equipment: "Silla" },
      { name: "Curl Explosivo con Botellas", sets: 3, reps: "10-12", rir: "2", equipment: "Botellas de agua" },
    ]
  },
  {
    dayNumber: 10,
    dayName: "Día 10: Piernas Explosivas",
    focus: "Potencia en Piernas",
    difficulty: "difícil",
    exercises: [
      { name: "Sentadillas Explosivas", sets: 4, reps: "8-12", rir: "2", equipment: "Peso corporal" },
      { name: "Saltos Profundos", sets: 3, reps: "8-10", rir: "2", equipment: "Peso corporal" },
      { name: "Estocadas Explosivas", sets: 3, reps: "10-12 c/pierna", rir: "2", equipment: "Peso corporal" },
      { name: "Puente Explosivo de Glúteos", sets: 3, reps: "12-15", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 11,
    dayName: "Día 11: Descanso Activo",
    focus: "Recuperación y Movilidad",
    difficulty: "fácil",
    exercises: [
      { name: "Caminata Moderada", sets: 1, reps: "45 min", rir: "1", equipment: "Peso corporal" },
      { name: "Estiramientos Profundos", sets: 1, reps: "20 min", rir: "1", equipment: "Peso corporal" },
    ]
  },
  {
    dayNumber: 12,
    dayName: "Día 12: Push Resistencia",
    focus: "Resistencia Muscular en Push",
    difficulty: "moderado",
    exercises: [
      { name: "Flexiones Lentas", sets: 4, reps: "12-15 (3 seg bajada)", rir: "1", equipment: "Peso corporal" },
      { name: "Flexiones Diamante Lentas", sets: 3, reps: "10-12 (3 seg bajada)", rir: "1", equipment: "Peso corporal" },
      { name: "Pike Push-ups Lentos", sets: 3, reps: "10-12 (3 seg bajada)", rir: "1", equipment: "Peso corporal" },
      { name: "Fondos Lentos", sets: 3, reps: "10-15 (3 seg bajada)", rir: "1", equipment: "Silla" },
    ]
  },
  {
    dayNumber: 13,
    dayName: "Día 13: Pull Resistencia",
    focus: "Resistencia Muscular en Pull",
    difficulty: "moderado",
    exercises: [
      { name: "Dominadas Lentas", sets: 4, reps: "8-12 (3 seg bajada)", rir: "1", equipment: "Barra o Puerta" },
      { name: "Remo Invertido Lento", sets: 3, reps: "10-12 (3 seg bajada)", rir: "1", equipment: "Barra o Puerta" },
      { name: "Flexiones Invertidas Lentas", sets: 3, reps: "10-15 (3 seg bajada)", rir: "1", equipment: "Silla" },
      { name: "Curl Lento con Botellas", sets: 3, reps: "12-15 (3 seg bajada)", rir: "1", equipment: "Botellas de agua" },
    ]
  },
  {
    dayNumber: 14,
    dayName: "Día 14: Cuerpo Completo Ligero",
    focus: "Recuperación y Mantenimiento",
    difficulty: "fácil",
    exercises: [
      { name: "Flexiones Ligeras", sets: 2, reps: "10-12", rir: "3", equipment: "Peso corporal" },
      { name: "Sentadillas Ligeras", sets: 2, reps: "15-20", rir: "3", equipment: "Peso corporal" },
      { name: "Flexiones Invertidas Ligeras", sets: 2, reps: "8-10", rir: "3", equipment: "Silla" },
      { name: "Caminata Ligera", sets: 1, reps: "30 min", rir: "1", equipment: "Peso corporal" },
    ]
  },
];

try {
  for (const day of vacationPlan) {
    const exercises = day.exercises;
    delete day.exercises;

    const [dayResult] = await connection.execute(
      'INSERT INTO vacation_workout_days (day_number, day_name, focus, difficulty) VALUES (?, ?, ?, ?)',
      [day.dayNumber, day.dayName, day.focus, day.difficulty]
    );

    const dayId = dayResult.insertId;

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      await connection.execute(
        'INSERT INTO vacation_exercises (vacation_day_id, order_index, name, sets, reps, rir, notes, equipment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [dayId, i + 1, exercise.name, exercise.sets, exercise.reps, exercise.rir, '', exercise.equipment]
      );
    }
  }

  console.log('✓ Vacation plan seeded successfully!');
} catch (error) {
  console.error('Error seeding vacation plan:', error);
} finally {
  await connection.end();
}
