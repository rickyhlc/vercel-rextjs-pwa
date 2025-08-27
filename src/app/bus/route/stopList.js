"use client";

import StopItem from "./stopItem";
import { useDataContext } from "./dataProvider";

export default function StopList() {

  console.log("StopList");

  const { apiData: { co, stops, route, bound, service_type, error } } = useDataContext();

  if (error) {
    return <div className="text-center mt-20">Unable to load bus stops...</div>;
  } else {
    return <>
      {stops.map(s => (
        <StopItem
          key={s.seq}
          company={co}
          stop={s.stop}
          name={s.name_tc}
          seq={s.seq}
          route={route}
          bound={bound}
          serviceType={service_type}
        />
        ))}
    </>;
  }
}