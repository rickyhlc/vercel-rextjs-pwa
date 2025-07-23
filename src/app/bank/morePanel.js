"use client";

import { useState, useEffect } from "react";
import UploadIcon from "@/icons/upload";
import DownloadIcon from "@/icons/download";
import { getCosts, saveCosts, checkHasBackup } from "@/actions/bank";
import { getServerPushSubscriptions } from "@/actions/scheduleJob";
import { dateFormat, timeFormat, PLAIN_BTN_BLUE } from "@/lib/utils";
import { Divider, CircularProgress } from '@mui/material';
getServerPushSubscriptions
export default function MorePanel({  onRefresh, onClose, localDB }) {

  //backup section
  const [backupDate, setBackupDate] = useState(null); // null = loading, false = no backup date
  useEffect(() => {
    checkHasBackup().then(res => {
      if (res?.error) {
        console.error("Error checking backup:", res.error);
      } else {
        setBackupDate(res ? new Date(res.date) : false);
      }
    });
    getServerPushSubscriptions().then(res => {
      if (res?.error) {
        console.error("Error fetching server push subscriptions:", res.error);
      } else {
        console.log("~~~~~~~~~~~~~", res);
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

  //notification section

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
        <span className="text-xs">Notification</span>
      </Divider>

      <div className="flex items-center px-[16px] pb-4">

      </div>
    </>
  );
}