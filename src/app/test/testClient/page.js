"use client";

import { useTransition, useState, useId, useRef } from "react";
import NavBtn from "@/app/test/testClient/navBtn";

export default function TestClientPage() {

  console.log("~~~TestClientPage client component");
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [isPending, startTransition] = useTransition();

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
    startTransition(async () => {
      console.log(ref.current.lbl);
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
      setCount(count -7);
      await add();
      startTransition(() => {
        setCount1(count1 + 100);
      });
    });
  }

  return (
    <div className="m-6">
      <div>
        <button onClick={handleClick}>Add</button><span className="ms-5">Count: {count},{count1}</span><span className="ms-5">loading: {isPending ? "yes" : "no"}</span>
      </div>
      <NavBtn ref={ref} />
    </div>
  );
}
