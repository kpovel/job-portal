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
  unmoderatedResumes: publicProcedure.query(async () => {
    return prisma.resume.findMany({ where: { moderationStatus: "PENDING" } });
  }),
});
