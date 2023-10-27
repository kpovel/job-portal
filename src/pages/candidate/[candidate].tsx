import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { CandidateProfileViewer } from "~/component/candidate/candidateProfileViewer";
import { SendJobOffer } from "~/component/candidate/sendJobOffer";
import type { ModerationStatus } from "~/utils/dbSchema/enums";

export type ResumePreview = {
  id: string;
  questionnaireId: string;
  firstName: string;
  lastName: string | null;
  age: string | null;
  specialty: string | null;
  workExperience: string | null;
  skills: string | null;
  education: string | null;
  foreignLanguages: string | null;
  interests: string | null;
  achievements: string | null;
  desiredSalary: string | null;
  employment: string | null;
  phoneNumber: string | null;
  email: string | null;
  linkedinLink: string | null;
  githubLink: string | null;
  telegramLink: string | null;
  moderationStatus: ModerationStatus;
} | null;

export default function Candidate({
  candidateResume,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const authorizedUser = useContext(AuthContext);
  const isEmployer = authorizedUser?.userType === "EMPLOYER";
  const isModeratedCandidate = candidateResume?.moderationStatus === "ACCEPTED";
  const canSendJobOffer = isEmployer && isModeratedCandidate;

  return (
    <>
      <Head>
        <title>
          Job Portal – {candidateResume?.firstName} {candidateResume?.lastName}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex space-x-4">
          <CandidateProfileViewer
            userType={authorizedUser?.userType}
            candidateResume={candidateResume}
          />
        </div>
        {canSendJobOffer && <SendJobOffer candidateId={candidateResume.id} />}
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
  const availableCandidatesQuery = await dbClient.execute(
    "select candidateId from Resume where moderationStatus = 'ACCEPTED';",
  );

  const candidates = availableCandidatesQuery.rows as {
    candidateId: string;
  }[];

  const paths: StaticPaths[] = candidates.map((candidate) => ({
    params: { candidate: candidate.candidateId },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: StaticPaths) => {
  const candidateResumeQuery = await dbClient.execute(
    `select id,
        questionnaireId,
        firstName,
        lastName,
        age,
        specialty,
        workExperience,
        skills,
        education,
        foreignLanguages,
        interests,
        achievements,
        desiredSalary,
        employment,
        phoneNumber,
        email,
        linkedinLink,
        githubLink,
        telegramLink,
        moderationStatus
      from User
        inner join Resume on User.id = Resume.candidateId
      where id = :candidateId;`,
    {
      candidateId: params.candidate,
    },
  );

  const candidateResume = candidateResumeQuery.rows[0] as ResumePreview;

  return {
    props: {
      candidateResume,
    },
    revalidate: 20,
  };
};
