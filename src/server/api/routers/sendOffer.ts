import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const sendOfferRouter = createTRPCRouter({
  isSentOffer: publicProcedure
  .input(
    z.object({
      candidateId: z.string(),
      employerId: z.string(),
    }))
    .query(async ({input}) => {
      const {candidateId, employerId} = input;
      // todo: find sent offer
      return prisma.response.findMany({
        where: {candidateId, employerId, responseBy: "EMPLOYER"},
      })
    }),
});
