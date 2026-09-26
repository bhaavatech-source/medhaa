// StudentGamesPage.tsx
// Complete student-facing Medhaa experience.
// Preserves the existing game loading/access/subscription behaviour while adding:
// - age selection (5–9, 10–13, 14–17, 18+ Aspirants)
// - dedicated Medhā for Aspirants (18+) pathway with exam-focus hub
// - age-specific CSS/SVG-generated visual worlds
// - student navigation
// - My Medhā check-in first, followed by the game collection and supporting tools,
//   Real Life Lab, Create Lab and My Journey entry points
// - Medhaa branding from src/assets/logo
//
// Logo files expected in:
//   src/assets/logo/M_2.png
//   src/assets/logo/medhaa-icon.svg

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard, GameTier } from './GameCard';
import { useGameGate } from '../pages/hooks/useGameGate';
import LoginPricingModal from './LoginPricingModal';
import { GAMES_CATALOG, getCatalogEntry } from '../data/gamesCatalog';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../utils/authFetch';
import { useClickSound } from '../pages/hooks/useClickSound';
import { ProgressBar } from '../ui/ProgressBar';
import medhaaLogo from '../assets/logo/M_2.png';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';
import '../styles/games-grid.css';
import '../styles/games-grid-enhanced.css';
import '../styles/student-games-page.css';
import { SimilarGames } from './SimilarGames';
import { getLastPlayedSlug, markPlayed } from '../services/gameExposure';

interface GameWithAccess {
  slug: string;
  title: string;
  domain: string;
  ageLabel: string;
  skills: string[];
  tier: GameTier;
  access: { allowed: boolean; reason: string; daysSinceSignup: number };
  entryPath?: string;
}

function displayGameTitle(title: string) {
  return title.replace(/bh[aā]va/gi, 'Medhā');
}

interface StudentGamesPageProps {
  apiUrl: string;
  childStudentId?: string;
}

type AgeAccent = 'sunny' | 'explorer' | 'future' | 'aspirants';

interface AgeProfile {
  label: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  greeting: string;
  accent: AgeAccent;
  icon: string;
}


type AgeGroup = '5-9' | '10-13' | '14-17' | 'aspirants';
const AGE_PROFILES: Record<AgeGroup, AgeProfile> = {
  '5-9': {
    label: '5–9 years',
    shortLabel: 'Play & discover',
    title: 'Play, wonder & discover',
    subtitle: 'Bright little adventures that turn curiosity into learning.',
    greeting: 'Ready for a little adventure?',
    accent: 'sunny',
    icon: '🌈',
  },
  '10-13': {
    label: '10–13 years',
    shortLabel: 'Explore & build',
    title: 'Challenge, build & explore',
    subtitle: 'Quests, puzzles and practical challenges for a growing mind.',
    greeting: 'What will you challenge yourself with today?',
    accent: 'explorer',
    icon: '🚀',
  },
  '14-17': {
    label: '14–17 years',
    shortLabel: 'Think & create',
    title: 'Think deeper. Build your future.',
    subtitle: 'Strategic challenges, useful tools and real-world learning.',
    greeting: 'Choose something that moves you forward.',
    accent: 'future',
    icon: '✦',
  },
  aspirants: {
    label: '18+ years',
    shortLabel: 'Focus & prepare',
    title: 'Prepare the mind behind the preparation.',
    subtitle: 'Focused cognitive practice, practical tools and purposeful challenges alongside your exam preparation.',
    greeting: 'Start a focused session.',
    accent: 'aspirants',
    icon: '🎯',
  },
};

const AGE_STORAGE_KEY = 'medhaa-student-age-group';

const FALLBACK_PERMANENT_FREE_SLUGS = new Set([
  'bhava-build-device-engineer',
  'bhava-smriti',
  'build-your-car',
  'focus-flash',
  'life-strategist-starter',
  'dharana-arena',
  'nagarikx-enhanced',
  'planet-guardians',
  'soccomm-enhanced',
  'neuroflash-memory',
  'calm-zone',
  'good-habits',
  'bcs-lite-v3',
  'medha-read-anybook-in-3hrs',
]);

const FALLBACK_ROTATING_SLUGS = new Set([
  'bhava-tech-likhwell',
  'brain-garden',
  'brain-quest',
  'day-hero-game',
  'day-super-hero',
  'iq-test-level-3',
  'logic-game',
  'math-blitz-example',
  'math-blitz',
  'memory-match-puzzle',
  'memory-match-ultimate',
  'memory-zoo-puzzle',
  'mindscape-pro',
  'mindspark-iq',
  'neurospark',
  'percentile-game',
]);

function buildFallbackGames(): GameWithAccess[] {
  return Object.values(GAMES_CATALOG).map((game) => {
    const tier: GameTier = game.slug === 'bcs-lite-v3'
      ? 'assessment'
      : FALLBACK_PERMANENT_FREE_SLUGS.has(game.slug)
        ? 'permanent-free'
        : FALLBACK_ROTATING_SLUGS.has(game.slug)
          ? 'rotating-free'
          : 'premium-only';

    return {
      slug: game.slug,
      title: displayGameTitle(game.title),
      domain: game.domain,
      ageLabel: `${game.ageMin}-${game.ageMax}`,
      skills: game.skillsBuilt,
      tier,
      access: {
        allowed: tier === 'assessment' || tier === 'permanent-free',
        reason: tier === 'rotating-free' ? 'This rotating game is not available today.' : 'Premium game',
        daysSinceSignup: 0,
      },
    };
  });
}

/**
 * Curated first-screen collections.
 *
 * These are deliberately separate from the complete catalogue:
 * - the catalogue remains the source of truth for every available game;
 * - these lists control what a student sees first;
 * - age eligibility is checked against gamesCatalog.ts before a game is recommended.
 *
 * Language-specific games are intentionally not forced into a student's
 * recommendations until Medhā has a language preference/profile.
 */
const CURATED_GAME_SLUGS: Record<Exclude<AgeGroup, 'aspirants'>, string[]> = {
  '5-9': [
    'dharana-arena',
    'focus-flash',
    'bhava-smriti',
    'memory-match-puzzle',
    'memory-zoo-puzzle',
    'visual-difference-detector',
    'good-habits',
    'calm-zone',
    'day-hero-game',
    'number-garden-quest',
    'grammar-galaxy',
    'imaginia-quest',
    'nadopaasana',
  ],
  '10-13': [
    'dharana-arena',
    'focus-flash',
    'neuroflash-memory',
    'bhava-smriti',
    'memory-match-puzzle',
    'visual-difference-detector',
    'empathy-quest',
    'empathy-conversation',
    'intelligent-machines',
    'brain-of-all-machines',
    'hidden-science',
    'bhava-tech-build-your-bike',
    'build-your-car',
    'soccomm-enhanced',
    'ready-for-the-world',
    'google-search-lab-deep-v2',
    'grammar-pro',
    'nadopaasana',
  ],
  '14-17': [
    'focus-under-distraction',
    'iq-test-level-3',
    'dharana-arena',
    'bhava-math-grid',
    'mental-rotation-game',
    'neuroflash-memory',
    'bhava-smriti',
    'logic-game',
    'logic-grid-puzzle',
    'brain-quest',
    'math-blitz',
    'hidden-maths',
    'know-maths',
    'rocket-build-engineer',
    'bhava-space-academy',
    'drone-build-engineer',
    'life-strategist-starter',
    'finlife-india-quest-enhanced',
    'career-adventure',
    'google-search-lab-deep-v2',
    'grammar-pro',
    'nadopaasana',
  ],
};

/**
 * The current catalogue is primarily built for the 5–17 student journey.
 * For 18+ Aspirants, the hub therefore uses a small, purposefully cognitive
 * practice collection rather than claiming that these games are adult-rated.
 */
const ASPIRANT_GAME_SLUGS = [
  'focus-under-distraction',
  'dharana-arena',
  'bhava-math-grid',
  'mental-rotation-game',
  'logic-game',
  'logic-grid-puzzle',
  'brain-quest',
  'math-blitz',
  'neuroflash-memory',
  'bhava-smriti',
  'focus-flash',
  'neurospark',
  'bcs-lite-v3',
  'take-test',
  'mindscape-pro',
  'mindspark-iq',
  'neuro-ascend-iq',
];

