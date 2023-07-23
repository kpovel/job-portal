import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import type { User, Candidate, Questionnaire, Resume } from "@prisma/client";
import Head from "next/head";
import React, { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { CandidateProfileViewer } from "~/component/candidate/candidateProfileViewer";
import { SendJobOffer } from "~/component/candidate/sendJobOffer";

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

  const parsedCandidate: ParsedCandidate = superjson.parse(candidate);
  const isEmployer = authorizedUser?.userType === "EMPLOYER";
  const isModeratedCandidate =
    parsedCandidate?.candidate?.questionnaires?.resume?.moderationStatus ===
    "ACCEPTED";
  const canSendJobOffer = isEmployer && isModeratedCandidate;

  return (
    <>
      <Head>
        <title>
          Job Portal – {parsedCandidate?.firstName} {parsedCandidate?.lastName}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex space-x-4">
          <CandidateProfileViewer
            userType={authorizedUser?.userType}
            candidateData={parsedCandidate}
          />
        </div>
        {canSendJobOffer && <SendJobOffer candidateId={parsedCandidate?.id} />}
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
    fallback: "blocking",
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
