"use client";

import { useRouter } from "next/navigation";
import { PLAIN_BTN_BLUE, getRouteURL } from "@/lib/utils";

export default function RouteItem({ company, route, bound, serviceType, dest, orig}) {

  const router = useRouter();

  return (
    <button className={`px-2 py-1 flex items-center w-full ${PLAIN_BTN_BLUE}`} onClick={() => router.push(getRouteURL(route, bound, serviceType))}>
      <div className="grow-0 basis-14 me-2">
        <div className="font-bold text-lg">{route}</div>
        <div className="text-xs">{company}{serviceType == "1" && " (特)"}</div>
      </div>
      <div className="grow-1 text-left">
        <div className="text-lg">往 {dest}</div>
        <div className="text-xs">{orig}</div>
      </div>
    </button>
  );
}