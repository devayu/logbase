"use client";
import { toggleProjectStatusAction } from "@/actions/projects";
import { Banner } from "@/components/Banner";
import { Play } from "lucide-react";
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
    <Banner
      title="Project Paused"
      desc="This project is currently paused and not collecting any new data."
      variant="info"
      buttonIcon={<Play className="h-4 w-4" />}
      buttonTitle="Resume Project"
      asyncAction={() => handleProjectPause(projectId, "PAUSED")}
    ></Banner>
  );
};
