import React, { useState, useEffect, useCallback } from 'react';
import TargetSetup from './components/TargetSetup';
import TrackerDashboard from './components/TrackerDashboard';
import {
  ACCENT_THEMES,
  loadTrackerState,
  saveTrackerState,
  resetCompletedDates
} from './utils/storageUtils';
import './App.css';

export default function App() {
  const [trackerState, setTrackerState] = useState(() => loadTrackerState());

  useEffect(() => {
    saveTrackerState(trackerState);
    document.documentElement.setAttribute('data-theme', trackerState.themeMode || 'light');
  }, [trackerState]);

  const activeAccent = ACCENT_THEMES.find((t) => t.id === trackerState.accentColor) || ACCENT_THEMES[0];

  const handleCreateTracker = useCallback((targetDays, startDate) => {
    setTrackerState((prev) => {
      const isSameConfig = prev.targetDays === targetDays && prev.startDate === startDate;
      const nextState = {
        ...prev,
        targetDays,
        startDate,
        completedDates: isSameConfig ? prev.completedDates : [],
        isConfigured: true
      };
      saveTrackerState(nextState);
      return nextState;
    });
  }, []);

  const handleToggleDay = useCallback((isoDate) => {
    setTrackerState((prev) => {
      const exists = prev.completedDates.includes(isoDate);
      const nextCompleted = exists
        ? prev.completedDates.filter((d) => d !== isoDate)
        : [...prev.completedDates, isoDate];
      const nextState = {
        ...prev,
        completedDates: nextCompleted
      };
      saveTrackerState(nextState);
      return nextState;
    });
  }, []);

  const handleResetProgress = useCallback(() => {
    setTrackerState((prev) => resetCompletedDates(prev));
  }, []);

  const handleEditSetup = useCallback(() => {
    setTrackerState((prev) => {
      const nextState = {
        ...prev,
        isConfigured: false
      };
      saveTrackerState(nextState);
      return nextState;
    });
  }, []);

  const handleToggleThemeMode = useCallback(() => {
    setTrackerState((prev) => {
      const nextState = {
        ...prev,
        themeMode: prev.themeMode === 'dark' ? 'light' : 'dark'
      };
      saveTrackerState(nextState);
      return nextState;
    });
  }, []);

  const handleSelectAccentColor = useCallback((colorId) => {
    setTrackerState((prev) => {
      const nextState = {
        ...prev,
        accentColor: colorId
      };
      saveTrackerState(nextState);
      return nextState;
    });
  }, []);

  const themeVars = {
    '--check-green': activeAccent.primary,
    '--check-green-hover': activeAccent.hover,
    '--bg-gradient': trackerState.themeMode === 'dark' ? activeAccent.bgGradDark : activeAccent.bgGradLight,
    '--btn-gradient': activeAccent.btnGrad,
    '--btn-shadow': activeAccent.btnShadow,
    '--accent-soft': trackerState.themeMode === 'dark' ? activeAccent.softDark : activeAccent.softLight
  };

  return (
    <div
      className={`app-wrapper ${trackerState.themeMode === 'dark' ? 'theme-dark' : 'theme-light'}`}
      style={themeVars}
    >
      <div className="app-shell">
        {!trackerState.isConfigured ? (
          <TargetSetup
            initialTargetDays={trackerState.targetDays}
            initialStartDate={trackerState.startDate}
            themeMode={trackerState.themeMode}
            accentColor={trackerState.accentColor}
            onToggleThemeMode={handleToggleThemeMode}
            onSelectAccentColor={handleSelectAccentColor}
            onCreateTracker={handleCreateTracker}
          />
        ) : (
          <TrackerDashboard
            targetDays={trackerState.targetDays}
            startDate={trackerState.startDate}
            completedDates={trackerState.completedDates}
            themeMode={trackerState.themeMode}
            accentColor={trackerState.accentColor}
            onToggleThemeMode={handleToggleThemeMode}
            onSelectAccentColor={handleSelectAccentColor}
            onToggleDay={handleToggleDay}
            onResetProgress={handleResetProgress}
            onEditSetup={handleEditSetup}
          />
        )}
      </div>
    </div>
  );
}
