"use client";
import DeleteConfirmationDialog, {
  DeleteDialogState,
} from "@/components/projects/DeleteProjectDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggleProjectStatus } from "@/hooks/useProjects";
import { cn, formatDate } from "@/lib/utils";
import { Project } from "@/prismaTypes";
import {
  ArchiveX,
  Ellipsis,
  FileDownIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ProjectCards = ({ projects }: { projects?: Project[] | null }) => {
  const router = useRouter();
  const { toggleProjectStatus } = useToggleProjectStatus();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    id: null,
    open: false,
  });

  const handleProjectClick = (projectId: number) => {
    router.push(`/dashboard/${projectId}/overview`);
  };

  const handleProjectPause = async (
    projectId: number | null,
    status: "PAUSED" | "ACTIVE"
  ) => {
    if (!projectId) return;

    toast.promise(
      toggleProjectStatus({
        projectId,
        status,
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

  const resetDeleteDialog = () => {
    setDeleteDialog({ id: null, open: false, projectName: "" });
  };

  const openDeleteDialog = (id: number, name: string) => {
    setDeleteDialog({ id, open: true, projectName: name });
  };

  return (
    <>
      {projects?.map(
        ({ id, name, description, createdAt, status, plan, updatedAt }) => (
          <ProjectCard
            key={id}
            id={id}
            name={name}
            description={description}
            createdAt={createdAt}
            status={status}
            updatedAt={updatedAt}
            plan={plan}
            onProjectClick={handleProjectClick}
            onDeleteClick={openDeleteDialog}
            onProjectPause={handleProjectPause}
          />
        )
      )}
      <DeleteConfirmationDialog
        deleteDialog={deleteDialog}
        onSuccess={() => {
          resetDeleteDialog();
          router.refresh();
        }}
        onClose={resetDeleteDialog}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
};

interface ProjectCardProps {
  id: number;
  name: string;
  status: "ACTIVE" | "PAUSED";
  plan: "BASIC" | "PREMIUM";
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  onProjectClick: (id: number) => void;
  onProjectPause: (id: number, status: ProjectCardProps["status"]) => void;
  onDeleteClick: (id: number, name: string) => void;
}

const dropdownItems = [
  {
    label: "Pause Project",
    action: () => {},
    icon: PauseIcon,
  },
  {
    label: "Export data",
    action: () => {},
  },
  {
    label: "Delete Project",
    className: "text-destructive",
    action: () => {},
  },
];
const ProjectCard = ({
  id,
  name,
  description,
  status,
  plan,
  createdAt,
  updatedAt,
  onProjectClick,
  onProjectPause,
  onDeleteClick,
}: ProjectCardProps) => (
  <Card
    className={cn(
      "border border-border/30 py-3 cursor-pointer relative gap-3 transition-all duration-200 hover:border-border hover:shadow-md hover:scale-[1.01]",
      status === "PAUSED" && [
        "opacity-90",
        "after:absolute",
        "after:inset-0",
        "after:bg-[linear-gradient(45deg,transparent_40%,#00000009_40%,#00000009_60%,transparent_60%)]",
        "after:bg-[length:8px_8px]",
        "after:pointer-events-none",
        "after:border-t after:border-border/30",
      ]
    )}
    onClick={() => onProjectClick(id)}
  >
    <CardHeader className="flex justify-between items-center">
      <CardTitle>{name}</CardTitle>
      <ProjectMenu
        plan={plan}
        status={status}
        dropdownItems={dropdownItems}
        onDelete={() => onDeleteClick(id, name)}
        onPause={() => onProjectPause(id, status)}
      />
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
    <CardFooter className="flex justify-between items-end border-t pt-3!">
      <div className="flex flex-col">
        {createdAt === updatedAt ? (
          <span className="text-sm text-muted-foreground">
            Created {formatDate(createdAt, true)}
          </span>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              Updated {formatDate(updatedAt, true)}
            </span>
            <span className="text-xs text-muted-foreground/70">
              Created {formatDate(createdAt)}
            </span>
          </>
        )}
      </div>
      {status === "PAUSED" && (
        <span className="text-xs flex items-center gap-1 text-yellow-600/70">
          <PauseIcon className="h-3 w-3" />
          Paused
        </span>
      )}
    </CardFooter>
  </Card>
);

type DropdownMenuItems = {
  label: string;
  action: () => void;
  icon?: React.ElementType;
  className?: string; // Add className prop for additional styling if needed
};

const ProjectMenu = ({
  status,
  plan,
  onDelete,
  onPause,
}: {
  status: "ACTIVE" | "PAUSED";
  plan: "BASIC" | "PREMIUM";
  onDelete: () => void;
  onPause: () => void;
  dropdownItems: DropdownMenuItems[];
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      asChild
      className="cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <Button variant="ghost" size="icon">
        <Ellipsis className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Project settings</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          onPause();
        }}
      >
        {status === "ACTIVE" ? <PauseIcon></PauseIcon> : <PlayIcon></PlayIcon>}
        {status === "ACTIVE" ? "Pause Project" : "Resume Project"}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={plan === "BASIC"}
      >
        <FileDownIcon></FileDownIcon>
        {`Export Data ${plan === "BASIC" ? "(Premium)" : ""}`}
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-destructive cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <ArchiveX></ArchiveX>
        Delete Project
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ProjectCards;
