"use client";

import { useState, useEffect } from "react";
import { CAT_LIST } from "./indexedDB";
import UploadIcon from "@/icons/upload";
import DownloadIcon from "@/icons/download";
import ResetIcon from "@/icons/reset";
import { getCosts, saveCosts, checkHasBackup } from "@/actions/bank";
import { dateFormat, timeFormat, getFlagIcon, PLAIN_BTN_BLUE, BTN_BLUER } from "@/lib/utils";
import { Divider, CircularProgress, Checkbox } from '@mui/material';

export default function MorePanel({ filter, setFilter, localDB, flags }) {

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

      // console.log("~~~", await getCosts());
      // console.log("~~~", await checkHasBackup());
      // console.log("~~~", JSON.stringify(await saveCosts([{ a: 64564 }, { a: 5 }])));
      // console.log("~~~", await getCosts());
      // console.log("~~~", await checkHasBackup());
    
    async function backupHandler() {
      if (!backupDate || confirm("Are you sure you want to restore the backup? This will overwrite your current data.")) {
        setBackupDate(null);
        const data = await localDB.getCosts();
        const res = await saveCosts(data);
        if (res.success) {
          setBackupDate(new Date(res.date));
        }
      }
    }
    async function restoreHandler() {
      if (confirm("Are you sure you want to restore the backup? This will overwrite your current data.")) {
        const data = await getCosts();
        await localDB.clearAllCosts();
        await localDB.saveCosts(data);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TODOricky refresh screen");
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
      <div className="flex gap-4 items-center px-[16px] py-2">
        {flags.map(f => (
          <label key={f.id} className="flex items-center w-1/2">
            <Checkbox color="primary" checked={filter[f.id] || false} onChange={e => {
              // let c = { ...data };
              // if (e.target.checked) {
              //   c[f.id] = true;
              // } else {
              //   delete c[f.id];
              // }
              // setData(c);
            }}/>
          </label>
        ))}
      </div>
      <div className="flex items-center px-[16px] py-2">
        <button
          className={`ms-auto rounded-full p-2 ${BTN_BLUER}`}
          disabled={!flags}
          onClick={() => setFilter({})}
        >
          <ResetIcon sizeClass="w-8 h-8"/>
        </button>
      </div>
    </>
  );
}