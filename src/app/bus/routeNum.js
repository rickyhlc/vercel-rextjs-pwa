export default function RouteNum({ company, route, serviceType }) {

  return (
    <div className="grow-0 basis-14 me-2">
      <div className="font-bold text-lg">{route}</div>
      <div className="text-xs">{company}{serviceType != "1" && " (特)"}</div>
    </div>
  );
}