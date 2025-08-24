"use client";

import { useContext, createContext, useEffect, useState } from "react";
import { initDB } from "@/app/bus/indexedDB";

export const DataContext = createContext({});

export function DataProvider({ children }) {

  console.log("DataProvider");

  const [db, setDB] = useState(null);
  useEffect(() => {
    initDB().then(setDB);
    return () => db?.close();
  }, []);

  return <DataContext.Provider value={db}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  return useContext(DataContext);
}