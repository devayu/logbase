import { BarChart2, Code, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogbaseLogo } from "@/components/LogbaseLogo";

export default function Home() {
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 relative">
                <div className="absolute -inset-x-4 -inset-y-4 border border-orange-500/50 -rotate-1"></div>
                <div className="absolute -inset-x-4 -inset-y-4 border border-orange-500/20 rotate-1"></div>
                <h1 className="relative text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Industrial-Grade{" "}
                  <span className="gradient-text">Analytics</span>
                </h1>
                <p className="relative mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track, analyze, and optimize your application with our
                  powerful yet simple analytics platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
                <Link href="/projects">
                  <Button size="lg">Projects</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-accent/10 ">
          <div className="container px-4 md:px-6 mx-auto">
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
          <div className="container px-4 md:px-6 mx-auto">
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
              <Link href="/sign-in">
                <Button size="lg" className="btn-glow">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:px-6 mx-auto">
          <LogbaseLogo />
          <p className="text-xs text-muted-foreground">
            &copy; 2025 Logbase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
