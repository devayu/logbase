import { getUserFromSession } from "@/auth/core/session";
import { Header } from "@/components/dashboard/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logbase",
  description: "All your tracking needs in one place.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getUserFromSession(await cookies());
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${space.className} antialiased min-h-screen bg-gradient-to-br from-background via-background to-accent/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header user={currentUser}></Header>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
