import { useContext } from "react";
import { DataProviderClient, DataContext } from "./dataProviderClient";

export async function DataProvider({ params, children }) {

  console.log("DataProvider (server)");

  const { routeId, bound, serviceType } = await params;

  // fetch data and then capture only the necessary values in the server side
  const res = await Promise.all([getStopsInfoData(), getRouteStopsData(routeId, bound, serviceType)]);
  const stops = res[0];
  const routeStops = res[1];
  const clientData = { route: routeId, bound, service_type: serviceType };
  if (stops.error || routeStops.error) {
    clientData.error = stops.error || routeStops.error;
  } else {
    let stopMap = {};
    stops.forEach(r => stopMap[r.stop] = { name_tc: r.name_tc }); //TODOricky lat, long for showing map
    clientData.data = routeStops.map(r => ({
      seq: r.seq,
      stop: r.stop,
      name_tc: stopMap[r.stop]?.name_tc || "Unknown",
    }));
  }  

  return <DataProviderClient data={clientData}>{children}</DataProviderClient>;
}

export function useDataContext() {
  return useContext(DataContext);
}

/*
 * data [{
 *   "stop":"18492910339410B1",
 *   "name_en":"CHUK YUEN ESTATE BUS TERMINUS (WT916)",
 *   "name_tc":"竹園邨總站 (WT916)",
 *   "name_sc":"竹园邨总站 (WT916)",
 *   "lat":"22.345415",
 *   "long":"114.192640"
 * }]
 */
async function getStopsInfoData() {
  console.log("Fetching stop data...");
  console.time("fetchStop");
  try {
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
    let res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop", { next: { revalidate: 86400 } });
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching stop data:", error);
    return { error };
  } finally {
    console.timeEnd("fetchStop");
  }
}

/**
 * data [{
 *   "route": "170",
 *   "bound": "O",
 *   "service_type": "1",
 *   "seq": "1",
 *   "stop": "F0A8A596641FFC5A"
 * }]
 */
async function getRouteStopsData(route, bound, serviceType) {
  console.log("Fetching route stop data...");
  let direction = bound;
  if (bound === "O") {
    direction = "outbound";
  } else if (bound === "I") {
    direction = "inbound";
  }
  try {
    // fetch in server component is cached by default, so this component can be statically rendered
    // revalidate daily
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/${serviceType}`, { next: { revalidate: 86400 } });
    res = await res.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching route stop data:", error);
    return { error };
  }
}