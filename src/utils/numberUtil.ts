
export function getRandomNumber(n: number): number {
  return Math.floor(Math.random() * n);
}

export function convertTo24HourFormat(time12: string) {
  let [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  return `${hours}:${minutes}`;
}

export function extractTime(timeStr: string) {
  // Splitting the string into time and period parts
  const [time, period] = timeStr.split(' ');

  // Further split time into hours and minutes
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  // Adjust hours for PM times
  if (period === 'PM' && hours < 12) {
    hours += 12;
  }

  // Adjust hours to 0 for 12 AM
  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

/**
 * convert Date in string with "MM/DD/YYYY" format
 * @param date Date
 * @returns string
 */
export function formatDateInYMD(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
/**
 * convert YYYY-MM-DD to MM/DD/YYYY
 * @param inputDate [string]
 * @returns [string]
 */
export function convertDateString(inputDate: string) {
  // Split the string into parts
  const parts = inputDate.split('-');
  // Rearrange the parts and join them with '/'
  const convertedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
  return convertedDate;
}