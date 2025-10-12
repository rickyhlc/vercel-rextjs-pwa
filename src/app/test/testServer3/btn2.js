
import { use } from "react";

export default function Btn2({ searchParams }) {
  console.log("~~~TestServerPage3->Btn2 (should log at SERVER side)");
  const y = use(searchParams);
  console.log("~~~TestServerPage3->Btn2 (should log at SERVER side) after 'use'", y);

  // console.log("~~~TestServerPage3->Btn2 (should log at SERVER side)~~");
  // let x = use(handleApiCall());
  // async function handleApiCall(){
  //   let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/", { cache: 'no-store' });
  //   let data = await res.json();
  //   console.log("~~~~~~~~~called");
  //   return data;
  // }

  return (
    <div>~~~~~~~~~~~</div>
  );
}
