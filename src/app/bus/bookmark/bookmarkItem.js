"use client";

import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@/components/accordion";
import StopETAs from "@/app/bus/stopETAs";
import { useDataContext } from "./dataProvider";
import { BORDER_BTN_BLUE } from "@/lib/utils";

import "./bookmark.css";

/**
 * data {
 *   id: 1,
 *   title: "ust",
 *   go: {
 *     title: "go",
 *     stops: [{ stop: "4FDB108B1B5186DF", routes: [{company: "KMB", route: "113", bound: "I", serviceType: "1"}] }]
 *   }
 *   back: {
 *     title: "go",
 *     stops: [{ stop: "4FDB108B1B5186DF", routes: [{company: "CTB", route: "113", bound: "O", serviceType: "1"}] }]
 *   }
 * }
 */
export default function BookmarkItem({ bookmark }) {

  const [expanded, setExpanded] = useState(null); //go, back or null
  const [showDetail, setShowDetail] = useState(false); // true when expanded or the close animation is not finished
  const [dir, setDir] = useState("go"); //go or back only

  const { stopInfoMap, loadBookmarkStopInfo } = useDataContext();

  function toggleExpanded(direction) {
    if (direction !== expanded) { // open or switch case
      loadBookmarkStopInfo(bookmark.id, direction);
      setExpanded(direction);
      setDir(direction);
    } else if (direction === dir) { // close case
      setExpanded(null);
    }
  }

  function generateDetailsElms() {
    let stops = bookmark[dir].stops;
    let elms = [];
    stops.forEach(s => {
      elms.push(
        <div key={s.stop} className="stopName">
          <span>{stopInfoMap[s.stop]?.name_tc || "---"}</span>
        </div>
      );
      elms.push(<StopETAs key={`${s.stop}-eta`} stop={s.stop} routes={s.routes} showRoute={true} className="etas"/>);
    });
    return elms;
  }

  let accordionClickHandle = null;
  if (bookmark.back.stops.length != bookmark.go.stops.length) {
    if (bookmark.back.stops.length == 0) {
      accordionClickHandle = () => toggleExpanded("go");
    } else if (bookmark.go.stops.length == 0) {
      accordionClickHandle = () => toggleExpanded("back");
    }
  }

  return (
    <Accordion
      expanded={expanded}
      className="accordion dark bookmark"
      TransitionProps={{
        onEnter: () => setShowDetail(true),
        onExited: () => setShowDetail(false)
      }}
    >
      <AccordionSummary expandIcon={null} onClick={accordionClickHandle}>
        <div className="flex justify-between items-center w-full text-lg font-bold">
          <span className="grow-1 basis-0">{bookmark.title}</span>
          {!accordionClickHandle && bookmark.go.stops.length > 0 && (
            <div
              className={`ms-2 text-center w-16 ${dir == "go" && showDetail ? "border-1 border-blue-400 rounded-full bg-blue-400": BORDER_BTN_BLUE}`}
              onClick={() => toggleExpanded("go")}
            >
              {bookmark.go.title}
            </div>
          )}
          {!accordionClickHandle && bookmark.back.stops.length > 0 && (
            <div
              className={`ms-2 text-center w-16 ${dir == "back" && showDetail ? "border-1 border-blue-400 rounded-full bg-blue-400": BORDER_BTN_BLUE}`}
              onClick={() => toggleExpanded("back")}
            >
              {bookmark.back.title}
            </div>
          )}
        </div>
      </AccordionSummary>
      {showDetail && <AccordionDetails>
        {generateDetailsElms()}
      </AccordionDetails>}
    </Accordion>
  );
}