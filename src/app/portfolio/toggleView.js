"use client";

import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function ToggleView({webComponent, mobileComponent}) {

  const [value, _setValue] = useState("web");
  function setValue(e) {
    if (e.target.value !== value) {
      _setValue(e.target.value);
    }
  }

  const btnSX = {
    "&.Mui-selected": {"background": "rgba(25, 118, 210, 0.3)"},
    height: "2rem"
  }

  return (
    <>
      <div className="flex items-center">
        <div className="text-lg me-2">Here are some screenshots of my work in my previous company:</div>
        <ToggleButtonGroup
          color="primary"
          sx={{ bgcolor: "#dddddd" }}
          value={value}
          onChange={setValue}
          exclusive
        >
          <ToggleButton sx={btnSX} value="web">Web</ToggleButton>
          <ToggleButton sx={btnSX} value="mobile">Mobile</ToggleButton>
        </ToggleButtonGroup>
      </div>
      {value === "web" && webComponent}
      {value === "mobile" && mobileComponent}
    </>
  );
}