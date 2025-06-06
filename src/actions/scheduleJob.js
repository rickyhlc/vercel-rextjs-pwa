"use server";

import { auth } from "@/lib/authConfig";
//TODOricky
export const test = async (subcription, data) => {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { error: 'Unauthorized' };
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_DOMAIN}/subscribePush`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Key': email,
      },
      body: JSON.stringify({ subcription, data })
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}