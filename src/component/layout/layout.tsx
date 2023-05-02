import { type ReactNode } from "react";
import { Header } from "~/component/layout/elements/header";
import { Footer } from "~/component/layout/elements/footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-max min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto flex w-full grow flex-col">{children}</main>
      <Footer />
    </div>
  );
}
