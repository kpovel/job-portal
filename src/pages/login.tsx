import { Layout } from "~/component/layout/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { parse as parseCookies } from "cookie";
import { AuthForm } from "~/component/auth/authForm";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { AuthLayout } from "~/component/auth/authLayout";

const Login = () => {
  const router = useRouter();

  async function verifyLogin(login: string, password: string) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      type AuthorizationResponse = {
        message: string;
        token: string;
      };

      if (response.ok) {
        const data = (await response.json()) as AuthorizationResponse;
        Cookie.set(AUTHORIZATION_TOKEN_KEY, data.token, {
          expires: 30,
          path: "/",
        });
        await router.push("/jobs");
      } else {
        const errorData = (await response.json()) as AuthorizationResponse;
        console.error(errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <Layout>
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
    </Layout>
  );
};

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

export default Login;
