import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-[#1a1b1e] p-4 shadow-md">
      <p className="text-base text-gray-200 mb-1">
        {new Date(label!).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-[#0066FF]">
          responseTime: {entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};