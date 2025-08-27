"use client";

import { createContext, useEffect, useState, useRef } from "react";
import { initDB } from "@/app/bus/indexedDB";

export const DataContext = createContext({});

export function DataProviderClient({ data, children }) {

  console.log("DataProviderClient");

  const dbRef = useRef(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkDrawerData, setBookmarkDrawerData] = useState(null); //{company, stop, route, bound, serviceType}

  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      db.getBookmarks().then(setBookmarks);
    });
    return () => dbRef.current?.close();
  }, []);

  function checkBookmarks(company, stop, route, serviceType, bound) {
    let list = [];
    bookmarks.forEach(b => {
      let tmp = b.go.stops.find(s => s.stop === stop)?.routes?.find(r => r.company === company && r.route === route && r.serviceType === serviceType && r.bound === bound);
      if (tmp) {
        list.push({id: b.id, direction: "go"})
      }
      tmp = b.back.stops.find(s => s.stop === stop)?.routes?.find(r => r.company === company && r.route === route && r.serviceType === serviceType && r.bound === bound);
      if (tmp) {
        list.push({id: b.id, direction: "back"})
      }
    })
    return list;
  }

  function toggleBookmark(bookmarkId, direction, company, stop, route, serviceType, bound) {
    let b = bookmarks.find(b => b.id === bookmarkId);
    b = {...b};
    b[direction] = {...b[direction]};
    b[direction].stops = [...b[direction].stops];
    let ind = b[direction].stops.findIndex(s => s.stop === stop);
    let newStop;
    if (ind != -1) {
      newStop = {...b[direction].stops[ind]};
      b[direction].stops.splice(ind, 1, newStop);
      newStop.routes = [...newStop.routes];
    } else {
      newStop = { stop, routes: [] };
      b[direction].stops.push(newStop);
    }
    ind = newStop.routes.findIndex(r => company === r.company && route === r.route && bound === r.bound && serviceType === r.serviceType);
    if (ind == -1) {
      newStop.routes.push({company, route, serviceType, bound});
    } else {
      newStop.routes.splice(ind, 1);
    }
    dbRef.current.saveBookmark(b).then(() => dbRef.current.getBookmarks().then(setBookmarks));
  }

  return (
    <DataContext.Provider value={{...data, bookmarks, toggleBookmark, checkBookmarks, setBookmarkDrawerData, bookmarkDrawerData}}>
      {children}
    </DataContext.Provider>
  );
}