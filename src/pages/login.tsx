import Link from "next/link";
import { type GetServerSideProps } from "next";
import { AuthForm } from "~/component/auth/authForm";
import { AuthLayout } from "~/component/auth/authLayout";
import { withoutAuth } from "~/utils/auth/withoutAuth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  async function verifyLogin(login: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (res.status === 200) {
        const redirectLocation = await res.text();
        await router.push(redirectLocation);
      }

      const errorData = await res.text();
      return errorData;
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <AuthLayout authorizationType="Log in">
      <AuthForm handleFormSubmit={verifyLogin} authorizationType="Log in" />
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <Link
          href="/signup"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign up instead
        </Link>
      </p>
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withoutAuth();
