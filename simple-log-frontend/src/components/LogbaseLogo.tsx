import { cn } from "@/lib/utils";
import Image from "next/image";
export const LogbaseLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <Image
        src="/logbase.svg"
        alt="Logbase Logo"
        className="w-5 h-5"
        width={20}
        height={20}
      />
      <span className="text-lg font-bold gradient-text">Logbase</span>
    </div>
  );
};
