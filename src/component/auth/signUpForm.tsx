import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import {
  SelectUserType,
  type UserTypeDescription,
} from "~/component/auth/selectUserType";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { UserType } from "~/utils/dbSchema/enums";
import type { User } from "~/utils/dbSchema/models";

type SignupResponse = {
  message: string;
  token: string;
  user: User;
};

type SignupResponseError = {
  message: string;
};

export function SignUpForm() {
  const router = useRouter();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedUserType, setSelectedUserType] = useState<
    UserTypeDescription | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string>("");
  const isFilledForm = login && password && selectedUserType;

  async function switchToPageAfterSignup(
    signupResponse: SignupResponse,
  ): Promise<void> {
    switch (signupResponse.user.userType) {
      case "EMPLOYER":
        await router.push("/home/profile");
        break;
      case "CANDIDATE":
        await router.push("/my/profile");
        break;
    }
  }

  async function createAccount(
    login: string,
    password: string,
    userType: Omit<UserType, "ADMIN">,
  ) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, userType }),
      });
      setIsLoading(false);

      if (response.ok) {
        const data = (await response.json()) as SignupResponse;

        Cookies.set(AUTHORIZATION_TOKEN_KEY, data.token, {
          expires: 30,
          path: "/",
        });

        void switchToPageAfterSignup(data);
        return;
      }

      const errorData = (await response.json()) as SignupResponseError;
      setResponseError(errorData.message);
      console.error(errorData.message);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();

    if (selectedUserType?.type) {
      void createAccount(login, password, selectedUserType.type);
    }
  }

  return (
    <form className="space-y-6" onSubmit={submitForm}>
      <div>
        <label
          htmlFor="login"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Login
        </label>
        <div className="mt-2">
          <input
            id="login"
            name="login"
            type="text"
            autoComplete="username"
            placeholder="Enter your login"
            required
            className="block w-full rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Password
        </label>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className="block w-full rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <SelectUserType
        userType={selectedUserType}
        onUserTypeChange={setSelectedUserType}
      />
      <button
        type="submit"
        disabled={isLoading || !isFilledForm}
        className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          isLoading || !isFilledForm ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        Sign up
      </button>
      <p className="text-red-500">{responseError}</p>
    </form>
  );
}
