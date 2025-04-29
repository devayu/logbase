import { getUserFromSession } from "@/auth/core/session";
import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  return getUserFromSession(await cookies());
};
export const getClientId = async () => {
  return (await getCurrentUser())?.id;
};
