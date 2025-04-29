import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  date: Date | null,
  includeTime: boolean = false,
  shortDate: boolean = false
) => {
  if (!date) return null;
  const dateString = date.toISOString();
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
