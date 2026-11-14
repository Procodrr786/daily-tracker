/**
 * Date Utility Functions for Daily Discipline & Calendar Tracker
 * Uses pure local-calendar arithmetic (new Date(year, monthIndex, day))
 * to completely avoid UTC/timezone offset bugs across DST, month, year, and leap-year boundaries.
 */

export const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Formats a Date object as a local YYYY-MM-DD string without UTC conversion.
 */
export function formatLocalISO(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date in local YYYY-MM-DD format.
 */
export function getTodayISO() {
  return formatLocalISO(new Date());
}

/**
 * Safely parses a YYYY-MM-DD string into a local Date object at noon local time
 * to prevent any midnight DST shift anomalies.
 */
export function parseLocalISO(isoString) {
  if (!isoString || typeof isoString !== 'string') {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  }
  const parts = isoString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Formats a YYYY-MM-DD string into a human-readable date like "14 November 2026".
 */
export function formatHumanDate(isoString) {
  const dateObj = parseLocalISO(isoString);
  const day = dateObj.getDate();
  const monthName = MONTHS_FULL[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${monthName} ${year}`;
}

/**
 * Checks whether a given year is a leap year.
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Generates an array of calendar day descriptors for the given startDate (YYYY-MM-DD)
 * and total targetDays count.
 */
export function generateCalendarDays(startDateISO, targetDays) {
  const count = Number(targetDays);
  if (!Number.isInteger(count) || count <= 0) {
    return [];
  }

  const start = parseLocalISO(startDateISO);
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();

  const days = [];
  let prevMonth = -1;
  let prevYear = -1;

  for (let i = 0; i < count; i++) {
    const current = new Date(startYear, startMonth, startDay + i, 12, 0, 0);
    const year = current.getFullYear();
    const monthIndex = current.getMonth();
    const dayNumber = current.getDate();
    const weekdayName = WEEKDAYS[current.getDay()];
    const monthAbbr = MONTHS_SHORT[monthIndex];
    const isoDate = formatLocalISO(current);

    const isMonthStart = i === 0 || monthIndex !== prevMonth;
    const isYearChange = i > 0 && year !== prevYear;
    const shortYear = String(year).slice(-2);

    days.push({
      index: i + 1,
      isoDate,
      dayNumber,
      weekdayName,
      monthAbbr,
      monthFull: MONTHS_FULL[monthIndex],
      year,
      isMonthStart,
      isYearChange,
      monthLabel: isYearChange || (i === 0 && count > 60)
        ? `${monthAbbr} '${shortYear}`
        : monthAbbr,
      fullHumanDate: `${dayNumber} ${MONTHS_FULL[monthIndex]} ${year}`
    });

    prevMonth = monthIndex;
    prevYear = year;
  }

  return days;
}

/**
 * Validates target days input.
 */
export function validateTargetDays(value) {
  const num = Number(value);
  if (!value && value !== 0) {
    return { valid: false, error: 'Please enter your target number of days.' };
  }
  if (!Number.isInteger(num) || isNaN(num)) {
    return { valid: false, error: 'Target days must be a whole number.' };
  }
  if (num < 1) {
    return { valid: false, error: 'Target days must be at least 1 day.' };
  }
  if (num > 1000) {
    return { valid: false, error: 'Please choose a target between 1 and 1,000 days.' };
  }
  return { valid: true, error: '' };
}
