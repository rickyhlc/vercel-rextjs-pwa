"use server";

import { auth } from "@/lib/authConfig";
//TODOricky
export const subscribeServerPush = async (subscription, notification) => {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { error: 'Unauthorized' };
    }

    const reqHeaders = new Headers();
    reqHeaders.set("Content-Type", "application/json");
    reqHeaders.set("X-Custom-Key", email);
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_DOMAIN}/updateSchedulePush`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({ subscription, notification })
    });
    return res.json();
  } catch (error) {
    console.error("Error:", error);
    return { error: 'Internal Server Error' };
  }
}

export const unsubscribeServerPush = async (subscription) => {
  //TODOricky
}