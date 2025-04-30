"use client";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { AlertCircle } from "lucide-react";

type BannerProps = {
  variant?: "info" | "default" | "destructive" | "success";
  className?: string;
  title?: string;
  desc?: string;
  buttonTitle?: string;
  buttonIcon?: React.ReactNode;
  asyncAction?: () => Promise<void>;
};

const bannerVariants = cva("text-black px-4 py-2 opacity-90 rounded-sm", {
  variants: {
    variant: {
      default: "bg-muted",
      destructive: "bg-destructive",
      info: "bg-orange-200",
      success: "bg-emerald-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const Banner = (props: BannerProps) => {
  const {
    title,
    desc,
    variant,
    className,
    asyncAction,
    buttonTitle,
    buttonIcon,
  } = props;
  return (
    <div className="p-4 pb-0">
      <div className={cn(bannerVariants({ variant }), className)}>
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 mr-4" />
          <div className="flex flex-col">
            <AlertTitle>{title}</AlertTitle>

            <AlertDescription className="text-black">{desc}</AlertDescription>
          </div>
          {asyncAction && (
            <Button
              onClick={asyncAction}
              type="submit"
              variant={variant}
              className="ml-auto cursor-pointer"
            >
              {buttonIcon}
              {buttonTitle}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
