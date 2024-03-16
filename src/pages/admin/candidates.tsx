import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { CandidateResumePreview } from "~/component/candidate/resumePreview";
import { adminOnlyAccess } from "~/utils/admin/adminOnlyAccess";
import { dbClient } from "~/server/db";
import type { ResumePreview } from "../candidates";

export default function Candidates({
  unmoderatedCandidates,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Job portal - Резюме кандидатів</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <AdminNavigationMenu />
          <hr className="w-full border-gray-300" />
          {unmoderatedCandidates.map((candidate) => {
            return (
              <CandidateResumePreview
                resume={candidate}
                key={candidate.user_uuid}
              />
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const isAdmin = await adminOnlyAccess(context);

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const unmoderatedCandidatesQuery = await dbClient.execute(
    "\
select user.user_uuid,\
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
from resume \
         inner join user on user.id = resume.candidate_id \
where moderation_status_id != (select id from status_type where status = 'ACCEPTED');",
  );

  const unmoderatedCandidates =
    unmoderatedCandidatesQuery.rows as never as ResumePreview[];

  return {
    props: {
      unmoderatedCandidates,
    },
  };
}