const AGE_BOUNDS: Record<Exclude<AgeGroup, 'aspirants'>, { min: number; max: number }> = {
  '5-9': { min: 5, max: 9 },
  '10-13': { min: 10, max: 13 },
  '14-17': { min: 14, max: 17 },
};

function isAgeEligible(game: GameWithAccess, ageGroup: Exclude<AgeGroup, 'aspirants'>): boolean {
  const catalog = getCatalogEntry(game.slug);
  if (!catalog) return false;

  const bounds = AGE_BOUNDS[ageGroup];
  return catalog.ageMin <= bounds.max && catalog.ageMax >= bounds.min;
}

function buildRecommendedGames(games: GameWithAccess[], ageGroup: AgeGroup): GameWithAccess[] {
  const recommendationSafeGames = games.filter((game) => game.tier !== 'rotating-free');
  const bySlug = new Map(recommendationSafeGames.map((game) => [game.slug, game]));
  const orderedSlugs = ageGroup === 'aspirants'
    ? ASPIRANT_GAME_SLUGS
    : CURATED_GAME_SLUGS[ageGroup];

  const curated = orderedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((game): game is GameWithAccess => {
      if (!game) return false;
      return ageGroup === 'aspirants' || isAgeEligible(game, ageGroup);
    });

  // If a backend catalogue is missing one of the curated games, fill the
  // remaining recommendation slots with eligible games, while keeping
  // different domains represented.
  const fallback = recommendationSafeGames.filter((game) => {
    if (curated.some((item) => item.slug === game.slug)) return false;
    if (ageGroup === 'aspirants') {
      return ['cognitive-focus', 'cognitive-memory', 'cognitive-logic', 'cognitive-math', 'cognitive-assessment'].includes(game.domain);
    }
    return isAgeEligible(game, ageGroup);
  });

  const seenDomains = new Set(curated.map((game) => game.domain));
  const balancedFallback = fallback.sort((a, b) => {
    const aPenalty = seenDomains.has(a.domain) ? 1 : 0;
    const bPenalty = seenDomains.has(b.domain) ? 1 : 0;
    return aPenalty - bPenalty;
  });

  return [...curated, ...balancedFallback].slice(0, 12);
}


const folderBasedSlugs = new Set([
  'bhava-build-device-engineer',
  'bhava-smriti',
  'bhava-space-academy',
  'bhava-tech-build-your-bike',
  'brain-of-all-machines',
  'build-your-car',
  'devanagari-game',
  'drone-build-engineer',
  'focus-flash',
  'hidden-maths',
  'intelligent-machines',
  'know-maths',
  'life-strategist-starter',
  'nadopaasana',
  'plane-builder',
  'rocket-build-engineer',
  'secret-of-silicon-game',
]);

function formatDomainLabel(domain: string): string {
  const map: Record<string, string> = {
    'cognitive-assessment': 'IQ Assessment',
    'cognitive-focus': 'Focus & Attention',
    'cognitive-logic': 'Logic & Reasoning',
    'cognitive-math': 'Math Skills',
    'cognitive-memory': 'Memory',
    'emotional-intel': 'Emotional Intelligence',
    'stem-engineering': 'Engineering',
    environment: 'Science in Life',
    'life-skills': 'Life Skills',
    creativity: 'Creativity',
    music: 'Music',
    'language-english': 'English',
    'language-hindi': 'Hindi',
    'language-telugu': 'Telugu',
    career: 'Career Explorer',
    civics: 'Civics',
    finance: 'Financial Literacy',
    'digital-literacy': 'Digital Literacy',
  };

  return map[domain] ?? domain.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const FEATURE_ITEMS = [
  {
    key: 'homework', icon: '📚', title: 'Homework',
    description: 'Keep school tasks, due dates and completion in one calm place.',
    tone: 'teal', action: 'Open Homework',
  },
  {
    key: 'time', icon: '⏱️', title: 'My Time',
    description: 'Plan study, breaks and focused sessions without making the day complicated.',
    tone: 'violet', action: 'Plan My Time',
  },
  {
    key: 'math', icon: '🧮', title: 'Math Lab',
    description: 'A calculator that helps you calculate, convert and understand real-life maths.',
    tone: 'orange', action: 'Open Math Lab',
  },
  {
    key: 'daily', icon: '🧩', title: 'Daily Challenge',
    description: 'One short problem, puzzle or real-world thinking challenge each day.',
    tone: 'pink', action: 'Try Today',
  },
  {
    key: 'planner', icon: '🗓️', title: 'Study Planner',
    description: 'Turn upcoming work into a simple plan you can actually follow.',
    tone: 'blue', action: 'Make a Plan',
  },
  {
    key: 'real-life', icon: '🌍', title: 'Real Life Lab',
    description: 'Explore money, travel, sports, technology and everyday decisions.',
    tone: 'green', action: 'Explore',
  },
  {
    key: 'create', icon: '🎨', title: 'Create Lab',
    description: 'Make, experiment and express ideas through music, stories, code and more.',
    tone: 'purple', action: 'Start Creating',
  },
  {
    key: 'journey', icon: '🏆', title: 'My Journey',
    description: 'See your activity history, achievements, goals and milestones.',
    tone: 'gold', action: 'View Journey',
  },
  {
    key: 'aspirant', icon: '🎯', title: 'Aspirant Hub',
    description: 'Set an exam focus and start a short cognitive practice session alongside your preparation.',
    tone: 'navy', action: 'Open Aspirant Hub',
  },
];


type FeatureKey =
  | 'homework'
  | 'time'
  | 'math'
  | 'daily'
  | 'planner'
  | 'real-life'
  | 'create'
  | 'journey'
  | 'aspirant';

interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  due: string;
  done: boolean;
}

const FEATURE_META: Record<FeatureKey, {
  icon: string;
  title: string;
  subtitle: string;
  tone: string;
}> = {
  homework: { icon: '📚', title: 'Homework', subtitle: 'Keep tasks, due dates and completion in one calm place.', tone: 'teal' },
  time: { icon: '⏱️', title: 'My Time', subtitle: 'Plan focused work and breaks without making your day complicated.', tone: 'violet' },
  math: { icon: '🧮', title: 'Math Lab', subtitle: 'Calculate, convert and explore practical mathematics.', tone: 'orange' },
  daily: { icon: '🧩', title: "Today's Challenge", subtitle: 'A short challenge chosen from the games already in Medhā.', tone: 'pink' },
  planner: { icon: '🗓️', title: 'Study Planner', subtitle: 'Turn upcoming work into a simple plan you can actually follow.', tone: 'blue' },
  'real-life': { icon: '🌍', title: 'Real Life Lab', subtitle: 'Explore practical decisions through short interactive scenarios.', tone: 'green' },
  create: { icon: '🎨', title: 'Create Lab', subtitle: 'A home for making, experimenting and expressing ideas.', tone: 'purple' },
  journey: { icon: '🏆', title: 'My Journey', subtitle: 'See your activities, goals and progress as they are recorded.', tone: 'gold' },
  aspirant: { icon: '🎯', title: 'Aspirant Hub', subtitle: 'A focused space for students 18+ preparing for demanding examinations.', tone: 'navy' },
};

