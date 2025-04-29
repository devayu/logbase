import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | null, includeTime: boolean = false) => {
  if (!date) return null;
  const dateString = date.toISOString();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
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
