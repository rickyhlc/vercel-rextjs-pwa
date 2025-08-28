import { TXT_SOFT, TXT_ZINC } from "@/lib/utils";

/**
 * etas [{
 *   minutes: 34,
 *   remark: ""
 * }]
 */
export default function StopETA({ etas }) {

  return (
    <div className="grow-1 text-left text-sm">
      {etas && etas.map((eta, i) => (
        <div key={i} className={`flex items-baseline ${i == 0 ? TXT_ZINC : TXT_SOFT}`}>
          <span className={`me-1 text-blue-400 ${i == 0 ? "font-bold text-lg" : ""}`}>{eta.minutes}</span>
          <span>分鐘</span>
          <span className="ms-2">{eta.remark && `(${eta.remark})`}</span>
        </div>
      ))}
    </div>
  );
}
