import * as React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Sparkles,
  Gamepad2,
  KeyRound,
  LayoutDashboard,
  Crown,
  Menu,
  ArrowRight,
  Brain,
  Heart,
  BarChart3,
  GraduationCap,
  Sparkle,
  Puzzle,
  Eye,
  Lightbulb,
  Users,
  LineChart,
  Sprout,
} from "lucide-react";
import "./HomePage.css";
import studentImg from '../assets/roles/student.png';
import parentImg from '../assets/roles/parent.png';
import teacherImg from '../assets/roles/teacher.png';
import schoolImg from '../assets/roles/school.png';
import medhaLogo from '../assets/logo/M_2.png';
import medhaIcon from '../assets/logo/medhaa-icon.svg';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

type Role = {
  title: string;
  subtitle: string;
  description: string;
  route: string;
  variant: 'student' | 'parent' | 'teacher' | 'school';
  image: string;
};

type Capability = {
  title: string;
  description: string;
  variant: string;
};

type GamePreview = {
  title: string;
  description: string;
  variant: string;
};

function StudentIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="28" fill="currentColor" opacity="0.12" />
      <path d="M25 35c0-7 5-12 11-12s11 5 11 12v12H25V35Z" fill="currentColor" opacity="0.9" />
      <circle cx="31" cy="34" r="2.5" fill="white" />
      <circle cx="41" cy="34" r="2.5" fill="white" />
      <path d="M31 41c3 2 7 2 10 0" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 50c4-6 10-9 17-9s13 3 17 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function ParentIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="25" cy="27" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="47" cy="27" r="8" fill="currentColor" opacity="0.72" />
      <circle cx="36" cy="45" r="7" fill="currentColor" />
      <path d="M12 53c2-9 7-14 13-14s11 5 13 14" fill="currentColor" opacity="0.8" />
      <path d="M34 53c2-8 7-13 13-13s11 5 13 13" fill="currentColor" opacity="0.62" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M15 24h42v29H15z" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="3" />
      <path d="M21 30h30M21 37h23M21 44h17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="m36 12 18 7-18 7-18-7 18-7Z" fill="currentColor" opacity="0.85" />
      <path d="M52 22v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="m36 13 25 12-25 12-25-12 25-12Z" fill="currentColor" opacity="0.9" />
      <path d="M17 33v19h38V33M27 52V38h18v14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M15 58h42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

const roles: Role[] = [
  {
    title: 'For Students',
    subtitle: 'Learn & play smarter',
    description: 'Brain-strengthening games, reports, and daily challenges tailored for every child.',
    variant: 'student',
    route: '/student/preview',
    image: '/images/roles/student-role.png',
  },
  {
    title: 'For Parents',
    subtitle: 'See real progress',
    description: 'Understand your child’s strengths and support them with actionable insights.',
    variant: 'parent',
    route: '/parent/preview',
    image: '/images/roles/parent-role.png',
  },
  {
    title: 'For Teachers',
    subtitle: 'Track your class',
    description: 'Monitor cognitive skills across the classroom and guide learning with data.',
    variant: 'teacher',
    route: '/teacher/preview',
    image: '/images/roles/teacher-role.png',
  },
  {
    title: 'For Schools',
    subtitle: 'Transform learning',
    description: 'School-wide cognitive assessment, dashboards, and improvement programs.',
    variant: 'school',
    route: '/school-report',
    image: '/images/roles/school-role.png',
  },
];


function FloatingOrb({ className = '' }: { className?: string }) {
  return (
    <span className={`floating-orb ${className}`} aria-hidden="true">
      <span />
    </span>
  );
}

function RoleGraphic({ variant }: { variant: Role['variant'] }) {
  const icons = {
    student: Brain,
    parent: Heart,
    teacher: BarChart3,
    school: GraduationCap,
  };
  const Icon = icons[variant];

  return (
    <span className={`role-graphic role-graphic-${variant}`} aria-hidden="true">
      <span className="graphic-ring graphic-ring-1" />
      <span className="graphic-ring graphic-ring-2" />
      <span className="graphic-dots">
        <i /><i /><i /><i />
      </span>
      <span className="graphic-icon">
        <Icon size={31} strokeWidth={1.8} />
      </span>
    </span>
  );
}


function MedhaWorldBackground() {
  return (
    <div className="medha-world" aria-hidden="true">
      <div className="world-sky" />
      <div className="world-cloud cloud-1" />
      <div className="world-cloud cloud-2" />
      <div className="world-cloud cloud-3" />

      <svg className="world-mountains" viewBox="0 0 1200 420" preserveAspectRatio="none">
        <defs>
          <linearGradient id="mountainBack" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#cdebea" />
            <stop offset="1" stopColor="#7cc7c4" />
          </linearGradient>
          <linearGradient id="mountainFront" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#78b9b2" />
            <stop offset="1" stopColor="#3f8e88" />
          </linearGradient>
        </defs>
        <path d="M0 290L125 135 215 225 330 70 455 238 565 112 690 250 820 92 965 240 1080 145 1200 270V420H0Z" fill="url(#mountainBack)" opacity=".78" />
        <path d="M0 330L120 205 210 270 315 140 425 285 560 175 670 300 805 155 930 286 1060 195 1200 300V420H0Z" fill="url(#mountainFront)" opacity=".76" />
        <path d="M315 140l-30 55 30-18 30 28 30-42zM805 155l-31 58 31-22 30 30 31-45z" fill="#eaf8f5" opacity=".8" />
      </svg>

      <div className="world-tree tree-a"><span /><span /><span /></div>
      <div className="world-tree tree-b"><span /><span /><span /></div>
      <div className="world-tree tree-c"><span /><span /><span /></div>
      <div className="world-tree tree-d"><span /><span /><span /></div>

      <div className="world-ground">
        <div className="world-path" />
        <div className="world-doodle doodle-a" />
        <div className="world-doodle doodle-b" />
        <div className="world-doodle doodle-c" />
        <div className="world-flags">
          <i /><i /><i /><i /><i />
        </div>
      </div>

      <div className="world-wood-ridge">
        <span className="wood-grain grain-a" />
        <span className="wood-grain grain-b" />
        <span className="wood-grain grain-c" />
      </div>
    </div>
  );
}

