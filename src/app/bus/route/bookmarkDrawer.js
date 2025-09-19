"use client";

import { useState } from "react";
import BottomDrawer from "@/components/bottomDrawer";
import BookmarkSolidIcon from "@/icons/bookmarkSolid";
import BookmarkIcon from "@/icons/bookmark";
import { useDataContext } from "./dataProvider";
import { PLAIN_BTN_BLUE } from "@/lib/utils";

export default function BookmarkDrawer() {

  const { bookmarks: allBookmarks, toggleBookmark, checkBookmarks, setBookmarkDrawerData, bookmarkDrawerData } = useDataContext();
  const {company, stop, route, serviceType, bound} = bookmarkDrawerData || {};
  const bookmarks = checkBookmarks(company, stop, route, serviceType, bound);

  function hasBookmark(bm, dir) {
    return bookmarks.find(b => b.id === bm.id && b.direction === dir);
  }

  function updateBookmark(bm, dir) {
    toggleBookmark(bm.id, dir, company, stop, route, serviceType, bound);
  }

  return (
    <BottomDrawer isOpen={bookmarkDrawerData} onCancel={() => setBookmarkDrawerData(null)}>
      <div className={allBookmarks.length ? "p-4" : "p-4 flex justify-center"}>
        {allBookmarks.length ? allBookmarks.map(bm => (
          <div className="flex items-center p2" key={bm.id}>
            <span className="me-auto">{bm.title}</span>
            <button className={`me-2 flex rounded-full py-1 px-2 ${PLAIN_BTN_BLUE}`} onClick={() => updateBookmark(bm, "go")}>
              {hasBookmark(bm, "go") ? (
                <BookmarkSolidIcon className="w-6 h-6 text-inherit" />
              ) : (
                <BookmarkIcon className="w-6 h-6 text-inherit" />
              )}
              <span className="ms-2">{bm.go.title}</span>
            </button>
            <button className={`flex rounded-full py-1 px-2 ${PLAIN_BTN_BLUE}`} onClick={() => updateBookmark(bm, "back")}>
              {hasBookmark(bm, "back") ? (
                <BookmarkSolidIcon className="w-6 h-6 text-inherit" />
              ) : (
                <BookmarkIcon className="w-6 h-6 text-inherit" />
              )}
              <span className="ms-2">{bm.back.title}</span>
            </button>
          </div>
        )) : (
          <span>沒有收藏夾, 請先在主頁創建</span>
        )}
      </div>
    </BottomDrawer>
  );
}