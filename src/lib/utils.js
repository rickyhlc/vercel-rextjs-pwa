import CalendarIcon from "@/icons/calendar";
import PeopleIcon from "@/icons/people";
import AlarmIcon from "@/icons/alarm";
import MoneyIcon from "@/icons/money";
import { test } from "@/actions/scheduleJob";

/**
 * 
 * @returns today's ts
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const getFlagIcon = (flag, cls) => {
  if (flag.id === "REGULAR") {
    return <CalendarIcon key={flag.id} className={cls}/>;
  } else if (flag.id === "FOR_OTHER") {
    return <PeopleIcon key={flag.id} className={cls}/>;
  } else if (flag.id === "SPECIAL") {
    return <AlarmIcon key={flag.id} className={cls}/>;
  } else if (flag.id === "INCOME") {
    return <MoneyIcon key={flag.id} className={cls}/>;
  }
}

export const dateFormat = (date, fmt) => {
  let options = {
    month: "short"
  }

  if (fmt === "day") {
    options.day = "2-digit"
  } else if (fmt === "month") {
    options.year = "numeric";
  } else {
    options.year = "numeric";
    options.day = "2-digit";
  }
  return date.toLocaleDateString("en-GB", options);
}

export const timeFormat = (date, fmt) => {
  let options = {
    hour: "2-digit"
  }
  if (fmt === "minute") {
    options.minute = "2-digit";
  } else if (fmt === "second") {
    options.minute = "2-digit";
    options.second = "2-digit";
  }
  return date.toLocaleTimeString("en-GB", options);
}

export const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, "+")
    .replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

export const subscribePushNotification = async () => {;console.log("lib subcribe");
  const registration = await navigator.serviceWorker.ready;
  // this will return the existing subscription if already created
  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
  });console.log(sub);
  return sub;
  await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_DOMAIN}/subscribe`, { data: JSON.stringify(sub) });
}
export const unsubscribePushNotification = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  await subscription?.unsubscribe();
  await unsubscribeUser();//TODOricky
}

export const TXT_ZINC = "text-zinc-800 dark:text-zinc-200";
export const BG_ZINC = "bg-zinc-200 dark:bg-zinc-800";
export const TXT_DISABLED = "disabled:text-zinc-400 dark:disabled:text-zinc-600";
export const BG_DISABLED = "disabled:bg-zinc-400 dark:disabled:bg-zinc-600";
export const ALL_ZINC = `${TXT_ZINC} ${BG_ZINC}`;
export const BTN_BLUER = `${BG_DISABLED} bg-blue-200/70 dark:bg-blue-800/70 active:bg-blue-200 dark:active:bg-blue-800 hover:bg-blue-200/85 dark:hover:bg-blue-800/85 focus-visible:outline-none ${TXT_ZINC}`;
export const PLAIN_BTN_BLUE = `disabled:bg-transparent dark:disabled:bg-transparent active:bg-blue-200 dark:active:bg-blue-400 hover:bg-blue-200/85 dark:hover:bg-blue-400/85 ${TXT_ZINC} ${TXT_DISABLED}`;