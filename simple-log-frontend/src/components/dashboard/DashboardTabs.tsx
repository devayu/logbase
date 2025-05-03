"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  CircleArrowLeft,
  LayoutDashboard,
  MonitorCheck,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const DEFAULT_VALUES = ["overview", "all-events", "settings", "monitoring"];

export const DashboardTabs = ({ projectId }: { projectId: number }) => {
  const router = useRouter();
  const pathName = usePathname();

  const defaultValue =
    DEFAULT_VALUES.filter((value) => {
      return pathName.includes(value);
    })?.[0] ?? "overview";
  return (
    <div className="border-b">
      <div className="p-4 flex items-center gap-2">
        <span className="sr-only">Go back</span>
        <CircleArrowLeft
          className="w-6 h-6 cursor-pointer opacity-70"
          onClick={() => {
            router.push("/projects");
          }}
        ></CircleArrowLeft>
        <div className="text-muted-foreground opacity-50 mr-2">|</div>

        <Tabs defaultValue={defaultValue} className="w-full">
          <TabsList className="bg-transparent gap-2">
            <TabsTrigger value="overview" asChild className="w-full">
              <Link
                href={`/dashboard/${projectId}/overview`}
                className="flex items-center gap-2 justify-center"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">Overview</span>
              </Link>
            </TabsTrigger>

            <TabsTrigger value="all-events" asChild className="w-full">
              <Link
                href={`/dashboard/${projectId}/all-events`}
                className="flex items-center gap-2 justify-center"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden md:inline">All events</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="monitoring" asChild className="w-full">
              <Link
                href={`/dashboard/${projectId}/monitoring`}
                className="flex items-center gap-2 justify-center"
              >
                <MonitorCheck className="h-4 w-4" />
                <span className="hidden md:inline">Monitoring</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild className="w-full">
              <Link
                href={`/dashboard/${projectId}/settings/general`}
                className="flex items-center gap-2 justify-center"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
