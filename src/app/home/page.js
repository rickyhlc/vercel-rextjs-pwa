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
        <button className="bg-blue-700 text-white w-30 py-2 rounded hover:bg-blue-800 active:bg-blue-900" onClick={testPushNotification}>Test Web Push</button>
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

      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <a
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        >
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={20}
          height={20}
        />
        Deploy now
        </a>
        <a
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        >
        Read our docs
        </a>
      </div>
    </main>
    <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
      aria-hidden
      src="/file.svg"
      alt="File icon"
      width={16}
      height={16}
      />
      Learn
    </a>
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
      aria-hidden
      src="/window.svg"
      alt="Window icon"
      width={16}
      height={16}
      />
      Examples
    </a>
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
      aria-hidden
      src="/globe.svg"
      alt="Globe icon"
      width={16}
      height={16}
      />
      Go to nextjs.org →
    </a>
    </footer>
  </div>
  );
}
