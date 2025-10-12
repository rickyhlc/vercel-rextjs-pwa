import {Suspense} from "react"
import TestItem from "@/app/test/testItem";
import Btn2 from "@/app/test/testServer3/btn2";

export default function TestServerPage3({ searchParams }) {

  // opt-in to dynamic rendering since searchParams is used in Btn2 (build BUILD and SERVER)
  // maybe need to enable experimental_ppr according to the docs for ppr
  console.log("~~~TestServerPage3 (should log at BUILD and SERVER)");

  return (<div>
   <TestItem />
   <Suspense><Btn2 searchParams={searchParams} /></Suspense>
  </div>);
}
