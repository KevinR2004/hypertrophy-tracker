import { describe, it, expect, beforeAll } from "vitest";
import { getDb, getExerciseProgressData, createWorkoutSession, logExercise } from "./db";
import { eq } from "drizzle-orm";
import { users, workoutSessions, exerciseLogs } from "../drizzle/schema";

describe("Exercise Progress Tracking", () => {
  let testUserId: number;
  let testSessionId: number;
  const testExerciseId = 1; // Assuming exercise ID 1 exists

  beforeAll(async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available for testing");
    }

    // Create a test user
    const testOpenId = `test-progress-${Date.now()}`;
    await db.insert(users).values({
      openId: testOpenId,
      name: "Test Progress User",
      email: "test-progress@example.com",
      role: "user",
    });

    const userResult = await db.select().from(users).where(eq(users.openId, testOpenId)).limit(1);
    testUserId = userResult[0].id;

    // Create a test workout session
    testSessionId = await createWorkoutSession({
      userId: testUserId,
      workoutDayId: 1,
      sessionDate: new Date(),
      notes: "Test session for progress tracking",
    });

    // Log some exercises
    await logExercise({
      sessionId: testSessionId,
      exerciseId: testExerciseId,
      setNumber: 1,
      reps: 8,
      weight: 60,
      rir: 2,
    });

    await logExercise({
      sessionId: testSessionId,
      exerciseId: testExerciseId,
      setNumber: 2,
      reps: 7,
      weight: 60,
      rir: 2,
    });

    await logExercise({
      sessionId: testSessionId,
      exerciseId: testExerciseId,
      setNumber: 3,
      reps: 6,
      weight: 60,
      rir: 3,
    });
  });

  it("should retrieve exercise progress data for a user", async () => {
    const progressData = await getExerciseProgressData(testUserId, testExerciseId);

    expect(progressData).toBeDefined();
    expect(Array.isArray(progressData)).toBe(true);
    expect(progressData.length).toBeGreaterThan(0);
  });

  it("should calculate max weight correctly", async () => {
    const progressData = await getExerciseProgressData(testUserId, testExerciseId);

    expect(progressData.length).toBeGreaterThan(0);
    const firstSession = progressData[0];
    expect(firstSession.maxWeight).toBe(60);
  });

  it("should calculate total volume correctly", async () => {
    const progressData = await getExerciseProgressData(testUserId, testExerciseId);

    expect(progressData.length).toBeGreaterThan(0);
    const firstSession = progressData[0];
    
    // Total volume = (60 * 8) + (60 * 7) + (60 * 6) = 480 + 420 + 360 = 1260
    expect(firstSession.totalVolume).toBe(1260);
  });

  it("should return empty array for user with no exercise logs", async () => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Create a new user with no logs
    const newTestOpenId = `test-no-logs-${Date.now()}`;
    await db.insert(users).values({
      openId: newTestOpenId,
      name: "Test No Logs User",
      email: "test-no-logs@example.com",
      role: "user",
    });

    const userResult = await db.select().from(users).where(eq(users.openId, newTestOpenId)).limit(1);
    const newUserId = userResult[0].id;

    const progressData = await getExerciseProgressData(newUserId, testExerciseId);
    expect(progressData).toEqual([]);
  });

  it("should return empty array for non-existent exercise", async () => {
    const progressData = await getExerciseProgressData(testUserId, 99999);
    expect(progressData).toEqual([]);
  });
});
