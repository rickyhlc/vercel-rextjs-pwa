"use client";

import { useState, useEffect, useTransition } from "react";
import EditIcon from "@/icons/edit";
import CostEditor from "./costEditor";
import { getServerPushSubscriptions, subscribeServerPush } from "@/actions/scheduleJob";
import { CAT_LIST, CAT_TYPE_LIST, FLAG_LIST } from "./indexedDB";
import { getPushSubscription, PLAIN_BTN_BLUE } from "@/lib/utils";
import { Divider, TextField, CircularProgress } from '@mui/material';

export default function NotificationSection({ onClose }) {

  //notification section
  const [saving, startSaving] = useTransition();
  const [notifications, setNotifications] = useState(null); // null = loading, [] = no notifications
  const [selectedNotification, _setSelectedNotification] = useState(null);
  const [notificationName, setNotificationName] = useState("");
  const [notificationSchedules, setNotificationSchedules] = useState("");
  useEffect(() => {
    getServerPushSubscriptions().then(res => {
      if (res?.error) {
        console.error("Error fetching server push subscriptions:", res.error);
      } else {
        setNotifications(res)
      }
    });
  }, []);

  function setSelectedNotification(notif) {
    if (notif === true) {
      _setSelectedNotification({
        notificationType: "bank",
        flags: [],
        cat: CAT_LIST[0],
        type: CAT_TYPE_LIST[CAT_LIST[0]],
        value: null
      });
      setNotificationName("");
      setNotificationSchedules("");
    } else if (notif) {
      setNotificationName(notif.data?.name);
      setNotificationSchedules(notif.schedules?.join() || "");
      _setSelectedNotification({id: notif._id, ...notif.data, ...Object.fromEntries(notif.data?.flags.map(f => [f, true]))});
    } else {
      _setSelectedNotification(null);
      setNotificationName("");
      setNotificationSchedules("");
    }
  }

  async function handleSaveNotification(data) {
    // convert data to db format
    let notificationData = {
      _id: selectedNotification.id,
      data: {...data, flags: [], name: notificationName},
      schedules: notificationSchedules.split(",").map(s => s.trim())
    }
    delete notificationData.data.id;
    FLAG_LIST.forEach(field => {
      if (notificationData.data[field.id]) {
        notificationData.data.flags.push(field.id);
        delete notificationData.data[field.id];
      }
    });
    // save to db
    startSaving(async () => {
      const sub = await getPushSubscription(true);
      const res = await subscribeServerPush(sub, notificationData);
      if (res.error) {
        alert(res.error);
      } else {
        setSelectedNotification(null);
        onClose();
        if (res.partial) {
          alert("Invalid schedule format found, schedules are partially saved");
        }
      }
      return res;
    });
  }

  let notificationElm;
  if (selectedNotification) {
    notificationElm = <>
      <div className="flex items-center px-[16px] py-2 gap-8">
        <TextField
          label="Name"
          className="grow-1"
          value={notificationName}
          onChange={(e) => setNotificationName(e.target.value) }
          disabled={saving}
        />
        <TextField
          label="Schedules"
          className="grow-1"
          placeholder="eg. 31, DAY0, 21/0"
          value={notificationSchedules}
          onChange={(e) => setNotificationSchedules(e.target.value) }
          disabled={saving}
        />
      </div>
      <CostEditor
        onSaveAsync={handleSaveNotification}
        onCancel={() => setSelectedNotification(null)}
        cost={selectedNotification}
        valueRequired={false}
        saveDisabled={saving}
      />
      <div className="mb-4"></div>
    </>;
  } else if (!notifications) {
    notificationElm = <div className="mx-auto py-1"><CircularProgress size={16}/></div>;
  } else if (notifications.length) {
    notificationElm = notifications.map(notif => (
      <div key={notif._id} className="flex items-center px-[16px] py-1">
        <span className="me-2">{notif.data?.name}</span>
        <button
          className={`ms-auto rounded-full p-1 ${PLAIN_BTN_BLUE}`}
          onClick={() => setSelectedNotification(notif)}
        >
          <EditIcon className="w-4 h-4 text-inherit" />
        </button>
      </div>
    ));
  } else {
    notificationElm = <div className="mx-auto py-1">No data</div>;
  }

  return (
    <>
      <Divider variant="middle" className="pb-1">
        <span className="text-xs">Notification</span>
      </Divider>
      {notificationElm}
    </>
  );
}