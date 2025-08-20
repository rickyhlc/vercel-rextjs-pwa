
import { use } from "react";

export default function Btn2({ searchParams }) {
  const x = use(searchParams);
  console.log("~~~TestServerPage3->Btn2 (should log at SERVER side)", x);

  return (
  <div>~~~~~~~~~~~</div>
  );
}
