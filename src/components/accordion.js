"use client";

import { Accordion as MuiAccordion, AccordionSummary as MuiAccordionSummary, AccordionDetails as MuiAccordionDetails } from '@mui/material';
import DownArrowIcon from "@/icons/downArrow";
import './accordion.css';

export function Accordion(props) {
  return <MuiAccordion className="accordion" {...props}>{props.children}</MuiAccordion>;
}

export function AccordionSummary(props) {
  return <MuiAccordionSummary expandIcon={<DownArrowIcon colorClass="text-inherit" />} {...props}>{props.children}</MuiAccordionSummary>;
}

export function AccordionDetails(props) {
  return <MuiAccordionDetails {...props}>{props.children}</MuiAccordionDetails>;
}