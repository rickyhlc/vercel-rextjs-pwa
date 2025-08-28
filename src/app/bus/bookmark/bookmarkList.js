"use client";

import { useDataContext } from "./dataProvider";
import BookmarkItem from "./bookmarkItem";
import BookmarkEditor from "./bookmarkEditor";
import { CircularProgress } from '@mui/material';

export default function BoomkarkList() {

  console.log("BookmarkList");

  const { bookmarks, bookmarkStructures, editMode } = useDataContext();

  if (bookmarks) {
    if (editMode) {
      return <>
        {bookmarkStructures.map(bm => <BookmarkEditor key={`${bm.id}-${bm.tmpId}`} bookmark={bm} />)}
      </>;
    } else {

      return <>
        {bookmarks.length ? (
           bookmarks.map(bm => <BookmarkItem key={bm.id} bookmark={bm} />)
         ) : (
          <div className="text-center mt-20">Bookmark is empty...</div>
        )}
      </>;
    }
  } else {
    return <div className="text-center mt-20"><CircularProgress size={32} /></div>;
  }
}