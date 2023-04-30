import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { UserType } from ".prisma/client";
import { prisma } from "~/server/db";

export const authRouter = createTRPCRouter({
  findUniqUser: publicProcedure
    .input(z.object({ login: z.string() }))
    .query(async ({ input }) => {
      const { login } = input;
      return prisma.user.findUnique({ where: { login: login } });
    }),
  createCandidate: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
        userType: z.nativeEnum(UserType),
      })
    )
    .query(async ({ input }) => {
      const { login, password, userType } = input;
      return prisma.user.create({
        data: {
          userType,
          login,
          password,
          candidate: {
            create: {},
          },
        },
      });
    }),
  createEmployer: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
        userType: z.nativeEnum(UserType),
      })
    )
    .query(async ({ input }) => {
      const { login, password, userType } = input;
      return prisma.user.create({
        data: {
          userType,
          login,
          password,
          employer: {
            create: {},
          },
        },
      });
    }),
  createAdmin: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
        userType: z.nativeEnum(UserType),
      })
    )
    .query(async ({ input }) => {
      const { login, password, userType } = input;
      return prisma.user.create({
        data: {
          userType,
          login,
          password,
        },
      });
    }),
});
