// ═══════════════════════════════════════════════════════════════
//  likhana/reviewedCorrections.ts — corrections approved by the teacher
//  Paste the "corrections" object from समीक्षा → Export here, e.g.
//    export const REVIEWED = { "क": { "order": [0, 2, 1, 3], "reversed": [0] } };
//  These apply for every learner; a browser's own review edits still apply on top.
// ═══════════════════════════════════════════════════════════════
import type { Correction } from "./engine";

export const REVIEWED: Record<string, Correction> = {};
