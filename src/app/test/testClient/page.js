"use client";

import { useState, useId, useRef } from "react";
import NavBtn from "@/app/test/testClient/navBtn";

export default function TestClientPage() {

  console.log("~~~TestClientPage client component");
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);

  const xid = useId();
  const yid = useId();
  console.log(xid, yid);

  const ref = useRef();

  async function add() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    });
  }

  function handleClick() {
    ref.current.setLbl("!!!");
    console.log(ref.current.lbl);
  }

  return (
    <div className="m-6">
      <div>
        <button onClick={handleClick}>Add</button><span className="ms-5">Count: {count},{count1}</span>
      </div>
      <NavBtn ref={ref} />
    </div>
  );
}
