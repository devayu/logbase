"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, Key, Code } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsTabs = [
  {
    id: "general",
    label: "General",
    icon: Settings,
    path: "general",
  },
  {
    id: "billing",
    label: "Plan & Billing",
    icon: CreditCard,
    path: "billing",
  },
  { id: "api", label: "API Keys", icon: Key, path: "api-key" },
  {
    id: "sdk",
    label: "SDK Integration",
    icon: Code,
    path: "sdk-integration",
  },
];
export const SettingsMenu = () => {
  const pathname = usePathname();

  return (
    <div className="flex gap-8 mr-6">
      <div className="w-64 shrink-0">
        <div className="space-y-8">
          {settingsTabs.map((tab) => (
            <Link href={tab.path} key={tab.id}>
              <Button
                key={tab.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname.includes(tab.path) ? "font-bold" : "opacity-75"
                )}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
