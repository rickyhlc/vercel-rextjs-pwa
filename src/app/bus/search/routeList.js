"use client";

import { useEffect, useState } from "react";
import RouteItem from "./routeItem";
import { useDataContext } from "./dataProvider";
import { CircularProgress } from '@mui/material';

export default function RouteList() {

  console.log("RouteList");

  const { apiData: { filteredList, error } } = useDataContext();
  
  // loading the list is slow in mobile, do it in useEffect to enable a quick initial render first
  const [elm, setElm] = useState(<div className="text-center mt-20"><CircularProgress size={32} /></div>);
  useEffect(() => {
    setElm(
      <>
        {filteredList.map(r => (
          <RouteItem
            key={`${r.route}-${r.bound}-${r.service_type}`}
            company={"KMB"}
            route={r.route}
            bound={r.bound}
            serviceType={r.service_type}
            dest={r.dest_tc}
            orig={r.orig_tc}
          />
        ))}
      </>
    );
  }, [filteredList]);

  if (error) {
    return <div className="text-center mt-20">Unable to load routes...</div>;
  } else {
    return (
      <>{elm}</>
    );
  }
}