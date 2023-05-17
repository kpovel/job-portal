import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import { ModerationStatus } from "@prisma/client";

export const candidateAccountRouter = createTRPCRouter({
  findCandidateById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return prisma.user.findUnique({
        where: { id },
        include: {
          candidate: {
            include: { questionnaires: { include: { resume: true } } },
          },
        },
      });
    }),
  findQuestionnaireByCandidateId: publicProcedure
    .input(z.object({ candidateId: z.string() }))
    .query(({ input }) => {
      const { candidateId } = input;
      return prisma.resume.findUnique({
        where: { candidateId },
      });
    }),
  updateCandidateResume: publicProcedure
    .input(
      z.object({
        workExperience: z.string().nullish(),
        skills: z.string().nullish(),
        education: z.string().nullish(),
        foreignLanguages: z.string().nullish(),
        interests: z.string().nullish(),
        achievements: z.string().nullish(),
        specialty: z.string().nullish(),
        desiredSalary: z.string().nullish(),
        employment: z.string().nullish(),
        candidateId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const {
        workExperience,
        skills,
        education,
        foreignLanguages,
        interests,
        achievements,
        specialty,
        desiredSalary,
        employment,
        candidateId,
      } = input;
      return prisma.resume.update({
        where: { candidateId },
        data: {
          workExperience,
          skills,
          education,
          foreignLanguages,
          interests,
          achievements,
          specialty,
          desiredSalary,
          employment,
        },
      });
    }),

  fetchAvailableCandidates: publicProcedure.query(async () => {
    return prisma.user.findMany({
      where: {
        userType: "CANDIDATE",
        candidate: {
          questionnaires: { resume: { moderationStatus: "ACCEPTED" } },
        },
      },
      include: {
        candidate: {
          include: { questionnaires: { include: { resume: true } } },
        },
      },
    });
  }),
  fetchAllCandidates: publicProcedure.query(async () => {
    return prisma.user.findMany({
      where: {
        userType: "CANDIDATE",
      },
      include: {
        candidate: {
          include: { questionnaires: { include: { resume: true } } },
        },
      },
    });
  }),
  updateModerationStatus: publicProcedure
    .input(
      z.object({
        moderationStatus: z.nativeEnum(ModerationStatus),
        questionnaireId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { moderationStatus, questionnaireId } = input;
      return prisma.resume.update({
        where: { questionnaireId },
        data: {
          moderationStatus,
        },
      });
    }),
});
