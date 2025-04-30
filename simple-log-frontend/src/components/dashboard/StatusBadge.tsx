import { Badge } from "@/components/ui/badge";
import { getStatusText, getStatusBadgeVariant } from "@/lib/utils";

export const StatusBadge = ({
  isPaused,
  isDown,
}: {
  isPaused?: boolean;
  isDown?: boolean;
}) => {
  return (
    <Badge
      variant={getStatusBadgeVariant(isPaused, isDown)}
      className="px-3 py-1"
    >
      {getStatusText(isPaused, isDown)}
    </Badge>
  );
};
