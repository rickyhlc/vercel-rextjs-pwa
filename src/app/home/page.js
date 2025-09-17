"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getSession, logout } from "@/actions/auth";
import { sendTestNotification } from "@/actions/scheduleJob";
import { timeFormat, dateFormat, getPushSubscription, getBankURL, getBusURL, getSignInURL } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [expTime, setExpTime] = useState(0);
  useEffect(() => {
  const getSess = async () => {
    const exp = (await getSession())?.expires;
    setExpTime(new Date(exp));
  } 
  getSess();
  }, [count]);

  // install pwa button
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    const handleBeforeInstallPrompt = async (e) => {
      console.log("install triggered");
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);
  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setCount(count+1);
    }
  }

  async function testPushNotification() {
    //TODOricky first time sw is not ready?
    const sub = await getPushSubscription(true);
    if (sub) {
      sendTestNotification(sub, {msg: "The push notification is working!"});
    }
    setCount(count+1);
  }

  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8  font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      {deferredPrompt != null  && <div className="flex gap-8 items-center">
        <button className="bg-blue-700 text-white w-50 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={handleInstall}>Install PWA</button>
      </div>
      }
      <div className="flex gap-8 items-center">
        <button className="bg-blue-700 text-white w-20 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={() => router.push(getSignInURL())}>Login</button>
        <button className="bg-blue-300 text-white w-20 py-2 rounded hover:bg-blue-400 active:bg-blue-500" onClick={() => logout()}>Logout</button>
      </div>
      <div className="flex gap-8 items-center">
        <button className="bg-blue-700 text-white w-20 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={() => router.push(getBusURL())}>Bus</button>
        <button className="bg-blue-700 text-white w-20 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={() => router.push(getBankURL())}>Bank</button>
        <button className="bg-blue-700 text-white w-20 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={() => router.push("/portfolio")}>Portfolio</button>
      </div>
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <div className="flex gap-8 items-center">
        <button className="bg-blue-700 text-white w-30 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={() => router.push("/test/testClient")}>Test</button>
        <button className="bg-blue-700 text-white w-30 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={() => router.push("/test/camera")}>Test Camera</button>
      </div>
      <div className="flex gap-8 items-center">
        <button className="bg-blue-700 text-white w-30 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={testPushNotification}>Test Web Push</button>
        <a className="text-center bg-blue-700 text-white w-30 py-2 rounded hover:bg-blue-800 active:bg-blue-900" href="https://wa.me/85261263612?text=test">wa</a>
      </div>
      <div className="">{expTime ? dateFormat(expTime) + " " + timeFormat(expTime, "second") : "-"} ({count})</div>
      <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        <li className="mb-2 tracking-[-.01em]">
        Get started by editing{" "}
        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
          src/app/page.js
        </code>
        .
        </li>
        <li className="tracking-[-.01em]">
        Save and see your changes instantly.
        </li>
      </ol>
    </main>
  </div>
  );
}
