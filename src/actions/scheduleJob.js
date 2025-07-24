"use server";

import { auth } from "@/lib/authConfig";

export const getServerPushSubscriptions = async () => {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { error: 'Unauthorized' };
    }

    const reqHeaders = new Headers();
    reqHeaders.set("Content-Type", "application/json");
    reqHeaders.set("X-Custom-Key", email);
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_DOMAIN}/getSchedulePushes`, {
      method: "POST",
      headers: reqHeaders,
    });
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    return { error: 'Internal Server Error' };
  }
}

/**
 * 
 * @param {*} subscription 
 * @param {*} notification - { _id schedules["DAY[0-6]", "[1-31]", "[1-31]/[0-11]"] data{name notificationType cat type flags value} }
 * @returns 
 */
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
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    return { error: 'Internal Server Error' };
  }
}

export const unsubscribeServerPush = async (subscription) => {
  //TODOricky
}

export const sendTestNotification = async (subscription, notification) => {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
      return { error: 'Unauthorized' };
    }

    const reqHeaders = new Headers();
    reqHeaders.set("Content-Type", "application/json");
    reqHeaders.set("X-Custom-Key", email);
    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_DOMAIN}/testNotification`, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({ subscription, notification })
    });
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    return { error: 'Internal Server Error' };
  }
}