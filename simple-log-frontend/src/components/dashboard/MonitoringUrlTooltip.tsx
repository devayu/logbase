import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const MonitoringUrlTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="bg-transparent">
          <Info className="h-4 w-4 text-muted-foreground cursor-pointer bg-muted" />
        </TooltipTrigger>
        <TooltipContent className="bg-muted">
          <p className=" text-white">
            This is the url which is currenly being monitored, you can change
            this in project settings.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
