"use client";

import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@/components/accordion";
import { PLAIN_BTN_BLUE, getRouteURL } from "@/lib/utils";

export default function StopItem({ stop, name, seq }) {

  const [showDetail, setShowDetail] = useState(false);

//TODOricky
  return (
    <Accordion
      className="accordion dark"
      square={true}
      TransitionProps={{ onEnter: () => setShowDetail(true), onExited: () => setShowDetail(false) }}
    >
      <AccordionSummary>
        <div className="flex justify-between items-center w-full pe-4 text-lg font-bold">
          <span>{`${seq}. ${name}`}</span>
        </div>
      </AccordionSummary>
      {showDetail && <AccordionDetails>
        TODOricky
      </AccordionDetails>}
    </Accordion>
    // <button className={`px-2 py-1 flex items-center w-full ${PLAIN_BTN_BLUE}`} onClick={() => router.push(getRouteURL(route, bound, serviceType))}>
    //   <div className="grow-0 basis-14 me-2">
    //     <div className="font-bold text-lg">{route}</div>
    //     <div className="text-xs">{company}{serviceType == "1" && " (特)"}</div>
    //   </div>
    //   <div className="grow-1 text-left">
    //     <div className="text-lg">往 {dest}</div>
    //     <div className="text-xs">{orig}</div>
    //   </div>
    // </button>
  );
}