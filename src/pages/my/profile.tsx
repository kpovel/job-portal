import { Layout } from "~/component/layout/layout";
import * as Tabs from "@radix-ui/react-tabs";
import { CandidateAccountForm } from "~/component/candidate/candidateAccountForm";
import { CandidateResumeForm } from "~/component/candidate/candidateResumeForm";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { dbClient } from "~/server/db";
import type { Resume, User } from "~/server/db/types/schema";

export default function Profile({
  nestedCandidateProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="isolate px-6 lg:px-8">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="mx-auto w-full max-w-3xl">
            <Tabs.Root
              className="my-8 flex-col rounded-md border border-slate-500"
              defaultValue="tab1"
            >
              <Tabs.List
                className="border-mauve6 flex shrink-0 border-b"
                aria-label="Manage your account"
              >
                <Tabs.Trigger
                  className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative"
                  value="tab1"
                >
                  Мій акаунт
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative"
                  value="tab2"
                >
                  Резюме
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="rounded-b-md bg-white p-5 outline-none"
                value="tab1"
              >
                <CandidateAccountForm
                  candidateData={nestedCandidateProfile.candidate}
                />
              </Tabs.Content>
              <Tabs.Content
                value="tab2"
                className="rounded-b-md bg-white p-5 outline-none"
              >
                <CandidateResumeForm
                  candidateResume={nestedCandidateProfile.resume}
                />
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req.cookies[AUTHORIZATION_TOKEN_KEY] ?? "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const candidateProfileQuery = await dbClient.execute({
    sql: "\
select first_name,\
       last_name,\
       phone_number,\
       email,\
       linkedin_link,\
       github_link,\
       work_experience,\
       skills,\
       education,\
       foreign_languages,\
       interests,\
       achievements,\
       specialty,\
       desired_salary,\
       employment \
from user \
         inner join resume on resume.candidate_id = user.id \
where user.id = :candidate_id \
  and user_type_id = (select id from user_type where type = 'CANDIDATE');",
    args: { candidate_id: verifiedToken.userId },
  });

  const candidateProfile = candidateProfileQuery.rows[0] as
    | (NestedCandidateProfile["candidate"] & NestedCandidateProfile["resume"])
    | undefined;

  if (!candidateProfile) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const nestedCandidateProfile: NestedCandidateProfile = {
    candidate: {
      first_name: candidateProfile.first_name,
      last_name: candidateProfile.last_name,
      phone_number: candidateProfile.phone_number,
      email: candidateProfile.email,
      linkedin_link: candidateProfile.linkedin_link,
      github_link: candidateProfile.github_link,
    },
    resume: {
      work_experience: candidateProfile.work_experience,
      skills: candidateProfile.skills,
      education: candidateProfile.education,
      foreign_languages: candidateProfile.foreign_languages,
      interests: candidateProfile.interests,
      achievements: candidateProfile.achievements,
      specialty: candidateProfile.specialty,
      desired_salary: candidateProfile.desired_salary,
      employment: candidateProfile.employment,
    },
  };

  return {
    props: {
      nestedCandidateProfile,
    },
  };
};

export type NestedCandidateProfile = {
  candidate: Omit<
    User,
    "id" | "user_uuid" | "user_type_id" | "login" | "password"
  >;
  resume: Pick<
    Resume,
    | "work_experience"
    | "skills"
    | "education"
    | "foreign_languages"
    | "interests"
    | "achievements"
    | "specialty"
    | "desired_salary"
    | "employment"
  >;
};
