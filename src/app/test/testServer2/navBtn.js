"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function NavBtn({ searchParams }) {

  const sp = useSearchParams();

  console.log("~~~TestServerPage2->navBtn (should log at SERVER and CLIENT side)", sp);

  const router = useRouter();

  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="flex gap-8 items-center">
      <button className="bg-blue-400 p-2.5 text-center text-white" onClick={() => router.push("/test/testClient")}>Go test</button>
    </div>
  </div>
  );
}
