import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}
export const EventStatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) => (
  <Card className="border border-border/30">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div
          className={`mt-2 text-xs ${
            trend.positive ? "text-green-500" : "text-destructive"
          }`}
        >
          {trend.positive ? "+" : "-"}
          {trend.value}% {trend.label}
        </div>
      )}
    </CardContent>
  </Card>
);
