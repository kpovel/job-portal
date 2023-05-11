import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import superjson from "superjson";
import type { User, Employer, Questionnaire, Vacancy } from "@prisma/client";
import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import type { CandidateFields as UserFields } from "~/component/candidate/candidateAccountForm";

type EmployerData =
  | User & {
      employer:
        | Employer & {
            questionnaires: (Questionnaire & { vacancy: Vacancy })[];
          };
    };

export default function EmployeeProfile({
  employer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedEmployerData: EmployerData = superjson.parse(employer);

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

  function handleUpdateEmployeeProfile(e: FormEvent): void {
    e.preventDefault();
    void updateEmployeeProfile();
  }

  async function updateEmployeeProfile(): Promise<void> {
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
    <Layout>
      <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
        <h1 className="text-3xl font-bold">Мій профіль</h1>
        <hr className="w-full border-gray-300" />
        <form
          onSubmit={handleUpdateEmployeeProfile}
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
              label="phoneNumber"
              id="phoneNumber"
              name="phoneNumber"
              autoComplete="tel"
              type="text"
              value={formData.phoneNumber}
              onChange={handleUpdateForm}
            />
            <FormInput
              label="email"
              id="email"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleUpdateForm}
            />
            <FormInput
              label="linkedinLink"
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
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req?.cookies[AUTHORIZATION_TOKEN_KEY] ?? "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  const caller = appRouter.createCaller({ prisma });
  const employerData = await caller.employer.findEmployeeById({
    employerId: verifiedToken?.userId ?? "",
  });

  const isUserEmployer = employerData?.userType === "EMPLOYER";

  if (!verifiedToken || !isUserEmployer) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const serializedEmployerData = superjson.stringify(employerData);

  return {
    props: {
      employer: serializedEmployerData,
    },
  };
};
