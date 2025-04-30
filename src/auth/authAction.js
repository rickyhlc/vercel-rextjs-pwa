"use server";

import { auth, handlers, signIn, signOut } from "./authConfig";

export const login = async (options) => {
    await signIn("google", options || { redirectTo: "/" });
}

export const logout = async (options) => {
    await signOut(options || { redirectTo: "/signIn" });
}

export const getSession = async () => {
    return await auth();
}