import {Suspense} from "react"
import NavBtn from "@/app/test/testServer2/navBtn";
import TestItem from "@/app/test/testItem";
import Btn2 from "@/app/test/testServer2/btn2";
import ItemSP from "@/app/test/testServer2/itemSearchParams";

// no prerendering, so no need to use Suspense for NavBtn
export const dynamic = 'force-dynamic';

export default function TestServerPage2({ searchParams }) {

  console.log("~~~TestServerPage2 (should log only at SERVER)");

  return (<div>
   <NavBtn  />
   <TestItem />
    <Btn2 />
    <ItemSP searchParams={searchParams} />
  </div>);
}
