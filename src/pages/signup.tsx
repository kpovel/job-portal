import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { parse as parseCookies } from "cookie";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { AuthLayout } from "~/component/auth/authLayout";
import Link from "next/link";
import { AuthForm } from "~/component/auth/authForm";
import { Layout } from "~/component/layout/layout";
import { type User } from ".prisma/client";

const Signup = () => {
  const router = useRouter();

  async function createAccount(
    login: string,
    password: string,
    userType: string | undefined
  ) {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, userType }),
      });

      type SignupResponse = {
        message: string;
        token: string;
        user: User;
      };

      if (response.ok) {
        const data = (await response.json()) as SignupResponse;

        Cookie.set(AUTHORIZATION_TOKEN_KEY, data.token, {
          expires: 30,
          path: "/",
        });
        await router.push("/jobs");
      } else {
        const errorData = (await response.json()) as SignupResponse;
        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <Layout>
      <AuthLayout authorizationType="Sign up">
        <AuthForm
          handleFormSubmit={createAccount}
          authorizationType="Sign up"
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
    </Layout>
  );
};

export default Signup;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;
  const parsedCookies = parseCookies(req.headers.cookie ?? "");

  if (parsedCookies[AUTHORIZATION_TOKEN_KEY]) {
    return Promise.resolve({
      redirect: {
        destination: "/jobs",
        permanent: false,
      },
    });
  }

  return Promise.resolve({
    props: {},
  });
};
