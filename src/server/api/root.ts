import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "~/server/api/routers/auth";
import { candidateAccountRouter } from "~/server/api/routers/candidate";
import { employerAccountRouter } from "~/server/api/routers/employer";
import { userRouter } from "~/server/api/routers/user";
import { adminRouter } from "~/server/api/routers/admin";
import { responseRouter } from "~/server/api/routers/responseOnVacancy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  candidate: candidateAccountRouter,
  employer: employerAccountRouter,
  admin: adminRouter,
  response: responseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
