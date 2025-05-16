"use client";

import { useEffect, useState, useRef, useCallback, useTransition } from "react";
import { initDB, CAT_LIST } from "./db";
import { getToday, BTN_BLUE, PLAIN_BTN_BLUE, ALL_ZINC, TXT_ZINC } from "@/utils";

import DownArrowIcon from "@/icons/downArrow";
import EditIcon from "@/icons/edit";
import AddIcon from "@/icons/add";
import { Accordion, AccordionSummary, AccordionDetails, TextField, NativeSelect } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import './bank.css';

export default function BankPage() {

  const today = getToday();
  const [calendarView, setCalendarView] = useState("month");
  const [calendarDate, setCalendarDate] = useState(today);  // only for calendar component display
  const [startDate, _setStartDate] = useState(today);  // selected date from calendar
  const [catTypeMap, setCatTypeMap] = useState({});
  const [costs, setCosts] = useState([]);
  const dbRef = useRef(null);

  const [isPending, startTransition] = useTransition();
  const [newCost, setNewCost] = useState(null);

  const setStartDate = useCallback((date) => {
    _setStartDate(date);
    setCalendarDate(date)
  }, []);


  // init page display
  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      reloadCostAsync();
      reloadCatTypeAsync().then(map => {
        setNewCost({ date: today.getTime(), value: "", cat: CAT_LIST[0], type: map[CAT_LIST[0]]?.[0] });  
      });
    });
    return () => dbRef.current?.close();
  }, []);

  async function reloadCatTypeAsync() {
    if (dbRef.current){
      let data = await dbRef.current.getCatTypes();
      setCatTypeMap(data);
      return data;
    }
  }
  async function reloadCostAsync() {
    if (dbRef.current){
      let endDate = new Date(startDate);
      if (calendarView === "month") {
        endDate.setMonth(startDate.getMonth() + 1);
      } else {
        endDate.setDate(startDate.getDate() + 1);
      }
      let data = await dbRef.current.getCosts(startDate.getTime(),  endDate.getTime());
      if (data) {
        data = Object.groupBy(data, (item) => item.cat);
        setCosts(data);
        return data;
      }
    }
  }

  // save new cost to db
  function handleAdd() {
    startTransition(async () => {
      const cat = newCost.cat;
      try {
        const res = await dbRef.current?.addCost(newCost);
        const catData = [...(costs[cat] || []), {id: res, ...newCost}];
        setCosts({ ...costs, [cat]: catData });
      } catch (err) {
        console.log("add cost error", err);
        await reloadCostAsync();
      }
    });
  }

  return (
    <div className={`flex flex-col justify-between min-h-screen ${ALL_ZINC}`}>
      <div>
        {CAT_LIST.map(cat => {
          return (
            <Accordion key={cat}>
              <AccordionSummary expandIcon={<DownArrowIcon colorClass={TXT_ZINC} />}>
                <div className="flex justify-between items-center w-full pe-4">
                  <span>{cat}</span>
                  <span>${costs[cat]?.reduce((total, item) => total + item.value, 0)}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {costs[cat]?.map(item => (
                  <div key={item.id} className="flex">
                    <span className="grow-0">{new Date(item.date).toLocaleDateString("en-GB")}</span>
                    <span className="grow">{item.type}</span>
                    <span className="grow text-right pe-4">${item.value}</span>
                    <button
                      className={`rounded-full p-1 ${PLAIN_BTN_BLUE}`}
                    >
                      <EditIcon className="w-4 h-4 text-inherit" />
                    </button>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
      {newCost && (
        <div className="min-w-full">
          <div className="flex gap-8 items-center min-w-full">
            <NativeSelect
              value={newCost.cat}
              disabled={isPending}
              className="w-1/2"
              onChange={(e) => {
                setNewCost({ ...newCost, cat: e.target.value, type: catTypeMap[e.target.value]?.[0] });
              }}
            >
              {CAT_LIST.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </NativeSelect>
            <NativeSelect
              value={newCost.type}
              disabled={isPending}
              className="w-1/2"
              onChange={(e) => {
                setNewCost({ ...newCost, type: e.target.value });
              }}
            >
              {catTypeMap[newCost.cat]?.map(type => <option key={type} value={type}>{type}</option>)}
            </NativeSelect>
          </div>
          <div className={`flex gap-8 items-center min-w-full ${ALL_ZINC}`}>
            <TextField
              label="$"
              type="number"
              value={isNaN(newCost.value) ? "" : newCost.value}
              onChange={(e) => setNewCost({ ...newCost, value: parseFloat(e.target.value) })}
              disabled={isPending}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                orientation="portrait"
                disableFuture={true}
                views={calendarView === "month" ? ["year", "month"] : ["year", "month", "day"]}
                value={calendarDate}
                onAccept={setStartDate}
                onChange={setCalendarDate}
                slotProps={{
                  textField: {
                    // fullWidth: true,
                    // margin: "normal",
                  },
                }}
              />
            </LocalizationProvider>
            <button
              className={`rounded-full p-1.5 ${BTN_BLUE}`}
              disabled={isPending || !newCost.value || !newCost.cat || !newCost.type}
              onClick={handleAdd}
            >
              <AddIcon/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
