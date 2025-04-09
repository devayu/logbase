import crypto from "crypto";

export function generateApiKey(): string {
  const prefix = "sl";
  const randomPart = crypto.randomBytes(32).toString("hex"); // 64 chars
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
