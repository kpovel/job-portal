import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import type { User, Candidate, Questionnaire, Resume } from "@prisma/client";
import Head from "next/head";

export default function Candidate({
  candidate,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  type ParsedCandidate =
    | User & {
        candidate:
          | Candidate & {
              questionnaires: Questionnaire & { resume: Resume };
            };
      };

  const parsedCandidate: ParsedCandidate = superjson.parse(candidate);
  const candidatesResume = parsedCandidate.candidate.questionnaires.resume;

  function renderCandidateResumeInfo(title: string, data: string | null) {
    if (!data) return null;
    return (
      <div className="mb-4">
        <strong className="text-lg font-semibold">{title}:</strong>
        <p className="mt-2 text-gray-700">{data}</p>
      </div>
    );
  }

  function renderCandidateContactInfo(
    title: string,
    data: string | null,
    href?: string | null
  ) {
    if (!data) return null;
    return (
      <div className="mb-4 flex items-center gap-2">
        <strong className="text-lg font-semibold">{title}:</strong>
        {href ? (
          <a href={href} className="text-blue-600 hover:text-blue-800">
            {data}
          </a>
        ) : (
          <p className="text-gray-700">{data}</p>
        )}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Job Portal – {parsedCandidate.firstName} {parsedCandidate.lastName}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex space-x-6">
          <div className="w-2/3 rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">
              {parsedCandidate.firstName} {parsedCandidate.lastName}
              {parsedCandidate.age ? ` - ${parsedCandidate.age}` : ""}
            </h2>
            <h3 className="mb-4 text-xl font-medium">
              {candidatesResume.specialty}
            </h3>
            {renderCandidateResumeInfo(
              "Досвід роботи",
              candidatesResume.workExperience
            )}
            {renderCandidateResumeInfo("Навички", candidatesResume.skills)}
            {renderCandidateResumeInfo("Освіта", candidatesResume.education)}
            {renderCandidateResumeInfo(
              "Іноземні мови",
              candidatesResume.foreignLanguages
            )}
            {renderCandidateResumeInfo("Інтереси", candidatesResume.interests)}
            {renderCandidateResumeInfo(
              "Досягнення",
              candidatesResume.achievements
            )}
            {renderCandidateResumeInfo(
              "Досвід роботи",
              candidatesResume.workExperience
            )}
          </div>
          <div className="w-1/3 rounded-lg border bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-medium">Контактна інформація</h3>
            {renderCandidateContactInfo(
              "Бажана зарплата",
              candidatesResume.desiredSalary
            )}
            {renderCandidateContactInfo(
              "Бажана зайнятість",
              candidatesResume.employment
            )}
            {renderCandidateContactInfo(
              "Номере телефону",
              parsedCandidate.phoneNumber,
              parsedCandidate.phoneNumber
                ? `tel:${parsedCandidate.phoneNumber}`
                : ""
            )}
            {renderCandidateContactInfo(
              "Email",
              parsedCandidate.email,
              parsedCandidate.email ? `mailto:${parsedCandidate.email}` : ""
            )}
            {renderCandidateContactInfo(
              "Linkedin",
              parsedCandidate.linkedinLink,
              parsedCandidate.linkedinLink
            )}
            {renderCandidateContactInfo(
              "Github",
              parsedCandidate.githubLink,
              parsedCandidate.githubLink
            )}
            {renderCandidateContactInfo(
              "Telegram",
              parsedCandidate.telegramLink,
              parsedCandidate.telegramLink
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
  const candidates = await caller.candidate.fetchAvailableCandidates();

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
  };
};
