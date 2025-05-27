"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { initDB, CAT_LIST } from "./db";
import { getToday, dateFormat, getFlagIcon, BTN_BLUE, PLAIN_BTN_BLUE, ALL_ZINC, TXT_ZINC } from "@/utils";

import DownArrowIcon from "@/icons/downArrow";
import EditIcon from "@/icons/edit";
import AddIcon from "@/icons/add";
import { Accordion, AccordionSummary, AccordionDetails, ToggleButton, ToggleButtonGroup } from '@mui/material';
import EditCostPanel from "./editCostPanel";
import DatePicker from "@/components/datePicker";
import BottomDrawer from "@/components/bottomDrawer";

import './bank.css';

export default function BankPage() {
  const today = getToday();
  const [calendarView, setCalendarView] = useState("day");
  const [startDate, setStartDate] = useState(today);
  const [catTypeMap, setCatTypeMap] = useState(null);
  const [flags, setFlags] = useState(null);
  const [costs, _setCosts] = useState(null);
  const [summary, setSummary] = useState({});
  const dbRef = useRef(null);
  const [newCost, setNewCost] = useState(null);

  // watch param change and reload cost display
  useEffect(() => {
    if (dbRef.current) {
      reloadCostAsync(calendarView, startDate);
    }
  }, [startDate]);

   // init page display
  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      reloadCostAsync(calendarView, startDate);
      reloadFlagsAsync();
      reloadCatTypeAsync();
    });
    return () => dbRef.current?.close();
  }, []);
  
  const selectCalendarView = useCallback((e, view) => {
    if (view) { // dont allow unselect view
      setCalendarView(view);
      setStartDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    }
  });

  function setCosts(data) {
    _setCosts(data);
    let s = { total: 0 };
    CAT_LIST.forEach(cat => {
      s[cat] = data[cat]?.reduce((total, item) => total + item.value, 0) || 0;
      s.total += s[cat];
    });
    setSummary(s); 
  }

  async function reloadFlagsAsync() {
    if (dbRef.current){
      let data = await dbRef.current.getFlags();
      setFlags(data || []);
      return data;
    }
  }
  async function reloadCatTypeAsync() {
    if (dbRef.current){
      let data = await dbRef.current.getCatTypes();
      setCatTypeMap(data || {});
      return data;
    }
  }
  async function reloadCostAsync(cView, sDate) {
    if (dbRef.current){
      let endDate = new Date(sDate);
      if (cView === "month") {
        endDate.setMonth(sDate.getMonth() + 1);
      } else {
        endDate.setDate(sDate.getDate() + 1);
      };
      let data = await dbRef.current.getCosts(sDate.getTime(),  endDate.getTime());
      if (data) {
        data = Object.groupBy(data, (item) => item.cat);
        setCosts(data);
        return data;
      } else {
        setCosts({});
        return [];
      }
    }
  }

  function showAddCostPanel(){
    setNewCost({ date: today.getTime(), value: "", cat: CAT_LIST[0], type: catTypeMap[CAT_LIST[0]][0] });
  }

  // add or update cost to db
  async function handleSaveCost(cost) {
    const costData = {...cost};
    if (costData.INCOME && costData.value > 0) {
      costData.value = -costData.value;
    }
    try {
      const res = await dbRef.current?.saveCost(costData);
      if (costData.id === undefined) {
        const catData = [...(costs[costData.cat] || []), {id: res, ...costData}];
        setCosts({ ...costs, [costData.cat]: catData });
        setNewCost(null);
      } else {
        await reloadCostAsync(calendarView, startDate);  
        setNewCost(null);
      }
    } catch (err) {
      console.log("add cost error", err);
      await reloadCostAsync(calendarView, startDate);
    }
  }

  return (
    <div className={`flex flex-col min-h-screen max-h-screen ${ALL_ZINC}`}>

      <div className="flex gap-4 items-center justify-between mx-[16px] py-4 mb-2 border-b border-solid border-zinc-400">
        <div>
          <div className={`${TXT_ZINC} text-xs`}>Expenses in</div>
          <div className={`${TXT_ZINC} text-2xl`}>{dateFormat(startDate, calendarView === "month" ? "month" : null)}</div>
        </div>
        <div className="text-5xl">${summary.total?.toFixed(1)}</div>
      </div>
      <div className="grow-1 basis-0 overflow-auto">
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
                      {flags?.map(f => item[f.id] ? getFlagIcon(f, "w-4 h-4 text-inherit") : null)}
                    </span>
                    <span className="grow text-right pe-4">${item.value}</span>
                    <button
                      className={`rounded-full p-1 ${PLAIN_BTN_BLUE}`}
                      onClick={() => setNewCost(item)}
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

      <div className="flex items-center justify-between px-[16px] py-4">
        <div className="flex gap-4 items-center">
          <ToggleButtonGroup
            color="primary"
            value={calendarView}
            exclusive
            onChange={selectCalendarView}
          >
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="day">Day</ToggleButton>
          </ToggleButtonGroup>
          {summary && <DatePicker value={startDate} setValue={setStartDate} selectionType={calendarView} hideSelection={true}/>}
        </div>
        <button className={`rounded-full p-2 ${BTN_BLUE}`} disabled={!catTypeMap || !flags} onClick={showAddCostPanel}>
          <AddIcon sizeClass="w-8 h-8"/>
        </button>
        <BottomDrawer
          isOpen={newCost}
          onCancel={() => setNewCost(null)}
        >
          {newCost && (
            <EditCostPanel
              cost={newCost}
              catTypeMap={catTypeMap}
              flags={flags}
              onSave={handleSaveCost}
            />
          )}
        </BottomDrawer>
      </div>

    </div>
  );
}