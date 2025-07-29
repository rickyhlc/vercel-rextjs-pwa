// import { useState, use } from "react";
// import { Suspense } from "react";
import Camera from "../camera";

export async function generateStaticParams() {
  console.log("~~~generateStaticParams");
  return [{ params: ['1','2']},{ params: ['a','b']}];
}

// export default function CameraPage({ params }) {
export default function CameraPage() {

  console.log("~~~CameraPage Server component");


  // const x = use(params); // better use <Suspense> to wrap this component


  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <Camera />
  </div>
  );
}
