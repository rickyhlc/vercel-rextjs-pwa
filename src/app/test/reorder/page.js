"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import Item from "@/app/test/reorder/item";

export default function ReorderListPage() {
  const [items, setItems] = useState([{id: 1, name: 'Editable Item 1'}, {id: 2, name: 'Editable Item 2'}, {id: 3, name: 'Editable Item 3'}, {id: 4, name: 'Editable Item 4'}]);

  function handleInput(e) {
    const newName = e.target.value;
    const itemId = parseInt(e.target.id);
    setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, name: newName } : item));
  }

  return (
    <div className="p-4 flex flex gap-20">
    <Reorder.Group values={items} onReorder={setItems}>
      {items.map(item => <Item key={item.id} item={item} onNameChange={handleInput} />)}
    </Reorder.Group>
    <div>
      <div className="mb-5">List data:</div>
      {JSON.stringify(items)}
    </div>
    </div>
  );
}