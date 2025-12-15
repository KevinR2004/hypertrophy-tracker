import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  workout: router({
    getDays: publicProcedure.query(async () => {
      const { getAllWorkoutDays } = await import("./db");
      return await getAllWorkoutDays();
    }),
    getExercises: publicProcedure
      .input(z.object({ dayId: z.number() }))
      .query(async ({ input }) => {
        const { getExercisesByDayId } = await import("./db");
        return await getExercisesByDayId(input.dayId);
      }),
  }),

  progress: router({
    createSession: protectedProcedure
      .input(
        z.object({
          workoutDayId: z.number(),
          sessionDate: z.date(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createWorkoutSession } = await import("./db");
        const sessionId = await createWorkoutSession({
          userId: ctx.user.id,
          workoutDayId: input.workoutDayId,
          sessionDate: input.sessionDate,
          notes: input.notes,
        });
        return { sessionId };
      }),

    logExercise: protectedProcedure
      .input(
        z.object({
          sessionId: z.number(),
          exerciseId: z.number(),
          setNumber: z.number(),
          reps: z.number(),
          weight: z.number(),
          rir: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { logExercise } = await import("./db");
        await logExercise(input);
        return { success: true };
      }),

    getSessions: protectedProcedure.query(async ({ ctx }) => {
      const { getUserSessions } = await import("./db");
      return await getUserSessions(ctx.user.id);
    }),

    getSessionLogs: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        const { getSessionLogs } = await import("./db");
        return await getSessionLogs(input.sessionId);
      }),

    getExerciseProgress: protectedProcedure
      .input(z.object({ exerciseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getExerciseProgressData } = await import("./db");
        return await getExerciseProgressData(ctx.user.id, input.exerciseId);
      }),

    getLastWeights: protectedProcedure.query(async ({ ctx }) => {
      const { getLastWeightsByUser } = await import("./db");
      return await getLastWeightsByUser(ctx.user.id);
    }),
  }),
  meals: router({
    create: protectedProcedure
      .input(
        z.object({
          description: z.string(),
          mealType: z.enum(["desayuno", "snack1", "almuerzo", "snack2", "pre_entrenamiento", "post_entrenamiento", "cena"]),
          protein: z.number(),
          carbs: z.number(),
          fats: z.number(),
          calories: z.number(),
          date: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createMeal } = await import("./db");
        return createMeal({
          userId: ctx.user.id,
          ...input,
        });
      }),
    getByDate: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ ctx, input }) => {
        const { getMealsByDate } = await import("./db");
        return getMealsByDate(ctx.user.id, input.date);
      }),
    delete: protectedProcedure
      .input(z.object({ mealId: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteMeal } = await import("./db");
        await deleteMeal(input.mealId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
