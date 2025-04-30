import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  date: Date | null,
  includeTime: boolean = false,
  shortDate: boolean = false,
  onlyTime: boolean = false
) => {
  if (!date) return null;
  const dateString = date.toISOString();

  if (onlyTime) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  const options: Intl.DateTimeFormatOptions = {
    year: shortDate ? undefined : "numeric",
    month: shortDate ? "short" : "long",
    day: "numeric",
    ...(includeTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return new Date(dateString).toLocaleDateString("en-US", options);
};

export function generateApiKey(): string {
  const prefix = "sl";
  const randomPart = crypto.randomBytes(8).toString("hex"); // 64 chars
  const timestamp = Math.floor(Date.now() / 1000); // Unix time in seconds

  return `${prefix}_${randomPart}_${timestamp}`;
}
export function parseApiKey(apiKey: string) {
  const parts = apiKey.split("_");

  if (parts.length !== 3 || parts[0] !== "sl") {
    throw new Error("Invalid API key format");
  }

  return {
    prefix: parts[0],
    key: parts[1],
    createdAt: new Date(Number(parts[2]) * 1000),
  };
}

export const isClientSide = () => {
  return typeof window !== "undefined";
};

export const getDeviceType = (
  userAgent: string
): "mobile" | "web" | "tablet" | "unknown" => {
  const ua = userAgent.toLowerCase();

  // Check for mobile devices
  if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(ua)) {
    // Specifically check for tablets
    if (/(ipad|android(?!.*mobile))/i.test(ua)) {
      return "tablet";
    }
    return "mobile";
  }

  // If not mobile and has common desktop browser strings, consider it web
  if (/(mozilla|chrome|safari|firefox|edge|opera)/i.test(ua)) {
    return "web";
  }

  return "unknown";
};

export const formatDuration = (ms: number): string => {
  if (!ms) return "0 minutes";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
};

export const getColorForEventType = (isDown: boolean, isPaused?: boolean) => {
  if (isPaused) return "bg-yellow-500";
  if (isDown) return "bg-red-500";

  return "bg-emerald-500";
};

export const getStatusBadgeVariant = (isPaused?: boolean, isDown?: boolean) => {
  if (isPaused) return "info";
  if (isDown) return "destructive";
  return "success";
};
export const getStatusText = (isPaused?: boolean, isDown?: boolean) => {
  if (isPaused) return "Paused";
  if (isDown) return "Down";

  return "Online";
};

export const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url.replace(/^(https?:\/\/)/, "");
};
