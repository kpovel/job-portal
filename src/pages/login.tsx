import { Layout } from "~/component/layout/layout";
import Image from "next/image";
import JobPortalLogo from "../../public/images/job-portal-logo.png";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { parse as parseCookies } from "cookie";
import { AuthForm } from "~/component/auth/authForm";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-20 w-auto"
            src={JobPortalLogo}
            alt="Job Portal Logo"
            priority
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <AuthForm handleFormSubmit={verifyLogin} />
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              href="/Signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up instead
            </Link>
          </p>
        </div>
      </div>
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
