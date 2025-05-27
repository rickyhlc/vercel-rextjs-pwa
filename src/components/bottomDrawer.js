"use client";

// import { useEffect, useCallback } from "react";
import { SwipeableDrawer } from '@mui/material';

import './bottomDrawer.css';

export default function BottomDrawer({ isOpen, onCancel, children }) {

  // useEffect(() => {
  //   if (isOpen) {
  //     // Push a new state to the history stack when the drawer opens
  //     window.history.pushState(null, "", `#popup`);
  //   } else {

  //   }
  // }, [isOpen]);

  // const onPopState = useCallback((e) => {
  //   if (isOpen) {
  //     onCancel();
  //   }
  // }, [isOpen, onCancel]);

  // const onClose = () => {
  //   if (window.history.hash === "#popup") {
  //     window.history.popState();
  //   onCancel();
  // }

  // useEffect(() => {
  //   window.addEventListener('popstate', onPopState);
  //   return () => {
  //     window.removeEventListener('popstate', onPopState);
  //   }
  // }, [onPopState])

  return (
    <SwipeableDrawer
      anchor={"bottom"}
      open={isOpen}
      onClose={onCancel}
    >
      {children}
    </SwipeableDrawer>
  );
}