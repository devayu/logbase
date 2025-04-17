"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeleteProject } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export interface DeleteDialogState {
  id: number | null;
  open: boolean;
  projectName?: string;
}
interface DeleteConfirmationDialogProps {
  deleteDialog: DeleteDialogState;
  // confirmationName: string;
  onSuccess: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

const DeleteConfirmationDialog = ({
  deleteDialog,
  onSuccess,
  onClose,
  onOpenChange,
}: DeleteConfirmationDialogProps) => {
  const { isLoading, deleteProject } = useDeleteProject();

  const [confirmationName, setConfirmationName] = useState("");
  const handleDeleteProject = async (projectId: number | null) => {
    if (confirmationName !== deleteDialog.projectName) return;
    if (!projectId) return;

    const res = await deleteProject(projectId);

    if (res?.status === "ok") {
      onSuccess();
    }
  };
  return (
    <Dialog open={deleteDialog.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {deleteDialog.projectName}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            project and all its associated data.
          </DialogDescription>
          <DialogDescription className="mt-2">
            To confirm, type{" "}
            <span className="font-semibold">{deleteDialog.projectName}</span> in
            the field below:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
            placeholder={`Type "${deleteDialog.projectName}" to confirm`}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setConfirmationName("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteProject(deleteDialog?.id);
            }}
            disabled={
              isLoading || deleteDialog.projectName !== confirmationName
            }
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
