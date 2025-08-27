"use client";

import { useDataContext } from "./dataProvider";
import EditIcon from "@/icons/edit";
import { PLAIN_BTN_BLUE } from "@/lib/utils";

export default function Title() {

  console.log("Title");
  const { startEdit, editMode } = useDataContext();

  return (
    <>
      <span className="text-xl grow-1">收藏</span>
      {!editMode &&
        <button className={`rounded-full p-1 ${PLAIN_BTN_BLUE}`} onClick={startEdit}>
          <EditIcon className="w-6 h-6 text-inherit" />
        </button>
      }
    </>
  );
}