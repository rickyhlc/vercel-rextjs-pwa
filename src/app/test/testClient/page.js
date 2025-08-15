"use client";

import { useState, useRef, Suspense } from "react";
import NavBtn from "@/app/test/testClient/navBtn";
import ApiDiv from "@/app/test/testClient/apiDiv";
import Data from "@/app/test/testClient/data";

export default function TestClientPage() {

  console.log("~~~TestClientPage client component");

  const ref = useRef();

  function handleClick() {
    ref.current.setLbl("!!!");
    console.log(ref.current.lbl);
  }

  async function handleApiCall(){
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/");
    let data = await res.json();
    console.log(data);
  }

  return (
    <div className="m-6">
      <div>
        <button onClick={handleClick}>Add</button><span className="ms-5">---</span>
      </div>
      <button onClick={handleApiCall}>Call</button>
      <NavBtn ref={ref} />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <ApiDiv /> */}
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      <Data url="https://data.etabus.gov.hk/v1/transport/kmb/route/" />
      </Suspense>
    </div>
  );
}
