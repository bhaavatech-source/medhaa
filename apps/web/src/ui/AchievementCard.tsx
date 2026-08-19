import React, { useEffect, useRef } from 'react';
import './AchievementCard.css';

interface AchievementCardProps {
  title: string;
  description: string;
  iconUrl: string;
  unlocked: boolean;
  justUnlocked?: boolean;
  onCelebrationEnd?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  iconUrl,
  unlocked,
  justUnlocked = false,
  onCelebrationEnd,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (justUnlocked && cardRef.current) {
      const timer = setTimeout(() => onCelebrationEnd?.(), 1200);
      return () => clearTimeout(timer);
    }
  }, [justUnlocked, onCelebrationEnd]);

  return (
    <div
      ref={cardRef}
      className={`medhaa-achievement ${
        unlocked ? 'medhaa-achievement--unlocked' : 'medhaa-achievement--locked'
      } ${justUnlocked ? 'medhaa-achievement--celebrate' : ''}`}
      role="group"
      aria-label={`${title} achievement, ${unlocked ? 'unlocked' : 'locked'}`}
    >
      <img src={iconUrl} alt="" className="medhaa-achievement__icon" />
      <div className="medhaa-achievement__body">
        <h4 className="medhaa-achievement__title">{title}</h4>
        <p className="medhaa-achievement__desc">{description}</p>
      </div>
      {justUnlocked && (
        <div className="medhaa-achievement__confetti" aria-hidden="true" />
      )}
    </div>
  );
};