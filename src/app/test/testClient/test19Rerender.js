"use client";

export default function TestRerender({ onClick }) {

  console.log("~~~19 TestRerender component");


  return (
    <button className="bg-blue-400 p-2.5 text-center text-white" onClick={onClick}>HAHA</button>
  );
}
