import React, { useState } from 'react';
import {
  getTodayISO,
  formatHumanDate,
  generateCalendarDays,
  validateTargetDays
} from '../utils/dateUtils';
import { ACCENT_THEMES } from '../utils/storageUtils';

const PRESET_TARGETS = [30, 60, 90, 180, 365];

export default function TargetSetup({
  initialTargetDays,
  initialStartDate,
  themeMode,
  accentColor,
  onToggleThemeMode,
  onSelectAccentColor,
  onCreateTracker
}) {
  const [targetInput, setTargetInput] = useState(String(initialTargetDays || 90));
  const [startDate, setStartDate] = useState(initialStartDate || getTodayISO());
  const [committed, setCommitted] = useState(true);
  const [error, setError] = useState('');

  const handlePresetClick = (days) => {
    setTargetInput(String(days));
    setError('');
  };

  const handleTargetChange = (e) => {
    setTargetInput(e.target.value);
    if (error) setError('');
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val || getTodayISO());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateTargetDays(targetInput);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    const validDays = Number(targetInput);
    const chosenStart = startDate || getTodayISO();
    onCreateTracker(validDays, chosenStart);
  };

  const previewValid = validateTargetDays(targetInput).valid;
  const previewDays = previewValid ? generateCalendarDays(startDate || getTodayISO(), Number(targetInput)) : [];
  const firstDay = previewDays[0];
  const lastDay = previewDays[previewDays.length - 1];

  return (
    <div className="setup-screen-container">
      {/* Top-left Crown Badge & Color Swatches (matches reference image) */}
      <div className="floating-top-left">
       
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
            />
          ))}
        </div>
      </div>

      {/* Split-Panel Elevated Card (matches reference image) */}
      <div className="split-setup-card sketch-card setup-card">
        {/* Left Dark Hero Panel */}
        <div className="split-left-hero">
          <div className="hero-watermark-num" aria-hidden="true">
            {previewValid ? targetInput : '90'}
          </div>

          <div className="hero-brand-top">
            <span className="hero-company-tag">DAILY DISCIPLINE</span>
          </div>

          <div className="hero-headline-block">
            <h2 className="hero-display-text">
              Start your
              <br />
              journey.
              <br />
              <span className="hero-display-bold">Today.</span>
            </h2>
          </div>

          <div className="hero-bottom-learn">
            <span className="hero-accent-line" />
            <span className="hero-learn-text">
              {previewValid && firstDay && lastDay
                ? `${targetInput} Days • ${firstDay.monthAbbr} ${firstDay.dayNumber} – ${lastDay.monthAbbr} ${lastDay.dayNumber}, ${lastDay.year}`
                : 'Build Unbreakable Consistency'}
            </span>
          </div>
        </div>

        {/* Right Clean Form Panel */}
        <div className="split-right-form">
          <div className="right-header-tabs">
            <span className="tab-inactive">Track Daily</span>
            <span className="tab-or">or</span>
            <h1 className="setup-heading tab-active">Please Select Your Target Days</h1>
          </div>

          <form onSubmit={handleSubmit} className="setup-form" noValidate>
            {/* Preset Target Day Pills */}
            <div className="form-group">
              <div className="preset-chips-row" role="group" aria-label="Preset target days">
                {PRESET_TARGETS.map((preset) => {
                  const isActive = Number(targetInput) === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`sketch-chip ${isActive ? 'sketch-chip-active' : ''}`}
                    >
                      {preset} Days
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Underlined Input 1: Target Days */}
            <div className="underlined-input-group">
              <label htmlFor="target-days-input" className="input-icon-label" title="Target Number of Days">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
                <span className="sr-only-label">Target Days</span>
              </label>
              <div className="underlined-field-wrap">
                <span className="floating-mini-label">Target Days</span>
                <input
                  id="target-days-input"
                  type="number"
                  min="1"
                  max="1000"
                  value={targetInput}
                  onChange={handleTargetChange}
                  placeholder="Enter target days (e.g. 90)"
                  className="sketch-input underlined-input"
                  required
                />
              </div>
            </div>

            {/* Underlined Input 2: Start Date */}
            <div className="underlined-input-group">
              <label htmlFor="start-date-input" className="input-icon-label" title="Start Date">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <line x1="16" y1="3" x2="16" y2="7" />
                  <line x1="8" y1="3" x2="8" y2="7" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="sr-only-label">Start Date</span>
              </label>
              <div className="underlined-field-wrap">
                <span className="floating-mini-label">Start Date ({formatHumanDate(startDate)})</span>
                <input
                  id="start-date-input"
                  type="date"
                  value={startDate}
                  onChange={handleDateChange}
                  className="sketch-input underlined-input"
                  required
                />
              </div>
            </div>

            {/* Read-only Summary Row styled like 3rd underlined line */}
            {previewValid && firstDay && lastDay ? (
              <div className="underlined-input-group summary-underlined-row">
                <span className="input-icon-label" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                </span>
                <div className="underlined-field-wrap summary-inline-text">
                  <span>
                    <strong>{targetInput} {Number(targetInput) === 1 ? 'Box' : 'Boxes'}</strong> &bull; {firstDay.weekdayName}, {formatHumanDate(startDate)} &rarr; {lastDay.weekdayName}, {lastDay.fullHumanDate}
                  </span>
                </div>
              </div>
            ) : null}

            {error ? (
              <p className="sketch-error" role="alert">
                {error}
              </p>
            ) : null}

            {/* Commitment Checkbox Row (matches reference image checkbox) */}
            <label className="commitment-checkbox-row">
              <input
                type="checkbox"
                checked={committed}
                onChange={(e) => setCommitted(e.target.checked)}
                className="commitment-checkbox-input"
              />
              <span className="custom-orange-checkbox">
                {committed ? '✓' : ''}
              </span>
              <span className="commitment-text">
                I commit to tracking my daily consistency for{' '}
                <span className="commitment-accent-link">
                  {previewValid ? `${targetInput} consecutive days` : 'my target days'}
                </span>
              </span>
            </label>

            {/* Bottom Action Row: Gradient Pill Button + Underlined Secondary Link */}
            <div className="setup-action-footer">
              <button type="submit" className="sketch-btn sketch-btn-primary pill-gradient-btn setup-create-btn">
                Create
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetInput('90');
                  setStartDate(getTodayISO());
                  setError('');
                }}
                className="already-member-link"
              >
                Reset to 90-day default
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom-right Floating Sparkle Button for Dark/Light Mode (matches reference image) */}
      <button
        type="button"
        onClick={onToggleThemeMode}
        className="floating-sparkle-btn theme-toggle-btn"
        title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Switch between Light and Dark mode"
      >
        <span className="sparkle-icon" aria-hidden="true">✦</span>
        <span className="sparkle-label">{themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
      </button>
    </div>
  );
}
