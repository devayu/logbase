"use client";
import { createProjectAction } from "@/actions/projects";
import { FormSubmitButton } from "@/components/FormSubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const NewProjectCard = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <>
      <Card
        className="cursor-pointer border-dashed border-2 hover:border-primary/50 hover:bg-accent/10 transition-colors"
        onClick={() => setOpen(true)}
      >
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">Add new project</p>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form
            action={async () => {
              const newProject = await createProjectAction({
                name,
                description,
              });
              if (newProject) {
                const isToShowSDKIntegration =
                  window.localStorage.getItem("dontShowSDKIntegration") ===
                    null ||
                  window.localStorage.getItem("dontShowSDKIntegration") ===
                    "false";
                if (isToShowSDKIntegration) {
                  router.push(
                    `/dashboard/${newProject.id}/settings/sdk-integration`
                  );
                } else {
                  router.push(`/dashboard/${newProject.id}/overview`);
                }

                setOpen(false);
                setName("");
                setDescription("");
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <FormSubmitButton>Create Project</FormSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
