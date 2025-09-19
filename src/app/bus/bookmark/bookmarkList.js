"use client";

import { useEffect, useRef } from "react";
import { useDataContext } from "./dataProvider";
import BookmarkItem from "./bookmarkItem";
import BookmarkEditor from "./bookmarkEditor";
import { CircularProgress } from '@mui/material';

export default function BoomkarkList() {

  console.log("BookmarkList");

  const { bookmarks, bookmarkStructures, keyboardTrigger, editMode } = useDataContext();
  const newTextFieldRef = useRef({});

  // show keyboard automatically when clicking the add button
  useEffect(() => {
    setTimeout(() => {
      newTextFieldRef.current?.[keyboardTrigger]?.focus();
    });
  }, [keyboardTrigger]);

  if (bookmarks) {
    if (editMode) {
      return <>
        {bookmarkStructures.map(bm => <BookmarkEditor key={`${bm.id}-${bm.tmpId}`} bookmark={bm} ref={tf => newTextFieldRef.current[bm.tmpId] = tf} />)}
      </>;
    } else {

      return <>
        {bookmarks.length ? (
           bookmarks.map(bm => <BookmarkItem key={bm.id} bookmark={bm} />)
         ) : (
          <div className="text-center mt-20">現在沒有收藏夾, 你可以點下編輯按鈕來創建新的收藏夾</div>
        )}
      </>;
    }
  } else {
    return <div className="text-center mt-20"><CircularProgress size={32} /></div>;
  }
}