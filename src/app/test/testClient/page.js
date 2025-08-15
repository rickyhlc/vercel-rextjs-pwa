"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import NavBtn from "@/app/test/testClient/navBtn";
import ApiDiv from "@/app/test/testClient/apiDiv";

export default function TestClientPage() {

  console.log("~~~TestClientPage client component");

  const ref = useRef();

  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="mt-4">Count: {count}</div>
    </div>
  );
}
