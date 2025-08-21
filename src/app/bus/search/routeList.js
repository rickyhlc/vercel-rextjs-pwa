"use client";

import RouteItem from "./routeItem";
import { useDataContext } from "./dataProvider";

export default function RouteList() {

  console.log("RouteList");

  const { filteredList } = useDataContext();

  if (filteredList.error) {
    return <div className="text-center mt-20">Unable to load routes...</div>;
  } else {
    return (
      <>
        {filteredList.map(r => 
          <RouteItem
            key={`${r.route}-${r.bound}-${r.service_type}`}
            company={"KMB"}
            route={r.route}
            bound={r.bound}
            serviceType={r.service_type}
            dest={r.dest_tc}
            orig={r.orig_tc}
          />
        )}
      </>
    );
  }
}