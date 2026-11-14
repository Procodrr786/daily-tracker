import React from 'react';
import DayBox from './DayBox';

export default function CalendarGrid({ days, completedSet, todayISO, onToggleDay }) {
  if (!days || days.length === 0) {
    return (
      <div className="empty-grid-message">
        No calendar days generated. Please configure your target days.
      </div>
    );
  }

  return (
    <div className="calendar-grid" role="region" aria-label="Discipline Calendar Grid">
      {days.map((day) => (
        <DayBox
          key={day.isoDate}
          day={day}
          isCompleted={completedSet.has(day.isoDate)}
          isToday={day.isoDate === todayISO}
          onToggle={onToggleDay}
        />
      ))}
    </div>
  );
}
