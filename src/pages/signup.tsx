import { type GetServerSideProps } from "next";
import { AuthLayout } from "~/component/auth/authLayout";
import Link from "next/link";
import { AuthForm } from "~/component/auth/authForm";
import { withoutAuth } from "~/utils/auth/withoutAuth";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createAccount(
    login: string,
    password: string,
    userType: string | undefined,
  ) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, userType }),
      });

      if (res.status === 200) {
        const redirectLocation = await res.text();
        await router.push(redirectLocation);
        return "";
      }

      return await res.text();
    } catch (error) {
      console.error(error);
      return "Network error";
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout authorizationType="Sign up">
      <AuthForm
        handleFormSubmit={createAccount}
        authorizationType="Sign up"
        loading={loading}
      />
      <p className="mt-10 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Log in instead
        </Link>
      </p>
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withoutAuth();
