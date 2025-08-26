"use client";

import { useState, useMemo } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@/components/accordion";
import StopETAs from "@/app/bus/stopETAs";
import { useDataContext } from "./dataProvider";
import { BORDER_BTN_BLUE } from "@/lib/utils";

/**
 * data {
 *   id: 1,
 *   title: "ust",
 *   children: [{
 *   title: "go",
 *   list: [{ stop: "4FDB108B1B5186DF", company: "ff", route: "113", bound: "I", serviceType: "1" }]
 * }
 */
export default function BookmarkItem({ data }) {

  const [expanded, setExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [childNum, setChildNum] = useState(0);

  const { stopInfoMap, loadBookmarkStopInfo } = useDataContext();

  const bookmark = useMemo(() => {
    let res = { ...data };
    res.children = res.children.map(c => ({ ...c, stops: Object.groupBy(c.list, (r) => r.stop) }));
    return res;
  }, [data]);

  function toggleExpanded(childInd) {
    if (childInd !== expanded) { // open or switch case
      loadBookmarkStopInfo(bookmark.id);
      setExpanded(childInd);
      setChildNum(childInd);
    } else if (childInd !== false) { // close case
      setExpanded(false);
    }
  }

  function generateDetailsElms() {
    let stops = bookmark.children[childNum].stops;
    let elms = [];
    for (let k in stops) {
      let s = stops[k];
      elms.push(
        <div key={k} className="flex justify-between items-center w-full pe-4 text-lg font-bold">
          <span>{stopInfoMap[k]?.name_tc || "---"}</span>
        </div>
      );
      elms.push(<StopETAs key={`${s.company}-${s.route}-${s.bound}-${s.serviceType}`} stop={k} routes={s} showRoute={true} />);
    }
    return elms;
  }

  return (
    <Accordion
      expanded={expanded !== false}
      TransitionProps={{
        onEnter: () => setShowDetail(true),
        onExited: () => setShowDetail(false)
      }}
    >
      <AccordionSummary expandIcon={null} onClick={bookmark.children.length == 0 ? () => toggleExpanded(0) : null}>
        <div className="flex justify-between items-center w-full text-lg font-bold">
          <span className="grow-1 basis-0">{bookmark.title}</span>
          {bookmark.children.length > 1 && bookmark.children.map((c, i) => (
            <div
              key={i}
              className={`ms-2 text-center w-16 ${childNum == i && showDetail ? "border-1 border-blue-400 rounded-full bg-blue-400": BORDER_BTN_BLUE}`}
              onClick={() => toggleExpanded(i)}
            >
              {c.title}
            </div>
          ))}
        </div>
      </AccordionSummary>
      {showDetail && <AccordionDetails>
        {generateDetailsElms()}
      </AccordionDetails>}
    </Accordion>
  );
}