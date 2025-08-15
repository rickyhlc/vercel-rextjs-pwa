"use client";

import { use } from "react";


export default function Data({url}) {

  console.log("~~~tc Data client component");

  const data = use(fetch(url).then(res => res.json));


  return (
    <pre>
      {JSON.stringify(data)}
      </pre>
  );
}
