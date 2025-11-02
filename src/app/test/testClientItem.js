"use client";

import { useEffect, useState } from "react";

// this file is for testing purpose only
export default function TestClientItem() {

  const [test, setTest] = useState(() => {
    console.log("+++++++");
    return 1;
  });

  useEffect(() => {
    // this wont call during prerendering
    console.log("~~~~~~~~~~~~~~~~");
  }, []);

  // this will be prerender + CSR
  // no prerender if opt-in to dynamic rendering
  console.log("~~~~TestClientItem");

  return <></>;
}
