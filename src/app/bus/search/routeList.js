"use client";

import { startTransition } from "react";
import RouteItem from "./routeItem";
import { useDataContext } from "./dataProvider";
import { CircularProgress } from '@mui/material';

export default function RouteList() {

  console.log("RouteList");

  const { filteredList } = useDataContext();
  
  let elm = <div className="text-center mt-20"><CircularProgress size={32} /></div>;
  startTransition(() => {
    elm = filteredList.map(r => 
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
  );

  if (filteredList.error) {
    return <div className="text-center mt-20">Unable to load routes...</div>;
  } else {
    return (
      <>{elm}</>
    );
  }
}