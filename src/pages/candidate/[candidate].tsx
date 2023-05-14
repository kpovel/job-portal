import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import type { User, Candidate, Questionnaire, Resume } from "@prisma/client";
import Head from "next/head";
import React, { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { renderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { renderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { ModerateCandidate } from "~/component/admin/moderation/moderateCandidate";

export type ParsedCandidate =
  | (User & {
      candidate:
        | (Candidate & {
            questionnaires: (Questionnaire & { resume: Resume | null }) | null;
          })
        | null;
    })
  | null;

export default function Candidate({
  candidate,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const authorizedUser = useContext(AuthContext);
  const isUserAdmin = authorizedUser?.userType === "ADMIN";

  const parsedCandidate: ParsedCandidate = superjson.parse(candidate);
  const candidatesResume = parsedCandidate?.candidate?.questionnaires?.resume;

  return (
    <>
      <Head>
        <title>
          Job Portal – {parsedCandidate?.firstName} {parsedCandidate?.lastName}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex space-x-6">
          <div className="w-2/3 rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">
              {parsedCandidate?.firstName} {parsedCandidate?.lastName}
              {parsedCandidate?.age ? ` - ${parsedCandidate?.age}` : ""}
            </h2>
            <h3 className="mb-4 text-xl font-medium">
              {candidatesResume?.specialty}
            </h3>
            {renderQuestionnaireDetail(
              "Досвід роботи",
              candidatesResume?.workExperience
            )}
            {renderQuestionnaireDetail("Навички", candidatesResume?.skills)}
            {renderQuestionnaireDetail("Освіта", candidatesResume?.education)}
            {renderQuestionnaireDetail(
              "Іноземні мови",
              candidatesResume?.foreignLanguages
            )}
            {renderQuestionnaireDetail("Інтереси", candidatesResume?.interests)}
            {renderQuestionnaireDetail(
              "Досягнення",
              candidatesResume?.achievements
            )}
            {renderQuestionnaireDetail(
              "Досвід роботи",
              candidatesResume?.workExperience
            )}
          </div>
          <div className="w-1/3 rounded-lg border bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-medium">Контактна інформація</h3>
            {renderQuestionnaireInfo(
              "Бажана зарплата",
              candidatesResume?.desiredSalary
            )}
            {renderQuestionnaireInfo(
              "Бажана зайнятість",
              candidatesResume?.employment
            )}
            {renderQuestionnaireInfo(
              "Номере телефону",
              parsedCandidate?.phoneNumber,
              parsedCandidate?.phoneNumber
                ? `tel:${parsedCandidate.phoneNumber}`
                : ""
            )}
            {renderQuestionnaireInfo(
              "Email",
              parsedCandidate?.email,
              parsedCandidate?.email ? `mailto:${parsedCandidate.email}` : ""
            )}
            {renderQuestionnaireInfo(
              "Linkedin",
              parsedCandidate?.linkedinLink,
              parsedCandidate?.linkedinLink
            )}
            {renderQuestionnaireInfo(
              "Github",
              parsedCandidate?.githubLink,
              parsedCandidate?.githubLink
            )}
            {renderQuestionnaireInfo(
              "Telegram",
              parsedCandidate?.telegramLink,
              parsedCandidate?.telegramLink
            )}
            {isUserAdmin && (
              <ModerateCandidate candidateData={parsedCandidate} />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

type StaticPaths = {
  params: {
    candidate: string;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const caller = appRouter.createCaller({ prisma });
  const candidates = await caller.candidate.fetchAllCandidates();

  const paths: StaticPaths[] = candidates.map((candidate) => ({
    params: { candidate: candidate.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: StaticPaths) => {
  const caller = appRouter.createCaller({ prisma });
  const candidate = await caller.candidate.findCandidateById({
    id: params.candidate,
  });
  const serializedCandidate = superjson.stringify(candidate);

  return {
    props: {
      candidate: serializedCandidate,
    },
    revalidate: 20,
  };
};
