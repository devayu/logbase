"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ProjectNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The project you're looking for doesn't exist or you don't have access to
        it.
      </p>
      <Button onClick={() => router.push("/projects")}>
        Return to Projects
      </Button>
    </div>
  );
};
