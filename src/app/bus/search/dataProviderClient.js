"use client";

import { createContext, useState } from "react";

export const DataContext = createContext({});

export function DataProviderClient({ data, children }) {

  console.log("DataProviderClient");

  const list = data.apiData.filteredList || [];
  const [searchText, _setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  function setSearchText(text) {
    if (searchText !== text) {
      setFilteredList(text ? list.filter(r => r.route.startsWith(text)) : list);
      _setSearchText(text);
    }
  }

  return (
    <DataContext.Provider value={{ searchText, setSearchText, apiData: { filteredList, error: data.apiData.error } }}>
      {children}
    </DataContext.Provider>
  );
}