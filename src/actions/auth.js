"use server";

import { auth, handlers, signIn, signOut } from "@/lib/authConfig";

export const login = async (options) => {
  await signIn("google", options || { redirectTo: "/home" });
}

export const logout = async (options) => {
  await signOut(options || { redirectTo: "/signIn" });
}

export const getSession = async () => {
  return await auth();
}