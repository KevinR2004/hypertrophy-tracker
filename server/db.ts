import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, workoutDays, exercises, workoutSessions, exerciseLogs, InsertWorkoutSession, InsertExerciseLog, meals, InsertMeal, Meal } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Workout Plan Queries
export async function getAllWorkoutDays() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(workoutDays).orderBy(workoutDays.dayNumber);
}

export async function getExercisesByDayId(dayId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(exercises).where(eq(exercises.workoutDayId, dayId)).orderBy(exercises.orderIndex);
}

// Progress Tracking Queries
export async function createWorkoutSession(session: InsertWorkoutSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(workoutSessions).values(session);
  return Number(result[0].insertId);
}

export async function logExercise(log: InsertExerciseLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(exerciseLogs).values(log);
}

export async function getUserSessions(userId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.sessionDate))
    .limit(limit);
}

export async function getSessionLogs(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(exerciseLogs).where(eq(exerciseLogs.sessionId, sessionId));
}

export async function getExerciseProgressData(userId: number, exerciseId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all sessions for this user with logs for the specific exercise
  const result = await db
    .select({
      sessionDate: workoutSessions.sessionDate,
      weight: exerciseLogs.weight,
      reps: exerciseLogs.reps,
      setNumber: exerciseLogs.setNumber,
    })
    .from(exerciseLogs)
    .innerJoin(workoutSessions, eq(exerciseLogs.sessionId, workoutSessions.id))
    .where(
      and(
        eq(workoutSessions.userId, userId),
        eq(exerciseLogs.exerciseId, exerciseId)
      )
    )
    .orderBy(workoutSessions.sessionDate);

  // Group by session date and calculate max weight and total volume
  const groupedData: Record<string, { date: Date; maxWeight: number; totalVolume: number; sets: number }> = {};
  
  result.forEach((row) => {
    const dateKey = row.sessionDate.toISOString().split('T')[0];
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = {
        date: row.sessionDate,
        maxWeight: row.weight,
        totalVolume: 0,
        sets: 0,
      };
    }
    
    // Update max weight if this set has higher weight
    if (row.weight > groupedData[dateKey].maxWeight) {
      groupedData[dateKey].maxWeight = row.weight;
    }
    
    // Add to total volume (weight × reps)
    groupedData[dateKey].totalVolume += row.weight * row.reps;
    groupedData[dateKey].sets += 1;
  });

  // Convert to array and sort by date
  return Object.values(groupedData).sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Meal tracking functions
export async function createMeal(meal: InsertMeal): Promise<Meal> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(meals).values(meal);
  const insertedId = Number(result[0].insertId);

  const inserted = await db.select().from(meals).where(eq(meals.id, insertedId)).limit(1);
  if (!inserted[0]) {
    throw new Error("Failed to retrieve inserted meal");
  }
  return inserted[0];
}

export async function getMealsByDate(userId: number, date: Date): Promise<Meal[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(meals)
    .where(and(eq(meals.userId, userId), gte(meals.date, startOfDay), lte(meals.date, endOfDay)))
    .orderBy(desc(meals.createdAt));
}

export async function deleteMeal(mealId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(meals).where(eq(meals.id, mealId));
}

// Get last weight used for each exercise by user
export async function getLastWeightsByUser(userId: number) {
  const db = await getDb();
  if (!db) return {};

  // Get the most recent log for each exercise for this user
  const result = await db
    .select({
      exerciseId: exerciseLogs.exerciseId,
      weight: exerciseLogs.weight,
      reps: exerciseLogs.reps,
      sessionDate: workoutSessions.sessionDate,
    })
    .from(exerciseLogs)
    .innerJoin(workoutSessions, eq(exerciseLogs.sessionId, workoutSessions.id))
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.sessionDate), desc(exerciseLogs.setNumber));

  // Group by exercise and get the most recent entry
  const lastWeights: Record<number, { weight: number; reps: number; date: Date }> = {};
  
  result.forEach((row) => {
    if (!lastWeights[row.exerciseId]) {
      lastWeights[row.exerciseId] = {
        weight: row.weight,
        reps: row.reps,
        date: row.sessionDate,
      };
    }
  });

  return lastWeights;
}
