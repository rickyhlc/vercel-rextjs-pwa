"use client";

import { useState, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex gap-8 items-center py-8">
      <button className="bg-blue-400 p-2.5 text-center text-white" onClick={() => router.push("/test/testServer")}>Go test {lbl}</button>
    </div>
  );
}
