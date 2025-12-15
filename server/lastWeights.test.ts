import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, getLastWeightsByUser } from "./db";
import { users, workoutDays, exercises, workoutSessions, exerciseLogs } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Last Weights Tracking", () => {
  let testUserId: number;
  let testExerciseId: number;
  let testDayId: number;
  let testSessionId1: number;
  let testSessionId2: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user
    const [testUser] = await db
      .insert(users)
      .values({
        openId: "test-last-weights-user-" + Date.now(),
        name: "Test Last Weights User",
        role: "user",
      })
      .onDuplicateKeyUpdate({ set: { name: "Test Last Weights User" } });
    testUserId = testUser.insertId;

    // Create test workout day
    const [testDay] = await db
      .insert(workoutDays)
      .values({
        dayNumber: 99,
        dayName: "Test Day Last Weights",
        focus: "Testing",
      })
      .onDuplicateKeyUpdate({ set: { dayName: "Test Day Last Weights" } });
    testDayId = testDay.insertId;

    // Create test exercise
    const [testExercise] = await db
      .insert(exercises)
      .values({
        workoutDayId: testDayId,
        name: "Test Exercise Last Weights",
        sets: 3,
        reps: "10",
        rir: "2",
        orderIndex: 1,
      })
      .onDuplicateKeyUpdate({ set: { name: "Test Exercise Last Weights" } });
    testExerciseId = testExercise.insertId;

    // Create first session with weight 50kg (older)
    const [session1] = await db.insert(workoutSessions).values({
      userId: testUserId,
      workoutDayId: testDayId,
      sessionDate: new Date("2024-01-01"),
    });
    testSessionId1 = session1.insertId;

    await db.insert(exerciseLogs).values({
      sessionId: testSessionId1,
      exerciseId: testExerciseId,
      setNumber: 1,
      reps: 10,
      weight: 50,
    });

    // Create a more recent session with weight 55kg
    const [session2] = await db.insert(workoutSessions).values({
      userId: testUserId,
      workoutDayId: testDayId,
      sessionDate: new Date("2024-01-15"),
    });
    testSessionId2 = session2.insertId;

    await db.insert(exerciseLogs).values({
      sessionId: testSessionId2,
      exerciseId: testExerciseId,
      setNumber: 1,
      reps: 12,
      weight: 55,
    });
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data in correct order (foreign key constraints)
    await db.delete(exerciseLogs).where(eq(exerciseLogs.sessionId, testSessionId1));
    await db.delete(exerciseLogs).where(eq(exerciseLogs.sessionId, testSessionId2));
    await db.delete(workoutSessions).where(eq(workoutSessions.id, testSessionId1));
    await db.delete(workoutSessions).where(eq(workoutSessions.id, testSessionId2));
    await db.delete(exercises).where(eq(exercises.id, testExerciseId));
    await db.delete(workoutDays).where(eq(workoutDays.id, testDayId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  it("should retrieve the most recent weight for an exercise", async () => {
    const lastWeights = await getLastWeightsByUser(testUserId);

    expect(lastWeights).toBeDefined();
    expect(lastWeights[testExerciseId]).toBeDefined();
    expect(lastWeights[testExerciseId].weight).toBe(55); // Most recent weight
    expect(lastWeights[testExerciseId].reps).toBe(12); // Most recent reps
  });

  it("should return empty object for user with no exercise logs", async () => {
    const lastWeights = await getLastWeightsByUser(999999);

    expect(lastWeights).toBeDefined();
    expect(Object.keys(lastWeights).length).toBe(0);
  });

  it("should include date information in the result", async () => {
    const lastWeights = await getLastWeightsByUser(testUserId);

    expect(lastWeights[testExerciseId]).toBeDefined();
    expect(lastWeights[testExerciseId].date).toBeDefined();
    expect(lastWeights[testExerciseId].date instanceof Date).toBe(true);
  });
});
