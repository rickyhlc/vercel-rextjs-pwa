"use server";

import { auth } from "@/lib/authConfig";
//TODOricky
export const test = async (subscription) => {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { error: 'Unauthorized' };
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_DOMAIN}/subscribePush`, {
      method: "POST",
      headers: {
        'X-Custom-Key': email,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(subscription)
    });
    return res.json();
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}