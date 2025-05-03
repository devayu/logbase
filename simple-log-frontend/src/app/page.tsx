import { LogbaseLogo } from "@/components/LogbaseLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart2, Check, Code, Shield, X, Zap } from "lucide-react";
import Link from "next/link";
import { FaReact, FaVuejs } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { RiNextjsFill } from "react-icons/ri";

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

  const integrations = [
    { name: "React", logo: FaReact, className: "text-cyan-400" },
    { name: "Next.js", logo: RiNextjsFill },
    { name: "Vue", logo: FaVuejs, className: "text-green-400" },
    {
      name: "JavaScript",
      logo: IoLogoJavascript,
      className: "text-yellow-300",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center p-4">
              <div className="space-y-2 relative">
                <div className="absolute -inset-x-4 -inset-y-4 border border-orange-500/50 -rotate-1 hidden md:block"></div>
                <div className="absolute -inset-x-4 -inset-y-4 border border-orange-500/20 rotate-1 hidden md:block"></div>
                <h1 className="relative text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Industrial-Grade{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Analytics</span>
                    <span className="absolute inset-0 bg-orange-500/10 -skew-x-12 animate-pulse"></span>
                  </span>{" "}
                  Made{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
                      Simple
                    </span>

                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-500 animate-pulse"></span>
                  </span>
                </h1>
                <p className="relative mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-6">
                  Gain deep insights, monitor performance, and optimize your app
                  with real-time event tracking — all with a developer-first
                  platform.
                </p>
              </div>
              <div className="flex flex-row gap-4 mt-4">
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

        <section className="w-full py-12 md:py-24 bg-accent/10">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 sm:text-4xl">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center space-y-2 rounded-lg border border-border/30 p-6 shadow-sm transition-all hover:shadow-md hover:border-orange-500/30 hover:-translate-y-1 duration-300 ease-out"
                >
                  <div className="rounded-full bg-primary/10 p-2 transition-all duration-300 group-hover:bg-orange-500/20 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-orange-500" />
                  </div>
                  <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-orange-500">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-accent/10">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 sm:text-4xl">
              What can you track with Logbase?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-[600px] mx-auto">
              {`Tracking events is as simple as one line of code. Here's what that
              might look like:`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* User Login Example */}
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/30 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                  <h3 className="text-xl font-semibold">User logs in</h3>
                </div>
                <div className="bg-muted rounded-md p-4 font-mono text-sm mb-4">
                  <span className="text-blue-500">tracker</span>
                  <span className="text-foreground">.</span>
                  <span className="text-orange-500">track</span>
                  <span className="text-foreground">(</span>
                  <span className="text-red-500">{`'login'`}</span>
                  <span className="text-foreground">)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {`Instantly appears in your dashboard's event stream`}
                </p>
              </div>

              {/* Purchase Click Example */}
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/30 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                  <h3 className="text-xl font-semibold">
                    {`User clicks on "Buy Now"`}
                  </h3>
                </div>
                <div className="bg-muted rounded-md p-4 font-mono text-sm mb-4">
                  <span className="text-blue-500">tracker</span>
                  <span className="text-foreground">.</span>
                  <span className="text-orange-500">track</span>
                  <span className="text-foreground">(</span>
                  <span className="text-red-500">{`'buy_now_click'`}</span>
                  <span className="text-foreground">, {`{`}</span>
                  <br />
                  <span className="text-foreground ml-4">plan: </span>
                  <span className="text-red-500">{`'pro'`}</span>
                  <span className="text-foreground">{`}`})</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Filters and segments help you analyze conversions by plan
                </p>
              </div>

              {/* Feature Toggle Example */}
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/30 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-sm bg-yellow-500"></div>
                  <h3 className="text-xl font-semibold">Feature toggled</h3>
                </div>
                <div className="bg-muted rounded-md p-4 font-mono text-sm mb-4">
                  <span className="text-blue-500">tracker</span>
                  <span className="text-foreground">.</span>
                  <span className="text-orange-500">track</span>
                  <span className="text-foreground">(</span>
                  <span className="text-red-500">{`'feature_toggle'`}</span>
                  <span className="text-foreground">, {`{`}</span>
                  <br />
                  <span className="text-foreground ml-4">feature: </span>
                  <span className="text-red-500">{`'dark_mode'`}</span>
                  <span className="text-foreground">{`}`})</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  View user behavior per feature
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-accent/5">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl">
              Why Choose Logbase?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-lg border border-border/30">
                <h3 className="text-xl font-semibold mb-6 text-muted-foreground">
                  Traditional Analytics
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-muted-foreground">
                    <X className="h-5 w-5 mr-2 text-red-500" />
                    Complex setup process
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <X className="h-5 w-5 mr-2 text-red-500" />
                    Limited customization
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <X className="h-5 w-5 mr-2 text-red-500" />
                    Slow data processing
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-lg border border-orange-500/30 bg-orange-500/5">
                <h3 className="text-xl font-semibold mb-6">Logbase</h3>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    5-minute setup
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Fully customizable
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Real-time insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-xl font-semibold mb-8">
              Works with your favorite frameworks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-2xl mx-auto opacity-75">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 hover:opacity-100 transition-opacity"
                >
                  <integration.logo
                    className={cn(integration.className, "w-8 h-8")}
                  ></integration.logo>
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
