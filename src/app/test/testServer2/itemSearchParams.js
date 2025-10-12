
import { use } from "react";

export default function ItemSP({ searchParams }) {
  console.log("~~~TestServerPage2->ItemSP (should log at SERVER side)");
  const y = use(searchParams);
  console.log("~~~TestServerPage2->ItemSP (should log at SERVER side)", y);


  return (
    <div>~~~~~~~~~~~</div>
  );
}
