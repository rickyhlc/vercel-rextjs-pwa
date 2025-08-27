"use client";

import { useDataContext } from "./dataProvider";

export default function Title() {

  console.log("Title");

  const { apiData: { route, dest_tc, service_type } } = useDataContext();

  return (
    <>
      <span className="text-lg">{route}</span><span className="text-xs">{service_type != "1" && " (特)"}</span>
      <div className="text-xs">往 {dest_tc}</div>
    </>
  );
}