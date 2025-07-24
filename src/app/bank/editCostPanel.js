"use client";

import { useState } from "react";
import CostEditor from "./costEditor";
import DatePicker from "@/components/datePicker";

export default function EditCostPanel({ onSave, cost }) {

  const [date, setDate] = useState(new Date(cost.date)); // convert ts to date

  async function handleSave(costData) {
    await onSave({...costData, date: date.getTime() }); // db store ts instead of date object
  }

  return (
    <>
      <div className="flex gap-8 items-center px-[16px] py-2">
        <DatePicker value={date} setValue={setDate} selectionType={"day"}/>
      </div>
      <CostEditor
        onSaveAsync={handleSave}
        cost={cost} //date will be ignored
        saveDisabled={!date}
      />
    </>
  );
}