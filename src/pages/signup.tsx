import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { type GetServerSideProps } from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { AuthLayout } from "~/component/auth/authLayout";
import Link from "next/link";
import { AuthForm } from "~/component/auth/authForm";
import { Layout } from "~/component/layout/layout";
import { type User } from ".prisma/client";
import { withoutAuth } from "~/utils/auth/withoutAuth";

const Signup = () => {
  const router = useRouter();
  type SignupResponse = {
    message: string;
    token: string;
    user: User;
  };

  const switchToPageAfterSignup = async (
    signupResponse: SignupResponse
  ): Promise<void> => {
    switch (signupResponse.user.userType) {
      case "EMPLOYER":
        await router.push("/home/profile");
        break;
      case "CANDIDATE":
        await router.push("/my/profile");
        break;
      case "ADMIN":
        await router.push("/admin");
        break;
    }
  };

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

      if (response.ok) {
        const data = (await response.json()) as SignupResponse;

        Cookie.set(AUTHORIZATION_TOKEN_KEY, data.token, {
          expires: 30,
          path: "/",
        });

        void switchToPageAfterSignup(data);
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

export const getServerSideProps: GetServerSideProps = withoutAuth();
