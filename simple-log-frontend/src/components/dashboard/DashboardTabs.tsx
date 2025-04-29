"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  ChartLine,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const DEFAULT_VALUES = ["overview", "all-events", "settings"];
export const DashboardTabs = ({ projectId }: { projectId: number }) => {
  const pathName = usePathname();

  const defaultValue =
    DEFAULT_VALUES.filter((value) => {
      return pathName.includes(value);
    })?.[0] ?? "overview";
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Tabs defaultValue={defaultValue} className="w-full">
          <TabsList className=" bg-transparent">
            <TabsTrigger value="overview" asChild>
              <Link href={`/dashboard/${projectId}/overview`}>
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
            </TabsTrigger>

            <TabsTrigger value="all-events" asChild>
              <Link href={`/dashboard/${projectId}/all-events`}>
                <Activity className="h-4 w-4" />
                All events
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Link href={`/dashboard/${projectId}/settings/general`}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
