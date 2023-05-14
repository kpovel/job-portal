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
  createVacancy: publicProcedure
    .input(
      z.object({
        employerId: z.string(),
        specialty: z.string(),
        salary: z.string().nullish(),
        duties: z.string().nullish(),
        requirements: z.string().nullish(),
        conditions: z.string().nullish(),
        workSchedule: z.string().nullish(),
        employment: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const {
        employerId,
        specialty,
        salary,
        duties,
        requirements,
        conditions,
        workSchedule,
        employment,
      } = input;

      return prisma.questionnaire.create({
        data: {
          questionnaireType: "VACANCY",
          employerId,
          vacancy: {
            create: {
              employerId,
              specialty,
              salary,
              duties,
              requirements,
              conditions,
              workSchedule,
              employment,
            },
          },
        },
      });
    }),
  getQuestionnaireById: publicProcedure
    .input(z.object({ questionnaireId: z.string() }))
    .query(async ({ input }) => {
      const { questionnaireId } = input;
      return prisma.questionnaire.findUnique({
        where: { questionnaireId },
        include: { vacancy: true },
      });
    }),
  updateVacancy: publicProcedure
    .input(
      z.object({
        questionnaireId: z.string(),
        specialty: z.string(),
        salary: z.string().nullish(),
        duties: z.string().nullish(),
        requirements: z.string().nullish(),
        conditions: z.string().nullish(),
        workSchedule: z.string().nullish(),
        employment: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const {
        questionnaireId,
        specialty,
        salary,
        duties,
        requirements,
        conditions,
        workSchedule,
        employment,
      } = input;

      return prisma.vacancy.update({
        where: { questionnaireId },
        data: {
          specialty,
          salary,
          duties,
          requirements,
          conditions,
          workSchedule,
          employment,
        },
      });
    }),
  fetchAvailableVacancies: publicProcedure.query(async () => {
    return prisma.vacancy.findMany({
      where: { moderationStatus: "ACCEPTED" },
    });
  }),
  fetchAllVacancies: publicProcedure.query(async () => {
    return prisma.vacancy.findMany();
  }),
  informationAboutVacancy: publicProcedure
    .input(z.object({ vacancyId: z.string() }))
    .query(async ({ input }) => {
      const { vacancyId } = input;
      const vacancy = await prisma.vacancy.findUnique({
        where: { questionnaireId: vacancyId },
      });

      const employer = await prisma.user.findUnique({
        where: { id: vacancy?.employerId },
        include: {
          employer: true,
        },
      });

      return {
        vacancy,
        employer,
      };
    }),
});
