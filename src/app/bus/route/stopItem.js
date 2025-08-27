"use client";

import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@/components/accordion";
import StopETAs from "@/app/bus/stopETAs";
import BookmarkSolidIcon from "@/icons/bookmarkSolid";
import BookmarkIcon from "@/icons/bookmark";
import { useDataContext } from "./dataProvider";
import { PLAIN_BTN_BLUE } from "@/lib/utils";

export default function StopItem({ company, stop, name, seq, route, bound, serviceType }) {

  const [showDetail, setShowDetail] = useState(false);
  const { checkBookmarks, setBookmarkDrawerData } = useDataContext();
  const bookmarks = checkBookmarks(company, stop, route, serviceType, bound);

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
        <div className="flex items-center">
          <div className="grow-1">
            <StopETAs stop={stop} routes={[{company, route, bound, serviceType}]} />
          </div>
          <button className={`rounded-full p-1 ${PLAIN_BTN_BLUE}`} onClick={() => setBookmarkDrawerData({company, stop, route, bound, serviceType})}>
            {bookmarks.length ? (
              <BookmarkSolidIcon className="w-6 h-6 text-inherit" />
            ) : (
              <BookmarkIcon className="w-6 h-6 text-inherit" />
            )}
          </button>
        </div>
      </AccordionDetails>}
    </Accordion>
  );
}