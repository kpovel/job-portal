import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import { ResponseResult } from "@prisma/client";

export const responseRouter = createTRPCRouter({
  responseOnVacancy: publicProcedure
    .input(
      z.object({
        candidateId: z.string(),
        employerId: z.string(),
        vacancyId: z.string(),
        coverLetter: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { candidateId, vacancyId, coverLetter, employerId } = input;
      const candidatesResume = await prisma.questionnaire.findUnique({
        where: { candidateId },
      });

      return prisma.response.create({
        data: {
          vacancyId,
          candidateId,
          employerId,
          resumeId: candidatesResume?.questionnaireId || "",
          coverLetter,
          responseBy: "CANDIDATE",
        },
      });
    }),
  findResponsesByCandidate: publicProcedure
    .input(z.object({ candidateId: z.string(), vacancyId: z.string() }))
    .query(async ({ input }) => {
      const { candidateId, vacancyId } = input;
      return prisma.response.findMany({
        where: { candidateId, vacancyId },
      });
    }),
  createFeedbackResult: publicProcedure
    .input(
      z.object({
        responseId: z.string(),
        responseResult: z.nativeEnum(ResponseResult),
        feedbackContent: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { responseId, responseResult, feedbackContent } = input;

      return prisma.feedbackResult.create({
        data: {
          responseId,
          responseResult,
          response: feedbackContent,
        },
      });
    }),
});
