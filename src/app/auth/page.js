"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("id_token");
    console.log(hashParams);
    console.log(token);
    if (token) {
      localStorage.setItem("googleAuthToken", token);
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <div>Processing sign-in...</div>;
}
