import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import React from "react";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { CandidateResumePreview } from "~/component/candidate/resumePreview";
import type { ParsedCandidate } from "~/pages/candidates";

export default function Candidates({
  unmoderatedCandidates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedCandidates: ParsedCandidate[] = superjson.parse(
    unmoderatedCandidates
  );

  return (
    <>
      <Head>
        <title>Job portal - Резюме кандидатів</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <AdminNavigationMenu />
          <hr className="w-full border-gray-300" />
          {parsedCandidates.map((candidate) => {
            return (
              <CandidateResumePreview
                candidate={candidate}
                key={candidate.id}
              />
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const context = appRouter.createCaller({ prisma });
  const candidatesWithUnmoderatedResumes =
    await context.admin.fetchUnmoderatedCandidates();
  const serializedCandidates = superjson.stringify(
    candidatesWithUnmoderatedResumes
  );

  return {
    props: {
      unmoderatedCandidates: serializedCandidates,
    },
  };
};
