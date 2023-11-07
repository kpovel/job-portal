import { type GetServerSideProps } from "next";
import { AuthLayout } from "~/component/auth/authLayout";
import Link from "next/link";
import { SignUpForm } from "~/component/auth/signUpForm";
import { Layout } from "~/component/layout/layout";
import { withoutAuth } from "~/utils/auth/withoutAuth";

export default function Signup() {
  return (
    <Layout>
      <AuthLayout authorizationType="Sign up">
        <SignUpForm />
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
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withoutAuth();
