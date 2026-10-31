import { describe, it, expect } from 'vitest';
import {
  generateICS,
  formatDateTimeToUTC,
  escapeICSText,
} from '../utils/calendarExport.js';
import { sampleEvent } from '../data/sampleEvent.js';

describe('Calendar Export Utility', () => {
  const fixedOptions = {
    uid: 'test-event-12345@daymark.local',
    dtStamp: '20261031T143000Z',
  };

  it('generates valid calendar file structure with standard headers and CRLF endings', () => {
    const ics = generateICS(sampleEvent, fixedOptions);

    expect(ics).toContain('BEGIN:VCALENDAR\r\n');
    expect(ics).toContain('VERSION:2.0\r\n');
    expect(ics).toContain('BEGIN:VEVENT\r\n');
    expect(ics).toContain('END:VEVENT\r\n');
    expect(ics).toContain('END:VCALENDAR\r\n');
    expect(ics.endsWith('\r\n')).toBe(true);

    // Verify all line endings are strictly CRLF
    const lines = ics.split('\r\n');
    expect(lines.length).toBeGreaterThan(5);
  });

  it('exports correct event title and description in the calendar content', () => {
    const ics = generateICS(sampleEvent, fixedOptions);

    expect(ics).toContain('SUMMARY:Project Planning Review\r\n');
    expect(ics).toContain('DESCRIPTION:Review project milestones and discuss upcoming tasks.\r\n');

    // Verify text escaping logic
    const complexText = 'Review, milestones; with \\ backslashes and\nnewlines';
    const escaped = escapeICSText(complexText);
    expect(escaped).toBe('Review\\, milestones\\; with \\\\ backslashes and\\nnewlines');
  });

  it('exports correct location and event details', () => {
    const ics = generateICS(sampleEvent, fixedOptions);

    expect(ics).toContain('LOCATION:Meeting Room 2\r\n');
    expect(ics).toContain(`UID:${fixedOptions.uid}\r\n`);
    expect(ics).toContain(`DTSTAMP:${fixedOptions.dtStamp}\r\n`);
  });

  it('converts local event start and end times to correct UTC timestamps', () => {
    // In Asia/Kolkata (UTC+5:30):
    // 10:00 AM local corresponds to 04:30 AM UTC (20261102T043000Z)
    // 11:00 AM local corresponds to 05:30 AM UTC (20261102T053000Z)
    const dtStart = formatDateTimeToUTC(sampleEvent.date, sampleEvent.startTime);
    const dtEnd = formatDateTimeToUTC(sampleEvent.date, sampleEvent.endTime);

    expect(dtStart).toBe('20261102T043000Z');
    expect(dtEnd).toBe('20261102T053000Z');

    const ics = generateICS(sampleEvent, fixedOptions);
    expect(ics).toContain('DTSTART:20261102T043000Z\r\n');
    expect(ics).toContain('DTEND:20261102T053000Z\r\n');
  });
});

