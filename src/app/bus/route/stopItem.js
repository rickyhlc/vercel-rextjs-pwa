"use client";

import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@/components/accordion";
import StopETAs from "@/app/bus/stopETAs";

export default function StopItem({ stop, name, seq, route, bound, serviceType }) {

  const [showDetail, setShowDetail] = useState(false);

  return (
    <Accordion
      className="accordion dark"
      TransitionProps={{ onEnter: () => setShowDetail(true), onExited: () => setShowDetail(false) }}
    >
      <AccordionSummary>
        <div className="flex justify-between items-center w-full pe-4 text-lg font-bold">
          <span>{`${seq}. ${name}`}</span>
        </div>
      </AccordionSummary>
      {showDetail && <AccordionDetails>
        <StopETAs stop={stop} routes={[{company: null, route, bound, serviceType}]} />
      </AccordionDetails>}
    </Accordion>
  );
}