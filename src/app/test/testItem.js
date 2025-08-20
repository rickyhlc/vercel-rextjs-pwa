// this file is for testing purpose only
export default function TestItem() {

  // under client component, this will be CSR
  // under server component, this will be SSR
  console.log("~~~~TestItem used in both client and server components");

  return <></>;
}
