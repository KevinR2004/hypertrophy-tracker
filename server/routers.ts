import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

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
  }),
});

export type AppRouter = typeof appRouter;
