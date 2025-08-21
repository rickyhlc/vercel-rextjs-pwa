"use client";

import { useState, useEffect, useTransition } from "react";
import AddIcon from "@/icons/add";
import BinIcon from "@/icons/bin";
import CostEditor from "./costEditor";
import { getServerPushSubscriptions, subscribeServerPush, unsubscribeServerPush } from "@/actions/scheduleJob";
import { CAT_LIST, CAT_TYPE_LIST, FLAG_LIST } from "@/app/bank/constant";
import { getPushSubscription, PLAIN_BTN_BLUE, BORDER_BTN_BLUE } from "@/lib/utils";
import { Divider, TextField, CircularProgress } from '@mui/material';

export default function NotificationSection({ onClose }) {

  const [saving, startSaving] = useTransition();
  const [notifications, setNotifications] = useState(null); // null = loading, [] = no notifications
  const [selectedNotification, _setSelectedNotification] = useState(null);
  const [notificationName, setNotificationName] = useState("");
  const [notificationSchedules, setNotificationSchedules] = useState("");

  function loadNotifications() {
    getServerPushSubscriptions().then(res => {
      if (res?.error) {
        console.error("Error fetching server push subscriptions:", res.error);
      } else {
        setNotifications(res)
      }
    });
  }
  useEffect(loadNotifications, []);

  function setSelectedNotification(notif) {
    if (notif === true) {
      _setSelectedNotification({
        notificationType: "bank",
        flags: [],
        cat: CAT_LIST[0],
        type: CAT_TYPE_LIST[CAT_LIST[0]][0],
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

  async function deleteNotification(notifId) {
    const res = await unsubscribeServerPush(notifId);
    if (res.error) {
      alert(res.error);
    } else {
      setNotifications(notifications.reduce((total, cur) => {
        if (cur._id !== notifId) {
          total.push(cur);
        }
        return total;
      }, []));
      setSelectedNotification(null);
    }
  }

  let notificationElm;
  if (selectedNotification) {
    notificationElm = <>
      <div className="flex items-center px-[16px] py-2 gap-4">
        <TextField
          label="Name"
          className="grow-1 basis-0"
          value={notificationName}
          onChange={(e) => setNotificationName(e.target.value) }
          disabled={saving}
        />
        <div className="flex items-center grow-1 basis-0">
          <TextField
            label="Schedules"
            className="grow-1"
            placeholder="eg. 31, DAY0, 21/0"
            value={notificationSchedules}
            onChange={(e) => setNotificationSchedules(e.target.value) }
            disabled={saving}
          />
          {selectedNotification.id &&
            <button
              className={`rounded-full p-2 ms-2 ${PLAIN_BTN_BLUE}`}
              onClick={() => deleteNotification(selectedNotification.id)}
            >
              <BinIcon className="w-6 h-6 text-inherit" />
            </button>
          }
        </div>
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
    notificationElm = <div className="flex flex-wrap items-center px-[16px] py-1">
      {notifications.map(notif => (
        <button
          key={notif._id}
          className={`truncate me-2 mb-2 py-1 px-2 ${BORDER_BTN_BLUE}`}
          onClick={() => setSelectedNotification(notif)}
        >
          {notif.data?.name}
        </button>
      ))}
    </div>;
  } else {
    notificationElm = <div className="mx-auto py-1">No data</div>;
  }
  if (!selectedNotification) {
    notificationElm = <>
      {notificationElm}
      <div className="flex items-center px-[16px] py-1">
        <span className="me-2 font-bold">Set new reminder</span>
        <button
            className={`ms-auto rounded-full p-1 ${PLAIN_BTN_BLUE}`}
            onClick={() => setSelectedNotification(true)}
          >
            <AddIcon className="w-4 h-4 text-inherit" />
          </button>
      </div>
    </>;
  }

  return (
    <>
      <Divider variant="middle" className="pb-1">
        <span className="text-xs">Reminder</span>
      </Divider>
      {notificationElm}
    </>
  );
}