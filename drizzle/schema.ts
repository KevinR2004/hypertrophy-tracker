import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Workout plan structure
 * Stores the 5-day hypertrophy plan with exercises
 */
export const workoutDays = mysqlTable("workout_days", {
  id: int("id").autoincrement().primaryKey(),
  dayNumber: int("day_number").notNull(), // 1-5
  dayName: varchar("day_name", { length: 100 }).notNull(), // e.g., "Push (Pectoral y HSPU)"
  focus: text("focus").notNull(), // e.g., "Pectoral, Hombro, Tríceps"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  workoutDayId: int("workout_day_id").notNull(),
  orderIndex: int("order_index").notNull(), // Order in the workout
  name: varchar("name", { length: 200 }).notNull(),
  sets: int("sets").notNull(),
  reps: varchar("reps", { length: 50 }).notNull(), // e.g., "6-8", "5-10 seg"
  rir: varchar("rir", { length: 20 }).notNull(), // e.g., "1-2"
  notes: text("notes"), // e.g., "Hacer primero. Descanso 90-120s."
  isSuperset: int("is_superset").default(0).notNull(), // 0 or 1 (boolean)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Progress tracking
 * Stores user's workout sessions and exercise performance
 */
export const workoutSessions = mysqlTable("workout_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  workoutDayId: int("workout_day_id").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exerciseLogs = mysqlTable("exercise_logs", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("session_id").notNull(),
  exerciseId: int("exercise_id").notNull(),
  setNumber: int("set_number").notNull(), // 1, 2, 3...
  reps: int("reps").notNull(), // Actual reps completed
  weight: int("weight").notNull(), // Weight in kg (stored as integer, e.g., 50 = 50kg)
  rir: int("rir"), // Actual RIR (optional)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WorkoutDay = typeof workoutDays.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type ExerciseLog = typeof exerciseLogs.$inferSelect;
export type InsertWorkoutDay = typeof workoutDays.$inferInsert;
export type InsertExercise = typeof exercises.$inferInsert;
export type InsertWorkoutSession = typeof workoutSessions.$inferInsert;
export type InsertExerciseLog = typeof exerciseLogs.$inferInsert;