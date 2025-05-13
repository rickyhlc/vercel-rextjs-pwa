"use client";

import { useEffect, useState, useRef } from "react";
import { initDB, CAT_LIST } from "./db";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export default function BankPage() {

    const dbRef = useRef(null);
    useEffect(() => {
        initDB().then(db => {
            dbRef.current = db;
            reloadDataAsync();
        });
        return () => dbRef.current?.close();
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [dateRange, setDateRange] = useState([today.getTime(), today.getTime() + 86400000]);
    const [costs, setCosts] = useState([]);

    useEffect(() => {
        reloadDataAsync();
    }, [dateRange]);

    async function reloadDataAsync() {
        if (dbRef.current){
            let data = await dbRef.current.getCosts(dateRange[0], dateRange[1]) || [];
            data = Object.groupBy(data, (item) => item.cat);
            console.log(data);
            setCosts(data);
        }
    }

    function handleAdd() {
        const cat = CAT_LIST[1];
        const newData = { date: new Date().getTime(), cat, type: "ttttype", value: Math.round(Math.random() * 100), desc: "111desc" };
        dbRef.current?.addCost(newData);
        const catData = [...(costs[cat] || []), newData];
        setCosts({ ...costs, [cat]: catData });
    }

    const DownArrow = <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
    </svg>;


  return (
    <div className="">
        <div>
            {CAT_LIST.map(cat => {
                return (
                    <Accordion key={cat}>
                        <AccordionSummary expandIcon={DownArrow}>
                            <span>{cat}</span>
                        </AccordionSummary>
                        <AccordionDetails>
                            {costs[cat]?.map(item => {
                                return (
                                    <div key={item.id} className="flex gap-4">
                                        <span>{item.date}</span>
                                        <span>{item.type}</span>
                                        <span>{item.value}</span>
                                        <span>{item.desc}</span>
                                    </div>
                                )
                            })}
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </div>
        <div className="flex gap-8 items-center">
            <button className="rounded bg-blue-600 p-2.5 text-white active:bg-blue-800 hover:bg-blue-700" onClick={reloadDataAsync}>
                Show
            </button>
            <button className="rounded bg-blue-600 p-2.5 text-white active:bg-blue-800 hover:bg-blue-700" onClick={handleAdd}>
                Add
            </button>
        </div>
    </div>
  );
}
