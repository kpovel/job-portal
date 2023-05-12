import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const employerAccountRouter = createTRPCRouter({
  findEmployeeById: publicProcedure
    .input(z.object({ employerId: z.string() }))
    .query(async ({ input }) => {
      const { employerId } = input;
      return prisma.user.findUnique({
        where: { id: employerId },
        include: {
          employer: {
            include: { questionnaires: { include: { vacancy: true } } },
          },
        },
      });
    }),
  updateCompanyData: publicProcedure
    .input(
      z.object({
        employerId: z.string(),
        companyName: z.string().nullish(),
        companyAddress: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { employerId, companyName, companyAddress } = input;
      return prisma.employer.update({
        where: { employerId },
        data: {
          companyName,
          companyAddress,
        },
      });
    }),
});
