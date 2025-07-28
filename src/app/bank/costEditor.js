"use client";

import { useState, useTransition } from "react";
import { CAT_LIST, CAT_TYPE_LIST, FLAG_LIST } from "./indexedDB";
import { TextField, NativeSelect, Checkbox } from '@mui/material';
import { BTN_BLUER, PLAIN_BTN_BLUE, TXT_ZINC, getFlagIcon } from "@/lib/utils";
import TickIcon from "@/icons/tick";
import CrossIcon from "@/icons/cross";

export default function CostEditor({ onSaveAsync, onCancel, cost, valueRequired = true, saveDisabled }) {

  const [data, setData] = useState({...cost});
  const [saving, startSaving] = useTransition();
  const disableSave = saving || (valueRequired && !data.value) || !data.cat || !data.type || saveDisabled;

  function handleSave() {
    if (!disableSave) {
      startSaving(async () => await onSaveAsync(data));
    }
  }

  return (
    <>
      <div className="flex gap-4 items-center px-[16px] py-2">
        <NativeSelect
          value={data.cat}
          disabled={saving}
          className="w-1/2"
          onChange={(e) => {
            setData({ ...data, cat: e.target.value, type: CAT_TYPE_LIST[e.target.value][0] });
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
          {CAT_TYPE_LIST[data.cat].map(type => <option key={type} value={type}>{type}</option>)}
        </NativeSelect>
      </div>
      <div className={`flex justify-between flex-wrap px-[16px] pb-1 ${TXT_ZINC}`}>
        {FLAG_LIST.map((f, i) => (
          <div key={f.id} className="flex items-center w-1/2">
            <label className={`flex items-center ${i&1 ? "ms-[-4px]" : "ms-[-12px]"}`}>
              {/* use "|| false" to prevent ctrl/un-ctrl component error */}
              <Checkbox color="primary" disabled={saving} checked={data[f.id] || false} onChange={e => {
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
          </div>
        ))}
      </div>
      <div className="flex justify-between px-[16px] pt-2">
        <TextField
          label="$"
          type="number"
          className="grow-1"
          value={!data.value || isNaN(data.value) ? "" : data.value}
          onChange={(e) => setData({ ...data, value: parseFloat(e.target.value) })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          disabled={saving}
        />
        {onCancel && (
          <button
            className={`rounded-full p-2 ms-2 ${PLAIN_BTN_BLUE}`}
            disabled={disableSave}
            onClick={onCancel}
          >
            <CrossIcon sizeClass="w-8 h-8 text-inherit"/>
          </button>
        )}
        <button
          className={`rounded-full p-2 ms-2 ${BTN_BLUER}`}
          disabled={disableSave}
          onClick={handleSave}
        >
          <TickIcon sizeClass="w-8 h-8 text-inherit"/>
        </button>
      </div>
    </>
  );
}