const medhaHeroStyles = `

  .medha-world {
    position: absolute;
    inset: 0;
    min-height: 900px;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    border-radius: 0 0 42px 42px;
    background: #dff5f1;
  }

  .world-sky {
    position: absolute;
    inset: 0 0 40% 0;
    background:
      radial-gradient(circle at 50% 12%, rgba(255,255,255,.95) 0 7%, transparent 24%),
      linear-gradient(180deg, #bff0ec 0%, #dff7f0 58%, #d9eee7 100%);
  }

  .world-sky::after {
    content: "";
    position: absolute;
    width: 190px;
    height: 190px;
    right: 8%;
    top: 7%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,229,126,.72), rgba(255,229,126,0) 68%);
    filter: blur(3px);
    animation: medhaSunPulse 7s ease-in-out infinite;
  }

  .world-cloud {
    position: absolute;
    width: 155px;
    height: 45px;
    border-radius: 50px;
    background: rgba(255,255,255,.72);
    filter: blur(.3px);
    box-shadow: 35px -14px 0 -5px rgba(255,255,255,.65), 82px -4px 0 -8px rgba(255,255,255,.62);
    opacity: .68;
    animation: medhaCloud 24s linear infinite;
  }

  .cloud-1 { left: 4%; top: 8%; }
  .cloud-2 { left: 55%; top: 14%; transform: scale(.78); animation-duration: 31s; animation-delay: -11s; }
  .cloud-3 { left: 31%; top: 23%; transform: scale(.55); animation-duration: 28s; animation-delay: -18s; opacity: .45; }

  .world-mountains {
    position: absolute;
    left: 0;
    right: 0;
    top: 18%;
    width: 100%;
    height: 38%;
  }

  .world-ground {
    position: absolute;
    left: -4%;
    right: -4%;
    top: 46%;
    bottom: 9%;
    background:
      radial-gradient(circle at 25% 30%, rgba(255,255,255,.24) 0 2px, transparent 3px),
      radial-gradient(circle at 75% 65%, rgba(255,255,255,.20) 0 2px, transparent 3px),
      radial-gradient(ellipse at 12% 70%, rgba(255,255,255,.18) 0 18px, transparent 20px),
      radial-gradient(ellipse at 86% 45%, rgba(255,255,255,.16) 0 15px, transparent 17px),
      linear-gradient(180deg, #79b978 0%, #8ec87c 19%, #cdb574 20%, #c49a5a 100%);
    clip-path: polygon(0 7%, 13% 3%, 26% 8%, 39% 2%, 54% 8%, 68% 3%, 82% 7%, 100% 1%, 100% 100%, 0 100%);
  }

  .world-ground::before,
  .world-ground::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: 2px dashed rgba(102,82,54,.22);
    width: 320px;
    height: 125px;
  }

  .world-ground::before { left: 34%; top: 18%; transform: rotate(-8deg); }
  .world-ground::after { left: 42%; top: 31%; width: 240px; height: 105px; transform: rotate(13deg); }

  .world-path {
    position: absolute;
    width: 190px;
    height: 430px;
    left: 48%;
    top: 5%;
    transform: translateX(-50%) rotate(-7deg);
    background: rgba(232, 219, 188, .66);
    border-radius: 55% 45% 45% 55%;
    filter: blur(.2px);
  }

  .world-path::before {
    content: "";
    position: absolute;
    width: 76%;
    height: 82%;
    left: 12%;
    top: 9%;
    border: 3px dashed rgba(107,77,53,.32);
    border-radius: 50%;
    transform: rotate(12deg);
  }

  .world-flags {
    position: absolute;
    inset: 10% 12% auto 12%;
    height: 120px;
  }

  .world-flags i {
    position: absolute;
    width: 2px;
    height: 55px;
    background: rgba(83,68,47,.35);
    transform-origin: bottom;
  }

  .world-flags i::after {
    content: "";
    position: absolute;
    left: 2px;
    top: 0;
    border-style: solid;
    border-width: 7px 20px 7px 0;
    border-color: transparent rgba(233,112,77,.75) transparent transparent;
  }

  .world-flags i:nth-child(1) { left: 10%; top: 18px; transform: rotate(-12deg); }
  .world-flags i:nth-child(2) { left: 28%; top: 6px; transform: rotate(8deg); }
  .world-flags i:nth-child(3) { left: 48%; top: 18px; transform: rotate(-5deg); }
  .world-flags i:nth-child(4) { left: 68%; top: 4px; transform: rotate(9deg); }
  .world-flags i:nth-child(5) { left: 86%; top: 20px; transform: rotate(-7deg); }

  .world-doodle {
    position: absolute;
    width: 34px;
    height: 12px;
    border-radius: 50%;
    background: rgba(73,123,74,.25);
    filter: blur(.2px);
  }

  .doodle-a { left: 21%; top: 48%; transform: rotate(-28deg); }
  .doodle-b { right: 19%; top: 37%; transform: rotate(22deg); }
  .doodle-c { left: 69%; top: 62%; transform: rotate(-8deg); }

  .world-tree {
    position: absolute;
    bottom: 37%;
    width: 58px;
    height: 116px;
    z-index: 2;
    animation: medhaTreeSway 5s ease-in-out infinite;
    transform-origin: bottom center;
  }

  .world-tree::after {
    content: "";
    position: absolute;
    width: 9px;
    height: 55px;
    left: 25px;
    bottom: 0;
    border-radius: 8px;
    background: #79533b;
  }

  .world-tree span {
    position: absolute;
    width: 47px;
    height: 35px;
    border-radius: 55% 45% 50% 50%;
    background: #4e9c6b;
    box-shadow: 15px 8px 0 #6eae69, -13px 11px 0 #78b56d;
  }

  .world-tree span:nth-child(1) { left: 7px; top: 13px; }
  .world-tree span:nth-child(2) { left: 2px; top: 34px; transform: scale(.82); }
  .world-tree span:nth-child(3) { left: 17px; top: 0; transform: scale(.72); }

  .tree-a { left: 4%; transform: scale(.88); }
  .tree-b { right: 4%; transform: scale(.96); animation-delay: -1.4s; }
  .tree-c { left: 19%; bottom: 29%; transform: scale(.54); animation-delay: -2.2s; }
  .tree-d { right: 18%; bottom: 30%; transform: scale(.62); animation-delay: -3.1s; }

  .world-wood-ridge {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 15%;
    min-height: 108px;
    background:
      radial-gradient(ellipse at 12% 35%, rgba(104,59,31,.15) 0 18px, transparent 20px),
      radial-gradient(ellipse at 70% 70%, rgba(104,59,31,.13) 0 25px, transparent 27px),
      repeating-linear-gradient(3deg, rgba(89,53,29,.10) 0 2px, transparent 2px 18px),
      linear-gradient(180deg, #b77b3e, #8c592f);
    box-shadow: inset 0 9px 0 rgba(255,255,255,.10), inset 0 2px 0 rgba(83,51,29,.16);
    z-index: 4;
  }

  .wood-grain {
    position: absolute;
    height: 2px;
    border-radius: 50%;
    background: rgba(73,42,24,.22);
  }

  .grain-a { width: 160px; left: 10%; top: 38%; transform: rotate(4deg); }
  .grain-b { width: 230px; left: 49%; top: 58%; transform: rotate(-2deg); }
  .grain-c { width: 110px; right: 8%; top: 31%; transform: rotate(5deg); }

  .medha-enhanced {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    background: transparent !important;
  }

  .medha-enhanced > .home-nav,
  .medha-enhanced > .explore-section,
  .medha-enhanced > .home-footer {
    position: relative;
    z-index: 5;
  }

  .medha-enhanced > .home-nav {
  background: transparent;
  backdrop-filter: none;
}

  .medha-enhanced > .explore-section {
    background: transparent;
  }

  .medha-enhanced::before,
  .medha-enhanced::after {
    content: "";
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
    filter: blur(2px);
    z-index: -1;
  }

  .medha-enhanced::before {
    width: 320px;
    height: 320px;
    right: -150px;
    top: 80px;
    background: radial-gradient(circle, rgba(120, 91, 255, .11), transparent 68%);
    animation: medhaFloat 9s ease-in-out infinite;
  }

  .medha-enhanced::after {
    width: 260px;
    height: 260px;
    left: -130px;
    bottom: 80px;
    background: radial-gradient(circle, rgba(40, 190, 170, .10), transparent 68%);
    animation: medhaFloat 11s ease-in-out infinite reverse;
  }

  .medha-intro {
    position: relative;
    max-width: 860px;
    margin: 0 auto 34px;
    padding: 18px 20px 4px;
    text-align: center;
    animation: medhaReveal .75s ease both;
  }

  .medha-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 13px;
    border: 1px solid rgba(120, 91, 255, .18);
    border-radius: 999px;
    background: rgba(255,255,255,.65);
    backdrop-filter: blur(10px);
    font-size: .76rem;
    font-weight: 750;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .medha-intro h1 {
    margin: 17px 0 12px;
    font-size: clamp(2.15rem, 5vw, 4.3rem);
    line-height: .98;
    letter-spacing: -.055em;
    text-wrap: balance;
  }

  .medha-intro h1 .gradient-word {
    background: linear-gradient(110deg, #6d4cff, #9b67ff 42%, #20b8a2);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .medha-intro p {
    max-width: 720px;
    margin: 0 auto;
    font-size: clamp(.98rem, 1.6vw, 1.12rem);
    line-height: 1.65;
    opacity: .78;
  }

  .medha-mini-points {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 18px;
  }

  .medha-mini-point {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(255,255,255,.56);
    border: 1px solid rgba(20,20,40,.08);
    font-size: .78rem;
    font-weight: 650;
  }

  .floating-orb {
    position: absolute;
    z-index: 4;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    opacity: .55;
    background: currentColor;
    box-shadow: 0 0 0 7px color-mix(in srgb, currentColor 10%, transparent);
    animation: medhaDrift 5s ease-in-out infinite;
    pointer-events: none;
  }

  .floating-orb span {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    animation: medhaPulse 2.8s ease-in-out infinite;
  }

  .orb-a { left: 7%; top: 22%; color: #7558ff; }
  .orb-b { right: 10%; top: 29%; color: #20b8a2; animation-delay: -1.6s; }
  .orb-c { left: 15%; bottom: 13%; color: #f0a94b; animation-delay: -2.8s; }

  .enhanced-role-grid {
    position: relative;
    z-index: 3;
  }

  .explore-section {
    position: relative;
    z-index: 2;
  }

  .section-heading-wrap,
  .medha-intro,
  .medha-trust-strip {
    position: relative;
    z-index: 5;
  }

  .enhanced-role-card {
    position: relative;
    overflow: hidden;
    transform: translateY(0);
    background: rgba(255,255,255,.78);
    backdrop-filter: blur(8px) saturate(1.05);
    border: 1px solid rgba(255,255,255,.72);
    transition:
      transform .35s cubic-bezier(.2,.8,.2,1),
      box-shadow .35s ease,
      border-color .35s ease;
    animation: medhaCardIn .65s cubic-bezier(.2,.8,.2,1) both;
    animation-delay: var(--role-delay, 0ms);
  }

  .enhanced-role-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 80% 15%, rgba(255,255,255,.48), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,.22), transparent 50%);
    opacity: .8;
    pointer-events: none;
  }

  .enhanced-role-card::after {
    content: "";
    position: absolute;
    width: 130px;
    height: 130px;
    right: -72px;
    bottom: -72px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.28);
    box-shadow: 0 0 0 18px rgba(255,255,255,.05), 0 0 0 38px rgba(255,255,255,.035);
    transition: transform .5s ease;
    pointer-events: none;
  }

  .enhanced-role-card:hover {
    transform: translateY(-9px) scale(1.012);
    box-shadow: 0 20px 48px rgba(32, 25, 65, .14);
  }

  .enhanced-role-card:hover::after {
    transform: scale(1.22);
  }

  .role-visual-wrap {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 178px;
    margin-bottom: 8px;
  }

  .role-image {
    position: relative;
    z-index: 2;
    display: grid;
    place-items: center;
    transition: transform .45s cubic-bezier(.2,.8,.2,1);
  }

  .enhanced-role-card:hover .role-image {
    transform: translateY(-6px) scale(1.045);
  }

  .role-image img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 12px 16px rgba(20,20,50,.10));
  }

  .role-graphic {
    position: absolute;
    width: 136px;
    height: 136px;
    z-index: 1;
    opacity: .95;
  }

  .graphic-ring {
    position: absolute;
    inset: 8px;
    border: 1px solid currentColor;
    border-radius: 50%;
    opacity: .13;
    animation: medhaSpin 12s linear infinite;
  }

  .graphic-ring-2 {
    inset: 25px;
    border-style: dashed;
    opacity: .16;
    animation-duration: 8s;
    animation-direction: reverse;
  }

  .graphic-icon {
    position: absolute;
    inset: 42px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(255,255,255,.68);
    color: currentColor;
    box-shadow: 0 9px 25px rgba(20,20,50,.08);
    backdrop-filter: blur(7px);
  }

  .graphic-dots {
    position: absolute;
    inset: 0;
    animation: medhaSpin 16s linear infinite;
  }

  .graphic-dots i {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: .34;
  }

  .graphic-dots i:nth-child(1) { left: 10%; top: 48%; }
  .graphic-dots i:nth-child(2) { left: 48%; top: 8%; }
  .graphic-dots i:nth-child(3) { right: 10%; top: 48%; }
  .graphic-dots i:nth-child(4) { left: 48%; bottom: 8%; }

  .role-graphic-student { color: #7256ff; }
  .role-graphic-parent { color: #e56c91; }
  .role-graphic-teacher { color: #1b9f96; }
  .role-graphic-school { color: #e49b36; }

  .role-title,
  .role-subtitle,
  .role-description,
  .role-link {
    position: relative;
    z-index: 3;
  }

  .role-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: gap .25s ease;
  }

  .enhanced-role-card:hover .role-link {
    gap: 10px;
  }

  .role-link .role-arrow-icon {
    transition: transform .25s ease;
  }

  .enhanced-role-card:hover .role-arrow-icon {
    transform: translateX(2px);
  }

  .medha-trust-strip {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 18px;
    margin: 32px auto 6px;
    padding: 12px 16px;
    color: inherit;
    opacity: .72;
    font-size: .78rem;
  }

  .medha-trust-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  @keyframes medhaReveal {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes medhaCardIn {
    from { opacity: 0; transform: translateY(22px) scale(.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes medhaFloat {
    0%,100% { transform: translate3d(0,0,0) scale(1); }
    50% { transform: translate3d(0,-18px,0) scale(1.04); }
  }

  @keyframes medhaDrift {
    0%,100% { transform: translate(0,0); }
    50% { transform: translate(8px,-14px); }
  }

  @keyframes medhaPulse {
    0%,100% { transform: scale(.75); opacity: .45; }
    50% { transform: scale(1.2); opacity: 1; }
  }

  @keyframes medhaSpin {
    to { transform: rotate(360deg); }
  }


  @keyframes medhaCloud {
    0% { transform: translateX(-8vw) scale(var(--cloud-scale, 1)); }
    50% { transform: translateX(8vw) scale(var(--cloud-scale, 1)); }
    100% { transform: translateX(-8vw) scale(var(--cloud-scale, 1)); }
  }

  @keyframes medhaSunPulse {
    0%,100% { transform: scale(.92); opacity: .58; }
    50% { transform: scale(1.08); opacity: .9; }
  }

  @keyframes medhaTreeSway {
    0%,100% { transform: rotate(-1deg); }
    50% { transform: rotate(1.5deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .medha-enhanced *,
    .medha-enhanced *::before,
    .medha-enhanced *::after {
      animation-duration: .001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .001ms !important;
    }
  }

  @media (max-width: 720px) {
    .medha-world {
      min-height: 1040px;
      border-radius: 0 0 26px 26px;
    }

    .world-mountains { top: 19%; height: 30%; }
    .world-ground { top: 43%; bottom: 10%; }
    .world-tree { bottom: 39%; }
    .world-wood-ridge { min-height: 78px; }

    .medha-intro {
      padding-inline: 12px;
      margin-bottom: 24px;
    }

    .medha-intro h1 {
      font-size: clamp(2rem, 12vw, 3rem);
    }

    .role-visual-wrap {
      min-height: 145px;
    }

    .role-graphic {
      width: 112px;
      height: 112px;
    }

    .graphic-icon {
      inset: 35px;
    }

    .medha-trust-strip {
      gap: 10px 16px;
    }
  }

/* --- Role artwork integration: adventure-marker treatment --- */
.enhanced-role-grid {
  align-items: stretch;
}

.enhanced-role-card {
  overflow: visible !important;
  margin-top: 54px;
  padding-top: 78px !important;
  background:
    linear-gradient(145deg, rgba(255,250,237,.94), rgba(247,239,218,.90)) !important;
  border: 1px solid rgba(255,255,255,.76) !important;
  box-shadow:
    0 18px 35px rgba(79,55,25,.13),
    inset 0 1px 0 rgba(255,255,255,.9) !important;
}

.role-visual-wrap {
  position: absolute !important;
  top: -76px;
  left: 50%;
  width: min(82%, 230px);
  height: 142px;
  min-height: 0 !important;
  transform: translateX(-50%);
  z-index: 8;
  pointer-events: none;
}

.role-visual-wrap::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 5px;
  width: 82%;
  height: 24px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(62,45,25,.20), transparent 68%);
  filter: blur(5px);
  opacity: .7;
}

.role-image {
  position: absolute !important;
  inset: 0;
  z-index: 4 !important;
  display: grid !important;
  place-items: end center !important;
  transform-origin: 50% 90%;
  animation: roleMarkerFloat 4.8s ease-in-out infinite;
}

.enhanced-role-card:nth-child(2) .role-image { animation-delay: -.8s; }
.enhanced-role-card:nth-child(3) .role-image { animation-delay: -1.6s; }
.enhanced-role-card:nth-child(4) .role-image { animation-delay: -2.4s; }

.role-image img {
  display: block;
  width: auto !important;
  height: 138px !important;
  max-width: 100% !important;
  object-fit: contain !important;
  object-position: center bottom;
  filter:
    drop-shadow(0 4px 0 rgba(255,255,255,.88))
    drop-shadow(0 12px 12px rgba(47,34,20,.18)) !important;
}

.role-graphic {
  width: 126px !important;
  height: 126px !important;
  left: 50%;
  bottom: -2px;
  transform: translateX(-50%);
  opacity: .30 !important;
  z-index: 2 !important;
}

.enhanced-role-card:hover .role-image {
  transform: translateY(-7px) rotate(-1deg) scale(1.045) !important;
}

.enhanced-role-card:nth-child(even):hover .role-image {
  transform: translateY(-7px) rotate(1deg) scale(1.045) !important;
}

/* Slightly richer dark/light landscape palette while preserving the world design */
.medha-enhanced {
  background:
    radial-gradient(circle at 12% 13%, rgba(255,248,202,.28), transparent 25%),
    radial-gradient(circle at 88% 19%, rgba(64,170,154,.18), transparent 27%),
    linear-gradient(180deg, #dff5ef 0%, #e9f0d7 34%, #d8bd76 64%, #bd8447 100%) !important;
}

.medha-enhanced::before {
  opacity: .78;
}

.medha-world,
.world-background,
.illustrated-world {
  filter: saturate(1.08) contrast(1.035);
}

/* Gentle pools of light/shade across the illustrated world */
.explore-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 18% 30%, rgba(255,255,224,.19), transparent 22%),
    radial-gradient(circle at 78% 38%, rgba(30,94,78,.10), transparent 26%),
    linear-gradient(100deg, rgba(64,45,20,.035), transparent 30%, rgba(255,255,235,.08) 54%, rgba(54,42,20,.05));
  mix-blend-mode: multiply;
}

.explore-section > * {
  position: relative;
  z-index: 2;
}

@keyframes roleMarkerFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(.7deg); }
}

@media (max-width: 720px) {
  .enhanced-role-card {
    margin-top: 46px;
    padding-top: 68px !important;
  }

  .role-visual-wrap {
    top: -65px;
    width: min(76%, 205px);
    height: 124px;
  }

  .role-image img {
    height: 120px !important;
  }
}


/* ---   World 2.0: depth, journey, cognitive skills and micro-interactions --- */

.medha-enhanced {
  --world-ink: #193536;
  --world-teal: #168d88;
  --world-purple: #7654ee;
  --world-gold: #e4a84c;
}

.medha-intro {
  z-index: 5;
}

.medha-intro::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -44px;
  width: 230px;
  height: 230px;
  transform: translateX(-50%);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255,255,255,.82) 0 18%, rgba(116,82,239,.10) 19% 32%, transparent 33%),
    repeating-conic-gradient(from 0deg, rgba(116,82,239,.11) 0 3deg, transparent 3deg 22deg);
  opacity: .62;
  z-index: -1;
  animation: medhaCorePulse 7s ease-in-out infinite;
}

.medha-intro::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 31px;
  width: 285px;
  height: 285px;
  transform: translateX(-50%);
  border: 1px dashed rgba(32,139,132,.18);
  border-radius: 50%;
  z-index: -1;
  animation: medhaSpin 28s linear infinite;
}

.enhanced-role-grid {
  position: relative;
}

.enhanced-role-grid::before {
  content: "";
  position: absolute;
  left: 7%;
  right: 7%;
  top: 50%;
  height: 2px;
  background: repeating-linear-gradient(90deg, rgba(93,70,39,.38) 0 7px, transparent 7px 15px);
  transform: rotate(-1deg);
  opacity: .72;
  z-index: 0;
}

.enhanced-role-card {
  z-index: 2;
}

.world-marker {
  position: absolute;
  right: 9px;
  top: 4px;
  width: 30px;
  height: 30px;
  z-index: 7;
  display: grid;
  place-items: center;
}

.marker-icon {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(145deg, rgba(35,113,107,.96), rgba(96,72,191,.96));
  box-shadow: 0 6px 15px rgba(40,42,72,.18);
  animation: markerFloat 3.8s ease-in-out infinite;
}

.world-marker-parent .marker-icon { background: linear-gradient(145deg, #d56c8e, #8e5bd4); }
.world-marker-teacher .marker-icon { background: linear-gradient(145deg, #198f87, #4b77cb); }
.world-marker-school .marker-icon { background: linear-gradient(145deg, #d99b3f, #7d6bc8); }

.marker-glow {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: currentColor;
  opacity: .12;
  animation: markerGlow 2.6s ease-in-out infinite;
}

.marker-spark {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: .5;
}
.marker-spark.s1 { left: -2px; top: 9px; }
.marker-spark.s2 { right: -2px; top: 18px; }
.marker-spark.s3 { left: 12px; top: -3px; }

.medha-journey {
  position: relative;
  max-width: 1000px;
  margin: 68px auto 30px;
  padding: 38px 28px 32px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255,251,235,.72), rgba(255,255,255,.48));
  border: 1px solid rgba(255,255,255,.68);
  box-shadow: 0 20px 50px rgba(61,47,29,.09);
  backdrop-filter: blur(7px);
  overflow: hidden;
}

.medha-journey::before {
  content: "";
  position: absolute;
  left: 8%;
  right: 8%;
  top: 113px;
  border-top: 2px dashed rgba(91,73,48,.22);
}

.journey-heading {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 30px;
}

.journey-kicker {
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
  opacity: .62;
}

.journey-heading h2 {
  margin: 6px 0 5px;
  font-size: clamp(1.55rem, 3vw, 2.25rem);
  letter-spacing: -.035em;
  color: var(--world-ink);
}

.journey-heading p {
  margin: 0;
  opacity: .68;
  font-size: .92rem;
}

.journey-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.journey-step {
  position: relative;
  text-align: center;
  padding: 0 10px;
}

.journey-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 13px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(145deg, #7254ee, #219d94);
  box-shadow: 0 10px 22px rgba(71,66,131,.16);
  transition: transform .3s ease;
}

.journey-step:hover .journey-icon {
  transform: translateY(-5px) rotate(-3deg);
}

.journey-step:nth-child(2) .journey-icon { background: linear-gradient(145deg, #218f98, #4d75d9); }
.journey-step:nth-child(3) .journey-icon { background: linear-gradient(145deg, #d88c4b, #7555ce); }
.journey-step:nth-child(4) .journey-icon { background: linear-gradient(145deg, #4c9b63, #1c8f92); }

.journey-step h3 {
  margin: 0 0 5px;
  font-size: 1rem;
  color: var(--world-ink);
}

.journey-step p {
  margin: 0 auto;
  max-width: 170px;
  font-size: .78rem;
  line-height: 1.5;
  opacity: .67;
}

.medha-skills {
  position: relative;
  max-width: 1080px;
  margin: 55px auto 20px;
  text-align: center;
}

.skills-heading {
  margin-bottom: 22px;
}

.skills-heading h2 {
  margin: 6px 0;
  color: var(--world-ink);
  font-size: clamp(1.55rem, 3vw, 2.2rem);
  letter-spacing: -.035em;
}

.skills-heading p {
  margin: 0 auto;
  max-width: 650px;
  opacity: .67;
  font-size: .9rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.skill-tile {
  position: relative;
  min-height: 132px;
  padding: 20px 10px 15px;
  border-radius: 21px;
  background: rgba(255,253,243,.72);
  border: 1px solid rgba(255,255,255,.72);
  box-shadow: 0 12px 25px rgba(63,48,27,.07);
  transition: transform .28s ease, box-shadow .28s ease, background .28s ease;
  overflow: hidden;
}

.skill-tile:hover {
  transform: translateY(-6px);
  background: rgba(255,255,255,.9);
  box-shadow: 0 18px 32px rgba(63,48,27,.11);
}

.skill-icon {
  width: 43px;
  height: 43px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(145deg, #7254ee, #4c9b9a);
}

.skill-tile:nth-child(2) .skill-icon { background: linear-gradient(145deg, #4b78d0, #5c61c9); }
.skill-tile:nth-child(3) .skill-icon { background: linear-gradient(145deg, #238f8c, #4b9c6a); }
.skill-tile:nth-child(4) .skill-icon { background: linear-gradient(145deg, #df9b48, #d46f77); }
.skill-tile:nth-child(5) .skill-icon { background: linear-gradient(145deg, #d86f91, #8c5ed1); }
.skill-tile:nth-child(6) .skill-icon { background: linear-gradient(145deg, #54a36a, #318a9b); }

.skill-tile h3 {
  margin: 0 0 4px;
  color: var(--world-ink);
  font-size: .9rem;
}

.skill-tile p {
  margin: 0;
  font-size: .71rem;
  line-height: 1.4;
  opacity: .63;
}

@keyframes medhaCorePulse {
  0%,100% { transform: translateX(-50%) scale(.96); opacity: .48; }
  50% { transform: translateX(-50%) scale(1.04); opacity: .75; }
}

@keyframes markerFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes markerGlow {
  0%,100% { transform: scale(.7); opacity: .10; }
  50% { transform: scale(1.25); opacity: .23; }
}

@media (max-width: 900px) {
  .skills-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 650px) {
  .enhanced-role-grid::before,
  .medha-journey::before { display: none; }

  .medha-journey {
    margin-top: 50px;
    padding: 30px 16px 25px;
  }

  .journey-grid { grid-template-columns: repeat(2, 1fr); row-gap: 28px; }
  .skills-grid { grid-template-columns: repeat(2, 1fr); }
}


/* =========================================================
   FINAL VISUAL POLISH
   ========================================================= */

/* Real Medhā brand assets */
.brand-logo-wrap {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 12px;
  flex: 0 0 42px;
  background: #fff;
  box-shadow: 0 5px 14px rgba(24, 42, 52, .13);
}

.brand-logo-image {
  width: 39px;
  height: 39px;
  object-fit: contain;
}

.footer-logo-wrap {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  flex: 0 0 32px;
}

.footer-logo-image {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.hero-brand-emblem {
  width: 64px;
  height: 64px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: rgba(255,255,255,.84);
  border: 1px solid rgba(255,255,255,.92);
  box-shadow: 0 12px 30px rgba(36, 56, 67, .12);
  animation: heroEmblemFloat 5.5s ease-in-out infinite;
}

.hero-brand-emblem img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

/* Reduce the decorative trees so they frame the page instead of covering content. */
.world-tree {
  width: 38px !important;
  height: 78px !important;
  bottom: 34% !important;
  opacity: .72;
  transform: scale(.72) !important;
}

.world-tree::after {
  width: 6px !important;
  height: 39px !important;
  left: 16px !important;
}

.world-tree span {
  width: 32px !important;
  height: 24px !important;
  box-shadow: 10px 6px 0 #6eae69, -9px 8px 0 #78b56d !important;
}

.world-tree span:nth-child(1) { left: 4px !important; top: 9px !important; }
.world-tree span:nth-child(2) { left: 1px !important; top: 23px !important; }
.world-tree span:nth-child(3) { left: 12px !important; top: 0 !important; }

.tree-a { left: 2.2% !important; }
.tree-b { right: 2.2% !important; }
.tree-c { left: 17% !important; bottom: 27% !important; transform: scale(.42) !important; }
.tree-d { right: 16% !important; bottom: 27% !important; transform: scale(.46) !important; }

/* Make flags smaller, lighter and less distracting. */
.world-flags {
  inset: 8% 13% auto 13% !important;
  height: 86px !important;
  opacity: .68;
}

.world-flags i {
  height: 39px !important;
  width: 1.5px !important;
  background: rgba(72,62,47,.28) !important;
}

.world-flags i::after {
  border-width: 5px 14px 5px 0 !important;
  border-color: transparent rgba(218,101,69,.62) transparent transparent !important;
}

.world-flags i:nth-child(1) { left: 8% !important; top: 12px !important; }
.world-flags i:nth-child(2) { left: 28% !important; top: 2px !important; }
.world-flags i:nth-child(3) { left: 50% !important; top: 14px !important; }
.world-flags i:nth-child(4) { left: 72% !important; top: 1px !important; }
.world-flags i:nth-child(5) { left: 92% !important; top: 13px !important; }

/* Reduce the wooden foreground so it does not consume too much viewport space. */
.world-wood-ridge {
  height: 10% !important;
  min-height: 70px !important;
  background:
    repeating-linear-gradient(3deg, rgba(89,53,29,.08) 0 2px, transparent 2px 18px),
    linear-gradient(180deg, #bd8448, #925d32) !important;
}

/* Stronger, readable typography over the illustrated background. */
.medha-intro h1,
.medha-intro p,
.section-heading-wrap,
.journey-heading h2,
.journey-heading p,
.journey-step h3,
.journey-step p,
.skills-heading h2,
.skills-heading p,
.skill-tile h3,
.skill-tile p,
.medha-trust-strip,
.medha-mini-point {
  color: #183638 !important;
}

.medha-intro h1 {
  text-shadow: 0 1px 0 rgba(255,255,255,.45);
}

.medha-intro p,
.journey-heading p,
.journey-step p,
.skills-heading p,
.skill-tile p {
  opacity: 1 !important;
  color: #445d60 !important;
}

.medha-eyebrow {
  color: #214446 !important;
  background: rgba(255,255,255,.88) !important;
  box-shadow: 0 5px 15px rgba(30,54,57,.07);
}

.medha-mini-point {
  background: rgba(255,255,255,.84) !important;
  border-color: rgba(35,62,64,.12) !important;
  box-shadow: 0 4px 12px rgba(32,51,55,.05);
}

.role-card {
  color: #183638 !important;
}

.role-title {
  color: #173536 !important;
  text-shadow: none !important;
}

.role-subtitle {
  color: #087f7a !important;
  font-weight: 800 !important;
}

.role-description {
  color: #536a6c !important;
  opacity: 1 !important;
}

.role-link {
  color: #1c5151 !important;
  font-weight: 800 !important;
}

.medha-trust-item {
  color: #274c4c !important;
}

.medha-journey,
.medha-skills {
  color: #183638 !important;
}

.medha-journey {
  background:
    linear-gradient(135deg, rgba(255,251,235,.90), rgba(255,255,255,.78)) !important;
  border-color: rgba(255,255,255,.92) !important;
  box-shadow: 0 20px 50px rgba(48,42,29,.12) !important;
}

.skill-tile {
  background: rgba(255,253,243,.90) !important;
  border-color: rgba(255,255,255,.95) !important;
}

/* Use the real logo subtly in the hero without competing with the headline. */
@keyframes heroEmblemFloat {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
}

/* Prevent the background decorative layer from reducing text contrast. */
.explore-section::before {
  background:
    radial-gradient(circle at 18% 30%, rgba(255,255,224,.13), transparent 22%),
    radial-gradient(circle at 78% 38%, rgba(30,94,78,.06), transparent 26%) !important;
  mix-blend-mode: normal !important;
}

.medha-enhanced > .home-nav {
  border: none !important;
  box-shadow: none !important;
}

.medha-enhanced > .home-nav::before,
.medha-enhanced > .home-nav::after {
  content: none !important;
  display: none !important;
}

.medha-enhanced > .explore-section::before,
.medha-enhanced > .explore-section::after {
  content: none !important;
  display: none !important;
}

/* Mobile: keep the framing elements away from text/cards. */
@media (max-width: 720px) {
  .world-tree {
    opacity: .48 !important;
    bottom: 30% !important;
  }

  .world-wood-ridge {
    height: 8% !important;
    min-height: 54px !important;
  }

  .hero-brand-emblem {
    width: 54px;
    height: 54px;
  }

  .hero-brand-emblem img {
    width: 41px;
    height: 41px;
  }
}

`;


