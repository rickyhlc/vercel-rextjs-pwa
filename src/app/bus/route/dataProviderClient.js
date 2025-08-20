"use client";

import { createContext, useState } from "react";

export const DataContext = createContext({});

export function DataProviderClient({ data, children }) {

  console.log("DataProviderClient");

  const [searchText, _setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState(data);

  function setSearchText(text) {
    if (searchText !== text) {
      setFilteredList(text ? data.filter(r => r.route.startsWith(text)) : data);
      _setSearchText(text);
    }
  }

  return (
    <DataContext.Provider value={{ searchText, setSearchText, filteredList }}>
      {children}
    </DataContext.Provider>
  );
}