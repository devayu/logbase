"use client";
import { SimpleLogTrackerProvider } from "simple-log-sdk";
import { useRouter } from "next/navigation";

export function TrackerProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <SimpleLogTrackerProvider
      apiKey={process.env.NEXT_PUBLIC_SIMPLE_API_KEY!!}
      initOpts={{
        autoTrackRoutes: true,
        endpoint: process.env.NEXT_PUBLIC_SIMPLE_LOG_URL!!,
        router: router as any,
      }}
    >
      {children}
    </SimpleLogTrackerProvider>
  );
}
