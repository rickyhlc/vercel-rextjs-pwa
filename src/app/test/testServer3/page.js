import {Suspense} from "react"
import TestItem from "@/app/test/testItem";
import Btn2 from "@/app/test/testServer3/btn2";

export default function TestServerPage3({ searchParams }) {

  // unexpected result, its now dynamically rendered (build BUILD and SERVER)
  // maybe need to enable experimental_ppr according to the docs
  console.log("~~~TestServerPage3 (should log only at BUILD)");

  return (<div>
   <TestItem />
   <Suspense><Btn2 searchParams={searchParams} /></Suspense>
  </div>);
}
