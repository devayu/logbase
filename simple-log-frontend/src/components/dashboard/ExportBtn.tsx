"use client";
import { Button } from "@/components/ui/button";
import { csvExport } from "@/lib/csvExport";
import { DownloadCloud } from "lucide-react";

type ExportProps = {
  data: Record<string, any>[];
  fileName: string;
};

export const Export = ({ data, fileName }: ExportProps) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }
    try {
      csvExport(data, fileName);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <DownloadCloud className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
};
