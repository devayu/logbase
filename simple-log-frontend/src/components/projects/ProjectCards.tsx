"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ellipsis, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createDeleteProjectMutation, Project } from "@/services/projects";
import DeleteConfirmationDialog, {
  DeleteDialogState,
} from "@/components/projects/DeleteProjectDialog";

export const ProjectCards = ({ projects }: { projects: Project[] | null }) => {
  const router = useRouter();
  const [mutationState, setMutationState] = useState({
    isLoading: createDeleteProjectMutation.isLoading,
    error: createDeleteProjectMutation.error,
  });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    id: null,
    open: false,
  });
  const [confirmationName, setConfirmationName] = useState("");

  useEffect(() => {
    const unsubscribe = createDeleteProjectMutation.subscribe((state) => {
      setMutationState({ isLoading: state.isLoading, error: state.error });
    });
    return unsubscribe;
  }, []);

  const handleProjectClick = (projectId: number) => {
    console.log("Project clicked", projectId);
  };

  const handleDeleteProject = async (projectId: number | null) => {
    if (!projectId || deleteDialog.projectName !== confirmationName) return;

    const res = await createDeleteProjectMutation.trigger({ projectId });
    if (res?.status === "ok") {
      resetDeleteDialog();
      router.refresh();
    }
  };

  const resetDeleteDialog = () => {
    setDeleteDialog({ id: null, open: false, projectName: "" });
    setConfirmationName("");
  };

  const openDeleteDialog = (id: number, name: string) => {
    setDeleteDialog({ id, open: true, projectName: name });
  };

  return (
    <>
      {projects?.map(({ id, name, description, createdAt }) => (
        <ProjectCard
          key={id}
          id={id}
          name={name}
          description={description}
          createdAt={createdAt}
          onProjectClick={handleProjectClick}
          onDeleteClick={openDeleteDialog}
        />
      ))}
      <DeleteConfirmationDialog
        deleteDialog={deleteDialog}
        confirmationName={confirmationName}
        setConfirmationName={setConfirmationName}
        onClose={resetDeleteDialog}
        onConfirm={() => handleDeleteProject(deleteDialog.id)}
        isLoading={mutationState.isLoading}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      />
    </>
  );
};

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  onProjectClick: (id: number) => void;
  onDeleteClick: (id: number, name: string) => void;
}

const ProjectCard = ({
  id,
  name,
  description,
  createdAt,
  onProjectClick,
  onDeleteClick,
}: ProjectCardProps) => (
  <Card
    className="border border-border/30 py-3 cursor-pointer"
    onClick={() => onProjectClick(id)}
  >
    <CardHeader className="flex justify-between items-center">
      <CardTitle>{name}</CardTitle>
      <ProjectMenu onDelete={() => onDeleteClick(id, name)} />
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
    <CardFooter className="flex justify-between border-t pt-3!">
      <span className="text-xs text-muted-foreground">Created {createdAt}</span>
    </CardFooter>
  </Card>
);

const ProjectMenu = ({ onDelete }: { onDelete: () => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="cursor-pointer">
      <Button variant="ghost" size="icon">
        <Ellipsis className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Project settings</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem
        className="text-destructive cursor-pointer"
        onClick={onDelete}
      >
        Delete Project
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ProjectCards;
