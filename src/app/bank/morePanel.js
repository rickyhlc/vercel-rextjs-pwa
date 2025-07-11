"use client";

import { useState, useEffect } from "react";
import { CAT_LIST, FLAG_LIST } from "./indexedDB";
import UploadIcon from "@/icons/upload";
import DownloadIcon from "@/icons/download";
import ResetIcon from "@/icons/reset";
import { getCosts, saveCosts, checkHasBackup } from "@/actions/bank";
import { dateFormat, timeFormat, getFlagIcon, PLAIN_BTN_BLUE, BTN_BLUER } from "@/lib/utils";
import { Divider, CircularProgress, NativeSelect, Checkbox } from '@mui/material';

export default function MorePanel({ flagFilter, onSetFlagFilter, catFilter, onSetCatFilter, anyTimeFilter, onSetAnyTimeFilter, onRefresh, onClose, localDB }) {

  const [backupDate, setBackupDate] = useState(null); // null = loading, false = no backup date
  useEffect(() => {
    checkHasBackup().then(res => {
      if (res?.error) {
        console.error("Error checking backup:", res.error);
      } else {
        setBackupDate(res ? new Date(res.date) : false);
      }
    });
  }, []);

  async function backupHandler() {
    if (!backupDate || confirm("Are you sure you want to overwrite the previous backup?")) {
      setBackupDate(null);
      const data = await localDB.getCosts();
      const res = await saveCosts(data);
      if (res.success) {
        setBackupDate(new Date(res.date));
        alert("Backup created");
        onClose();
      }
    }
  }
  async function restoreHandler() {
    if (confirm("Are you sure you want to restore the backup? This will overwrite your current data.")) {
      const data = await getCosts();
      await localDB.clearAllCosts();
      await localDB.saveCosts(data);
      onRefresh();
      alert("Data restored");
      onClose();
    }
  }

  let dateElm;
  if (backupDate) {
    dateElm = <span>{`${dateFormat(backupDate)} ${timeFormat(backupDate, "second")}`}</span>;
  } else if (backupDate === null) {
    dateElm = <CircularProgress size={16} />;
  } else {
    dateElm = <span>-</span>;
  }

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
        <span className="text-xs">Backup</span>
      </Divider>
      <div className="flex items-center px-[16px] py-2">
        <span className="me-2">Last backup:</span>{dateElm}
        <button className={`ms-auto rounded-full p-2 ${PLAIN_BTN_BLUE}`} disabled={!localDB || backupDate === null} onClick={backupHandler}>
          <UploadIcon className="w-6 h-6 text-inherit"/>
        </button>
        <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} disabled={!localDB || !backupDate} onClick={restoreHandler}>
          <DownloadIcon className="w-6 h-6 text-inherit"/>
        </button>
      </div>
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