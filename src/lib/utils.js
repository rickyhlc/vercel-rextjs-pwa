import CalendarIcon from "@/icons/calendar";
import PeopleIcon from "@/icons/people";
import AlarmIcon from "@/icons/alarm";
import MoneyIcon from "@/icons/money";
import convertVapidKey from "convert-vapid-public-key";

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

export const getServiceWorkerRegistration = async () => {
  // register the service worker
  // will return the same registration if already registered
  return await navigator.serviceWorker.register("/push-sw.js");
}

// get the subscription object from sw
export const getPushSubscription = async (autoCreate) => {
  try {
    // get subscription
    const registration = await getServiceWorkerRegistration();
    let sub = await registration.pushManager.getSubscription();
    if (!sub && autoCreate) {
      // ask for notification permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // create new subscription
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertVapidKey(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
        });
      } else {
        console.log("no notification permission");
        return null;
      }
    }
    return sub?.toJSON();
  } catch (e) {
    console.log(e);
    return { error: "unable to subscribe!" };
  }
}
export const unsubscribeSWPush = async () => {
  const subscription = await getPushSubscription();
  await subscription?.unsubscribe();
}

export const TXT_ZINC = "text-zinc-800 dark:text-zinc-200";
export const BG_ZINC = "bg-zinc-200 dark:bg-zinc-800";
export const TXT_DISABLED = "disabled:text-zinc-400 dark:disabled:text-zinc-600";
export const BG_DISABLED = "disabled:bg-zinc-400 dark:disabled:bg-zinc-600";
export const ALL_ZINC = `${TXT_ZINC} ${BG_ZINC}`;
export const BTN_BLUER = `${BG_DISABLED} bg-blue-200/70 dark:bg-blue-800/70 active:bg-blue-200 dark:active:bg-blue-800 hover:bg-blue-200/85 dark:hover:bg-blue-800/85 focus-visible:outline-none ${TXT_ZINC}`;
export const PLAIN_BTN_BLUE = `disabled:bg-transparent dark:disabled:bg-transparent active:bg-blue-200 dark:active:bg-blue-400 hover:bg-blue-200/85 dark:hover:bg-blue-400/85 ${TXT_ZINC} ${TXT_DISABLED}`;
export const BORDER_BTN_BLUE = `active:border-blue-200 dark:active:border-blue-400 hover:border-blue-200/85 dark:hover:border-blue-400/85 border-1 rounded-full disabled:bg-transparent dark:disabled:bg-transparent active:bg-blue-200 dark:active:bg-blue-400 hover:bg-blue-200/85 dark:hover:bg-blue-400/85 ${TXT_ZINC} ${TXT_DISABLED}`;