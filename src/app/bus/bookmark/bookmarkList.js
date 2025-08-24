"use client";

import { useDataContext } from "./dataProvider";

export default function BoomkarkList() {

  console.log("BookmarkList");
//TODOricky
  const db = useDataContext();
  if (db) {
    let bookmarks = db.getBookmarks().then(console.log);
    console.log(bookmarks);
  } else {
    return <></>;
  }

  return (
    <>
    </>
  );
}