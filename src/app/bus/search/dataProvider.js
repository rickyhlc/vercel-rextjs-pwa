import { useContext } from "react";
import { DataProviderClient, DataContext } from "./dataProviderClient";

export async function DataProvider({ children }) {

  console.log("DataProvider (server)");
 
  // fetch route data in server component
  let clientData = await getRoutesInfoData();
  if (clientData.error) {
    clientData = { apiData: { error: clientData.error } };
  } else {
    clientData = { apiData: { filteredList: clientData, company: "KMB" } };
  }

  return <DataProviderClient data={clientData}>{children}</DataProviderClient>;
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
async function getRoutesInfoData() {
  console.log("Fetching routes info data...");
  console.time("fetchRoute");
  try {
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/", { next: { revalidate: 86400 } });
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching routes info data:", error);
    return { error };
  } finally {
    console.timeEnd("fetchRoute");
  }
}