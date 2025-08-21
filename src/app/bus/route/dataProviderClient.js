"use client";

import { createContext } from "react";

export const DataContext = createContext({});

export function DataProviderClient({ data, children }) {

  console.log("DataProviderClient");

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}