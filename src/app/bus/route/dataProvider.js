import { useContext } from "react";
import { DataProviderClient, DataContext } from "./dataProviderClient";

export async function DataProvider({ params, children }) {

  console.log("DataProvider (server)");
 
  // fetch route data in server component, convert to map and reduce data size
  let stops = await getData();
  let stopMap = {};
  if (!stops.error) {
    const { routeId, direction, serviceType } = await params; //TODOricky find stop
    stops.forEach(r => {
      if (true){}
      stopMap[r.stop] = { name_tc: r.name_tc }
    }); //TODOricky lat, long for showing map
  }  

  return <DataProviderClient data={stopMap}>{children}</DataProviderClient>;
}

export function useDataContext() {
  return useContext(DataContext);
}

/*
 * data {
 *   "stop":"18492910339410B1",
 *   "name_en":"CHUK YUEN ESTATE BUS TERMINUS (WT916)",
 *   "name_tc":"竹園邨總站 (WT916)",
 *   "name_sc":"竹园邨总站 (WT916)",
 *   "lat":"22.345415",
 *   "long":"114.192640"
 */
async function getData() {
  console.log("Fetching stop data...");
  console.time("fetchStop");
  try {
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop", { next: { revalidate: 86400 } });
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error };
  } finally {
    console.timeEnd("fetchStop");
  }
}