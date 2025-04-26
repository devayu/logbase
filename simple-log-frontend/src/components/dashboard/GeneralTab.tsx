"use client";
import DeleteConfirmationDialog, {
  DeleteDialogState,
} from "@/components/projects/DeleteProjectDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project, useUpdateProject } from "@/hooks/useProjects";
import { ArrowUpFromLine, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const GeneralTab = ({ project }: { project: Project | null }) => {
  const { isLoading, updateProject } = useUpdateProject();
  const [name, setName] = useState(project?.name);
  const [description, setDescription] = useState(project?.description);
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    id: null,
    open: false,
  });
  const resetDeleteDialog = () => {
    setDeleteDialog({ id: null, open: false, projectName: "" });
  };

  const openDeleteDialog = (id: number, name: string) => {
    setDeleteDialog({ id, open: true, projectName: name });
  };
  const handleUpdateProject = async () => {
    if (!project?.id) return;
    if (!name || !description) return toast.error("Please fill all fields");
    const res = await updateProject({
      projectId: project.id,
      projectName: name,
      description: description,
    });
    if (res.status === "ok") {
      toast.success("Project updated successfully");
      router.refresh();
    }
  };

  const hasChanges =
    name !== project?.name || description !== project?.description;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>
          Manage your project details and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleUpdateProject}
            disabled={isLoading || !hasChanges}
            variant="outline"
            className={`transition-opacity duration-200 ${
              hasChanges ? "opacity-100" : "opacity-0"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive/90"
            onClick={() => openDeleteDialog(project!.id, project!.name)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete project
          </Button>
        </div>

        <DeleteConfirmationDialog
          deleteDialog={deleteDialog}
          onClose={resetDeleteDialog}
          onSuccess={() => {
            resetDeleteDialog();
            router.push("/projects");
          }}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
        />
      </CardContent>
    </Card>
  );
};
