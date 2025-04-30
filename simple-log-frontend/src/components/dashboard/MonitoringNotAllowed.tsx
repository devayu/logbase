"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const MonitoringNotAllowed = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Seems like you are on a basic plan.
      </h1>
      <p className="text-muted-foreground mb-6">
        {`Update to Premium plan for enabling monitoring.`}
      </p>
      <Button
        onClick={() => router.push("settings/billing")}
        variant="default"
        className="cursor-pointer"
      >
        Settings
      </Button>
    </div>
  );
};
