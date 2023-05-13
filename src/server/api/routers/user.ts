import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  updateUserProfile: publicProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().nullish(),
        lastName: z.string().nullish(),
        age: z.string().nullish(),
        githubLink: z.string().url().optional().or(z.literal("")),
        linkedinLink: z.string().url().optional().or(z.literal("")),
        telegramLink: z.string().url().optional().or(z.literal("")),
        phoneNumber: z.string().nullish(),
        email: z.string().email().nullish(),
      })
    )
    .query(async ({ input }) => {
      const {
        id,
        firstName,
        lastName,
        age,
        githubLink,
        linkedinLink,
        telegramLink,
        phoneNumber,
        email,
      } = input;

      return prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          age,
          githubLink,
          linkedinLink,
          telegramLink,
          phoneNumber,
          email: email,
        },
      });
    }),
});
