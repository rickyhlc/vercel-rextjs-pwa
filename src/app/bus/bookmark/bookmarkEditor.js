"use client";

import TextField from '@/components/textField';
import { useDataContext } from "./dataProvider";
import BinIcon from "@/icons/bin";
import { PLAIN_BTN_BLUE } from "@/lib/utils";

/**
 * bookmark {
 *   id: 1,
 *   tmpId: 2, (require either id or tmpId)
 *   title: "ust",
 *   delete: true, (optional)
 * }
 */
export default function BookmarkEditor({ bookmark }) {

  const { updateBookmarkStructure } = useDataContext();

  return (
    <div className="flex items-center py-2 px-4">
      <TextField
        className="grow-1"
        value={bookmark.title}
        onChange={(e) => updateBookmarkStructure({ ...bookmark, title: e.target.value })}
      />
      <button className={`rounded-full p-1 ms-2 ${PLAIN_BTN_BLUE}`} onClick={() => updateBookmarkStructure({ ...bookmark, delete: true })}>
        <BinIcon className="w-6 h-6 text-inherit" />
      </button>
    </div>
  );
}