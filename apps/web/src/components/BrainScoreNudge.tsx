import { useEffect, useState } from 'react';

interface BrainScoreNudgeProps {
  lastCheckInAt: string | null;
  onOpenAssessment: () => void;
}

export function BrainScoreNudge({ lastCheckInAt, onOpenAssessment }: BrainScoreNudgeProps) {
  const [dismissed, setDismissed] = useState(false);

  const daysSince = lastCheckInAt
    ? Math.floor((Date.now() - new Date(lastCheckInAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const shouldShow = !dismissed && (daysSince === null || daysSince >= 5);

  useEffect(() => {
    setDismissed(false);
  }, [lastCheckInAt]);

  if (!shouldShow) return null;

  const message = daysSince === null
    ? "Let’s check your Medhā Score for the first time!"
    : `It's been ${daysSince} days since your last Medhā Score check-in.`;

  return (
    <div className="brain-nudge-card" role="status">
      <div className="brain-nudge-icon">✦</div>
      <div className="brain-nudge-body">
        <p className="brain-nudge-title">{message}</p>
        <p className="brain-nudge-sub">Takes 5 minutes. See how your Medhā activity and capability profile are developing over time.</p>
      </div>
      <div className="brain-nudge-actions">
        <button className="brain-nudge-primary" onClick={onOpenAssessment}>
          Check Now
        </button>
        <button className="brain-nudge-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">
          Later
        </button>
      </div>
    </div>
  );
}