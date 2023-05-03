import { type ReactNode, useContext } from "react";
import { Header } from "~/component/layout/elements/header";
import { Footer } from "~/component/layout/elements/footer";
import { GuestOnlyHeader } from "~/component/layout/elements/guestOnlyHeader";
import { AuthContext } from "~/utils/auth/authContext";

export function Layout({ children }: { children: ReactNode }) {
  const isAuthorizedUser = useContext(AuthContext);
  return (
    <div className="flex h-max min-h-screen flex-col bg-gray-50">
      {isAuthorizedUser ? <Header /> : <GuestOnlyHeader />}
      <main className="mx-auto flex w-full grow flex-col pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
