"use client";

import { useRef } from "react";
import { Button, ButtonGroup } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getToday } from "@/lib/utils";

import './datePicker.css';

export default function DatePicker({ selectionType, value, setValue, hideSelection, disabled }) {

  const todayRef = useRef(getToday());

  function shiftStartDate(isBackward) {
    let newDate = new Date(value);
    if (selectionType === "Y") {
      newDate.setFullYear(newDate.getFullYear() + (isBackward ? -1 : 1));
    } else if (selectionType === "M") {
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
      <Button onClick={() => shiftStartDate(true)} disabled={disabled}>{"<"}</Button>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          orientation="portrait"
          closeOnSelect={true}
          disableFuture={true}
          views={selectionType === "Y" ? ["year"] : selectionType === "M" ? ["year", "month"] : ["year", "month", "day"]}
          value={value}
          onChange={setValue}
          className={hideSelection ? "hideSelection" : ""}
           disabled={disabled}
        />
      </LocalizationProvider>
      <Button onClick={() => shiftStartDate()} disabled={disabled}>{">"}</Button>
    </ButtonGroup>
  );
}