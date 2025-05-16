/**
 * 
 * @returns today's ts
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const TXT_ZINC = "text-zinc-800 dark:text-zinc-200";
export const BG_ZINC = "bg-zinc-200 dark:bg-zinc-800";
export const TXT_DISABLED = "disabled:text-zinc-400 dark:disabled:text-zinc-600";
export const BG_DISABLED = "disabled:bg-zinc-400 dark:disabled:bg-zinc-600";
export const ALL_ZINC = `${TXT_ZINC} ${BG_ZINC}`;
export const BTN_BLUE = `${BG_DISABLED} bg-blue-200/70 dark:bg-blue-800/70 active:bg-blue-200 dark:active:bg-blue-800 hover:bg-blue-200/85 dark:hover:bg-blue-800/85 ${TXT_ZINC}`;
export const PLAIN_BTN_BLUE = `disabled:bg-transparent dark:disabled:bg-transparent active:bg-blue-200 dark:active:bg-blue-800 hover:bg-blue-200/85 dark:hover:bg-blue-800/85 ${TXT_ZINC} ${TXT_DISABLED}`;