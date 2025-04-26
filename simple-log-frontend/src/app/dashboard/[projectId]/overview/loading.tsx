import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
const randomWidths = ["w-[150px]", "w-[180px]", "w-[200px]", "w-[220px]"];

export default function Loading() {
  return (
    <div className="p-6">
      <Skeleton className="h-6 w-[100px] mb-2" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border border-border/30 py-3">
            <div className="p-6 space-y-4">
              <Skeleton
                className={cn(
                  "h-6",
                  randomWidths[Math.floor(Math.random() * randomWidths.length)]
                )}
              />{" "}
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-4 border-t-2"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
