import Image from "next/image";

import signin from "./screens/1_signin.png";
import home1 from "./screens/2_home1-1.png";
import home2 from "./screens/3_home1-2.png";
import home3 from "./screens/4_home1-3.png";
import home4 from "./screens/5_home2.png";
import home5 from "./screens/6_home3-1.png";
import home6 from "./screens/7_home3-2.png";
import home7 from "./screens/8_home3-3.png";
import home8 from "./screens/9_home3-4.png";

import location1 from "./screens/10_location1.png";
import location2 from "./screens/11_location2.png";
import location3 from "./screens/12_location3.png";

import schedule1 from "./screens/13_schedule1.png";
import schedule2 from "./screens/14_schedule2.png";
import schedule3 from "./screens/15_schedule3.png";

import log1 from "./screens/16_log.png";
import log2 from "./screens/17_heatmap.png";

import account from "./screens/19_account.png";


export default function WebContent() {

  const styleH = {
    width: "90%",
    height: "auto"
  }

  const styleV = {
    width: "60%",
    height: "auto"
  }

  return (
    <>
      <div className="pt-12">sign in page</div>
      <Image alt="" src={signin} style={styleH} className="pt-4" />

      <div className="pt-12">Home page with responsive design, allow user to have quick control to their workstations&apos; device (lighting, fan, aircon...etc)</div>
      <Image alt="" src={home1} style={styleH} className="pt-4" />
      <Image alt="" src={home2} style={styleH} className="pt-4" />
      <Image alt="" src={home3} style={styleV} className="pt-4" />

      <div className="pt-12">Control other&apos;s workstation or common area in home page</div>
      <Image alt="" src={home4} style={styleH} className="pt-4" />

      <div className="pt-12">Switch to map view (the polygon in different color represent to location of workstations)</div>
      <Image alt="" src={home5} style={styleH} className="pt-4" />

      <div className="pt-12">Select a polygon to show the control panel (with responsive design)</div>
      <Image alt="" src={home6} style={styleH} className="pt-4" />
      <Image alt="" src={home7} style={styleH} className="pt-4" />
      <Image alt="" src={home8} style={styleV} className="pt-4" />

      <div className="pt-12">Location page for admin to do settings for all workstation or common area, icons on the map show the devices</div>
      <Image alt="" src={location1} style={styleH} className="pt-4" />

      <div className="pt-12">Location page with the setting panel</div>
      <Image alt="" src={location2} style={styleH} className="pt-4" />

      <div className="pt-12">Admin can draw the polygon to represent the workstations and common areas</div>
      <Image alt="" src={location3} style={styleH} className="pt-4" />

      <div className="pt-12">Scheulde page for admin to edit schedule settings for workstations and common areas</div>
      <Image alt="" src={schedule1} style={styleH} className="pt-4" />

      <div className="pt-12">Edit scheulde by dragging on the timetable</div>
      <Image alt="" src={schedule2} style={styleH} className="pt-4" />

      <div className="pt-12">Assign workstation to schedule by drag and drop</div>
      <Image alt="" src={schedule3} style={styleH} className="pt-4" />

      <div className="pt-12">Log page for admin to analyze the usage</div>
      <Image alt="" src={log1} style={styleH} className="pt-4" />

      <div className="pt-12">Heatmap to show the aircon coverage and request record</div>
      <Image alt="" src={log2} style={styleH} className="pt-4" />

      <div className="pt-12">Account page for user management</div>
      <Image alt="" src={account} style={styleH} className="pt-4" />
    </>
  );
}