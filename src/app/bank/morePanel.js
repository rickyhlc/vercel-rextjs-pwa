"use client";

import { useState, useEffect } from "react";
import { CAT_LIST } from "./indexedDB";
import UploadIcon from "@/icons/upload";
import DownloadIcon from "@/icons/download";
import { getCosts, saveCosts, checkHasBackup } from "@/actions/bank";
import { dateFormat, getFlagIcon, PLAIN_BTN_BLUE } from "@/lib/utils";

export default function MorePanel({ onSetFilter }) {

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

   return (
    <>
      <div className="flex gap-4 items-center px-[16px] py-2">
        <span>Last backup date: {backupDate ? dateFormat(backupDate) : "-"}</span>
        <button className={`ms-auto rounded-full p-2 ${PLAIN_BTN_BLUE}`} disabled={backupDate === null}>
          <UploadIcon className="w-6 h-6 text-inherit"/>
        </button>
        <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} disabled={!backupDate}>
          <DownloadIcon className="w-6 h-6 text-inherit"/>
        </button>
      </div>
      <div className="flex gap-4 items-center px-[16px] py-2">
        TODOricky
      </div>
    </>
  );
}