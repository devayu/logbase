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
import { createDeleteProjectMutation, Project } from "@/services/projects";
import { ArrowUpFromLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const GeneralTab = ({ project }: { project: Project | null }) => {
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
          <Input defaultValue={project?.name} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea defaultValue={project?.description} />
        </div>
        <Button
          variant="outline"
          onClick={() => openDeleteDialog(project!.id, project!.name)}
        >
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          Update project
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive/90"
          onClick={() => openDeleteDialog(project!.id, project!.name)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete project
        </Button>

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
