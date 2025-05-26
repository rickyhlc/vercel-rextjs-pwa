"use client";

import { useEffect, useState, useRef } from "react";
import { SwipeableDrawer } from '@mui/material';
import { getToday } from "@/utils";

import './bottomDrawer.css';

export default function BottomDrawer({ isOpen, selectionType, initialVal, onSave, onCancel, children }) {

  return (
    <SwipeableDrawer
      anchor={"bottom"}
      open={isOpen}
      onClose={onCancel}
      // onOpen={toggleDrawer(anchor, true)}
    >
      {children}
    </SwipeableDrawer>
  );
}