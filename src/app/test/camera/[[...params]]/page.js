import Camera from "../camera";

// test prerendering
// /test/camera, /test/camera/1/2, /test/camera/a will be prerendered
// other paths will get 404
export const dynamicParams = false;
export async function generateStaticParams() {
  console.log("~~~generateStaticParams");
  return [{ params: ['1','2']},{ params: ['a']},{ params: []}];
}

export default function CameraPage() {

  console.log("~~~CameraPage Server component");

  return (
  <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <Camera />
  </div>
  );
}
