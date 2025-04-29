"use client";
import { deleteProjectAction } from "@/actions/projects";
import { FormSubmitButton } from "@/components/FormSubmitButton";
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
import { useState } from "react";
import { toast } from "sonner";

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
  const [confirmationName, setConfirmationName] = useState("");
  return (
    <Dialog open={deleteDialog.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          action={async () => {
            if (!deleteDialog.id) return;
            const deletedProject = await deleteProjectAction(deleteDialog.id);
            if (deletedProject) {
              onSuccess();
            } else {
              toast.error("Failed to delete project");
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Delete {deleteDialog.projectName}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all its associated data.
            </DialogDescription>
            <DialogDescription className="mt-2">
              To confirm, type{" "}
              <span className="font-semibold">{deleteDialog.projectName}</span>{" "}
              in the field below:
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
            <FormSubmitButton
              variant="destructive"
              disabled={deleteDialog.projectName !== confirmationName}
            >
              Delete Project
            </FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
