"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PLAIN_BTN_BLUE, getRouteURL } from "@/lib/utils";
import BookmarkSolidIcon from "@/icons/bookmarkSolid";
import ErrorIcon from "@/icons/error";
import StopETA from "./stopETA";
import RouteNum from "./routeNum";
import { useDataContext } from "./bookmark/dataProvider";

/**
 * all routes must be of the same stop
 * routes [{ 
 *   "company": "KMB",
 *   "route": "170",
 *   "bound": "O",
 *   "serviceType": "1",
 * }]
 */
export default function StopETAs({ stop, routes, showRoute, bookmarkId, direction, className }) {

  const router = useRouter();
  const { removeBookmark } = useDataContext();

  const [etasData, setETAsData] = useState(null);

  useEffect(() => {
    let keepPolling = true;

    setETAsData(routes.map(r => ({
      ...r,
      etas: [],
    })));

    const getMinutes = (eta, now) => {
      if (eta) {
        let m = (new Date(eta).getTime() - now) / 60000;
        return m >= 1 ? Math.floor(m) : m > 0 ? "<1" : "0";
      } else {
        return "-";
      }
    }
    
    const loadData = async () => {
      if (!keepPolling)  {
        return;
      }
      
      // use stop-eta to get all by one api call if there are multiple routes
      let res = routes.length  === 1 ? await getStopRouteETAsData(stop, routes[0].route, routes[0].serviceType) : await getStopETAsData(stop);
      const now = Date.now();

      // update after getting api response
      setETAsData(prev => {
        let list = prev.map(p => ({ ...p, error: res.error }));
        if (res.error) {  // still need to refresh the minutes field for prevent data
          list.forEach(item => {
            item.etas = item.etas.map(eta => ({
              ...eta,
              minutes: getMinutes(eta.eta, now)
            }));
          });
        } else {  // update eta data
          list.forEach(item => {
            let newItems = res.filter(r => r.route === item.route && r.dir === item.bound && r.service_type == item.serviceType);
            newItems.sort((a, b) => a.eta_seq > b.eta_seq);
            item.etas = newItems.map(newItem => ({
              time: newItem.eta,
              minutes: getMinutes(newItem.eta, now),
              remark: newItem.rmk_tc
            }));
          });
        }
        return list;
      });

      if (keepPolling) {
        setTimeout(loadData, 30000);
      }
    }

    loadData();
    return () => keepPolling = false;
  }, [routes]);

  return (
    <>
      {etasData && etasData.map(item => (
        <div key={`${item.route}-${item.serviceType}`} className={className || "px-2 pt-2 flex items-center"}>
          {showRoute ? (
            <button className={`flex items-center grow-1 ${PLAIN_BTN_BLUE}`} onClick={() => router.push(getRouteURL(item.company, item.route, item.bound, item.serviceType))}>
              <RouteNum company={item.company} route={item.route} serviceType={item.serviceType} />
              <StopETA etas={item.etas} />
              {item.error ? <ErrorIcon className="w-8 h-8 text-amber-500" /> : null}
            </button>
          ) : (
            <>
              <StopETA etas={item.etas} />
              {item.error ? <ErrorIcon className="w-8 h-8 text-amber-500" /> : null}
            </>
          )}
          {bookmarkId && (
            <button className={`rounded-full p-1 ${PLAIN_BTN_BLUE}`} onClick={() => removeBookmark(bookmarkId, direction, item.company, stop, item.route, item.serviceType, item.bound)} >
              <BookmarkSolidIcon className="w-6 h-6 text-inherit" />
            </button>
          )}
        </div>
      ))}
    </>
  );
}

/**
 * data [{
 *   "co": "KMB",
 *   "route": "1",
 *   "dir": "O",                          ***eta apis use dir instead of bound***
 *   "service_type": 1,                   ***eta apis use int instead of string***
 *   "seq": 9,
 *   "dest_tc": "尖沙咀碼頭",
 *   "dest_sc": "尖沙咀码头",
 *   "dest_en": "STAR FERRY",
 *   "eta_seq": 1,
 *   "eta": "2025-08-22T11:25:26+08:00",  ***can be null***
 *   "rmk_tc": "",
 *   "rmk_sc": "",
 *   "rmk_en": "",
 *   "data_timestamp": "2025-08-22T11:20:17+08:00"
 * }]
 */
async function getStopETAsData(stop) {
  console.log("Fetching stop eta data...");
  try {
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${stop}`);
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching stop eta data:", error);
    return { error };
  }
}
async function getStopRouteETAsData(stop, route, serviceType) {
  console.log("Fetching stop route eta data...");
  try {
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stop}/${route}/${serviceType}`);
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching stop toute eta data:", error);
    return { error };
  }
}