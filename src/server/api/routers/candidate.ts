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
        include: {
          candidate: {
            include: { questionnaires: { include: { resume: true } } },
          },
        },
      });
    }),
  updateCandidateProfile: publicProcedure
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
          email,
        },
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

  fetchCandidateById: publicProcedure
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
});
