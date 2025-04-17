"use client";
import { BarChart3, Settings } from "lucide-react";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/hooks/useProjects";
import { Overview } from "./Overview";
import { ProjectSettings } from "./ProjectSettings";

export const DashboardContent = ({ project }: { project: Project | null }) => {
  const [activeTab, setActiveTab] = useState("overview");

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
        {activeTab === "overview" ? (
          <Overview project={project} />
        ) : (
          <ProjectSettings project={project} />
        )}
      </main>
    </div>
  );
};
