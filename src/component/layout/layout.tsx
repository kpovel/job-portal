import { type ReactNode } from "react";
import { Header } from "~/component/layout/header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-max min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}
