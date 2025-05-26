"use client";

import { useState, useTransition } from "react";
import { CAT_LIST } from "./db";
import Dialog from '@mui/material/Dialog';
import { TextField, NativeSelect, Checkbox } from '@mui/material';
import { BTN_BLUE, TXT_ZINC, getFlagIcon } from "@/utils";
import AddIcon from "@/icons/add";

export default function EditCostModal({ isOpen, onCancel, onSave, cost, flags, catTypeMap }) {

  const [data, setData] = useState({...cost});
  const [saving, startSaving] = useTransition();

  function handleSave() {
    startSaving(async () => {
      await onSave(data);
    });
  }

  return (
    <Dialog onClose={onCancel} open={isOpen}>
      {isOpen && (
        <>
          <div className="flex gap-8 items-center px-[16px] py-2">
            <NativeSelect
              value={data.cat}
              disabled={saving}
              className="w-1/2"
              onChange={(e) => {
                setData({ ...data, cat: e.target.value, type: catTypeMap[e.target.value]?.[0] });
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
              {catTypeMap[data.cat]?.map(type => <option key={type} value={type}>{type}</option>)}
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
              disabled={saving}
            />
            <button
              className={`rounded-full p-2 ${BTN_BLUE}`}
              disabled={saving || !data.value || !data.cat || !data.type}
              onClick={handleSave}
            >
              <AddIcon sizeClass="w-8 h-8"/>
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}