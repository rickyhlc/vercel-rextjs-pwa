"use client";

import { CAT_LIST, FLAG_LIST } from "./indexedDB";
import ResetIcon from "@/icons/reset";
import { getFlagIcon, BTN_BLUER } from "@/lib/utils";
import { Divider, NativeSelect, Checkbox } from '@mui/material';

export default function FilterPanel({ flagFilter, onSetFlagFilter, catFilter, onSetCatFilter, anyTimeFilter, onSetAnyTimeFilter, onClose }) {

  function setFlagFilter(f) {
    if (Object.values(f).find(v => v)) {
      onSetFlagFilter(f);
    } else {
      onSetFlagFilter(null);
    }
  }

  function setCatFilter(cat) {
    if (cat) {
      onSetCatFilter(cat);
    } else {
      onSetCatFilter(null);
    }
  }

   return (
    <>
      <Divider variant="middle">
        <span className="text-xs">Filter</span>
      </Divider>
      <div className="ps-[16px] pt-4">Only show this category:</div>
      <div className="flex items-center flex-wrap px-[16px] py-2">
        <NativeSelect
          value={catFilter || ""}
          className="w-1/2"
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option key="no_filter" value={""}>SHOW ALL</option>
          {CAT_LIST.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </NativeSelect>
        <label className="flex items-center w-1/2">
          <Checkbox color="primary" checked={anyTimeFilter} onChange={e => onSetAnyTimeFilter(e.target.checked)}/>
          <span>All time</span>
        </label>
      </div>
      <div className="ps-[16px] pt-4">Only include this item:</div>
      <div className="flex items-center flex-wrap ps-[4px] pe-[16px] py-2">
        {FLAG_LIST.map(f => (
          <label key={f.id} className="flex items-center w-1/2">
            <Checkbox color="primary" checked={flagFilter?.[f.id] === "oi" || false} onChange={e => {
              let _flagFilter = flagFilter ? {...flagFilter} : {};
              if (e.target.checked) {
                FLAG_LIST.map(v => {
                  if (_flagFilter[v.id] === "oi") {
                    _flagFilter[v.id] = null;
                  }
                });
                _flagFilter[f.id] = "oi";
              } else {
                _flagFilter[f.id] = null;
              }
              setFlagFilter(_flagFilter);
            }}/>{f.name}{getFlagIcon(f, "ms-1 w-4 h-4 text-inherit")}
          </label>
        ))}
      </div>
      <div className="ps-[16px] pt-4">And exclude these items:</div>
      <div className="flex items-center flex-wrap ps-[4px] pe-[16px] py-2">
        {FLAG_LIST.map(f => (
          <label key={f.id} className="flex items-center w-1/2">
            <Checkbox color="primary" checked={flagFilter?.[f.id] === "e" || false} onChange={e => {
              let _flagFilter = flagFilter ? {...flagFilter} : {};
              _flagFilter[f.id] = e.target.checked ? "e" : null;
              setFlagFilter(_flagFilter);
            }}/>{f.name}{getFlagIcon(f, "ms-1 w-4 h-4 text-inherit")}
          </label>
        ))}
      </div>
      <div className="flex items-center px-[16px] pb-4">
        <button
          className={`ms-auto rounded-full p-2 ${BTN_BLUER}`}
          onClick={() => {
            setFlagFilter({});
            onSetAnyTimeFilter(false);
            setCatFilter(null);
            onClose();
          }}
        >
          <ResetIcon className="w-8 h-8 text-inherit"/>
        </button>
      </div>
    </>
  );
}