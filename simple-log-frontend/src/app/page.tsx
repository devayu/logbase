"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, Zap, Shield, Code } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/services/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const features = [
    {
      icon: BarChart2,
      title: "Real-time Analytics",
      description:
        "View your application events in real time and get instant insights.",
    },
    {
      icon: Zap,
      title: "Easy Integration",
      description:
        "Our SDK takes just minutes to set up and works across all platforms.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Your data is encrypted and secured with enterprise-grade protection.",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description:
        "Comprehensive documentation and flexible APIs for custom integrations.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-2 mr-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">
              App Insight Central
            </span>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" onClick={() => router.push("/auth")}>
              Log in
            </Button>
            <Button
              onClick={() => router.push("/auth?tab=register")}
              className="btn-glow"
            >
              Sign up
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background via-background to-accent/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Insight into Your{" "}
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track, analyze, and optimize your application with our
                  powerful yet simple analytics platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/auth?tab=register")}
                  className="btn-glow"
                >
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
                <Button size="lg" onClick={() => router.push("/projects")}>
                  Projects
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-accent/10">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border border-border/30 p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to gain insights?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Register now and start tracking your application events in
                  minutes.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => router.push("/auth?tab=register")}
                className="btn-glow"
              >
                Get Started for Free
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <BarChart2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <p className="text-sm font-medium">App Insight Central</p>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2025 App Insight Central. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
