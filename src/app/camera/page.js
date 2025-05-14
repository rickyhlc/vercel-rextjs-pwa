"use client";

import { useEffect, useState } from "react";

export default function CameraPage() {

  useEffect(() => {
    console.log(navigator.mediaDevices.getSupportedConstraints());
  }, []);

  const [source, setSource] = useState(null);

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  }

  const handleSelect = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        alert(file.webkitRelativePath);
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  }

  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <div className="flex gap-8 items-center">
      <label className="rounded bg-blue-600 p-2.5 text-center text-white active:bg-blue-800 hover:bg-blue-700">
        <input
          accept="image/*"
          className="hidden"
          type="file"
          capture="environment"
          onChange={(e) => handleCapture(e.target)}
        />
        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 3h-2l-.447-.894A2 2 0 0 0 12.764 1H7.236a2 2 0 0 0-1.789 1.106L5 3H3a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2Z"/>
        </svg>
      </label>
      <label className="rounded bg-blue-600 p-2.5 text-center text-white active:bg-blue-800 hover:bg-blue-700">
        <input
          accept="video/*"
          className="hidden"
          type="file"
          capture="environment"
          onChange={(e) => handleCapture(e.target)}
        />
        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"/>
        </svg>
      </label>
      <label className="rounded bg-blue-600 p-2.5 text-center text-white active:bg-blue-800 hover:bg-blue-700">
        <input
          accept="video/*,image/*"
          className="hidden"
          type="file"
          multiple
          onChange={(e) => handleSelect(e.target)}
        />
        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path fill="currentColor" d="M16 18H8l2.5-6 2 4 1.5-2 2 4Zm-1-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 18h8l-2-4-1.5 2-2-4L8 18Zm7-8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
        </svg>
      </label>
    </div>
    {source && <img src={source} alt={"Preview!~"} className=""></img>}
  </div>
  );
}
