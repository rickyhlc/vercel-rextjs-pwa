"use client";

import { useDataContext } from "./dataProvider";
import EditIcon from "@/icons/edit";
import BookmarkSolidIcon from "@/icons/bookmarkSolid";
import { PLAIN_BTN_BLUE } from "@/lib/utils";

export default function Title() {

  console.log("Title");
  const { startEdit, editMode } = useDataContext();

  return (
    <>
      <div className="text-xl grow-1 flex">
        <BookmarkSolidIcon className="me-2 w-6 h-6 text-inherit" />
        <span>收藏</span>
      </div>
      {!editMode &&
        <button className={`rounded-full p-1 ${PLAIN_BTN_BLUE}`} onClick={startEdit}>
          <EditIcon className="w-6 h-6 text-inherit" />
        </button>
      }
    </>
  );
}