"use client";

import SearchIcon from "@/icons/search";
import { useDataContext } from "./dataProvider";

export default function Title() {

  console.log("Title");
  const { searchText } = useDataContext();

  return (
    <>
      <SearchIcon className="w-4 h-4 text-inherit me-2" />
      <span className="text-xl grow-1">
        尋找路線: {searchText}
      </span>
    </>
  );
}