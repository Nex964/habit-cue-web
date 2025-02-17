import { v4 as uuidv4 } from 'uuid';

export function createTask(title: string, type: string, parent: null | string = null){
  return {
    title: title,
    createdBy: localStorage.getItem("userId"), 
    createdAt: getCurrentISO8601Time(), 
    isCompleted: false, 
    id: uuidv4(), 
    parent: parent, 
    type: type, 
    childs: null 
  } 
}


export function getCurrentISO8601Time(now: Date = new Date) {
  const timezoneOffset = -now.getTimezoneOffset(); // Get the time zone offset in minutes
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const pad = (num: any) => String(num).padStart(2, "0");

  // Convert the offset into hours and minutes
  const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
  const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

  // Format the date as ISO 8601
  const formattedDate = now.getFullYear() +
    "-" + pad(now.getMonth() + 1) + // Months are zero-based, so add 1
    "-" + pad(now.getDate()) +
    "T" + pad(now.getHours()) +
    ":" + pad(now.getMinutes()) +
    ":" + pad(now.getSeconds()) +
    "." + String(now.getMilliseconds()).padStart(3, "0") +
    sign + offsetHours + ":" + offsetMinutes;

  return formattedDate;
}