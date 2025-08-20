import {Suspense} from "react"
import NavBtn from "@/app/test/testServer/navBtn";
import TestItem from "@/app/test/testItem";

export default function TestServerPage({  }) {

  console.log("~~~TestServerPage (should log only at BUILD time)");
  // need to wrap NavBtn in Suspense because this page is prerendered first
  // inside Suspense, the content will dynamically rendered later

  return (<div>
   <Suspense><NavBtn  /></Suspense>
   <TestItem />
  </div>);
}
