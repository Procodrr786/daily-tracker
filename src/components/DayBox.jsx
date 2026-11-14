import React from 'react';

export default function DayBox({ day, isCompleted, isToday, onToggle }) {
  return (
    <div className="day-cell-wrapper">
      <span className="day-weekday-label">{day.weekdayName}</span>

      <button
        type="button"
        onClick={() => onToggle(day.isoDate)}
        className={`day-box ${isCompleted ? 'day-box-completed' : ''} ${isToday ? 'day-box-today' : ''}`}
        title={`Day ${day.index}: ${day.weekdayName}, ${day.fullHumanDate} (${isCompleted ? 'Completed - click to unmark' : 'Incomplete - click to complete'})`}
        aria-pressed={isCompleted}
        aria-label={`${day.weekdayName} ${day.fullHumanDate}, Day ${day.index}, ${isCompleted ? 'Completed' : 'Incomplete'}`}
      >
        {isCompleted ? (
          <div className="day-box-completed-inner">
            <svg
              className="sketch-checkmark-svg"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 14.8L11.2 20L22 8"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="day-date-number day-date-completed">{day.dayNumber}</span>
          </div>
        ) : (
          <span className="day-date-number">{day.dayNumber}</span>
        )}
      </button>

      <span className={`day-month-label ${day.isMonthStart ? 'day-month-start' : ''}`}>
        {day.monthLabel}
      </span>
    </div>
  );
}
