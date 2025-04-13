import { Header } from "@/components/dashboard/Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <Header></Header>
      {children}
    </div>
  );
};
