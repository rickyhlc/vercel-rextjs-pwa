"use client";

import { useState, useEffect } from "react";
import { CAT_LIST } from "./indexedDB";
import UploadIcon from "@/icons/upload";
import DownloadIcon from "@/icons/download";
import { getCosts, saveCosts, checkHasBackup } from "@/actions/bank";
import { dateFormat, getFlagIcon, PLAIN_BTN_BLUE } from "@/lib/utils";

export default function MorePanel({ onSetFilter, localDB }) {

  const [backupDate, setBackupDate] = useState(null);
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
        console.log("Restoring data:", data);
      }
    }

   return (
    <>
      <div className="flex gap-4 items-center px-[16px] py-2">
        <span>Last backup date: {backupDate ? dateFormat(backupDate) : "-"}</span>
        <button className={`ms-auto rounded-full p-2 ${PLAIN_BTN_BLUE}`} disabled={!localDB || backupDate === null} onClick={backupHandler}>
          <UploadIcon className="w-6 h-6 text-inherit"/>
        </button>
        <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} disabled={!localDB || !backupDate} onClick={restoreHandler}>
          <DownloadIcon className="w-6 h-6 text-inherit"/>
        </button>
      </div>
      <div className="flex gap-4 items-center px-[16px] py-2">
        TODOricky
      </div>
    </>
  );
}