import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { SDKIntegration } from "./SDKIntegration";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

type SDKIntegrationOverlayProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};
export const SDKIntegrationOverlay = ({
  isOpen = false,
  onOpenChange,
}: SDKIntegrationOverlayProps) => {
  useEffect(() => {
    // Check if user has opted out
    const dontShow = localStorage.getItem("showSDKIntegration");
    if (!dontShow) {
      onOpenChange(true);
    }
  }, []);

  const handleDontShowAgain = (checked: boolean) => {
    if (checked) {
      localStorage.setItem("showSDKIntegration", "false");
    } else {
      localStorage.removeItem("showSDKIntegration");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay>
        {/* <DialogContent className="w-full max-w-full top-[50%]"> */}
        <div className="max-w-4xlxl top-[50%] left-[50%] fixed translate-x-[-50%] translate-y-[-50%]">
          <SDKIntegration />
          <div className="flex items-center mt-4 justify-between">
            <div className="space-x-2 flex items-center">
              <Checkbox id="dontShow" onCheckedChange={handleDontShowAgain} />
              <label
                htmlFor="dontShow"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Don't show this again for new projects
              </label>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
        {/* </DialogContent> */}
      </DialogOverlay>
      {/* <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Get Started with Simple Log SDK</DialogTitle>
        </DialogHeader>
        <SDKIntegration />
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox id="dontShow" onCheckedChange={handleDontShowAgain} />
          <label
            htmlFor="dontShow"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Don't show this again for new projects
          </label>
        </div>
      </DialogContent> */}
    </Dialog>
  );
};