function AgeWorldArt({ accent }: { accent: AgeAccent }) {
  const artMap: Record<
    AgeAccent,
    {
      title: string;
      emojis: string[];
      svg: React.ReactNode;
    }
  > = {
    sunny: {
      title: 'Playful discovery',
      emojis: ['🌈', '🦋', '⭐', '🎈'],
      svg: (
        <svg className="age-world-art__svg" viewBox="0 0 440 280" role="presentation">
          <defs>
            <linearGradient id="sunnySky" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#ffd86b" stopOpacity=".9"/><stop offset="100%" stopColor="#ff7a9f" stopOpacity=".45"/></linearGradient>
            <linearGradient id="sunnyRainbow" x1="0" x2="1"><stop offset="0%" stopColor="#ff9b45"/><stop offset="45%" stopColor="#ff5c9d"/><stop offset="100%" stopColor="#7b67e8"/></linearGradient>
          </defs>
          <circle cx="342" cy="58" r="42" fill="url(#sunnySky)" className="age-svg-pulse" />
          <path d="M42 206 Q220 42 398 206" fill="none" stroke="url(#sunnyRainbow)" strokeWidth="22" strokeLinecap="round" opacity=".48"/>
          <path d="M67 211 Q220 75 373 211" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".42"/>
          <path d="M74 225 C125 190 164 205 205 224 C253 246 309 236 365 205" fill="none" stroke="#70c85d" strokeWidth="14" strokeLinecap="round" opacity=".55"/>
          <g className="age-svg-sparkles" fill="#fff"><circle cx="85" cy="58" r="5"/><circle cx="130" cy="34" r="3"/><circle cx="184" cy="64" r="4"/><circle cx="285" cy="38" r="4"/></g>
          <path d="M218 92 l8 18 19 2-14 12 4 19-17-9-17 9 4-19-14-12 19-2z" fill="#fff" opacity=".8"/>
        </svg>
      ),
    },
    explorer: {
      title: 'Explore & build',
      emojis: ['🚀', '🪐', '🧩', '✨'],
      svg: (
        <svg className="age-world-art__svg" viewBox="0 0 440 280" role="presentation">
          <defs><linearGradient id="explorerCore" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#61d8f3"/><stop offset="100%" stopColor="#6756df"/></linearGradient></defs>
          <ellipse cx="222" cy="137" rx="172" ry="72" fill="none" stroke="#fff" strokeWidth="2" opacity=".38" className="age-svg-orbit"/>
          <ellipse cx="222" cy="137" rx="132" ry="53" fill="none" stroke="#fff" strokeWidth="2" opacity=".22" transform="rotate(27 222 137)" className="age-svg-orbit age-svg-orbit--slow"/>
          <circle cx="222" cy="137" r="48" fill="url(#explorerCore)" opacity=".72"/>
          <path d="M202 165 L222 78 L242 165 L222 151 Z" fill="#fff" opacity=".72"/>
          <path d="M207 153 L222 103 L237 153" fill="none" stroke="#fff" strokeWidth="4" opacity=".85"/>
          <circle cx="222" cy="137" r="6" fill="#fff"/>
          <path d="M70 62 l7 15 17 2-13 11 4 17-15-9-15 9 4-17-13-11 17-2z" fill="#fff" opacity=".65"/>
          <circle cx="365" cy="78" r="18" fill="#fff" opacity=".22"/>
        </svg>
      ),
    },
    future: {
      title: 'Think & engineer',
      emojis: ['💡', '⚙️', '📐', '⚡'],
      svg: (
        <svg className="age-world-art__svg" viewBox="0 0 440 280" role="presentation">
          <defs><linearGradient id="futureCore" x1="0" x2="1"><stop offset="0%" stopColor="#4d6df0"/><stop offset="100%" stopColor="#14b7b0"/></linearGradient></defs>
          <circle cx="220" cy="137" r="86" fill="none" stroke="#6d82ee" strokeWidth="2" opacity=".18" className="age-svg-orbit"/>
          <circle cx="220" cy="137" r="52" fill="none" stroke="#25b5bb" strokeWidth="2" opacity=".24"/>
          <path d="M72 212 L135 162 L195 184 L264 94 L353 143" fill="none" stroke="url(#futureCore)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".7"/>
          {[72,135,195,264,353].map((cx, i) => <circle key={cx} cx={cx} cy={[212,162,184,94,143][i]} r="9" fill="url(#futureCore)" className="age-svg-node" />)}
          <path d="M220 55 l8 18 19 3-14 12 4 19-17-10-17 10 4-19-14-12 19-3z" fill="#fff" opacity=".72"/>
          <path d="M95 74 h38 M114 55 v38" stroke="#fff" strokeWidth="3" opacity=".22"/>
        </svg>
      ),
    },
    aspirants: {
      title: 'Focused preparation',
      emojis: ['🎯', '🎓', '⚡', '📚'],
      svg: (
        <svg className="age-world-art__svg" viewBox="0 0 440 280" role="presentation">
          <defs><linearGradient id="aspirantCore" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#52d7c7"/><stop offset="100%" stopColor="#31579a"/></linearGradient></defs>
          <circle cx="220" cy="138" r="94" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".18" className="age-svg-orbit"/>
          <circle cx="220" cy="138" r="66" fill="none" stroke="#62d8cb" strokeWidth="2.5" opacity=".3" className="age-svg-orbit age-svg-orbit--slow"/>
          <circle cx="220" cy="138" r="35" fill="url(#aspirantCore)" opacity=".78"/>
          <path d="M220 75 V201 M157 138 H283 M176 94 L264 182 M264 94 L176 182" stroke="#fff" strokeWidth="2" opacity=".18"/>
          <path d="M220 91 L229 128 L267 138 L229 148 L220 185 L211 148 L173 138 L211 128 Z" fill="#fff" opacity=".34"/>
          <circle cx="220" cy="138" r="7" fill="#fff"/>
          <path d="M90 215 Q220 35 350 215" fill="none" stroke="#52d7c7" strokeWidth="2" opacity=".16"/>
        </svg>
      ),
    },
  };

  const art = artMap[accent];

  return (
    <div
      className={`age-world-art age-world-art--${accent}`}
      aria-hidden="true"
    >
      {art.svg}

      <span className="age-world-art__label">
        {art.title}
      </span>

      {art.emojis.map((emoji, index) => (
        <span
          key={emoji}
          className={`age-world-art__emoji age-world-art__emoji--${index + 1}`}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

function AgePickerArt({ accent }: { accent: AgeAccent }) {
  if (accent === 'sunny') {
    return (
      <svg className="age-picker-art" viewBox="0 0 180 120" role="presentation">
        <circle cx="143" cy="28" r="17" fill="#ffd86b" opacity=".9" />
        <path d="M18 74 Q48 35 78 74 T138 74" fill="none" stroke="#f36f93" strokeWidth="8" strokeLinecap="round" opacity=".8" />
        <path d="M27 78 Q55 45 78 78 T129 78" fill="none" stroke="#ffb43f" strokeWidth="8" strokeLinecap="round" />
        <path d="M36 82 Q60 55 79 82 T120 82" fill="none" stroke="#7265d9" strokeWidth="7" strokeLinecap="round" />
        <path d="M0 103 Q48 80 92 99 Q137 116 180 91 V120 H0Z" fill="#65b95b" />
        <circle cx="28" cy="27" r="3" fill="#fff" /><circle cx="53" cy="18" r="2" fill="#fff" /><circle cx="116" cy="25" r="3" fill="#fff" />
      </svg>
    );
  }

  if (accent === 'explorer') {
    return (
      <svg className="age-picker-art" viewBox="0 0 180 120" role="presentation">
        <ellipse cx="90" cy="61" rx="68" ry="27" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".42" />
        <ellipse cx="90" cy="61" rx="50" ry="20" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".25" transform="rotate(24 90 61)" />
        <path d="M82 88 L99 28 L116 88 L99 77Z" fill="#fff" opacity=".88" />
        <path d="M87 77 L99 42 L111 77" fill="none" stroke="#6359dc" strokeWidth="3" />
        <circle cx="99" cy="61" r="4" fill="#fff" />
        <circle cx="35" cy="28" r="4" fill="#fff" opacity=".7" /><circle cx="149" cy="35" r="5" fill="#fff" opacity=".55" />
      </svg>
    );
  }

  if (accent === 'future') {
    return (
      <svg className="age-picker-art" viewBox="0 0 180 120" role="presentation">
        <circle cx="90" cy="61" r="45" fill="none" stroke="#8798ff" strokeWidth="1.5" opacity=".42" />
        <circle cx="90" cy="61" r="27" fill="none" stroke="#2bbcc0" strokeWidth="2" opacity=".55" />
        <path d="M18 93 L48 67 L77 78 L111 34 L163 61" fill="none" stroke="#4d73ed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {[18,48,77,111,163].map((cx, index) => <circle key={cx} cx={cx} cy={[93,67,78,34,61][index]} r="5" fill={index % 2 ? '#19b6b2' : '#6376ee'} />)}
        <path d="M90 20 l5 12 13 2-10 8 3 13-11-7-11 7 3-13-10-8 13-2z" fill="#fff" opacity=".8" />
      </svg>
    );
  }

  return (
    <svg className="age-picker-art" viewBox="0 0 180 120" role="presentation">
      <circle cx="90" cy="60" r="43" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".35" />
      <circle cx="90" cy="60" r="28" fill="none" stroke="#5ed6c9" strokeWidth="2" opacity=".7" />
      <circle cx="90" cy="60" r="15" fill="#319b9d" opacity=".85" />
      <path d="M90 23 V97 M53 60 H127 M64 34 L116 86 M116 34 L64 86" stroke="#fff" strokeWidth="1.5" opacity=".3" />
      <path d="M90 39 l5 15 16 6-16 5-5 16-5-16-16-5 16-6z" fill="#fff" opacity=".78" />
    </svg>
  );
}

function StudentFeaturePage({
  feature,
  onBack,
  randomGame,
  onPlayGame,
  ageLabel,
  games,
  homework,
  setHomework,
}: {
  feature: FeatureKey;
  onBack: () => void;
  randomGame: GameWithAccess | null;
  onPlayGame: (slug: string) => void;
  games: GameWithAccess[];
  ageLabel: string;
  homework: HomeworkItem[];
  setHomework: React.Dispatch<React.SetStateAction<HomeworkItem[]>>;
}) {
  const meta = FEATURE_META[feature];
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [calc, setCalc] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [planItems, setPlanItems] = useState<string[]>([]);
  const [planText, setPlanText] = useState('');
  const [examTrack, setExamTrack] = useState('JEE');
  const [sessionLength, setSessionLength] = useState('10');

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          setTimerRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  function addHomework() {
    if (!taskTitle.trim()) return;
    setHomework((items) => [
      ...items,
      {
        id: `${Date.now()}`,
        title: taskTitle.trim(),
        subject: taskSubject.trim() || 'General',
        due: taskDue || 'No due date',
        done: false,
      },
    ]);
    setTaskTitle('');
    setTaskSubject('');
    setTaskDue('');
  }

  function calculate() {
    const safe = calc.trim();
    if (!/^[0-9+\-*/().%\s]+$/.test(safe)) {
      setCalcResult('Use numbers and + − × ÷ ( ) % only.');
      return;
    }
    try {
      // Calculator-only expression evaluation. No external data is used.
      const value = Function(`"use strict"; return (${safe.replace(/×/g, '*').replace(/÷/g, '/')})`)();
      setCalcResult(Number.isFinite(value) ? String(value) : 'Cannot calculate');
    } catch {
      setCalcResult('Check the expression and try again.');
    }
  }

  function addPlanItem() {
    if (!planText.trim()) return;
    setPlanItems((items) => [...items, planText.trim()]);
    setPlanText('');
  }

  return (
    <section className={`student-feature-page student-feature-page--${meta.tone}`}>
      <div className="student-feature-page__top">
        <button type="button" className="feature-back-button" onClick={onBack}>← Back to My Medhā</button>
        <span className="feature-age-pill">{ageLabel}</span>
      </div>

      <div className="student-feature-page__hero">
        <div className="feature-page-icon">{meta.icon}</div>
        <div>
          <span className="student-section-kicker">MY MEDHĀ</span>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </div>

      {feature === 'homework' && (
        <div className="feature-workspace">
          <div className="workspace-card">
            <span className="workspace-kicker">ADD A TASK</span>
            <h2>What do you need to finish?</h2>
            <div className="homework-form">
              <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Homework or school task" />
              <input value={taskSubject} onChange={(e) => setTaskSubject(e.target.value)} placeholder="Subject" />
              <input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
              <button type="button" onClick={addHomework}>Add task</button>
            </div>
          </div>
          <div className="workspace-card">
            <span className="workspace-kicker">MY TASKS</span>
            <h2>{homework.length ? `${homework.length} task${homework.length === 1 ? '' : 's'}` : 'Nothing added yet'}</h2>
            {homework.length === 0 ? (
              <div className="feature-empty-state">Add a real school task above. Medhā will keep it here for you.</div>
            ) : (
              <div className="homework-list">
                {homework.map((item) => (
                  <label key={item.id} className={`homework-row ${item.done ? 'is-done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => setHomework((items) => items.map((x) => x.id === item.id ? { ...x, done: !x.done } : x))}
                    />
                    <span><strong>{item.title}</strong><small>{item.subject} · {item.due}</small></span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {feature === 'time' && (
        <div className="feature-workspace feature-workspace--two">
          <div className="workspace-card focus-card">
            <span className="workspace-kicker">FOCUS SESSION</span>
            <h2>Give one thing your full attention.</h2>
            <div className="focus-clock">{minutes}:{secs}</div>
            <div className="focus-actions">
              <button type="button" onClick={() => setTimerRunning((v) => !v)}>{timerRunning ? 'Pause' : 'Start focus'}</button>
              <button type="button" className="secondary" onClick={() => { setTimerRunning(false); setSeconds(25 * 60); }}>Reset</button>
            </div>
          </div>
          <div className="workspace-card">
            <span className="workspace-kicker">A SIMPLE RHYTHM</span>
            <h2>Try this</h2>
            <div className="time-rhythm"><b>25 min</b><span>Focus</span></div>
            <div className="time-rhythm"><b>5 min</b><span>Break</span></div>
            <div className="time-rhythm"><b>25 min</b><span>Continue</span></div>
            <p className="workspace-note">You can change the rhythm later. The goal is not to study longer — it is to study with intention.</p>
          </div>
        </div>
      )}

      {feature === 'math' && (
        <div className="feature-workspace feature-workspace--two">
          <div className="workspace-card math-calculator">
            <span className="workspace-kicker">CALCULATOR</span>
            <h2>Try a calculation</h2>
            <input className="math-display" value={calc} onChange={(e) => setCalc(e.target.value)} placeholder="e.g. 120 × 1.18" />
            <div className="math-keys">
              {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','%','+'].map((key) => (
                <button type="button" key={key} onClick={() => setCalc((v) => v + key)}>{key}</button>
              ))}
            </div>
            <div className="math-result">{calcResult || 'Your answer will appear here.'}</div>
            <div className="focus-actions">
              <button type="button" onClick={calculate}>Calculate</button>
              <button type="button" className="secondary" onClick={() => { setCalc(''); setCalcResult(''); }}>Clear</button>
            </div>
          </div>
          <div className="workspace-card">
            <span className="workspace-kicker">REAL-LIFE MATH</span>
            <h2>What can you explore?</h2>
            <div className="tool-chip-grid">
              <span>🛒 Discounts</span><span>🏏 Sports</span><span>🚗 Speed</span>
              <span>❄️ Energy</span><span>⏰ Time</span><span>💰 Budget</span>
            </div>
            <p className="workspace-note">The Math Lab is designed to make calculations useful, visible and connected to everyday decisions.</p>
          </div>
        </div>
      )}

      {feature === 'daily' && (
        <div className="feature-workspace">
          <div className="random-game-card">
            <div className="random-game-card__art">{randomGame ? (getCatalogEntry(randomGame.slug)?.emoji || '🎮') : '✨'}</div>
            <div>
              <span className="workspace-kicker">TODAY'S RANDOM PICK</span>
              <h2>{randomGame?.title || 'Finding a game…'}</h2>
              <p>{randomGame ? `A game selected from your available Medhā collection. Ready for a quick challenge?` : 'Your game collection is still loading.'}</p>
                            <p>{randomGame ? `A game selected from your available Medhā collection. Ready for a quick challenge?` : 'Your game collection is still loading.'}</p>
              {randomGame && <small>{formatDomainLabel(randomGame.domain)}</small>}
            </div>
            {randomGame && <button type="button" onClick={() => onPlayGame(randomGame.slug)}>Play this game →</button>}
          </div>
          <div className="workspace-card">
            <span className="workspace-kicker">NO PRESSURE</span>
            <h2>Try, think, learn.</h2>
            <p className="workspace-note">There is no need to chase a score here. The purpose is to explore a different kind of thinking.</p>
          </div>
        </div>
      )}

      {feature === 'planner' && (
        <div className="feature-workspace">
          <div className="workspace-card">
            <span className="workspace-kicker">TODAY'S PLAN</span>
            <h2>What would make today feel complete?</h2>
            <div className="planner-add">
              <input value={planText} onChange={(e) => setPlanText(e.target.value)} placeholder="Add one thing to work on" />
              <button type="button" onClick={addPlanItem}>Add</button>
            </div>
            {planItems.length === 0 ? (
              <div className="feature-empty-state">Start with one small task. You can add more when you need them.</div>
            ) : (
              <ol className="planner-list">{planItems.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ol>
            )}
          </div>
        </div>
      )}

      {feature === 'real-life' && (
        <div className="feature-workspace">
          <div className="scenario-grid">
            {[
              ['💰', 'Money decision', 'You have a limited budget. What would you choose first?'],
              ['🏏', 'Sports maths', 'A score, time and probability problem from the real world.'],
              ['📱', 'Digital life', 'A short situation about privacy, scams or online choices.'],
              ['✈️', 'Travel plan', 'Use time, distance and money to make a practical plan.'],
            ].map(([icon, title, text]) => (
              <article className="scenario-card" key={title}>
                <span>{icon}</span><h3>{title}</h3><p>{text}</p><button type="button">Explore →</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {feature === 'create' && (
        <div className="feature-workspace">
          <div className="create-grid">
            {[
              ['🎵', 'Music', 'Explore notes, rhythm and your own musical ideas.'],
              ['💻', 'Coding', 'Build small ideas and experiment with logic.'],
              ['✍️', 'Stories', 'Turn an idea into a story, scene or character.'],
              ['🔬', 'Build & Experiment', 'Ask a question, make a model and see what happens.'],
            ].map(([icon, title, text]) => (
              <article className="scenario-card" key={title}>
                <span>{icon}</span><h3>{title}</h3><p>{text}</p><button type="button">Open →</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {feature === 'aspirant' && (
        <div className="feature-workspace">
          <div className="aspirant-hub-card">
            <div className="aspirant-hub-card__glow" aria-hidden="true" />
            <div className="aspirant-hub-card__intro">
              <span className="workspace-kicker">MEDHĀ FOR ASPIRANTS · 18+</span>
                            <span className="workspace-kicker">MEDHĀ FOR ASPIRANTS · 18+</span>
              <h2>Train the learning habits around your preparation.</h2>
              <p>Medhā is not a replacement for your coaching, textbooks or subject preparation. Use this space for short, purposeful practice in attention, memory, reasoning and thinking alongside your regular study.</p>
                          <p>Medhā is not a replacement for your coaching, textbooks or subject preparation. Use this space for short, purposeful practice in attention, memory, reasoning and thinking alongside your regular study.</p>
            </div>
            <div className="aspirant-track-grid">
              {[['JEE','⚛️','Engineering entrance preparation'],['NEET','🧬','Medical entrance preparation'],['UPSC / IAS','🏛️','Civil services preparation'],['Other','📚','Another demanding examination']].map(([value,icon,label]) => (
                <button type="button" key={value} className={`aspirant-track ${examTrack === value ? 'is-selected' : ''}`} onClick={() => setExamTrack(value)}>
                  <span>{icon}</span><strong>{value}</strong><small>{label}</small>
                </button>
              ))}
            </div>
            <div className="aspirant-session">
              <div><span className="workspace-kicker">QUICK PRACTICE</span><h3>How much time do you have?</h3><p>Choose a short session and return to your normal preparation afterwards.</p></div>
              <div className="aspirant-session-options">
                {['5','10','15'].map((minutes) => <button type="button" key={minutes} className={sessionLength === minutes ? 'is-selected' : ''} onClick={() => setSessionLength(minutes)}>{minutes} min</button>)}
              </div>
            </div>
            <div className="aspirant-practice-grid">
              <article><span>🎯</span><strong>Focus</strong><small>Sustain attention on one task.</small></article>
              <article><span>💭</span><strong>Memory</strong><small>Practise recall and working memory.</small></article>
              <article><span>🧩</span><strong>Reasoning</strong><small>Work through unfamiliar problems.</small></article>
              <article><span>⚡</span><strong>Thinking under time</strong><small>Practise staying deliberate when time matters.</small></article>
            </div>
            <div className="aspirant-hub-footer">
              <div><strong>{examTrack}</strong><span>{sessionLength}-minute Medhā practice</span></div>
                            <div><strong>{examTrack}</strong><span>{sessionLength}-minute Medhā practice</span></div>
              <button type="button" onClick={() => { const candidate = games.find((g) => /focus|memory|logic|reason|pattern|math/i.test(`${g.title} ${g.domain}`)) || randomGame; if (candidate) onPlayGame(candidate.slug); }}>Start a Medhā challenge →</button>
            </div>
          </div>
          <div className="workspace-card aspirant-note-card">
            <span className="workspace-kicker">KEEP THE BOUNDARY CLEAR</span>
            <h2>Medhā works alongside your preparation.</h2>
                        <h2>Medhā works alongside your preparation.</h2>
                          Medhā should never invent a performance score.
            <p className="workspace-note">Your exam syllabus, coaching and subject practice remain yours. This space adds short cognitive experiences and practical tools without pretending to be an exam coaching course.</p>
          </div>
        </div>
      )}

      {feature === 'journey' && (
        <div className="feature-workspace">
          <div className="workspace-card">
            <span className="workspace-kicker">MY JOURNEY</span>
            <h2>Your progress will grow from real activity.</h2>
            <p className="workspace-note">
              Medhā should never invent a performance score. These bars are ready to show actual activity data when the student completes activities and the backend records it.
            </p>
            <div className="journey-bars">
              <ProgressBar value={0} label="Games completed" color="#6366f1" />
              <ProgressBar value={0} label="Homework completed" color="#0ea5a4" />
              <ProgressBar value={0} label="Focus sessions" color="#f59e0b" />
              <ProgressBar value={0} label="Challenges completed" color="#ec4899" />
            </div>
          </div>
          <div className="workspace-card journey-next">
            <span className="workspace-kicker">NEXT</span>
            <h2>Keep exploring.</h2>
            <p>As the student uses Medhā, this space can become the single place for activities, achievements, goals and meaningful progress.</p>
                        <p>As the student uses Medhā, this space can become the single place for activities, achievements, goals and meaningful progress.</p>
            <div className="journey-pill-row"><span>🎮 Games</span><span>📚 Study</span><span>⏱️ Focus</span><span>🏆 Achievements</span></div>
          </div>
        </div>
      )}
    </section>
  );
}

export function StudentGamesPage({ apiUrl, childStudentId }: StudentGamesPageProps) {
  const [games, setGames] = useState<GameWithAccess[]>([]);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [lastCheckInAt, setLastCheckInAt] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{ status: string; plan: string; trialEndsAt: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [catalogReload, setCatalogReload] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [gameSearch, setGameSearch] = useState('');
  const [showPromo, setShowPromo] = useState(false);
  const [showMyMedhaPromo, setShowMyMedhaPromo] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureKey | null>(null);
  const [randomGame, setRandomGame] = useState<GameWithAccess | null>(null);
  const [homework, setHomework] = useState<HomeworkItem[]>(() => {
    try {
      const saved = localStorage.getItem('medhaa-homework');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(() => {
    const saved = localStorage.getItem(AGE_STORAGE_KEY);
    return saved === '5-9' || saved === '10-13' || saved === '14-17' || saved === 'aspirants' ? saved : null;
  });
  const [showAgePicker, setShowAgePicker] = useState(() => {
    const saved = localStorage.getItem(AGE_STORAGE_KEY);
    return saved !== '5-9' && saved !== '10-13' && saved !== '14-17' && saved !== 'aspirants';
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { showGate, setShowGate, tryPlay } = useGameGate();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { playClick } = useClickSound();
  const isLoggedIn = !!user;
  const profile = ageGroup ? AGE_PROFILES[ageGroup] : AGE_PROFILES['10-13'];

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 480);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    function useFallbackGames() {
      if (cancelled) return;
      setGames(buildFallbackGames());
      setStudentName(null);
      setLastCheckInAt(null);
      setSubscription(null);
    }

    async function load() {
      try {
        const token = localStorage.getItem('accessToken');

        // "/student/preview" is meant for anonymous/public visitors only — if
        // there's no logged-in token, show the locked demo catalogue. But if
        // the user IS logged in (e.g. reached this URL via "Explore games",
        // "Play as child", etc.) always fetch their real access/trial status
        // instead of forcing the always-locked fallback.
        if (!childStudentId && window.location.pathname === '/student/preview' && !token) {
          useFallbackGames();
          return;
        }

        const endpoint = childStudentId
          ? `/games-with-access/child/${childStudentId}`
          : token
            ? '/games-with-access/with-access'
            : '/games-with-access/public';
        const res = token
          ? await authFetch(`${apiUrl}${endpoint}`, { signal: controller.signal })
          : await fetch(`${apiUrl}${endpoint}`, { signal: controller.signal });
        if (!res.ok) {
          setCatalogError('The live game list could not be loaded. You can retry, or explore the basic catalogue for now.');
          useFallbackGames();
          return;
        }
        const data = await res.json(); 
        const allGames: GameWithAccess[] = (data.games ?? []).map((game: GameWithAccess) => ({
          ...game,
          title: displayGameTitle(game.title),
        }));
        if (cancelled) return;
        setGames(allGames);
        setStudentName(data.studentName ?? null);
        setLastCheckInAt(data.lastCheckInAt ?? null);

        if (data.studentName) {
          const existing = JSON.parse(localStorage.getItem('bhava_current_student') || '{}');
          localStorage.setItem(
            'bhava_current_student',
            JSON.stringify({ ...existing, name: data.studentName, grade: data.gradeLevel ?? existing.grade, school: data.schoolName ?? existing.school })
          );
        }
        setSubscription(data.subscription ?? null);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.warn('Student games API timed out; using local catalogue fallback.');
          setCatalogError('The game list is taking too long to load. Check your connection and try again.');
        } else {
          console.error('Failed to load student games:', error);
          setCatalogError('The live game list could not be loaded. Check your connection and try again.');
        }
        useFallbackGames();
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [apiUrl, childStudentId, catalogReload]);

  function retryCatalogLoad() {
    setCatalogError('');
    setLoading(true);
    setCatalogReload((value) => value + 1);
  }

  useEffect(() => {
    localStorage.setItem('medhaa-homework', JSON.stringify(homework));
  }, [homework]);

  const recommendedGames = useMemo(
    () => buildRecommendedGames(games, ageGroup ?? '10-13'),
    [games, ageGroup],
  );

  useEffect(() => {
    if (recommendedGames.length) {
      setRandomGame(recommendedGames[Math.floor(Math.random() * recommendedGames.length)]);
    } else {
      setRandomGame(null);
    }
  }, [recommendedGames]);


  useEffect(() => {
    if (subscription) return;
    const shownCount = parseInt(sessionStorage.getItem('medhaa-promo-shown') || '0', 10);
    if (shownCount >= 3) return;
    const timer = window.setTimeout(() => {
      setShowPromo(true);
      sessionStorage.setItem('medhaa-promo-shown', String(shownCount + 1));
    }, 20000);
    return () => window.clearTimeout(timer);
  }, [subscription]);

  // Gentle reminder to check in on "My Medhā" (the ongoing progress
  // tracker, not the one-time paid assessment) — nudges every ~1.5 days,
  // and definitely once it's been 10+ days since their last real check-in.
  const MY_MEDHA_MIN_GAP_MS = 36 * 60 * 60 * 1000;
  const MY_MEDHA_STALE_MS = 10 * 24 * 60 * 60 * 1000;
  useEffect(() => {
    if (!isLoggedIn) return;
    const now = Date.now();
    const lastShown = Number(localStorage.getItem('medhaa_my_medha_promo_last_shown') || 0);
    const lastCheckin = lastCheckInAt ? new Date(lastCheckInAt).getTime() : 0;
    const sinceCheckin = lastCheckin ? now - lastCheckin : Infinity;
    const stale = sinceCheckin >= MY_MEDHA_STALE_MS;
    const dueForRegularNudge = now - lastShown >= MY_MEDHA_MIN_GAP_MS && sinceCheckin >= MY_MEDHA_MIN_GAP_MS;
    if (!stale && !dueForRegularNudge) return;
    const timer = window.setTimeout(() => {
      setShowMyMedhaPromo(true);
      localStorage.setItem('medhaa_my_medha_promo_last_shown', String(now));
    }, 45000);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, lastCheckInAt]);

  function handlePlay(slug: string) {
    const loggedInNow = !!localStorage.getItem('accessToken');
    if (!loggedInNow && !tryPlay(slug)) return;
    markPlayed(slug);
    const entryPath = games.find((g) => g.slug === slug)?.entryPath;
    const path = entryPath
      ? `/games-static/${entryPath}`
      : folderBasedSlugs.has(slug) ? `/games-static/${slug}/index.html` : `/games-static/${slug}.html`;
    window.location.href = path;
  }

  function openAssessment() {
    handlePlay('bcs-lite-v3');
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  function selectAge(nextAge: AgeGroup) {
    playClick();
    setAgeGroup(nextAge);
    setShowAgePicker(false);
    setExpanded(false);
    setActiveFeature(null);
    localStorage.setItem(AGE_STORAGE_KEY, nextAge);
  }

  function changeAge() {
    playClick();
    setShowAgePicker(true);
  }

  function openFeature(feature: FeatureKey) {
    playClick();
    setActiveFeature(feature);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const filteredGames = useMemo(() => {
    const query = gameSearch.trim().toLowerCase();
    if (!query) return games;
    return games.filter((game) => {
      const catalog = getCatalogEntry(game.slug);
      return [
        game.title,
        game.domain,
        game.ageLabel,
        ...(game.skills || []),
        ...(catalog?.skillsBuilt || []),
        catalog?.tagline || '',
      ].join(' ').toLowerCase().includes(query);
    });
  }, [games, gameSearch]);

  const filteredGrouped = useMemo(() => filteredGames.reduce<Record<string, GameWithAccess[]>>((acc, game) => {
    (acc[game.domain] ??= []).push(game);
    return acc;
  }, {}), [filteredGames]);

  const visibleFeatureItems = useMemo(
    () => FEATURE_ITEMS.filter((item) => item.key !== 'aspirant' || ageGroup === 'aspirants'),
    [ageGroup],
  );


  const myMedhaaStatus = useMemo(() => {
    if (!lastCheckInAt) {
      return {
        state: 'baseline' as const,
        title: 'Start your Medhā baseline',
        message: 'Complete your first My Medhā check-in early so your journey has a meaningful starting point.',
        detail: '',
        nextLabel: '',
        daysSince: null as number | null,
      };
    }

    const completedAt = new Date(lastCheckInAt);
    const daysSince = Math.max(0, Math.floor((Date.now() - completedAt.getTime()) / (1000 * 60 * 60 * 24)));
    const daysUntilNext = Math.max(0, 30 - daysSince);

    return {
      state: daysUntilNext === 0 ? 'ready' as const : 'tracking' as const,
      title: daysUntilNext === 0 ? 'Your next My Medhā check-in is ready' : 'Your Medhā journey is being tracked',
      message: daysUntilNext === 0
        ? 'A new structured check-in can help you compare your current position with your earlier one.'
        : 'Keep exploring varied Medhā activities. Your next recommended structured check-in is approaching.',
      detail: `Last check-in · ${completedAt.toLocaleDateString()}`,
      nextLabel: daysUntilNext === 0 ? '30-day check-in' : `Next check-in in ${daysUntilNext} day${daysUntilNext === 1 ? '' : 's'}`,
      daysSince,
    };
  }, [lastCheckInAt]);

  const myMedhaaCheckpoints = [
    { key: 'baseline', label: 'Baseline' },
    { key: '30', label: '30 days' },
    { key: '90', label: '90 days' },
    { key: '180', label: '180 days' },
    { key: '365', label: '1 year' },
  ];

  
const disclaimerBanner = (
  <div
    className="student-disclaimer-banner"
    role="note"
    aria-label="Important information about Medhā results"
  >
    <span>
      <strong>Important:</strong> Medhā is an educational platform designed for
      learning, practice and progress tracking. Its activities, scores and
      insights are based on recorded activity and platform methods. They are
      indicative learning insights, not medical diagnoses, clinical assessments,
      or standardized psychological or psychometric tests, and should not be
      used alone to make medical, psychological, educational or career decisions.
    </span>
  </div>
);


  const benefitsBanner = subscription ? (
    <div className="student-trial-banner student-trial-banner--active">
      <span>
        {subscription.status === 'TRIALING'
          ? `✨ Your Medhā experience is active — explore learning, tools & play until ${subscription.trialEndsAt ? new Date(subscription.trialEndsAt).toLocaleDateString() : 'your trial end date'}.`
          : '⭐ Medhā member — your learning, play and progress space is active.'}
      </span>
    </div>
  ) : (
    <div className="student-trial-banner">
      <span>✨ Explore Medhā with games, learning tools and daily challenges.</span>
      <button type="button" onClick={() => { playClick(); navigate('/subscribe'); }}>Explore Plans</button>
    </div>
  );

  const header = (
    <header className="student-header">
      <button type="button" className="student-brand" onClick={() => navigate('/')} aria-label="Go to Medhā home">
        <img src={medhaaLogo} alt="Medhā" className="student-brand__wordmark" />
      </button>

      <nav className="student-header__nav" aria-label="Student navigation">
  <button
    type="button"
    aria-label="Home"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    <span>⌂</span> <span className="student-header__nav-label">Home</span>
  </button>

  <button
    type="button"
    aria-label="Play"
    onClick={() =>
      document.getElementById('student-games')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  >
    <span>🎮</span> <span className="student-header__nav-label">Play</span>
  </button>

  <button
    type="button"
    aria-label="Tools"
    onClick={() =>
      document.getElementById('student-tools')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  >
    <span>🧰</span> <span className="student-header__nav-label">Tools</span>
  </button>

  <button type="button" aria-label="Age & Theme" onClick={changeAge}>
    <span>{profile.icon}</span> <span className="student-header__nav-label">Age &amp; Theme</span>
  </button>

  {subscription?.status === 'ACTIVE' ? (
  <span className="student-header__subscribed">
    ✓ <span className="student-header__nav-label">Subscribed</span>
  </span>
) : subscription?.status === 'PENDING' ? (
  <span className="student-header__subscribed" style={{ opacity: 0.75 }}>
    ⏳ <span className="student-header__nav-label">Verifying Payment</span>
  </span>
) : (
  <button
    type="button"
    className="student-header__subscribe"
    aria-label="Subscribe"
    onClick={() => {
      playClick();
      navigate('/subscribe');
    }}
  >
    ✨ <span className="student-header__nav-label">Subscribe</span>
  </button>
)}
</nav>

      <div className="student-header__account">
        {isLoggedIn ? (
          <>
            <button type="button" className="student-header__ghost" onClick={() => { playClick(); navigate('/settings'); }}>⚙️ Settings</button>
            <button type="button" className="student-header__ghost" onClick={() => { playClick(); handleLogout(); }}>Logout</button>
            <button type="button" className="student-header__achievement" onClick={() => { playClick(); navigate('/achievements'); }}>🏆 Achievements</button>
          </>
        ) : (
          <>
            <button type="button" className="student-header__ghost" onClick={() => { playClick(); navigate('/login/student'); }}>Login</button>
            <button type="button" className="student-header__start" onClick={() => { playClick(); navigate('/signup/student'); }}>Start Free</button>
          </>
        )}
      </div>
    </header>
  );

  if (activeFeature) {
    return (
      <div className={`student-page student-page--${profile.accent}`}>
        {disclaimerBanner}
        {header}
        {benefitsBanner}
        <main className="student-main">
          <StudentFeaturePage
            feature={activeFeature}
            onBack={() => setActiveFeature(null)}
            randomGame={randomGame}
            onPlayGame={handlePlay}
            games={games}
            ageLabel={profile.label}
            homework={homework}
            setHomework={setHomework}
          />
        </main>
        {showGate && <LoginPricingModal onClose={() => setShowGate(false)} />}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`student-page student-page--${profile.accent}`}>
        {header}
        <div className="student-loading">
          <div className="student-loading__orb">✦</div>
          <strong>Preparing your Medhā space…</strong>
          <span>Loading today's games and challenges.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`student-page student-page--${profile.accent}`}>
      <div className="student-world" aria-hidden="true">
        <div className="world-sun" /><div className="world-moon" /><div className="world-rainbow" />
        <div className="world-cloud world-cloud--one" /><div className="world-cloud world-cloud--two" />
        <div className="world-star world-star--one">✦</div><div className="world-star world-star--two">✦</div><div className="world-star world-star--three">✦</div>
        <div className="world-orbit world-orbit--one" /><div className="world-orbit world-orbit--two" />
        <div className="world-rocket">🚀</div><div className="world-bubble world-bubble--one" /><div className="world-bubble world-bubble--two" />
        <div className="world-shape world-shape--one" /><div className="world-shape world-shape--two" />
      </div>

      {disclaimerBanner}
      {header}
      {benefitsBanner}
      {catalogError && (
        <div className="student-catalog-error" role="status">
          <span>{catalogError}</span>
          <button type="button" onClick={retryCatalogLoad}>Retry</button>
        </div>
      )}

      <div className="student-scroll-banner" role="button" tabIndex={0} onClick={() => { playClick(); openAssessment(); }} onKeyDown={(e) => { if (e.key === 'Enter') openAssessment(); }}>
        <div className="student-scroll-banner__track">
          <span>📊 My Medhā — check in on your progress and scores anytime, free for subscribed students →</span>
          <span>📊 My Medhā — check in on your progress and scores anytime, free for subscribed students →</span>
        </div>
      </div>

      <main className="student-main">

        {studentName && (
          <div className="student-welcome-line">
            <span className="student-section-kicker">WELCOME BACK</span>
            <strong>{studentName}</strong>
          </div>
        )}

        <section className="student-my-medhaa" aria-labelledby="my-medhaa-title">
          <div className="student-my-medhaa__topline">
            <div className="student-my-medhaa__icon" aria-hidden="true">✦</div>
            <div className="student-my-medhaa__eyebrow-wrap">
              <span className="student-section-kicker">MY MEDHĀ</span>
              {studentName && <span className="student-my-medhaa__student-name">{studentName}'s journey</span>}
            </div>
          </div>

          <div className="student-my-medhaa__main">
            <div className="student-my-medhaa__content">
              <h2 id="my-medhaa-title">
                {myMedhaaStatus.state === 'baseline'
                  ? 'Track your progress with My Medhā'
                  : myMedhaaStatus.state === 'ready'
                    ? 'Check My Medhā again'
                    : 'Keep your Medhā journey going'}
              </h2>
              <p>
                {myMedhaaStatus.state === 'baseline'
                  ? ''
                  : myMedhaaStatus.state === 'ready'
                    ? 'It is a good time for another free check-in. Repeating it helps you follow your journey over time.'
                    : `Last check-in ${myMedhaaStatus.daysSince} day${myMedhaaStatus.daysSince === 1 ? '' : 's'} ago. Keep exploring, and check in again when your next milestone arrives.`}
              </p>
              <div className="student-my-medhaa__meta">
                <span>{myMedhaaStatus.detail}</span>
                <span>{myMedhaaStatus.nextLabel}</span>
              </div>
            </div>

            <div className="student-my-medhaa__timeline" aria-label="My Medhā recommended checkpoints">
              {myMedhaaCheckpoints.map((checkpoint, index) => (
                <React.Fragment key={checkpoint.key}>
                  <div
                    className={`student-my-medhaa__checkpoint ${
                      checkpoint.key === 'baseline' && lastCheckInAt ? 'is-complete' : ''
                    } ${
                      checkpoint.key === 'baseline' && myMedhaaStatus.state === 'baseline' ? 'is-current' : checkpoint.key === '30' && myMedhaaStatus.state === 'ready' ? 'is-current' : ''
                    }`}
                  >
                    <span className="student-my-medhaa__checkpoint-dot" />
                    <span>{checkpoint.label}</span>
                  </div>
                  {index < myMedhaaCheckpoints.length - 1 && <span className="student-my-medhaa__connector" aria-hidden="true" />}
                </React.Fragment>
              ))}
            </div>

            <div className="student-my-medhaa__actions">
              <button
                type="button"
                className="student-my-medhaa__button"
                onClick={() => {
                  playClick();
                  navigate('/student/bcs-lite');
                }}
              >
                {myMedhaaStatus.state === 'baseline' ? 'Check My Medhā ' : 'Check My Medhā →'}
              </button>
              <span className="student-my-medhaa__free-note">Free check-in </span>
            </div>
          </div>

        </section>

<section className={`student-section student-games-section ${expanded ? 'student-games-section--expanded' : ''}`} id="student-games">
  <AgeWorldArt accent={profile.accent} />
  <div className="student-section-heading student-section-heading--games">
    <div>
      <span className="student-section-kicker">{expanded ? 'COMPLETE LIBRARY' : 'PICKED FOR YOU'}</span>
      <h2>{expanded ? 'Explore all Medhā games' : 'Games picked for your Medhā world'}</h2>
      <p>
        {expanded
          ? 'Browse the complete game collection. Your age-based recommendations remain the first place to start.'
          : `A smaller, age-appropriate starting collection for ${profile.label.toLowerCase()}.`}
      </p>
    </div>
    <div className="student-games-count">
      <strong>{expanded ? games.length : recommendedGames.length}</strong>
      <span>{expanded ? 'games in library' : 'recommended for you'}</span>
    </div>
  </div>

  {expanded && (
    <div className="games-search-bar" role="search">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        value={gameSearch}
        onChange={(event) => setGameSearch(event.target.value)}
        placeholder="Search games, skills or domains"
        aria-label="Search games, skills or domains"
      />
      {gameSearch && (
        <button type="button" className="games-search-clear" onClick={() => setGameSearch('')} aria-label="Clear game search">×</button>
      )}
    </div>
  )}

  <div className="games-grid-wrap student-games-wrap">
    {getLastPlayedSlug() && (
      <SimilarGames
        games={games}
        currentSlug={getLastPlayedSlug()!}
        onPlay={handlePlay}
        apiUrl={apiUrl}
      />
    )}

    {!expanded ? (
      <>
        <div className="student-recommendation-note student-recommendation-note--merged">
  <span className="student-recommendation-note__icon">{profile.icon}</span>
  <div className="student-recommendation-note__body">
    <strong>Start with these — your first {recommendedGames.length} games</strong>
    <span>
      Handpicked from the full catalogue using the age range set for this Medhā pathway.
      Pick any game below to begin.
    </span>
  </div>
</div>

        <div className="games-grid games-grid--recommended">
          {recommendedGames.map((game) => {
            const cat = getCatalogEntry(game.slug);
            return <GameCard key={game.slug} {...game} emoji={cat?.emoji} kind={cat?.kind} onPlay={handlePlay} apiUrl={apiUrl} />;
          })}
        </div>
        <button
          type="button"
          className="student-explore-games"
          onClick={() => { playClick(); setExpanded(true); window.setTimeout(() => document.getElementById('student-games')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }}
        >
          Explore all {games.length} games <span>↓</span>
        </button>
      </>
    ) : (
      <>
        {(Object.entries(filteredGrouped) as [string, GameWithAccess[]][]).map(([domain, domainGames]) => (
          <section key={domain} className="domain-section">
            <div className="domain-section__heading">
              <div>
                <span className="student-section-kicker">GAME DOMAIN</span>
                <h3 className="domain-title">{formatDomainLabel(domain)}</h3>
              </div>
              <span className="domain-section__count">{domainGames.length}</span>
            </div>
            <div className="games-grid games-grid--library">
              {domainGames.map((game) => {
                const cat = getCatalogEntry(game.slug);
                return <GameCard key={game.slug} {...game} emoji={cat?.emoji} kind={cat?.kind} onPlay={handlePlay} apiUrl={apiUrl} />;
              })}
            </div>
          </section>
        ))}
        {!filteredGames.length && (
          <div className="games-search-empty">No games match “{gameSearch}”. Try a different title, skill or domain.</div>
        )}
        <button
          type="button"
          className="student-explore-games student-explore-games--back"
          onClick={() => { playClick(); setExpanded(false); window.setTimeout(() => document.getElementById('student-games')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }}
        >
          ← Back to recommended games
        </button>
      </>
    )}
  </div>
</section>

        <section className="student-daily-card student-daily-card--game">
          <div className="daily-card__spark">{randomGame ? (getCatalogEntry(randomGame.slug)?.emoji || '🎮') : '✦'}</div>
          <div>
            <span className="student-section-kicker">TODAY'S RANDOM PICK</span>
            <h2>{randomGame?.title || 'A Medhā challenge is waiting'}</h2>
            <p>{randomGame ? `A quick game selected from your available collection · ${formatDomainLabel(randomGame.domain)}` : 'Your available games are loading.'}</p>
          </div>
          <button type="button" onClick={() => openFeature('daily')}>Open today's pick →</button>
        </section>

        <div className={`student-after-games-divider student-after-games-divider--${profile.accent}`} aria-hidden="true">
          <span>{profile.icon}</span>
          <i />
          <b />
          <small>{profile.shortLabel} · explore more when you're ready</small>
        </div>

        <section className="student-section student-tools-section" id="student-tools">
          <div className="student-section-heading">
            <div><span className="student-section-kicker">AFTER YOU PLAY</span><h2>More things to explore</h2><p>Useful tools are here when you need them — your games remain the main Medhā experience.</p></div>
            <div className="student-mini-status"><span className="student-mini-status__dot" />{profile.label}</div>
          </div>

          <div className="student-feature-grid">
            {visibleFeatureItems.map((item) => (
              <article key={item.key} className={`student-feature-card student-feature-card--${item.tone}`}>
                <div className="student-feature-card__icon">{item.icon}</div>
                <div className="student-feature-card__body">
                  <h3>{item.title}</h3><p>{item.description}</p>
                  <button type="button" onClick={() => openFeature(item.key as FeatureKey)}>{item.action} <span>→</span></button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="student-progress-strip">
          <div>
            <span className="student-section-kicker">KEEP GOING</span>
            <h2>Play, explore, then check in again.</h2>
            <p>Your activities build the journey; My Medhā gives you a simple checkpoint to see how you're progressing.</p>
          </div>
          <button type="button" onClick={() => { playClick(); navigate('/student/bcs-lite'); }}>
            Check My Medhā →
          </button>
        </section>
      </main>

      <footer className="student-footer">
        <img src={medhaaIcon} alt="" /><span>Medhā · Play. Learn. Plan. Create. Grow.</span>
        <button type="button" onClick={changeAge}>Change age & theme</button>
      </footer>

      {showAgePicker && (
        <div className="age-picker-backdrop" role="dialog" aria-modal="true" aria-labelledby="age-picker-title">
          <div className="age-picker">
            <button type="button" className="age-picker__close" aria-label="Close age selection" onClick={() => { playClick(); navigate('/'); }}>×</button>
            <div className="age-picker__spark">✦</div>
            <span className="student-section-kicker">WELCOME TO MEDHĀ</span>
            <h2 id="age-picker-title">How old are you?</h2>
            <p>We'll shape your Medhā space around your age.</p>
            <div className="age-choice-grid">
              {(Object.entries(AGE_PROFILES) as [AgeGroup, AgeProfile][]).map(([key, age]) => (
                <button type="button" key={key} className={`age-choice age-choice--${age.accent}`} onClick={() => selectAge(key)}>
                  <div className="age-choice__scene" aria-hidden="true"><AgePickerArt accent={age.accent} /></div>
                  <strong>{age.label}</strong><small>{age.shortLabel}</small><em>Choose →</em>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showGate && <LoginPricingModal onClose={() => setShowGate(false)} />}

      {showPromo && (
        <div className="student-promo">
          <button type="button" className="student-promo__close" aria-label="Close" onClick={() => setShowPromo(false)}>×</button>
          <div className="student-promo__icon">✨</div><strong>Make your Medhā journey bigger.</strong>
          <p>Continue learning, playing and building your own activity history.</p>
          <button type="button" onClick={() => navigate('/subscribe')}>See plans →</button>
        </div>
      )}

      {showMyMedhaPromo && !showPromo && (
        <div className="student-promo student-mymedha-promo">
          <button type="button" className="student-promo__close" aria-label="Close" onClick={() => setShowMyMedhaPromo(false)}>×</button>
          <div className="student-promo__icon">📊</div><strong>Time for a My Medhā check-in?</strong>
          <p>See how your scores and progress have been trending lately.</p>
          <button type="button" onClick={() => { setShowMyMedhaPromo(false); openAssessment(); }}>Open My Medhā →</button>
        </div>
      )}

      <button
        type="button"
        className={`student-back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        onClick={() => { playClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        aria-label="Back to top"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <span className="student-back-to-top__arrow">↑</span>
        <span className="student-back-to-top__ring" aria-hidden="true" />
      </button>
    </div>
  );
}
