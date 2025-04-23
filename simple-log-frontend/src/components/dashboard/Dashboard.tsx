"use client";
import { BarChart3, ChartLine, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/hooks/useProjects";
import { Overview } from "./Overview";
import { ProjectSettings } from "./ProjectSettings";
import { AllEvents } from "@/components/dashboard/AllEvents";

export const DashboardContent = ({ project }: { project: Project | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );

  useEffect(() => {
    router.push(`?tab=${activeTab}`, { scroll: false });
  }, [activeTab, router]);

  const getViewToRender = () => {
    switch (activeTab) {
      case "overview":
        return <Overview project={project} />;
      case "all-events":
        return <AllEvents projectId={project?.id ?? 0}></AllEvents>;
      case "settings":
        return <ProjectSettings project={project} />;
      default:
        return <Overview project={project} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Tabs
            defaultValue="overview"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview" className="cursor-pointer">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="all-events" className="cursor-pointer">
                <ChartLine className="h-4 w-4 mr-2" />
                All events
              </TabsTrigger>
              <TabsTrigger value="settings" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <main className="flex-1">
        <div className="p-6 py-4 pb-0">
          <h2 className="font-bold text-4xl ">{project?.name}</h2>
          <p className="font-normal text-sm opacity-80">
            {project?.description}
          </p>
        </div>

        {getViewToRender()}
      </main>
    </div>
  );
};
