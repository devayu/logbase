"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const styles = {
  dark: materialDark,
  light: materialLight,
} as const;
export const SDKIntegration = () => {
  const npmInstall = `npm install simple-log-sdk`;

  const initCode = `import { SimpleLogTrackerProvider } from "simple-log-sdk";

// Wrap your app with SimpleLogTrackerProvider
const App = ({ children }) => {
  return (
    <SimpleLogTrackerProvider
      apiKey={process.env.NEXT_PUBLIC_SIMPLE_API_KEY}
      initOpts={{
        autoTrackRoutes: true,
        endpoint: process.env.NEXT_PUBLIC_SIMPLE_LOG_URL,
        router: router
      }}
    >
      {children}
    </SimpleLogTrackerProvider>
  );
}`;

  const trackingCode = `import { useSimpleLogTracker } from "simple-log-sdk";

// Track custom events
const tracker = useSimpleLogTracker();

trackEvent("test", { testing: "metadata" })

// Page views are tracked automatically with autoTrackRoutes: true`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      description: "You can now paste this code into your project",
    });
  };
  const currentTheme = useTheme();
  const getThemeToUse = () => {
    if (currentTheme.theme === "dark") {
      return styles[currentTheme.theme];
    }
    if (currentTheme.theme === "light") {
      return styles.light;
    }
    if (currentTheme.theme === "system" && currentTheme.systemTheme) {
      return styles[currentTheme.systemTheme];
    }
  };
  const handleDontShowAgain = (checked: boolean) => {
    if (checked) {
      localStorage.setItem("showSDKIntegration", "true");
    } else {
      localStorage.removeItem("showSDKIntegration");
    }
  };
  const style = getThemeToUse();
  return (
    <Card className="border border-border/30">
      <CardHeader>
        <CardTitle>SDK Integration</CardTitle>
        <CardDescription>
          Follow these steps to integrate the Simple Log SDK
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Install the SDK</h3>
            <div className="relative">
              <SyntaxHighlighter
                language="bash"
                style={style}
                customStyle={{
                  borderRadius: "0.375rem",
                  borderColor: "#30363d",
                  padding: "1rem",
                  margin: 0,
                  fontSize: "0.875rem",
                }}
              >
                {npmInstall}
              </SyntaxHighlighter>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 hover:bg-accent/50"
                onClick={() => copyToClipboard(npmInstall)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">
              2. Initialize with your API Key
            </h3>
            <div className="relative">
              <SyntaxHighlighter
                language="typescript"
                style={style}
                customStyle={{
                  fontSize: "0.875rem",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  margin: 0,
                  borderColor: "#30363d",
                }}
              >
                {initCode}
              </SyntaxHighlighter>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 hover:bg-accent/50"
                onClick={() => copyToClipboard(initCode)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. Track Events</h3>
            <div className="relative">
              <SyntaxHighlighter
                language="typescript"
                style={style}
                customStyle={{
                  fontSize: "0.875rem",
                  borderRadius: "0.375rem",
                  padding: "1rem",
                  margin: 0,
                  borderColor: "#30363d",
                }}
              >
                {trackingCode}
              </SyntaxHighlighter>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 hover:bg-accent/50"
                onClick={() => copyToClipboard(trackingCode)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 justify-between">
          <div className="space-x-2 flex items-center">
            <Checkbox id="dontShow" onCheckedChange={handleDontShowAgain} />
            <label
              htmlFor="dontShow"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show SDK integration for new projects
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
