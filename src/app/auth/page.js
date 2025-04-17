"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { decodeIdToken } from "../../utils/googleAuth"; // Adjust the import path as necessary

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    console.log(window.location.href);
    console.log(window.location.hash);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("id_token");
console.log(decodeIdToken(token));
    if (token) {
      localStorage.setItem("googleAuthToken", token);
      router.push("/");
    } else {
      router.push("/login");
    }
  }, []);

  return <div>Processing sign-in...</div>;
}
