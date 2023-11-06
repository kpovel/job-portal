import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

type AuthorizationResponse = {
  message: string;
  token: string;
};

type AuthorizationFailed = {
  message: string;
};

export function LogInForm() {
  const router = useRouter();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFilledForm = login && password;

  async function handleLogIn(login: string, password: string) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      setIsLoading(false);

      if (response.ok) {
        const data = (await response.json()) as AuthorizationResponse;
        Cookies.set(AUTHORIZATION_TOKEN_KEY, data.token, {
          expires: 30,
          path: "/",
        });
        await router.push("/jobs");
        return;
      }

      const errorData = (await response.json()) as AuthorizationFailed;
      setErrorMessage(errorData.message);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();

    void handleLogIn(login, password);
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
      <button
        type="submit"
        disabled={isLoading || !isFilledForm}
        className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          isLoading || !isFilledForm ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        Log in
      </button>
      <p className="text-red-500">{errorMessage}</p>
    </form>
  );
}
