import { Layout } from "~/component/layout/layout";
import Link from "next/link";
import { type GetServerSideProps } from "next";
import { AuthLayout } from "~/component/auth/authLayout";
import { withoutAuth } from "~/utils/auth/withoutAuth";
import { LogInForm } from "~/component/auth/logInForm";

export default function Login() {
  return (
    <Layout>
      <AuthLayout authorizationType="Log in">
        <LogInForm />
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
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withoutAuth();
