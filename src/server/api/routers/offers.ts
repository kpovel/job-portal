import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const offersRouter = createTRPCRouter({
  findCandidateOffers: publicProcedure
    .input(
      z.object({
        candidateId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { candidateId } = input;

      return prisma.response.findMany({
        where: { candidateId },
        include: {
          feedbackResult: true,
          vacancy: true,
        },
      });
    }),
});
