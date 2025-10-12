import {Suspense, use, useMemo} from "react";
import NavBtn from "@/app/test/testServer/navBtn";
import TestItem from "@/app/test/testItem";
import TestClientItem from "@/app/test/testClientItem";

export default function TestServerPage({  }) {

  console.log("~~~TestServerPage (should log only at BUILD time)");
  // need to wrap NavBtn in Suspense because this page is prerendered first
  // inside Suspense, the content will dynamically rendered later

  return (<div>
   <Suspense><ItemWithUse /></Suspense>
   <Suspense><NavBtn /></Suspense>
   <TestClientItem />
   <TestItem />

  </div>);
}

function ItemWithUse() {
  const data = useMemo(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("data x");
      }, 6456);
    });
  });
  const x = use(data);

  return <div>{x}!!</div>;
}