import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const candidateAccountRouter = createTRPCRouter({
  findCandidateById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return prisma.user.findUnique({
        where: { id },
        include: { candidate: { include: { resume: true } } },
      });
    }),
});
