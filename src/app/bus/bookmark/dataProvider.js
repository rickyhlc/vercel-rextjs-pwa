"use client";

import { useContext, createContext, useEffect, useRef, useState } from "react";
import { initDB } from "@/app/bus/indexedDB";

export const DataContext = createContext({});

export function DataProvider({ children }) {

  console.log("DataProvider");

  const dbRef = useRef(null);
  const [bookmarks, setBookmarks] = useState(null);
  const [stopInfoMap, setStopInfoMap] = useState({});

  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      db.getBookmarks().then(setBookmarks);
    });
    return () => dbRef.current?.close();
  }, []);

  function loadBookmarkStopInfo(bookmarkId) {
    let bm = bookmarks.find(b => b.id === bookmarkId);
    let map = {};
    bm.children.forEach(c => c.list.forEach(r => map[r.stop] = true));
    let stopList = Object.keys(map).filter(s => !stopInfoMap[s]);
    Promise.all(stopList.map(s => getStopInfoData(s))).then(res => {
      let newMap = { ...stopInfoMap };
      res.forEach((r,i) => {
        newMap[stopList[i]] = r;
      });
      setStopInfoMap(newMap);
    });
  }

  return <DataContext.Provider value={{ db: dbRef.current, bookmarks, loadBookmarkStopInfo, stopInfoMap }}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  return useContext(DataContext);
}

async function getStopInfoData(stop) {
  console.log("Fetching stop info data...");
  try {
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${stop}`, { next: { revalidate: 86400 } });
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching stop info data:", error);
    return { error };
  }
}