const cognitiveSkills = [
  { title: "Focus", icon: Eye, text: "Stay with what matters." },
  { title: "Memory", icon: Brain, text: "Remember, connect, recall." },
  { title: "Attention", icon: Sparkles, text: "Notice what others miss." },
  { title: "Creativity", icon: Lightbulb, text: "Imagine new possibilities." },
  { title: "Empathy", icon: Heart, text: "Understand another mind." },
  { title: "Imagination", icon: Puzzle, text: "Explore beyond the obvious." },
];

const medhaJourney = [
  { title: "Play", icon: Gamepad2, text: "Engage through meaningful activities." },
  { title: "Observe", icon: Eye, text: "See patterns in how learners respond." },
  { title: "Understand", icon: LineChart, text: "Turn experiences into useful insights." },
  { title: "Grow", icon: Sprout, text: "Support continuous cognitive development." },
];

function WorldMarker({ type }: { type: "student" | "parent" | "teacher" | "school" }) {
  const iconMap = {
    student: Gamepad2,
    parent: Users,
    teacher: GraduationCap,
    school: BarChart3,
  };
  const Icon = iconMap[type];

  return (
    <span className={`world-marker world-marker-${type}`} aria-hidden="true">
      <span className="marker-glow" />
      <span className="marker-icon"><Icon size={19} strokeWidth={2} /></span>
      <span className="marker-spark s1" />
      <span className="marker-spark s2" />
      <span className="marker-spark s3" />
    </span>
  );
}

