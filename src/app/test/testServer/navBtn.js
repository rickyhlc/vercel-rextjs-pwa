"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function NavBtn() {

  console.log("~~~TestServerPage->navBtn (should log at BUILD and CLIENT)");
  const sp = useSearchParams();
  console.log("~~~TestServerPage->navBtn (should log only at CLIENT side)", sp);

  const router = useRouter();
//TODOricky test server fetch no-store
  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="flex gap-8 items-center">
      <button className="bg-blue-400 p-2.5 text-center text-white" onClick={() => router.push("/test/testClient")}>Go test</button>
    </div>
  </div>
  );
}
