import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import { CandidateResumePreview } from "~/component/candidate/resumePreview";
import type { Resume } from "~/utils/dbSchema/models";

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
              <CandidateResumePreview
                key={resume.questionnaireId}
                resume={resume}
              />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const acceptedResumeQuery = await dbClient.execute(`
      select questionnaireId, workExperience, skills, education, foreignLanguages, interests, achievements, specialty, desiredSalary, employment, updatedAt, candidateId, firstName, lastName
      from Resume
      inner join User on User.id = Resume.candidateId
      where moderationStatus = 'ACCEPTED';`);

  const acceptedResumes = acceptedResumeQuery.rows as (Omit<
    Resume,
    "moderationStation"
  > & { firstName: string; lastName: string })[];

  return {
    props: {
      acceptedResumes,
    },
    revalidate: 20,
  };
}
