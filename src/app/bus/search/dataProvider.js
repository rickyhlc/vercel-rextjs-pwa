import { useContext } from "react";
import { DataProviderClient, DataContext } from "./dataProviderClient";

export async function DataProvider({ children }) {

  console.log("DataProvider (server)");
 
  // fetch route data in server component
  let routes = await getData();

  return <DataProviderClient data={routes}>{children}</DataProviderClient>;
}

export function useDataContext() {
  return useContext(DataContext);
}

/*
 * data [{ 
 *   "route": "1",
 *   "bound": "O",
 *   "service_type": "1",
 *   "orig_en": "CHUK YUEN ESTATE",
 *   "orig_tc": "竹園邨",
 *   "orig_sc": "竹园邨",
 *   "dest_en": "STAR FERRY",
 *   "dest_tc": "尖沙咀碼頭",
 *   "dest_sc": "尖沙咀码头"
 * }]
 */
async function getData() {
  console.log("Fetching route data...");
  console.time("fetchRoute");
  try {
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/", { next: { revalidate: 86400 } });
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching route data:", error);
    return { error };
  } finally {
    console.timeEnd("fetchRoute");
  }
}