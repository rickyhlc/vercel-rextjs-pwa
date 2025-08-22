import { TXT_SOFT, TXT_ZINC } from "@/lib/utils";

/**
 * etas [{
 *   minutes: 34,
 *   remark: ""
 * }]
 */
export default function StopETA({ etas }) {

  console.log("StopETA");

  return (
    <div className="grow-1 text-left text-sm">
      {etas && etas.map((eta, i) => (
        <div key={i} className={`flex ${i == 0 ? TXT_ZINC : TXT_SOFT}`}>
          <span className="text-blue-400 font-bold me-1">{eta.minutes}</span>
          <span>分鐘</span>
          <span className="ms-2">{eta.remark && `(${eta.remark})`}</span>
        </div>
      ))}
    </div>
  );
}
