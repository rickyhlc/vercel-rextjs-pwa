import Image from "next/image";

import app1 from "./screens/app1.png";
import app2 from "./screens/app2.png";
import app3 from "./screens/app3.png";
import app4 from "./screens/app4.png";
import app5 from "./screens/app5.png";


export default function MobileContent() {


  const styleV = {
    width: "45%",
    height: "auto"
  }

  return (
    <>
    <div className="flex justify-around">
      <div className="pt-12">Home page</div>
      <div className="pt-12">Device usage data page</div>
    </div>
    <div className="flex justify-around">
      <Image alt="" src={app1} style={styleV} className="pt-4" />
      <Image alt="" src={app2} style={styleV} className="pt-4" />
    </div>

    <div className="flex justify-around">
      <div className="pt-12">Control workstation (select)</div>
      <div className="pt-12">Control workstation (control)</div>
    </div>
    <div className="flex justify-around">
      <Image alt="" src={app3} style={styleV} className="pt-4" />
      <Image alt="" src={app4} style={styleV} className="pt-4" />
    </div>

    <div className="flex justify-around">
      <div className="pt-12">Energy saving data</div>
    </div>
    <div className="flex justify-around">
      <Image alt="" src={app5} style={styleV} className="pt-4" />
    </div>
    </>
  );
}