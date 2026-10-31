import React, { useState } from 'react';
import { sampleEvent } from '../data/sampleEvent';
import { generateICS, downloadICS } from '../utils/calendarExport';

export default function EventForm() {
  const [eventData, setEventData] = useState(sampleEvent);
  const [notification, setNotification] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExport = (e) => {
    e.preventDefault();

    try {
      const icsContent = generateICS(eventData);
      const filename = `${eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'event'}.ics`;

      downloadICS(filename, icsContent);

      setNotification(`Event exported successfully as ${filename}`);
      setTimeout(() => {
        setNotification('');
      }, 4000);
    } catch (err) {
      console.error('Failed to export calendar event:', err);
      setNotification('Export failed. Please check event details.');
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-badge">Scheduled Event</div>
        <h2 className="event-headline">{eventData.title}</h2>
        <p className="event-subhead">
          Review and manage event details prior to calendar synchronization.
        </p>
      </div>

      {notification && (
        <div className="notification" role="status" aria-live="polite">
          <svg
            className="notification-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleExport} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={eventData.title}
            onChange={handleChange}
            placeholder="Event Title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Event Description"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={eventData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={eventData.location}
              onChange={handleChange}
              placeholder="e.g. Conference Room"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              required
              value={eventData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              required
              value={eventData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" id="export-button">
            <svg
              className="btn-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                clipRule="evenodd"
              />
            </svg>
            Export to Calendar (.ics)
          </button>
        </div>
      </form>
    </div>
  );
}

