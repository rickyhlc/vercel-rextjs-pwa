"use client";

import { useDataContext } from "./dataProvider";
import BookmarkItem from "./bookmarkItem";
import { CircularProgress } from '@mui/material';

export default function BoomkarkList() {

  console.log("BookmarkList");
//TODOricky
  const { db, bookmarks } = useDataContext();

  if (bookmarks) {
    return <>
      {bookmarks.map(bm => <BookmarkItem key={bm.id} data={bm} />)}
    </>;
  } else {
    return <div className="text-center mt-20"><CircularProgress size={32} /></div>;
  }
}