import { type FormEvent, useState } from "react";
import { SelectUserType, type UserType } from "~/component/auth/selectUserType";

export interface AuthFormProps {
  handleFormSubmit: (
    login: string,
    password: string,
    userType?: string,
  ) => Promise<string>;
  authorizationType: "Log in" | "Sign up";
}

export function AuthForm({
  handleFormSubmit,
  authorizationType,
}: AuthFormProps) {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedUserType, setSelectedUserType] = useState<
    UserType | undefined
  >();
  const [authError, setAuthError] = useState("");

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    void submitForm();
  }

  async function submitForm() {
    if (authorizationType === "Sign up") {
      const error = await handleFormSubmit(
        login,
        password,
        selectedUserType?.type,
      );
      setAuthError(error);
      return;
    }

    const error = await handleFormSubmit(login, password);
    setAuthError(error);
  }

  const isFilledForm = {
    "Log in": login && password,
    "Sign up": login && password && selectedUserType,
  };

  return (
    <form className="space-y-6" action="#" onSubmit={handleSubmitForm}>
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
      {authorizationType !== "Sign up" || (
        <SelectUserType
          userType={selectedUserType}
          onUserTypeChange={setSelectedUserType}
        />
      )}
      <button
        type="submit"
        disabled={!isFilledForm[authorizationType]}
        className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
          !isFilledForm[authorizationType]
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        {authorizationType}
      </button>
      <div className="text-red-500">{authError}</div>
    </form>
  );
}
