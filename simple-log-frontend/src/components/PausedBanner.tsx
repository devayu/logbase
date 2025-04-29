"use client";
import { toggleProjectStatusAction } from "@/actions/projects";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const PausedBanner = ({ projectId }: { projectId: number }) => {
  const router = useRouter();
  const handleProjectPause = async (
    projectId: number | null,
    status: "PAUSED" | "ACTIVE"
  ) => {
    if (!projectId) return;

    toast.promise(
      toggleProjectStatusAction({
        projectId,
        currentStatus: status,
      }),
      {
        loading: `${status === "PAUSED" ? "Resuming" : "Pausing"} project...`,
        success: () => {
          router.refresh();
          return `Project ${
            status === "PAUSED" ? "resumed" : "paused"
          } successfully!`;
        },
        error:
          "An error occurred while toggling project status. Please try again later.",
      }
    );
  };
  return (
    <div className="p-4 pb-0">
      <div className="bg-orange-200 text-black px-4 py-2 opacity-90 rounded-sm">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 mr-4" />
          <div className="flex flex-col">
            <AlertTitle className=" font-bold">Project Paused</AlertTitle>

            <AlertDescription className="text-black">
              This project is currently paused and not collecting any new data.
            </AlertDescription>
          </div>
          <Button
            onClick={async () => {
              handleProjectPause(projectId, "PAUSED");
            }}
            type="submit"
            variant="default"
            className="ml-auto bg-orange-300 hover:bg-orange-400 text-black"
          >
            <Play className="h-4 w-4" />
            Resume Project
          </Button>
        </div>
      </div>
    </div>
  );
};
