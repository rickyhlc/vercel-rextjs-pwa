"use client";

import { useEffect, useState } from "react";
import StopItem from "./stopItem";
import { useDataContext } from "./dataProvider";
import { CircularProgress } from '@mui/material';

export default function StopList() {

  console.log("StopList");

  const { apiData: { stops, error } } = useDataContext();

  if (error) {
    return <div className="text-center mt-20">Unable to load bus stops...</div>;
  } else {
    return (
      <>
        {stops.map(s => <StopItem key={s.seq} stop={s.stop} name={s.name_tc} seq={s.seq} />)}
      </>
    );
  }
}