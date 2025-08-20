"use client";

import { useRouter } from "next/navigation";
import { BTN_BLUER } from "@/lib/utils";

export default function NavBtn({ path, iconElm, label, className }) {

  const router = useRouter();

  return (
    <button onClick={() => router.push(path)} className={className || `rounded-full p-2 ${BTN_BLUER}`}>
      {iconElm}{label}
    </button>
  );
}