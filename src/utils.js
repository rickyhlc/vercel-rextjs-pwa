/**
 * 
 * @returns today's ts
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

export const ONE_DAY = 86400000;