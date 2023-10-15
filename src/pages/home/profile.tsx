import { Layout } from "~/component/layout/layout";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import superjson from "superjson";
import type {
  Employer,
  Questionnaire,
  User,
  Vacancy,
} from "~/utils/dbSchema/models";
import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import type { CandidateFields as UserFields } from "~/component/candidate/candidateAccountForm";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import Head from "next/head";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { verifyToken } from "~/utils/auth/auth";
import { dbClient } from "~/server/db";

export type EmployerData =
  | User & {
      employer:
        | Employer & {
            questionnaires: (Questionnaire & { vacancy: Vacancy })[];
          };
    };

type EmployerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  email: string;
  linkedinLink: string;
  githubLink: string;
  telegramLink: string;
};

export default function EmployerProfile({
  employerProfile: employer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedEmployerData: EmployerProfile = superjson.parse(employer);

  type FormData = {
    [key: string]: string | number;
  } & UserFields;

  const [formData, setFormData] = useState<FormData>({
    firstName: parsedEmployerData?.firstName ?? "",
    lastName: parsedEmployerData?.lastName ?? "",
    age: parsedEmployerData?.age ?? "",
    phoneNumber: parsedEmployerData?.phoneNumber ?? "",
    email: parsedEmployerData?.email ?? "",
    linkedinLink: parsedEmployerData?.linkedinLink ?? "",
    githubLink: parsedEmployerData?.githubLink ?? "",
    telegramLink: parsedEmployerData?.telegramLink ?? "",
  });

  function handleUpdateForm(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleUpdateEmployerProfile(e: FormEvent): void {
    e.preventDefault();
    void updateEmployerProfile();
  }

  async function updateEmployerProfile(): Promise<void> {
    try {
      await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: parsedEmployerData?.id }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Head>
        <title>Job Portal – Мій профіль</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <EmployerNavigationMenu />
          <hr className="w-full border-gray-300" />
          <form
            onSubmit={handleUpdateEmployerProfile}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
          >
            <div className="space-y-4">
              <FormInput
                label="Імʼя"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                type="text"
                value={formData.firstName}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Прізвище"
                id="lastName"
                name="lastName"
                autoComplete="given-name"
                type="text"
                value={formData.lastName}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Номер телефону"
                id="phoneNumber"
                name="phoneNumber"
                autoComplete="tel"
                type="text"
                value={formData.phoneNumber}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Електронна пошта"
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Посилання на LinkedIn"
                id="linkedinLink"
                name="linkedinLink"
                autoComplete="linkedinLink"
                type="url"
                value={formData.linkedinLink}
                onChange={handleUpdateForm}
              />
            </div>
            <button
              type="submit"
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Оновити дані мого профілю
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req?.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const verifiedToken = verifyToken(authToken) as VerifyToken | null;
  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const employerProfile = await dbClient.execute(
    `select id, firstName, lastName, age, phoneNumber, email, linkedinLink, githubLink, telegramLink
      from User
      left join Employer on User.id = Employer.employerId
      where id = :employerId;`,
    { employerId: verifiedToken.userId },
  );

  const serializedEmployerProfile = superjson.stringify(employerProfile.rows[0]);

  return {
    props: {
      employerProfile: serializedEmployerProfile,
    },
  };
};
