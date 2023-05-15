import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import type { User, Candidate, Questionnaire, Resume } from "@prisma/client";
import { CandidateResumePreview } from "~/component/candidate/resumePreview";

export type ParsedCandidate = User & {
  candidate:
    | (Candidate & {
        questionnaires: (Questionnaire & { resume: Resume | null }) | null;
      })
    | null;
};

export default function Candidates({
  candidates,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const parsedCandidates: ParsedCandidate[] = superjson.parse(candidates);

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
              <CandidateResumePreview
                key={candidate.id}
                candidate={candidate}
              />
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
