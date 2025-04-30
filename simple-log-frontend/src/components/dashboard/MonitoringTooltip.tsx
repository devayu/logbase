import { formatDate } from "@/lib/utils";
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

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-[#1a1b1e] p-4 shadow-md">
      <p className="text-sm text-gray-400 mb-1">
        {formatDate(new Date(label ?? new Date()), true, true)}
      </p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-[#0066FF] font-semibold">
          {entry.value.toFixed(2)}ms
        </p>
      ))}
    </div>
  );
};
