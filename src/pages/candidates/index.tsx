import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import { CandidateResumePreview } from "~/component/candidate/resumePreview";
import type { Resume, User } from "~/server/db/types/schema";

export default function Candidates({
  acceptedResumes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Job Portal – Список доступних кандидатів</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4">
          <h2 className="py-3 text-2xl font-bold">
            {acceptedResumes.length
              ? "Список доступних кандидатів"
              : "Наразі ніхто з кандидатів не шукає роботу"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {acceptedResumes.map((resume) => (
              <CandidateResumePreview key={resume.user_uuid} resume={resume} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const acceptedResumeQuery = await dbClient.execute(
    "\
select user_uuid,\
       first_name,\
       last_name,\
       work_experience,\
       skills,\
       education,\
       foreign_languages,\
       interests,\
       achievements,\
       specialty,\
       desired_salary,\
       employment,\
       updated_at \
from Resume\
         inner join user on user.id = resume.candidate_id \
where moderation_status_id = (select id as moderation_status_id from status_type where status = 'ACCEPTED');",
  );

  const acceptedResumes = acceptedResumeQuery.rows as never as ResumePreview[];

  return {
    props: {
      acceptedResumes,
    },
    revalidate: 20,
  };
}

export type ResumePreview = Pick<
  User,
  "user_uuid" | "first_name" | "last_name"
> &
  Omit<Resume, "id" | "resume_uuid" | "candidate_id" | "moderation_status_id">;
