"use client";

import { useState, useTransition } from "react";
import { CAT_LIST } from "./indexedDB";
import { TextField, NativeSelect, Checkbox } from '@mui/material';
import { BTN_BLUER, TXT_ZINC, getFlagIcon } from "@/lib/utils";
import TickIcon from "@/icons/tick";
import DatePicker from "@/components/datePicker";

export default function EditCostPanel({ onSave, cost, flags, catTypeMap }) {

  const [data, setData] = useState({...cost, date: new Date(cost.date)}); // convert ts to date
  const [saving, startSaving] = useTransition();
  const disableSave = saving || !data.value || !data.cat || !data.type;

  function handleSave() {
    if (!disableSave) {
      startSaving(async () => {
        await onSave({...data, date: data.date.getTime() }); // db store ts instead of date object
      });
    }
  }

  function setDate(date) {
    setData({ ...data, date });
  }

  return (
    <>
      <div className="flex gap-8 items-center px-[16px] py-2">
        <DatePicker value={data.date} setValue={setDate} selectionType={"day"}/>
      </div>
      <div className="flex gap-8 items-center px-[16px] py-2">
        <NativeSelect
          value={data.cat}
          disabled={saving}
          className="w-1/2"
          onChange={(e) => {
            setData({ ...data, cat: e.target.value, type: catTypeMap[e.target.value][0] });
          }}
        >
          {CAT_LIST.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </NativeSelect>
        <NativeSelect
          value={data.type}
          disabled={saving}
          className="w-1/2"
          onChange={(e) => {
            setData({ ...data, type: e.target.value });
          }}
        >
          {catTypeMap[data.cat].map(type => <option key={type} value={type}>{type}</option>)}
        </NativeSelect>
      </div>
      <div className={`flex justify-between flex-wrap ps-[4px] pe-[16px] py-2 ${TXT_ZINC}`}>
        {flags.map(f => (
          <label key={f.id} className="flex items-center w-1/2">
            {/* use "|| false" to prevent ctrl/un-ctrl component error */}
            <Checkbox color="primary" checked={data[f.id] || false} onChange={e => {
              let c = { ...data };
              if (e.target.checked) {
                c[f.id] = true;
              } else {
                delete c[f.id];
              }
              setData(c);
            }}/>
            {f.name}{getFlagIcon(f, "ms-1 w-4 h-4 text-inherit")}
          </label>
        ))}
      </div>
      <div className="flex justify-between px-[16px] py-2">
        <TextField
          label="$"
          type="number"
          value={isNaN(data.value) ? "" : data.value}
          onChange={(e) => setData({ ...data, value: parseFloat(e.target.value) })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          disabled={saving}
        />
        <button
          className={`rounded-full p-2 ${BTN_BLUER}`}
          disabled={disableSave}
          onClick={handleSave}
        >
          <TickIcon sizeClass="w-8 h-8"/>
        </button>
      </div>
    </>
  );
}