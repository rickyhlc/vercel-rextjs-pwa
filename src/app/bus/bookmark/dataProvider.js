"use client";

import { useContext, createContext, useEffect, useRef, useState } from "react";
import { initDB } from "@/app/bus/bookmark/indexedDB";

export const DataContext = createContext({});

export function DataProvider({ children }) {

  console.log("DataProvider");

  const idGeneratorRef = useRef(1);
  const dbRef = useRef(null);
  const [bookmarks, setBookmarks] = useState(null);
  const [stopInfoMap, setStopInfoMap] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bookmarkStructures, setBookmarkStructures] = useState(null);
  const [bmDeleteId, setBmDeleteId] = useState(null);

  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      db.getBookmarks().then(setBookmarks);
    });
    return () => dbRef.current?.close();
  }, []);

  function loadBookmarkStopInfo(bookmarkId, direction) {
    let bm = bookmarks.find(b => b.id === bookmarkId);
    let map = {};
    bm[direction].stops.forEach(s => map[s.stop] = true);
    let stopList = Object.keys(map).filter(s => !stopInfoMap[s]);
    Promise.all(stopList.map(s => getStopInfoData(s))).then(res => {
      let newMap = { ...stopInfoMap };
      res.forEach((r,i) => newMap[stopList[i]] = r);
      setStopInfoMap(newMap);
    });
  }

  async function saveEdit() {
    let promises = (bmDeleteId || []).map(id => dbRef.current.deleteBookmark(id));
    let { adds = [], updates = [] } = Object.groupBy(bookmarkStructures, (s => s.tmpId ? "adds" : "updates"));
    adds = adds.map(a => ({
      title: a.title,
      go: {
        title: "往",
        stops: []
      },
      back: {
        title: "返",
        stops: []
      },
    }));console.log(updates, bookmarks);
    updates = updates.map(u => ({
      ...bookmarks.find(b => u.id === b.id),
      title: u.title,
    }));
    promises.push(dbRef.current.saveBookmarks([...adds, ...updates]));

    try {
      const res = await Promise.all(promises);
      setBookmarks(await dbRef.current.getBookmarks());
      cancelEdit();
    } catch(e) {
      console.error(e);
    }
  }

  function cancelEdit() {
    setBookmarkStructures(null);
    setBmDeleteId(null);
    setEditMode(false);
  }

  function startEdit() {
    setBookmarkStructures(bookmarks.map(bm => ({ id: bm.id, title: bm.title })));
    setBmDeleteId([]);
    setEditMode(true);
  }

/**
 * newBookmark {
 *   id: 1,           update case
 *   title: "ust",
 * }
 * {
 *   tmpId: 1,
 *   title: "ust",    create case
 * }
 * {
 *   id: 4,           delete case
 *   delete: true,
 * }
 */
  function updateBookmarkStructure(bmStructure) {
    if (bmStructure.id || bmStructure.tmpId) {
      let list = [...bookmarkStructures];
      const ind = bmStructure.id ? list.findIndex(s => s.id === bmStructure.id) : list.findIndex(s => s.tmpId === bmStructure.tmpId);
      if (ind != -1) {
        if (bmStructure.delete) {
          if (bmStructure.id) {
            setBmDeleteId([...bmDeleteId, bmStructure.id]);
          }
          list.splice(ind, 1);
        } else {
          list[ind] = {...bmStructure};
        }
        setBookmarkStructures(list);
      }
    } else {
      idGeneratorRef.current++;
      setBookmarkStructures([...bookmarkStructures, {...bmStructure, tmpId: idGeneratorRef.current}]);
    }
  }

  const data = {
    bookmarks,
    loadBookmarkStopInfo,
    stopInfoMap,
    editMode,
    startEdit,
    saveEdit,
    cancelEdit,
    updateBookmarkStructure,
    bookmarkStructures
  }

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
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