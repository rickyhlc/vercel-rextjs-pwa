"use client";

import { useEffect, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
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
  const controls = useDragControls();

  // handle auto close whenn remove bookmark
  useEffect(() => {
    if (expanded === "go" && bookmark.go.stops.length == 0) {
      toggleExpanded("go");
    } else if (expanded === "back" && bookmark.back.stops.length == 0) {
      toggleExpanded("back");
    }
  }, [bookmark]);

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
      elms.push(
        <StopETAs key={`${s.stop}-eta`} stop={s.stop} routes={s.routes} showRoute={true} bookmarkId={bookmark.id} direction={dir} className="etas"/>
      );
    });
    return elms;
  }

  return (
    <Reorder.Item key={bookmark.id} value={bookmark} dragListener={false} dragControls={controls}>
      <Accordion
        expanded={expanded}
        className="accordion dark bookmark"
        TransitionProps={{
          onEnter: () => setShowDetail(true),
          onExited: () => setShowDetail(false)
        }}
      >
        <AccordionSummary expandIcon={null}>
          <div className="flex justify-between items-center w-full text-lg font-bold">
            <div className="grabHandle me-2" onPointerDown={(e) => controls.start(e)}></div>
            <span className="grow-1 basis-0">{bookmark.title}</span>
            <div // cant use button inside button, use div instead
              className={`ms-2 text-center w-16 ${dir == "go" && showDetail ? "border-1 border-blue-400 rounded-full bg-blue-400": BORDER_BTN_BLUE} ${bookmark.go.stops.length == 0 ? DIV_DISABLED_BTN : ""}`}
              onClick={() => {
                if (bookmark.go.stops.length > 0) {
                  toggleExpanded("go")
                }
              }}
            >
              {bookmark.go.title}
            </div>
            <div
              className={`ms-2 text-center w-16 ${dir == "back" && showDetail ? "border-1 border-blue-400 rounded-full bg-blue-400": BORDER_BTN_BLUE} ${bookmark.back.stops.length == 0 ? DIV_DISABLED_BTN : ""}`}
              onClick={() => {
                if (bookmark.back.stops.length > 0) {
                  toggleExpanded("back")
                }
              }}
            >
              {bookmark.back.title}
            </div>
          </div>
        </AccordionSummary>
        {showDetail && <AccordionDetails>
          {generateDetailsElms()}
        </AccordionDetails>}
      </Accordion>
    </Reorder.Item>
  );
}

const DIV_DISABLED_BTN = " hover:dark:bg-transparent hover:active:dark:bg-transparent dark:text-zinc-600 hover:dark:border-zinc-600 hover:active:dark:border-zinc-600 cursor-default"