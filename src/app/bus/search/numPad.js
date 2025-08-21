"use client";

import { PLAIN_BTN_BLUE } from "@/lib/utils";
import BackIcon from "@/icons/back";
import RefreshIcon from "@/icons/refresh";
import { useDataContext } from "./dataProvider";

export default function NumPad() {

  console.log("NumPad");
  
  const { searchText, setSearchText, apiData: { filteredList } } = useDataContext();

  function handleBack() {
    setSearchText(searchText.slice(0, -1));
  }

  function handleClear() {
    setSearchText("");
  }

  const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const allNumSet = new Set(nums);
  const charSet = new Set();
  const numSet = new Set();
  filteredList.forEach(r => {
    let c = r.route.charAt(searchText.length);
    allNumSet.has(c) ? numSet.add(c) : charSet.add(c);
  });
  charSet.delete("");
  const chars = [...charSet].sort();;
 
  return (
    <div className="flex items-start py-2">
      <div className="flex flex-wrap items-start basis-1/2">
        {chars.map(lbl =>
          <button
            key={lbl}
            onClick={() => setSearchText(searchText + lbl)}
            className={`${PLAIN_BTN_BLUE} grow-0 basis-1/3 py-2`}
          >
            {lbl}
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-start basis-1/2">
        {nums.map(lbl =>
          <button
            key={lbl}
            onClick={() => setSearchText(searchText + lbl)}
            className={`${PLAIN_BTN_BLUE} grow-0 basis-1/3 py-2`}
            disabled={!numSet.has(lbl)}
          >
            {lbl}
          </button>
        )}
        <button className={`${PLAIN_BTN_BLUE} grow-0 basis-1/3 py-2`} onClick={handleBack}>
          <BackIcon className="w-6 h-6 text-inherit m-auto" />
        </button>
        <button className={`${PLAIN_BTN_BLUE} grow-0 basis-1/3 py-2`} onClick={handleClear}>
          <RefreshIcon className="w-5 h-5 text-inherit m-auto" />
        </button>
      </div>
    </div>
  );
}