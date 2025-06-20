"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { initDB, CAT_LIST, CAT_TYPE_LIST, FLAG_LIST } from "./indexedDB";
import { getToday, dateFormat, getFlagIcon, getServiceWorkerRegistration, BTN_BLUER, PLAIN_BTN_BLUE, ALL_ZINC, TXT_ZINC } from "@/lib/utils";
import DownArrowIcon from "@/icons/downArrow";
import EditIcon from "@/icons/edit";
import AddIcon from "@/icons/add";
import MenuDotsIcon from "@/icons/menuDots";
import FilterIcon from "@/icons/filter";
import { Accordion, AccordionSummary, AccordionDetails, ToggleButton, ToggleButtonGroup } from '@mui/material';
import EditCostPanel from "./editCostPanel";
import MorePanel from "./morePanel";
import DatePicker from "@/components/datePicker";
import BottomDrawer from "@/components/bottomDrawer";

import './bank.css';
import { ca } from "date-fns/locale";

export default function BankPage() {
  return <Suspense><BankPageMain/></Suspense>;
}

function BankPageMain() {
  const today = getToday();
  const [calendarView, setCalendarView] = useState("day");
  const [startDate, setStartDate] = useState(today);
  const [filter, setFilter] = useState(null);
  const [costs, _setCosts] = useState(null);
  const [summary, setSummary] = useState({});
  const dbRef = useRef(null);
  const [newCost, setNewCost] = useState(null);
  const [showMore, setShowMore] = useState(false);

  //handler click notification
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();
  useEffect(() => {
    const cat = queryParams.get("cat");
    const type = queryParams.get("type");
    if (CAT_LIST.includes(cat) && CAT_TYPE_LIST[cat].includes(type)) {
      const value = queryParams.get("value");
      const flags = queryParams.get("flags")?.split(",");
      let data = {
        date: today.getTime(),
        value: value ? parseFloat(value) : "",
        cat,
        type,
      }
      flags?.forEach(f => {
        if (FLAG_LIST.includes(f)) {
          data[f] = true;
        }
      });
      setNewCost(data);
      router.replace(pathname);
    }
  }, []);
  
  // watch param change and reload cost display
  useEffect(() => {
    reloadCostAsync();
  }, [startDate, filter]);

  
  useEffect(() => {
    // install sw if not yet installed
    getServiceWorkerRegistration();

    // init page display
    initDB().then(async db => {
      dbRef.current = db;
      reloadCostAsync();
    });
    return () => dbRef.current?.close();
  }, []);
  
  const selectCalendarView = useCallback((e, view) => {
    if (view) { // dont allow unselect view
      setCalendarView(view);
      if (view === "day" && startDate.getMonth() == today.getMonth() && startDate.getFullYear() == today.getFullYear()) {
        setStartDate(new Date(today));
      } else {
        setStartDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
      }
    }
  });

  function setCosts(data) {
    _setCosts(data);
    let s = { total: 0 };
    CAT_LIST.forEach(cat => {
      s[cat] = 0;
      CAT_TYPE_LIST[cat].forEach(type => {
        const typeKey = `${cat}-${type}`;
        s[typeKey] = data[cat]?.[type]?.reduce((total, item) => total + item.value, 0) || 0;
        s[cat] += s[typeKey];
      });
      s.total += s[cat];
    });
    setSummary(s); 
  }

  async function reloadCostAsync() {
    if (dbRef.current){
      let endDate = new Date(startDate);
      if (calendarView === "month") {
        endDate.setMonth(startDate.getMonth() + 1);
      } else {
        endDate.setDate(startDate.getDate() + 1);
      }
      let data = await dbRef.current.getCosts(startDate.getTime(), endDate.getTime(), filter);
      if (data) {
        data = Object.groupBy(data, (item) => item.cat);
        Object.keys(data).forEach(cat => data[cat] = Object.groupBy(data[cat], (item) => item.type));
        setCosts(data);
        return data;
      } else {
        setCosts({});
        return [];
      }
    }
  }

  function showAddCostPanel(){
    setNewCost({ date: today.getTime(), value: "", cat: CAT_LIST[0], type: CAT_TYPE_LIST[CAT_LIST[0]][0] });
  }

  // add or update cost to db
  async function handleSaveCost(cost) {
    const costData = {...cost};
    if (costData.INCOME && costData.value > 0) {
      costData.value = -costData.value;
    }
    try {
      await dbRef.current?.saveCost(costData);
      await reloadCostAsync();  
      setNewCost(null);
    } catch (err) {
      console.log("add cost error", err);
    }
  }
//TODOricky groupBy type
  return (
    <div className={`flex flex-col min-h-screen max-h-screen ${ALL_ZINC}`}>

      <div className="flex gap-4 items-center justify-between mx-[16px] py-4 mb-2 border-b border-solid border-zinc-400">
        <div>
          <div className={`${TXT_ZINC} text-xs`}>Expenses in</div>
          <div className={`${TXT_ZINC} text-2xl`}>{dateFormat(startDate, calendarView === "month" ? "month" : null)}</div>
        </div>
        <div className="text-4xl">${summary.total?.toFixed(1)}</div>
      </div>
      <div className="grow-1 basis-0 overflow-auto">
        {costs && CAT_LIST.map(cat => {
          return (
            <Accordion key={cat}>
              <AccordionSummary expandIcon={<DownArrowIcon colorClass="text-inherit" />}>
                <div className="flex justify-between items-center w-full pe-4">
                  <span>{cat}</span>
                  <span>${summary[cat]?.toFixed(1)}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {CAT_TYPE_LIST[cat].map(type => (
                  <Accordion key={`${cat}-${type}`}>
                    {CAT_TYPE_LIST[cat].length > 1 &&
                      <AccordionSummary expandIcon={<DownArrowIcon colorClass="text-inherit" />}>
                        <div className="flex justify-between items-center w-full pe-4">
                          <span>{`${cat} - ${type}`}</span>
                          <span>${summary[`${cat}-${type}`]?.toFixed(1)}</span>
                        </div>
                      </AccordionSummary>
                    }
                    <AccordionDetails>
                      {costs[cat]?.[type]?.map(item => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <span className="grow-0">{dateFormat(new Date(item.date), "day")}</span>
                          <span className="ps-5 grow-0 basis-20 flex gap-1">
                            {FLAG_LIST.map(f => item[f.id] ? getFlagIcon(f, "w-4 h-4 text-inherit") : null)}
                          </span>
                          <span className="grow basis-0 text-right">${item.value}</span>
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
                ))}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>

      <div className="flex items-center ps-[16px] py-4">
        <div className="flex gap-2 items-center">
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
        <button className={`ms-auto rounded-full p-2 ${BTN_BLUER}`} onClick={showAddCostPanel}>
          <AddIcon className="w-8 h-8 text-inherit"/>
        </button>
        <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} onClick={() => setShowMore(true)}>
          {filter ? (
            <FilterIcon className="w-8 h-8 text-blue-200"/> // disabled class "w-8 h-8 text-blue-200/70"
          ) : (
            <MenuDotsIcon className="w-8 h-8 text-inherit"/>
          )}
        </button>
        <BottomDrawer isOpen={newCost} onCancel={() => setNewCost(null)}>
          {newCost && (
            <EditCostPanel
              cost={newCost}
              onSave={handleSaveCost}
            />
          )}
        </BottomDrawer>
        <BottomDrawer isOpen={showMore} onCancel={() => setShowMore(false)}>
          {showMore && (
            <MorePanel
              filter={filter}
              onSetFilter={setFilter}
              onRefresh={reloadCostAsync}
              onClose={() => setShowMore(false)}
              localDB={dbRef.current}
            />
          )}
        </BottomDrawer>
      </div>
    </div>
  );
}