"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/home");
  }, [router]);

  return <></>;
}
