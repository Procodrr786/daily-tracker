import React from 'react';

export default function ProgressBar({ targetDays, completedCount }) {
  const safeTarget = Math.max(1, Number(targetDays) || 1);
  const safeCompleted = Math.min(safeTarget, Math.max(0, Number(completedCount) || 0));
  const remainingCount = Math.max(0, safeTarget - safeCompleted);
  const percentage = ((safeCompleted / safeTarget) * 100).toFixed(2);

  return (
    <section className="progress-section" aria-label="Discipline Progress">
      <div className="progress-stats-row">
        <div className="progress-stat-pill pill-target">
          <span className="stat-label">Target:</span>{' '}
          <strong className="stat-value">{safeTarget} {safeTarget === 1 ? 'Day' : 'Days'}</strong>
        </div>
        <div className="progress-stat-pill pill-completed">
          <span className="stat-label">Completed:</span>{' '}
          <strong className="stat-value stat-completed">{safeCompleted} {safeCompleted === 1 ? 'Day' : 'Days'}</strong>
        </div>
        <div className="progress-stat-pill pill-remaining">
          <span className="stat-label">Remaining:</span>{' '}
          <strong className="stat-value">{remainingCount} {remainingCount === 1 ? 'Day' : 'Days'}</strong>
        </div>
        <div className="progress-stat-pill pill-progress">
          <span className="stat-label">Progress:</span>{' '}
          <strong className="stat-value">{percentage}%</strong>
        </div>
      </div>

      <div
        className="sketch-progress-track"
        role="progressbar"
        aria-valuenow={Number(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="sketch-progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, Number(percentage)))}%` }}
        />
      </div>
    </section>
  );
}
