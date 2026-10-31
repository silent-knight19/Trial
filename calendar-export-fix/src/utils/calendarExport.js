/**
 * Calendar Export Utility
 * Handles generating and downloading iCalendar (.ics) format files.
 */

/**
 * Escapes characters for iCalendar TEXT property values according to RFC 5545.
 * @param {string} text
 * @returns {string}
 */
export function escapeICSText(text = '') {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Formats a local date and time string to an iCalendar UTC timestamp (YYYYMMDDTHHmmssZ).
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:mm format
 * @returns {string} Formatted iCalendar UTC timestamp
 */
export function formatDateTimeToUTC(dateStr, timeStr) {
  const localDate = new Date(`${dateStr}T${timeStr}:00`);

  // Bug: serializes local date and time values directly as UTC without converting to UTC
  return `${dateStr.replace(/-/g, '')}T${timeStr.replace(/:/g, '')}00Z`;
}

/**
 * Formats a Date object to an iCalendar UTC timestamp.
 * Used for DTSTAMP metadata.
 * @param {Date} date
 * @returns {string}
 */
export function formatCurrentDTStamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates valid iCalendar (.ics) content for a single event.
 *
 * @param {Object} event
 * @param {string} event.title
 * @param {string} [event.description]
 * @param {string} event.date
 * @param {string} event.startTime
 * @param {string} event.endTime
 * @param {string} [event.location]
 * @param {Object} [options]
 * @param {string} [options.uid]
 * @param {string} [options.dtStamp]
 * @returns {string}
 */
export function generateICS(event, options = {}) {
  const {
    title = '',
    description = '',
    date = '',
    startTime = '',
    endTime = '',
    location = '',
  } = event;

  const dtStart = formatDateTimeToUTC(date, startTime);
  const dtEnd = formatDateTimeToUTC(date, endTime);
  const dtStamp = options.dtStamp || formatCurrentDTStamp();
  const uid = options.uid || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@daymark.local`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Daymark//Event Manager//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICSText(title)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n') + '\r\n';
}

/**
 * Triggers a browser download for the generated iCalendar content.
 *
 * @param {string} filename
 * @param {string} icsContent
 */
export function downloadICS(filename, icsContent) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

