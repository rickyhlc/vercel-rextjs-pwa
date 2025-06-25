"use client";

import { useEffect } from 'react';

// testing only, can be removed now
// testing only, the prompt may not show on back

export default function BackPrompt() {

  useEffect(() => {
    console.log("add back prompt listener");
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave this page?';
    }
    window.addEventListener('beforeunload', handler);
    return () => {
      console.log("remove back prompt listener");
      window.removeEventListener('beforeunload', handler);
    }
  }, []);


  return <></>;
}