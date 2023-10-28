import { Layout } from "~/component/layout/layout";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import type {
  Employer,
  Questionnaire,
  User,
  Vacancy,
} from "~/utils/dbSchema/models";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import Head from "next/head";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { verifyToken } from "~/utils/auth/auth";
import { dbClient } from "~/server/db";
import { UserType } from "~/utils/dbSchema/enums";

export type EmployerData =
  | User & {
      employer:
        | Employer & {
            questionnaires: (Questionnaire & { vacancy: Vacancy })[];
          };
    };

type EmployerProfile = {
  id: string;
  userType: UserType;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  linkedinLink: string | null;
};

type FormData = Omit<EmployerProfile, "id" | "userType">;

type NonNullableKeys<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

type NonNullableFormData = NonNullableKeys<FormData>;

export default function EmployerProfile({
  employerProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formData, setFormData] = useState<NonNullableFormData>({
    firstName: employerProfile.firstName ?? "",
    lastName: employerProfile.lastName ?? "",
    phoneNumber: employerProfile.phoneNumber ?? "",
    email: employerProfile.email ?? "",
    linkedinLink: employerProfile.linkedinLink ?? "",
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
        body: JSON.stringify({ ...formData, id: employerProfile.id }),
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

  const employerProfileQuery = await dbClient.execute(
    `select id, userType, firstName, lastName, phoneNumber, email, linkedinLink
      from User
      left join Employer on User.id = Employer.employerId
      where id = :employerId;`,
    { employerId: verifiedToken.userId },
  );

  const employerProfile = employerProfileQuery.rows[0] as EmployerProfile;

  if (employerProfile.userType !== UserType.EMPLOYER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      employerProfile,
    },
  };
};
