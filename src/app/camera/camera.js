"use client";

import { useState } from "react";
import CameraIcon from "@/icons/camera";
import VideoIcon from "@/icons/video";
import MediaIcon from "@/icons/media";

// export default function CameraPage({ params }) {
export default function Camera() {

  console.log("~~~Camera client component");



  // const x = use(params); // better use <Suspense> to wrap this component

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
  <>
    <div className="flex gap-8 items-center">
      <label className="rounded bg-blue-600 p-2.5 text-center text-white active:bg-blue-800 hover:bg-blue-700">
        <input
          accept="image/*"
          className="hidden"
          type="file"
          capture="environment"
          onChange={(e) => handleCapture(e.target)}
        />
        <CameraIcon/>
      </label>
      <label className="rounded bg-blue-600 p-2.5 text-center text-white active:bg-blue-800 hover:bg-blue-700">
        <input
          accept="video/*"
          className="hidden"
          type="file"
          capture="environment"
          onChange={(e) => handleCapture(e.target)}
        />
        <VideoIcon/>
      </label>
      <label className="rounded bg-blue-600 p-2.5 text-center text-white active:bg-blue-800 hover:bg-blue-700">
        <input
          accept="video/*,image/*"
          className="hidden"
          type="file"
          multiple
          onChange={(e) => handleSelect(e.target)}
        />
        <MediaIcon/>
      </label>
    </div>
    {source && <img src={source} alt={"Preview!~"} className=""></img>}
  </>
  );
}
