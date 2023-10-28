import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { CandidateResumePreview } from "~/component/candidate/resumePreview";
import { adminOnlyAccess } from "~/utils/admin/adminOnlyAccess";
import type { Resume } from "~/utils/dbSchema/models";
import { dbClient } from "~/server/db";

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
                key={candidate.questionnaireId}
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

  const unmoderatedCandidatesQuery = await dbClient.execute(`
      select questionnaireId, workExperience, skills, education, foreignLanguages, interests, achievements, specialty, desiredSalary, employment, updatedAt, candidateId, firstName, lastName
      from Resume
      inner join User on User.id = Resume.candidateId
      where moderationStatus != 'ACCEPTED';`);

  const unmoderatedCandidates = unmoderatedCandidatesQuery.rows as (Omit<
    Resume,
    "moderationStation"
  > & { firstName: string; lastName: string })[];

  return {
    props: {
      unmoderatedCandidates,
    },
  };
}
