import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const SDKIntegration = () => {
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
            <pre className="bg-secondary rounded-md p-4 font-mono text-sm overflow-x-auto">
              <code>npm install simple-log-sdk</code>
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">
              2. Initialize with your API Key
            </h3>
            <pre className="bg-secondary rounded-md p-4 font-mono text-sm overflow-x-auto">
              <code>{`import { SimpleLogTrackerProvider } from "simple-log-sdk";

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
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. Track Events</h3>
            <pre className="bg-secondary rounded-md p-4 font-mono text-sm overflow-x-auto">
              <code>{`import { useSimpleLogTracker } from "simple-log-sdk";

// Track custom events
const tracker = useSimpleLogTracker();

trackEvent("test", { testing: "metadata" })

// Page views are tracked automatically with autoTrackRoutes: true`}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
