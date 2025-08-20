"use client";

import { useState } from "react";

export default function Btn2() {

  console.log("~~~TestServerPage2->Btn2 (should log at SERVER and CLIENT side)");

  const [x, setX] = useState(0);
  return (
  <button onClick={() => setX(x + 1)} className="bg-blue-400 p-2.5 text-center text-white">
    {x}
  </button>
  );
}
