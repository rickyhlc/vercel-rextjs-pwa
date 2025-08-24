"use client";

import { useState, useEffect } from "react";
import ErrorIcon from "@/icons/error";
import StopETA from "./stopETA";
import RouteNum from "./routeNum";

/**
 * all routes must be of the same stop
 * routes [{ 
 *   "company": "KMB",
 *   "route": "170",
 *   "bound": "O",
 *   "serviceType": "1",
 * }]
 */
export default function StopETAs({ stop, routes, showRoute }) {

  const [etasData, setETAsData] = useState(routes.map(r => ({
    ...r,
    etas: [],
    // loading: true
  })));

  useEffect(() => {
    let keepPolling = true;

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
      let res = routes.length  === 1 ? await getStopETAsData(stop) : await getStopRouteETAsData(stop, route, serviceType);
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
  }, []);

  return (
    <>
      {etasData.map(item => (
        <div key={`${item.route}-${item.serviceType}`} className="px-2 py-2 flex items-center">
          {showRoute && <RouteNum company={item.company} route={item.route} serviceType={item.serviceType} />}
          <StopETA etas={item.etas} />
          {item.error ? <ErrorIcon className="w-8 h-8 text-amber-500" /> : null}
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
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
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
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stop}/${route}/${serviceType}`);
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching stop toute eta data:", error);
    return { error };
  }
}