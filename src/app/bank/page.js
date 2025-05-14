"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { initDB, CAT_LIST } from "./db";
import { getToday, ONE_DAY } from "@/utils";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { TextField, NativeSelect } from '@mui/material';

export default function BankPage() {

  const today = getToday();
  const [dateRange, setDateRange] = useState([today, today + ONE_DAY]);
  const [catTypeMap, setCatTypeMap] = useState({});
  const [costs, setCosts] = useState([]);
  const dbRef = useRef(null);

  const [isPending, startTransition] = useTransition();
  const [newCost, setNewCost] = useState(null);

  // init page display
  useEffect(() => {
    initDB().then(db => {
      dbRef.current = db;
      reloadCostAsync();
      reloadCatTypeAsync().then(map => {
        setNewCost({ date: today, value: "", cat: CAT_LIST[0], type: map[CAT_LIST[0]]?.[0] });  
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
      let data = await dbRef.current.getCosts(dateRange[0], dateRange[1]);
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

  const DownArrow = <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
  </svg>;

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div>
        {CAT_LIST.map(cat => {
          return (
            <Accordion key={cat}>
              <AccordionSummary expandIcon={DownArrow}>
                <div className="flex justify-between items-center w-full pe-4">
                  <span>{cat}</span>
                  <span>${costs[cat]?.reduce((total, item) => total + item.value, 0)}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {costs[cat]?.map(item => (
                  <div key={item.id} className="flex w-full">
                    <span className="w-30">{new Date(item.date).toLocaleDateString("en-GB")}</span>
                    <span>{item.type}</span>
                    <span className="w-20 text-right">${item.value}</span>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </div>
      {newCost && (
        <div className="min-w-full">
          <div className="flex gap-8 items-center min-w-full bg-white">
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
          <div className="flex gap-8 items-center min-w-full bg-white">
            <TextField
              label="$"
              type="number"
              value={isNaN(newCost.value) ? "" : newCost.value}
              onChange={(e) => setNewCost({ ...newCost, value: parseFloat(e.target.value) })}
              disabled={isPending}
            />
            <button
              className="rounded bg-blue-600 p-2.5 text-white active:bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isPending || !newCost.value || !newCost.cat || !newCost.type}
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
