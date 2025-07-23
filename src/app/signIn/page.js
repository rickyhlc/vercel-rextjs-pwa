"use client";

import { login } from "@/actions/auth";

export default function SignInPage() {
  
  console.log("~~~SignInPage client component");

  return (
  <div className="flex flex-col items-center justify-center min-h-screen p-8">
    <h1 className="text-2xl font-bold mb-4">Sign in to continue</h1>
    <button
    onClick={() => login()}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
    Sign in with Google
    </button>
  </div>
  );
}
