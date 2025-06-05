"use server";

import { auth } from "@/lib/authConfig";

export const test = async (options) => {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { error: 'Unauthorized' };
    };console.log("TODOricky", email);
    const res = await fetch("https://rickyzero-api.vercel.app/home", {
      method: "GET",
      headers: {
        'X-Custom-Key': email,
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}