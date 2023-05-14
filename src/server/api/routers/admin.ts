import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const adminRouter = createTRPCRouter({
  findAdminById: publicProcedure
    .input(z.object({ adminId: z.string() }))
    .query(async ({ input }) => {
      const { adminId } = input;
      return prisma.user.findUnique({ where: { id: adminId } });
    }),
  fetchUnmoderatedCandidates: publicProcedure.query(async () => {
    return prisma.user.findMany({
      include: {
        candidate: {
          include: { questionnaires: { include: { resume: true } } },
        },
      },
      where: {
        candidate: {
          questionnaires: { resume: { moderationStatus: "PENDING" } },
        },
      },
    });
  }),
  fetchUnmoderatedVacancies: publicProcedure.query(async () => {
    return prisma.vacancy.findMany({
      where: { moderationStatus: "PENDING" },
    });
  }),
});
