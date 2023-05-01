import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { UserType } from ".prisma/client";
import { prisma } from "~/server/db";

export const authRouter = createTRPCRouter({
  findUserByLogin: publicProcedure
    .input(z.object({ login: z.string() }))
    .query(async ({ input }) => {
      const { login } = input;
      return prisma.user.findUnique({ where: { login: login } });
    }),
  findUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return prisma.user.findUnique({ where: { id } });
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
