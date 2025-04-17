"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

export const PlanUpgradeCard = ({
  currentPlan,
}: {
  currentPlan: "BASIC" | "PREMIUM";
}) => {
  const handleUpgrade = async () => {
    // Add your payment/upgrade logic here
    console.log("Upgrading to premium");
  };

  return (
    <Card className="border border-border/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          Plan & Billing
        </CardTitle>
        <CardDescription>Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div>
              <h3 className="font-medium mb-1">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                {currentPlan === "BASIC" ? "Basic (Free)" : "Premium"}
              </p>
              {currentPlan === "BASIC" && (
                <Button
                  onClick={handleUpgrade}
                  variant="outline"
                  className="mt-4 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-medium mb-4">Premium Features</h4>
            <ul className="space-y-3">
              {[
                "Export project data",
                "Auto event tracking",
                "Advanced analytics",
                "Custom event properties",
                "Priority support",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-yellow-500/70 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
