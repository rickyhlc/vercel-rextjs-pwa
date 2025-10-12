"use client";

import { useState, useEffect, useRef, Suspense, useReducer } from "react";
import NavBtn from "@/app/test/testClient/navBtn";
import TestItem from "@/app/test/testItem";
import TestClientItem from "@/app/test/testClientItem";

export default function TestClientPage() {

  console.log("~~~~~~TestClientPage (should log in BUILD and CLIENT) sss");

  const ref = useRef();

  const [state, dispatch] = useReducer((prev, action) => {
    return { x: prev.x + 1}
  }, { x: 1 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 4000);
    setCount(count+1);setCount(count+1);setCount(count+1);setCount(count+1);
    dispatch();dispatch();dispatch();dispatch();
    return () => clearInterval(interval);
  }, []);

  function handleClick() {
    ref.current.setLbl("!!!");
    console.log(state, count);
    console.log(ref.current.lbl);
  }

  async function handleApiCall(){
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/");
    let data = await res.json();
    console.log(data);
  }

  console.log("~~~~~~TestClientPage (should log in BUILD and CLIENT) eee");

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
      <TestItem />
      <TestClientItem />
    </div>
  );
}