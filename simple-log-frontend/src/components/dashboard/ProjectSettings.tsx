"use client";
import { GeneralTab } from "@/components/dashboard/GeneralTab";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Project } from "@/hooks/useProjects";
import { Code, CreditCard, Key, Settings } from "lucide-react";
import { useState } from "react";
import { ApiKeyCard } from "./ApiKeyCard";
import { PlanUpgradeCard } from "./PlanUpgradeCard";
import { SDKIntegration } from "./SDKIntegration";

const settingsTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "billing", label: "Plan & Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
  { id: "sdk", label: "SDK Integration", icon: Code },
];

export const ProjectSettings = ({ project }: { project: Project | null }) => {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab project={project}></GeneralTab>;
      case "billing":
        return <PlanUpgradeCard currentPlan={project?.plan || "BASIC"} />;
      case "api":
        return <ApiKeyCard apiKey={project?.apiKey} projectId={project?.id} />;
      case "sdk":
        return <SDKIntegration />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 p-4 md:p-6">
      <div className="w-64 shrink-0">
        <div className="space-y-2">
          {settingsTabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                activeTab === tab.id ? "font-bold" : "opacity-75"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};
