import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { CandidateProfileViewer } from "~/component/candidate/candidateProfileViewer";
import { SendJobOffer } from "~/component/candidate/sendJobOffer";
import type { Resume, StatusType, User } from "~/server/db/types/schema";

export default function Candidate({
  candidateResume,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const authorizedUser = useContext(AuthContext);
  const isEmployer = authorizedUser?.type === "EMPLOYER";
  const isModeratedCandidate = candidateResume.status === "ACCEPTED";
  const canSendJobOffer = isEmployer && isModeratedCandidate;

  return (
    <>
      <Head>
        <title>
          Job Portal – {candidateResume.first_name} {candidateResume.last_name}
        </title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex space-x-4">
          <CandidateProfileViewer
            userType={authorizedUser?.type}
            candidateResume={candidateResume}
          />
        </div>
        {canSendJobOffer && (
          <SendJobOffer candidateUUID={candidateResume.user_uuid} />
        )}
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const availableCandidatesQuery = await dbClient.execute(
    "\
select user_uuid \
from resume \
         inner join user on user.id = main.resume.candidate_id \
where moderation_status_id = (select id as moderation_status_id from status_type where status = 'ACCEPTED');",
  );

  const candidates = availableCandidatesQuery.rows as never as Pick<
    User,
    "user_uuid"
  >[];

  const paths: StaticPaths[] = candidates.map((candidate) => ({
    params: { candidate: candidate.user_uuid },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }: StaticPaths) {
  const candidateResumeQuery = await dbClient.execute({
    sql: "\
select user_uuid,\
       first_name,\
       last_name,\
       phone_number,\
       email,\
       linkedin_link,\
       github_link,\
       specialty,\
       work_experience,\
       skills,\
       education,\
       foreign_languages,\
       interests,\
       achievements,\
       desired_salary,\
       employment,\
       status \
from user\
         inner join resume on user.id = resume.candidate_id\
         inner join status_type on status_type.id = resume.moderation_status_id \
where user_uuid = :user_uuid;",
    args: {
      user_uuid: params.candidate,
    },
  });

  const candidateResume = candidateResumeQuery.rows[0] as
    | ResumePreview
    | undefined;

  if (!candidateResume) {
    return {
      redirect: {
        destination: "/candidates",
        permanent: false,
      },
    };
  }

  return {
    props: {
      candidateResume,
    },
    revalidate: 20,
  };
}

type StaticPaths = {
  params: {
    candidate: string;
  };
};

export type ResumePreview = Pick<
  User,
  | "user_uuid"
  | "first_name"
  | "last_name"
  | "phone_number"
  | "email"
  | "linkedin_link"
  | "github_link"
> &
  Pick<
    Resume,
    | "specialty"
    | "work_experience"
    | "skills"
    | "education"
    | "foreign_languages"
    | "interests"
    | "achievements"
    | "desired_salary"
    | "employment"
  > &
  Pick<StatusType, "status">;
