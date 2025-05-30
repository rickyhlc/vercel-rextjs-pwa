"use client";

import { useRef } from "react";
import { Button, ButtonGroup } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getToday } from "@/lib/utils";

import './datePicker.css';

export default function DatePicker({ selectionType, value, setValue, hideSelection }) {

  const todayRef = useRef(getToday());

  function shiftStartDate(isBackward) {
    let newDate = new Date(value);
    if (selectionType === "month") {
      newDate.setMonth(newDate.getMonth() + (isBackward ? -1 : 1));
    } else {
      newDate.setDate(newDate.getDate() + (isBackward ? -1 : 1));
    }
    if (isBackward || (newDate.getTime() <= todayRef.current.getTime())) {
      setValue(newDate);
    }
  }

  return (
    <ButtonGroup className="datePicker">
      <Button onClick={() => shiftStartDate(true)}>{"<"}</Button>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          orientation="portrait"
          closeOnSelect={true}
          disableFuture={true}
          views={selectionType === "month" ? ["year", "month"] : ["year", "month", "day"]}
          value={value}
          onChange={setValue}
          className={hideSelection ? "hideSelection" : ""}
        />
      </LocalizationProvider>
      <Button onClick={() => shiftStartDate()}>{">"}</Button>
    </ButtonGroup>
  );
}