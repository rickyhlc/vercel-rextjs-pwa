import {Suspense} from "react"
import NavBtn from "@/app/test/testServer/navBtn";


export default function TestServerPage({  }) {

  console.log("~~~TestPage server component");

  return (<div>
   <Suspense><NavBtn  /></Suspense>
   
  </div>);
}
