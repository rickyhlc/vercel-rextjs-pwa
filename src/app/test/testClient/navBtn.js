"use client";

import { useState, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";

// export default function CameraPage({ params }) {
export default function NavBtn({ ref }) {

  console.log("~~~tc navBtn client component");

  const [lbl, setLbl] = useState("");
  const router = useRouter();

  useImperativeHandle(ref, () => {
    return {
      setLbl,
      lbl
    }
  }, [lbl]);

  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="flex gap-8 items-center">
      <button className="bg-blue-400 p-2.5 text-center text-white" onClick={() => router.push("/test/testServer")}>Go test {lbl}</button>
    </div>
  </div>
  );
}
