"use client";

import { useDataContext } from "./dataProvider";
import NavBtn from "@/components/navBtn";
import CrossIcon from "@/icons/cross";
import TickIcon from "@/icons/tick";
import AddIcon from "@/icons/add";
import SearchIcon from "@/icons/search";
import { PLAIN_BTN_BLUE, BTN_BLUER, getSearchBusURL } from "@/lib/utils";

export default function BottomBar() {

  console.log("BottomBar");

  const { saveEdit, cancelEdit, bookmarkStructures, updateBookmarkStructure, editMode } = useDataContext();

  function addBookmark() {
    updateBookmarkStructure({ title: "" });
  }

  return (
    <>
      {editMode ? (
        <>
          <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} onClick={addBookmark}>
            <AddIcon className="w-8 h-8 text-inherit" />
          </button>
          <button className={`ms-auto rounded-full p-2 ${PLAIN_BTN_BLUE}`} onClick={cancelEdit}>
            <CrossIcon className="w-8 h-8 text-inherit" />
          </button>
          <button className={`ms-2 rounded-full p-2 ${BTN_BLUER}`} disabled={bookmarkStructures?.some(b => !b.title?.trim())} onClick={saveEdit}>
            <TickIcon className="w-8 h-8 text-inherit" />
          </button>
        </>
      ) : (
        <NavBtn path={getSearchBusURL()} extraClassName="ms-auto" iconElm={<SearchIcon className="w-8 h-8 text-inherit" />} />
      )}
    </>
  );
}