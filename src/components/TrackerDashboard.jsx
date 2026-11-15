import React, { useState, useMemo } from 'react';
import Motivation from './Motivation';
import ProgressBar from './ProgressBar';
import CalendarGrid from './CalendarGrid';
import { generateCalendarDays, formatHumanDate, getTodayISO } from '../utils/dateUtils';
import { ACCENT_THEMES } from '../utils/storageUtils';

export default function TrackerDashboard({
  targetDays,
  startDate,
  completedDates,
  themeMode,
  accentColor,
  onToggleThemeMode,
  onSelectAccentColor,
  onToggleDay,
  onResetProgress,
  onEditSetup
}) {
  const [showResetModal, setShowResetModal] = useState(false);

  const calendarDays = useMemo(
    () => generateCalendarDays(startDate, targetDays),
    [startDate, targetDays]
  );

  const validDateSet = useMemo(
    () => new Set(calendarDays.map((d) => d.isoDate)),
    [calendarDays]
  );

  const completedSet = useMemo(() => {
    const filtered = (completedDates || []).filter((d) => validDateSet.has(d));
    return new Set(filtered);
  }, [completedDates, validDateSet]);

  const todayISO = getTodayISO();
  const lastDay = calendarDays[calendarDays.length - 1];

  const handleConfirmReset = () => {
    onResetProgress();
    setShowResetModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Top Header with Toolbar, Motivation, and Progress */}
      <header className="dashboard-header sketch-card">
        {/* Row 1: Theme Swatches + Action Buttons */}
        <div className="dashboard-toolbar">
          <div className="toolbar-left-group">
            <div className="color-swatches-group" role="group" aria-label="Accent color theme">
              {ACCENT_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectAccentColor(t.id)}
                  className={`color-swatch-btn ${accentColor === t.id ? 'color-swatch-active' : ''}`}
                  style={{ backgroundColor: t.primary }}
                  title={`${t.label} theme`}
                  aria-label={`${t.label} color theme`}
                ></button>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleThemeMode}
              className="sketch-btn sketch-btn-small theme-toggle-btn"
              title="Toggle Light or Dark mode"
            >
              {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          <div className="header-actions">
            <button
              type="button"
              onClick={onEditSetup}
              className="sketch-btn sketch-btn-secondary"
              title="Change target days or start date"
            >
              Change Target
            </button>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="sketch-btn sketch-btn-danger"
              title="Reset all completed boxes"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Row 2: Motivational Quote Banner */}
        <div className="header-top-bar">
          <Motivation />
        </div>

        {/* Row 3: Date Range Metadata */}
        <div className="header-meta-row">
          <span className="meta-item">
            Start Date: <strong>{formatHumanDate(startDate)}</strong>
          </span>
          {lastDay ? (
            <span className="meta-item">
              End Date: <strong>{lastDay.fullHumanDate}</strong>
            </span>
          ) : null}
          <span className="meta-item meta-hint-item">
            Tap any box to toggle completion
          </span>
        </div>

        {/* Row 4: Progress KPIs & Bar */}
        <ProgressBar
          targetDays={calendarDays.length}
          completedCount={completedSet.size}
        />
      </header>

      {/* Main Calendar Box Grid */}
      <main className="dashboard-main sketch-card">
        <CalendarGrid
          days={calendarDays}
          completedSet={completedSet}
          todayISO={todayISO}
          onToggleDay={onToggleDay}
        />
      </main>

      {/* Confirmation Dialog Modal for Reset */}
      {showResetModal ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="sketch-card modal-box">
            <h2 id="reset-modal-title" className="modal-title">
              Reset Completed Progress?
            </h2>
            <p className="modal-text">
              Are you sure you want to reset all <strong>{completedSet.size}</strong> completed{' '}
              {completedSet.size === 1 ? 'box' : 'boxes'}? Your target of{' '}
              <strong>{targetDays} days</strong> and start date (
              <strong>{formatHumanDate(startDate)}</strong>) will be preserved.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="sketch-btn sketch-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="sketch-btn sketch-btn-danger"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
