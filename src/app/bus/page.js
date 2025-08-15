"use client";
//TODOricky
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
import BottomDrawer from "@/components/bottomDrawer";


export default function BankPage() {
  return <Suspense><BankPageMain/></Suspense>;
}

function BankPageMain() {
  const today = getToday();
  const [calendarView, setCalendarView] = useState("D");
  const [startDate, setStartDate] = useState(today);
  const [flagFilter, setFlagFilter] = useState(null);
  const [catFilter, setCatFilter] = useState(null);
  const [anyTimeFilter, setAnyTimeFilter] = useState(false);
  const [costs, _setCosts] = useState(null);
  const [summary, setSummary] = useState({});
  const dbRef = useRef(null);
  const [newCost, setNewCost] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  //handle click notification
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
        if (FLAG_LIST.some(i => i.id === f)) {
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
  }, [startDate, flagFilter, catFilter, anyTimeFilter]);

  
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
      if (view === "M" || view === "D") {
        setStartDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
      } else if (view === "Y") {
        setStartDate(new Date(startDate.getFullYear(), 0, 1));
      }
    } else if (calendarView === "D") { // click "D" for the second time, go to today
      setStartDate(new Date(today));
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
      let data;
      if (anyTimeFilter) {
        data = await dbRef.current.getCosts(null, null, catFilter, flagFilter);
      } else {
        let endDate = new Date(startDate);
        if (calendarView === "Y") {
          endDate.setFullYear(startDate.getFullYear() + 1);
        } else if (calendarView === "M") {
          endDate.setMonth(startDate.getMonth() + 1);
        } else {
          endDate.setDate(startDate.getDate() + 1);
        }
        data = await dbRef.current.getCosts(startDate.getTime(), endDate.getTime(), catFilter, flagFilter);
      }

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
          <div className={`${TXT_ZINC} text-2xl`}>{anyTimeFilter ? "All date" : calendarView === "Y" ? startDate.getFullYear() : dateFormat(startDate, calendarView === "M" ? "month" : null)}</div>
        </div>
        <div className="text-4xl">${summary.total?.toFixed(1)}</div>
      </div>

      <div className="grow-1 basis-0 overflow-auto">
        {costs && (catFilter ? [catFilter] : CAT_LIST).map(cat => {
          return (
            <Accordion key={cat} square={true}>
              <AccordionSummary expandIcon={<DownArrowIcon colorClass="text-inherit" />}>
                <div className="flex justify-between items-center w-full pe-4 text-lg font-bold">
                  <span>{cat}</span>
                  <span>${summary[cat]?.toFixed(1)}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {CAT_TYPE_LIST[cat].map(type => (
                  <Accordion key={`${cat}-${type}`} square={true} defaultExpanded={true}>
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
                          <span className="grow-0 basis-18">{dateFormat(new Date(item.date), "day")}</span>
                          <span className="grow-0 basis-18 flex gap-1">
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

      <div className="flex items-center px-[16px] py-4">
        <div className="flex gap-2 grow-1 items-center">
          <ToggleButtonGroup
            color="primary"
            value={calendarView}
            onChange={selectCalendarView}
            disabled={anyTimeFilter}
            exclusive
          >
            <ToggleButton value="Y">Y</ToggleButton>
            <ToggleButton value="M">M</ToggleButton>
            <ToggleButton value="D">D</ToggleButton>
          </ToggleButtonGroup>
          {summary && <DatePicker value={startDate} setValue={setStartDate} selectionType={calendarView} hideSelection={true} disabled={anyTimeFilter}/>}
          <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} onClick={() => setShowFilter(true)}>
            <FilterIcon className={`w-8 h-8 ${flagFilter || catFilter || anyTimeFilter ? "text-blue-200" : "text-inherit"}`}/>
          </button>
        </div>
        <button className={`rounded-full p-2 ${PLAIN_BTN_BLUE}`} onClick={() => setShowMore(true)}>
          <MenuDotsIcon className="w-8 h-8 text-inherit"/>
        </button>
      </div>

      <div className="flex items-center px-[16px] pb-4">
        <div className="flex gap-2 items-center">

        </div>
        <button className={`ms-auto rounded-full p-2 ${BTN_BLUER}`} onClick={showAddCostPanel}>
          <AddIcon className="w-8 h-8 text-inherit"/>
        </button>
      </div>

      <BottomDrawer isOpen={newCost} onCancel={() => setNewCost(null)}>
        {newCost && (
          <EditCostPanel
            cost={newCost}
            onSave={handleSaveCost}
          />
        )}
      </BottomDrawer>
      <BottomDrawer isOpen={showFilter} onCancel={() => setShowFilter(false)}>
        {showFilter && (
          <FilterPanel
            flagFilter={flagFilter}
            onSetFlagFilter={setFlagFilter}
            catFilter={catFilter}
            onSetCatFilter={setCatFilter}
            anyTimeFilter={anyTimeFilter}
            onSetAnyTimeFilter={setAnyTimeFilter}
            onClose={() => setShowFilter(false)}
          />
        )}
      </BottomDrawer>
      <BottomDrawer isOpen={showMore} onCancel={() => setShowMore(false)}>
        {showMore && (
          <MorePanel
            flagFilter={flagFilter}
            onSetFlagFilter={setFlagFilter}
            catFilter={catFilter}
            onSetCatFilter={setCatFilter}
            anyTimeFilter={anyTimeFilter}
            onSetAnyTimeFilter={setAnyTimeFilter}
            onRefresh={reloadCostAsync}
            onClose={() => setShowMore(false)}
            localDB={dbRef.current}
          />
        )}
      </BottomDrawer>
    </div>
  );
}