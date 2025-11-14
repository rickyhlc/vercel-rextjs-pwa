import { Reorder, useDragControls } from "framer-motion";

export default function Item({ item, onNameChange }) {

  const controls = useDragControls();

  return (
    <Reorder.Item key={item.id} value={item} dragListener={false} dragControls={controls}>
      <div className="p-2 bg-blue-400 w-70 m-1 flex items-center">
        <div className="grabHandle" onPointerDown={(e) => controls.start(e)}></div>
        <input className="border-none bg-blue-100 grow-1 ms-2 px-2 text-blue-700" id={item.id} type="text" value={item.name} onChange={onNameChange} />
      </div>
    </Reorder.Item>
  );
}