export default function HomePage() {

  const navigate = useNavigate();
  const go = (route: string) => navigate(route);

  return (
    <main className="home-wrap medha-enhanced">
      <style>{medhaHeroStyles}</style>
      <MedhaWorldBackground />
      <FloatingOrb className="orb-a" />
      <FloatingOrb className="orb-b" />
      <FloatingOrb className="orb-c" />
      <header className="home-nav">
        <button
          className="brand"
          onClick={() => go("/")}
          aria-label="Medhaa home"
        >
          <span className="brand-logo-wrap" aria-hidden="true">
            <img className="brand-logo-image" src={medhaLogo} alt="" />
          </span>
          <span className="brand-name">Medhā</span>
        </button>
      


        <button className="mobile-menu-button" aria-label="Open navigation menu">
          <Menu size={23} aria-hidden="true" />
        </button>

        <header className="homepage-header">
  <button
    type="button"
    className="homepage-brand"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    aria-label="Medhā home"
  >
  </button>

  <nav className="homepage-header-actions" aria-label="Homepage navigation">
    <button
      type="button"
      className="homepage-nav-link homepage-nav-link--approach"
      onClick={() => {
        navigate('/our-approach');
      }}
    >
      Our Approach
      <span aria-hidden="true"></span>
    </button>
  </nav>
</header>
      </header>
      <section className="section explore-section" id="explore">
  <div className="medha-intro">
    <div className="hero-brand-emblem" aria-hidden="true">
      <img src={medhaIcon} alt="" />
    </div>
    <span className="medha-eyebrow">
      <Sparkles size={13} aria-hidden="true" />
      Explore Medhā
    </span>

    <h1>
      One platform for <span className="gradient-word"> every student.</span>
    </h1>

    <p>
      Medhā brings meaningful play, cognitive development, progress insights,
      and learning support together — with an experience designed for the person using it.
    </p>

    <div className="medha-mini-points" aria-label="Medhā highlights">
      <span className="medha-mini-point"><Brain size={14} /> Build cognitive skills</span>
      <span className="medha-mini-point"><BarChart3 size={14} /> Understand progress</span>
      <span className="medha-mini-point"><Heart size={14} /> Support every learner</span>
    </div>
  </div>

  <div className="section-heading-wrap" style={{ display: 'none' }}>
    <span className="section-kicker">Explore Medhā</span>
    <h2>One platform For all.</h2>
  </div>

  <div className="role-grid enhanced-role-grid">
    {roles.map((role, index) => (
      <button
        key={role.title}
        className={`role-card role-${role.variant} enhanced-role-card`}
        onClick={() => go(role.route)}
        style={{
          animationDelay: `${index * 80}ms`,
          ['--role-delay' as string]: `${index * 80}ms`,
        }}
      >
        <span className="role-visual-wrap">
          <RoleGraphic variant={role.variant} />
          <span className="role-image">
            <img
              src={role.image}
              alt=""
              aria-hidden="true"
            />
          </span>
          <WorldMarker type={role.variant} />
        </span>
        <span className="role-title">
          {role.title}
        </span>

        <span className="role-subtitle">
          {role.subtitle}
        </span>

        <span className="role-description">
          {role.description}
        </span>

        <span className="role-link">
          Explore <ArrowRight className="role-arrow-icon" size={16} aria-hidden="true" />
        </span>
      </button>
    ))}
  </div>
</section>

<section
  className="medha-skills"
  aria-labelledby="skills-title"
  style={{
    position: 'relative',
    zIndex: 5,
    paddingTop: '48px',
    paddingBottom: '56px',
  }}
>
  <div
    className="skills-heading"
    style={{
      position: 'relative',
      zIndex: 20,
      width: 'min(900px, calc(100% - 40px))',
      margin: '0 auto 38px',
      padding: '28px 36px 30px',
      textAlign: 'center',
      background: 'rgba(255, 251, 239, 0.94)',
      border: '1px solid rgba(255, 255, 255, 0.75)',
      borderRadius: '24px',
      boxShadow: '0 14px 40px rgba(55, 72, 50, 0.10)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      boxSizing: 'border-box',
      opacity: 1,
    }}
  >
    <span
      className="journey-kicker"
      style={{
        display: 'block',
        marginBottom: '9px',
        color: '#315c5c',
        fontSize: '0.75rem',
        fontWeight: 800,
        letterSpacing: '0.17em',
        lineHeight: 1.3,
        textTransform: 'uppercase',
        opacity: 1,
      }}
    >
      Inside the world of Medhā
    </span>

    <h2
      id="skills-title"
      style={{
        margin: '0 0 12px',
        color: '#183638',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 800,
        lineHeight: 1.12,
        letterSpacing: '-0.035em',
        opacity: 1,
      }}
    >
      Build the skills behind better learning.
    </h2>

    <p
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        color: '#536a6c',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.65,
        opacity: 1,
      }}
    >
      A playful environment can still be purposeful — each experience can
      help learners explore the cognitive skills that support everyday
      learning.
    </p>

    <div
      aria-label="Medhā platform qualities"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '9px 14px',
        marginTop: '22px',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 13px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(49,92,92,0.10)',
          color: '#315c5c',
          fontSize: '0.78rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <Sparkle size={14} />
        Joyful engagement
      </span>

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 13px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(49,92,92,0.10)',
          color: '#315c5c',
          fontSize: '0.78rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <BarChart3 size={14} />
        Meaningful insights
      </span>

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 13px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(49,92,92,0.10)',
          color: '#315c5c',
          fontSize: '0.78rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <Heart size={14} />
        Learner-centred design
      </span>
    </div>
  </div>

  <div
    className="skills-grid"
    style={{
      position: 'relative',
      zIndex: 10,
    }}
  >
    {cognitiveSkills.map((skill) => {
      const Icon = skill.icon;

      return (
        <article
          className="skill-tile"
          key={skill.title}
          style={{
            position: 'relative',
            zIndex: 10,
            opacity: 1,
          }}
        >
          <span
            className="skill-icon"
            aria-hidden="true"
            style={{
              opacity: 1,
            }}
          >
            <Icon size={21} strokeWidth={1.9} />
          </span>

          <h3
            style={{
              color: '#183638',
              opacity: 1,
            }}
          >
            {skill.title}
          </h3>

          <p
            style={{
              color: '#536a6c',
              opacity: 1,
            }}
          >
            {skill.text}
          </p>
        </article>
      );
    })}
  </div>
</section>

<footer className="home-footer">
  <div className="footer-brand">
    <span className="footer-logo-wrap" aria-hidden="true">
      <img className="footer-logo-image" src={medhaIcon} alt="" />
    </span>
    <strong>Medhā</strong>
  </div>

  <span>© 2026 Medhā · Designed for curious minds</span>

  <span className="footer-note">
    A Bhāva Tech product
  </span>
</footer>
    </main>
  );
}
