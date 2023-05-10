import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import type { User, Candidate, Questionnaire, Resume } from "@prisma/client";
import Link from "next/link";

export default function Candidates({
  candidates,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  type ParsedCandidates = (User & {
    candidate:
      | (Candidate & {
          questionnaires: (Questionnaire & { resume: Resume | null }) | null;
        })
      | null;
  })[];

  const parsedCandidates: ParsedCandidates = superjson.parse(candidates);

  return (
    <>
      <Head>
        <title>Job Portal – Список доступних кандидатів</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4">
          {parsedCandidates.length ? (
            <h2 className="py-3 text-2xl font-bold">
              Список доступних кандидатів
            </h2>
          ) : (
            <h2 className="py-3 text-2xl font-bold">
              Нарізі ніхто з кандидатів не шукає роботу
            </h2>
          )}
          <div className="grid grid-cols-1 gap-4">
            {parsedCandidates.map((candidate) => (
              <div
                className="rounded-md border border-gray-300 p-4"
                key={candidate.id}
              >
                <Link
                  href={`/candidate/${candidate.id}`}
                  className="mb-3 flex items-center"
                >
                  <div>
                    <div className="font-bold text-blue-600  hover:text-blue-800">
                      {candidate.firstName} {candidate.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {candidate.candidate?.questionnaires?.resume?.specialty}
                    </div>
                  </div>
                </Link>
                <div className="mb-2">
                  <strong>Work Experience:</strong>{" "}
                  {candidate.candidate?.questionnaires?.resume?.workExperience}
                </div>
                <div className="mb-2">
                  <strong>Skills:</strong>{" "}
                  {candidate.candidate?.questionnaires?.resume?.skills}
                </div>
                <div className="mb-2">
                  <strong>Education:</strong>{" "}
                  {candidate.candidate?.questionnaires?.resume?.education}
                </div>
                <div className="mb-2">
                  <strong>Foreign Languages:</strong>{" "}
                  {
                    candidate.candidate?.questionnaires?.resume
                      ?.foreignLanguages
                  }
                </div>
                <div className="mb-2">
                  <strong>Interests:</strong>{" "}
                  {candidate.candidate?.questionnaires?.resume?.interests}
                </div>
                <div className="mb-2">
                  <strong>Achievements:</strong>{" "}
                  {candidate.candidate?.questionnaires?.resume?.achievements}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const caller = appRouter.createCaller({ prisma });
  const candidates = await caller.candidate.fetchAvailableCandidates();
  const serializedCandidates = superjson.stringify(candidates);

  return {
    props: {
      candidates: serializedCandidates,
    },
    revalidate: 20,
  };
};
