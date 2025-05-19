"use client";

import { useEffect, useState, useRef, useCallback, useTransition } from "react";
import { initDB, CAT_LIST } from "./db";
import { getToday, dateFormat, BTN_BLUE, PLAIN_BTN_BLUE, ALL_ZINC, TXT_ZINC } from "@/utils";

import DownArrowIcon from "@/icons/downArrow";
import EditIcon from "@/icons/edit";
import AddIcon from "@/icons/add";
import CalendarIcon from "@/icons/calendar";
import PeopleIcon from "@/icons/people";
import AlarmIcon from "@/icons/alarm";
import { Accordion, AccordionSummary, AccordionDetails, TextField, NativeSelect, ToggleButton, ToggleButtonGroup, Checkbox } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import './bank.css';

export default function BankPage() {

  const today = getToday();
  const [calendarView, setCalendarView] = useState("day");
  const [calendarDate, setCalendarDate] = useState(today);  // only for calendar component display
  const [startDate, _setStartDate] = useState(today);  // selected date from calendar
  const [catTypeMap, setCatTypeMap] = useState({});
  const [flags, setFlags] = useState([]);
  const [costs, _setCosts] = useState(null);
  const [summary, setSummary] = useState({});
  const dbRef = useRef(null);

  const [savingCost, startSaveCost] = useTransition();
  const [newCost, setNewCost] = useState(null);

  const setStartDate = useCallback((date) => {
    _setStartDate(date);
    setCalendarDate(date)
  }, []);

  const selectCalendarView = useCallback((e, view) => {
    if (view) {
      setCalendarView(view);
      if (view === "month") {
        setStartDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
      } else {
        // stay on 1st of the month
        reloadCostAsync();
      }
    }
  }, []);

  const setCosts = (data) => {
    _setCosts(data);
    let s = { total: 0 };
    CAT_LIST.forEach(cat => {
      s[cat] = data[cat]?.reduce((total, item) => total + item.value, 0) || 0;
      s.total += s[cat];
    });
    setSummary(s); 
  };

  // init page display
  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      reloadCostAsync();
      Promise.all([reloadFlagsAsync(), reloadCatTypeAsync()]).then(map => {
        setNewCost({ date: today.getTime(), value: "", cat: CAT_LIST[0], type: map[CAT_LIST[0]]?.[0] });  
      });
    });
    return () => dbRef.current?.close();
  }, []);

  // reload data when selection changed
  useEffect(() => {
    if (dbRef.current) {
      reloadCostAsync();
    }
  }, [startDate]);

  async function reloadFlagsAsync() {
    if (dbRef.current){
      let data = await dbRef.current.getFlags();
      setFlags(data);
      return data;
    }
  }
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
      } else {
        setCosts([]);
        return [];
      }
    }
  }

  function showAddCostPanel(){}

  // save new cost to db
  function handleAdd() {
    startSaveCost(async () => {
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
        <div className="flex gap-4 items-center justify-between px-[16px] py-2 mb-4">
          <div>
            <div className={`${TXT_ZINC} text-xs`}>Expenses in</div>
            <div className={`${TXT_ZINC} text-2xl`}>{dateFormat(startDate, calendarView === "month" ? "month" : null)}</div>
          </div>
          <div className="text-5xl">${summary.total?.toFixed(1)}</div>
        </div>
        <div>
          {costs && CAT_LIST.map(cat => {
            return (
              <Accordion key={cat}>
                <AccordionSummary expandIcon={<DownArrowIcon colorClass={TXT_ZINC} />}>
                  <div className="flex justify-between items-center w-full pe-4">
                    <span>{cat}</span>
                    <span>${summary[cat]?.toFixed(1)}</span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {costs[cat]?.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <span className="grow-0">{dateFormat(new Date(item.date), "day")}</span>
                      <span className="grow">{item.type}</span>
                      <span className="grow-0 flex gap-1">
                        {flags?.map(f => {
                          if (item[f.id]) {
                            if (f.id === "REGULAR") {
                              return <CalendarIcon key={f.id} className="w-4 h-4 text-inherit" />;
                            } else if (f.id === "FOR_OTHER") {
                              return <PeopleIcon key={f.id} className="w-4 h-4 text-inherit" />;
                            } else if (f.id === "SPECIAL") {
                              return <AlarmIcon key={f.id} className="w-4 h-4 text-inherit" />;
                            }
                          }
                        })}
                      </span>
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
      </div>
      {newCost && (
        <>
          <div className="flex gap-8 items-center px-[16px] py-2">
            <NativeSelect
              value={newCost.cat}
              disabled={savingCost}
              className="w-1/2"
              onChange={(e) => {
                setNewCost({ ...newCost, cat: e.target.value, type: catTypeMap[e.target.value]?.[0] });
              }}
            >
              {CAT_LIST.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </NativeSelect>
            <NativeSelect
              value={newCost.type}
              disabled={savingCost}
              className="w-1/2"
              onChange={(e) => {
                setNewCost({ ...newCost, type: e.target.value });
              }}
            >
              {catTypeMap[newCost.cat]?.map(type => <option key={type} value={type}>{type}</option>)}
            </NativeSelect>
          </div>
          <div className="flex gap-8 items-center justify-between px-[16px] py-2">
            <TextField
              label="$"
              type="number"
              value={isNaN(newCost.value) ? "" : newCost.value}
              onChange={(e) => setNewCost({ ...newCost, value: parseFloat(e.target.value) })}
              disabled={savingCost}
            />
            <button
              className={`rounded-full p-2 ${BTN_BLUE}`}
              disabled={savingCost || !newCost.value || !newCost.cat || !newCost.type}
              onClick={handleAdd}
            >
              <AddIcon sizeClass="w-8 h-8"/>
            </button>
          </div>
          <div className="">{/* flex flex-col items-start */}
            {flags.map(flag => (
              <label key={flag.id}>
                {/* use "|| false" to prevent ctrl/un-ctrl component error */}
                <Checkbox color="primary" checked={newCost[flag.id] || false} onChange={e => {
                  let c = { ...newCost };
                  if (e.target.checked) {
                    c[flag.id] = true;
                  } else {
                    delete c[flag.id];
                  }
                  setNewCost(c);
                }} />
                {flag.name}
              </label>
            ))}
          </div>
        </>
      )}
      {costs && (
        <div className="flex items-center justify-between px-[16px] py-4">
          <div className="flex gap-8 items-center">
            <ToggleButtonGroup
              color="primary"
              value={calendarView}
              exclusive
              onChange={selectCalendarView}
            >
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="day">Day</ToggleButton>
            </ToggleButtonGroup>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                orientation="portrait"
                disableFuture={true}
                views={calendarView === "month" ? ["year", "month"] : ["year", "month", "day"]}
                value={calendarDate}
                onAccept={setStartDate}
                onChange={setCalendarDate}
              />
            </LocalizationProvider>
          </div>
          <button className={`rounded-full p-2 ${BTN_BLUE}`} onClick={showAddCostPanel}>
            <AddIcon sizeClass="w-8 h-8"/>
          </button>
        </div>
      )}
    </div>
  );
}
