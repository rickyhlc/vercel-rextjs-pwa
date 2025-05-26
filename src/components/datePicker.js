"use client";

import { useEffect, useState, useRef } from "react";
import { Button, ButtonGroup } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getToday } from "@/utils";

import './datePicker.css';

export default function DatePicker({ selectionType, initialVal, onChange }) {

  const today = getToday();
  const [calendarDate, setCalendarDate] = useState(initialVal || today);  // only for component display
  const startDateRef = useRef(initialVal || today);  // selected value
  
  const isInitialMount = useRef(true);
  
  // watch for selection type change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (selectionType) {
        setStartDate(new Date(startDateRef.current.getFullYear(), startDateRef.current.getMonth(), 1));
      }
    }
  }, [selectionType]);

  function setStartDate(date) {
    if (date.getTime() !== startDateRef.current.getTime()) {
      startDateRef.current = date;
      setCalendarDate(date);
      if (onChange) {
        onChange(date);
      }
    }
  }

  function shiftStartDate(isBackward) {
    let newDate;
    if (selectionType === "month") {
      if (isBackward || (startDateRef.current.getMonth() < today.getMonth())) {
        newDate = new Date(startDateRef.current);
        newDate.setMonth(newDate.getMonth() + (isBackward ? -1 : 1));
        setStartDate(newDate);
      }
    } else {
      if (isBackward || (startDateRef.current.getDate() < today.getDate())) {
        newDate = new Date(startDateRef.current);
        newDate.setDate(newDate.getDate() + (isBackward ? -1 : 1));
        setStartDate(newDate);
      }
    }
  }

  return (
    <ButtonGroup>
      <Button onClick={() => shiftStartDate(true)}>{"<"}</Button>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          orientation="portrait"
          disableFuture={true}
          views={selectionType === "month" ? ["year", "month"] : ["year", "month", "day"]}
          value={calendarDate}
          onAccept={setStartDate}
          onChange={setCalendarDate}
        />
      </LocalizationProvider>
      <Button onClick={() => shiftStartDate()}>{">"}</Button>
    </ButtonGroup>
  );
}