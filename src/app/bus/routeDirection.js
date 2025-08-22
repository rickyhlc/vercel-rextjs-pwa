export default function RouteDirection({ dest, orig }) {

  return (
    <div className="grow-1 text-left">
      <div className="text-lg">往 {dest}</div>
      <div className="text-xs">{orig}</div>
    </div>
  );
}