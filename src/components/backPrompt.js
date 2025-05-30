"use client";

import { useEffect } from 'react';

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