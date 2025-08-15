"use client";

import { use } from "react";
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");



export default function ApiDiv() {

  console.log("~~~tc apiDiv client component");

  async function handleApiCall(){
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/");
    let data = await res.json();
    console.log("@@@", data);
  }

  // const data = use(fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/").then(res => res.json));


  return (
    <div className="flex gap-8 items-center py-8">
      {/* hi,  {data.length} */}
    </div>
  );
}
