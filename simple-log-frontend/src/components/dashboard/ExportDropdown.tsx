import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { csvExport, jsonExport } from "@/lib/dataExport";
import { transformedEvents } from "@/lib/transformEventsForExport";
import { Event } from "@prisma/client";
import { DownloadCloud, FileSpreadsheet, FileJson } from "lucide-react";

type ExportDropdownProps = {
  fileName: string;
  events: Event[];
};
export const ExportDropdown = ({ fileName, events }: ExportDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Open export menu">
          <DownloadCloud className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => csvExport(transformedEvents(events), fileName)}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            jsonExport(transformedEvents(events, false), fileName);
          }}
        >
          <FileJson className="mr-2 h-4 w-4" />
          <span>JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
