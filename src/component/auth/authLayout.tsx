import Image from "next/image";
import JobPortalLogo from "../../../public/images/job-portal-logo.png";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  authorizationType: "Log in" | "Sign up";
  children: ReactNode;
};

export function AuthLayout({ authorizationType, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-20 w-auto"
          src={JobPortalLogo}
          alt="Job Portal Logo"
          priority
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {authorizationType} to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">{children}</div>
    </div>
  );
}
