import { Layout } from "~/component/layout/layout";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import Head from "next/head";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { verifyToken } from "~/utils/auth/auth";
import { dbClient } from "~/server/db";
import type { User } from "~/server/db/types/schema";

export default function EmployerProfile({
  employerProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formData, setFormData] = useState({
    first_name: employerProfile.first_name ?? "",
    last_name: employerProfile.last_name ?? "",
    phone_number: employerProfile.phone_number ?? "",
    email: employerProfile.email ?? "",
    linkedin_link: employerProfile.linkedin_link ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleUpdateForm(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleUpdateEmployerProfile(e: FormEvent) {
    e.preventDefault();
    void updateEmployerProfile();
  }

  async function updateEmployerProfile() {
    setSubmitting(true);
    try {
      await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
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
                name="first_name"
                autoComplete="given-name"
                type="text"
                value={formData.first_name}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Прізвище"
                id="lastName"
                name="first_name"
                autoComplete="given-name"
                type="text"
                value={formData.first_name}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Номер телефону"
                id="phoneNumber"
                name="phone_number"
                autoComplete="tel"
                type="text"
                value={formData.phone_number}
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
                name="linkedin_link"
                autoComplete="linkedinLink"
                type="url"
                value={formData.linkedin_link}
                onChange={handleUpdateForm}
              />
            </div>
            <button
              type="submit"
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5
              text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-indigo-600 disabled:bg-indigo-600/50"
              aria-disabled={submitting}
              disabled={submitting}
            >
              Оновити дані мого профілю
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
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

  const employerProfileQuery = await dbClient.execute({
    sql: "\
select first_name,\
       last_name,\
       phone_number,\
       email,\
       linkedin_link \
from user \
         left join employer on user.id = employer.id \
where user.id = :employer_id \
and user.user_type_id = (select id from user_type where type = 'EMPLOYER');",
    args: { employer_id: verifiedToken.userId },
  });

  const employerProfile = employerProfileQuery.rows[0] as
    | Pick<
        User,
        "first_name" | "last_name" | "phone_number" | "email" | "linkedin_link"
      >
    | undefined;

  if (!employerProfile) {
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
}
