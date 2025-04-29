"use server";
import { createUserSession, removeUserFromSession } from "@/auth/core/session";
import { prisma } from "@/db/db";
import { hashPassword, passwordCompare } from "@/lib/passwordHasher";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import { z } from "zod";

const RegisterUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});
const salt = process.env.SECRET_SALT;
export type RegisterUserT = z.infer<typeof RegisterUserSchema>;

export const registerUserAction = async (registerForm: FormData) => {
  const result = RegisterUserSchema.safeParse({
    email: registerForm.get("email"),
    name: registerForm.get("name"),
    password: registerForm.get("password"),
  });
  if (!result.success) {
    return "Unable to register user, please try again later.";
  }
  const { name, email, password } = result.data;

  const existingUser = await prisma.client.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return "User already exists, please login.";
  }
  const hashedPassword = await hashPassword(password, salt);
  const user = await prisma.client.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  createUserSession(user, await cookies());
  redirect("/projects");
};

export const loginUserAction = async (loginUser: FormData) => {
  const result = RegisterUserSchema.omit({ name: true }).safeParse({
    email: loginUser.get("email"),
    password: loginUser.get("password"),
  });
  if (!result.success) {
    return "Unable to login user, please try again later.";
  }
  const { email, password } = result.data;

  const user = await prisma.client.findUnique({
    where: {
      email,
    },
  });

  if (!user) return "No user found with this email";
  const isPasswordEqual = await passwordCompare(user.password, password, salt);
  if (!isPasswordEqual) return "Wrong password";

  createUserSession(user, await cookies());
  redirect("/projects");
};

export const logOutUser = async () => {
  console.log("logu out");
  await removeUserFromSession(await cookies());
  redirect("/");
};
