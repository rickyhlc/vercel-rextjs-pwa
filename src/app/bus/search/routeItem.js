"use client";

import { useRouter } from "next/navigation";
import { PLAIN_BTN_BLUE, getRouteURL } from "@/lib/utils";
import RouteNum from "../routeNum";
import RouteDirection from "../routeDirection";

export default function RouteItem({ company, route, bound, serviceType, dest, orig}) {

  const router = useRouter();

  return (
    <button className={`px-2 py-2 flex items-center w-full ${PLAIN_BTN_BLUE}`} onClick={() => router.push(getRouteURL(route, bound, serviceType))}>
      <RouteNum company={company} route={route} serviceType={serviceType} />
      <RouteDirection dest={dest} orig={orig} />
    </button>
  );
}