// packages/ui/src/theme/tokens.ts
// Central design tokens for MEDHAA. All role themes derive from this file.
// Never hardcode colors/spacing in components — always import from here.

export type Role = 'student' | 'parent' | 'teacher' | 'admin';

export const fontFamilies = {
  heading: "'Poppins', sans-serif",
  body: "'Inter', sans-serif",
  playful: "'Nunito', sans-serif",
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const radii = {
  sm: '6px',
  md: '12px',
  lg: '20px',
  pill: '999px',
};

export const shadows = {
  card: '0 2px 8px rgba(0,0,0,0.08)',
  elevated: '0 8px 24px rgba(0,0,0,0.12)',
};

// Role-specific palettes. UI shell reads the active role from auth context
// and applies the matching palette via ThemeProvider.
export const rolePalettes: Record<Role, Record<string, string>> = {
  student: {
    primary: '#3B82F6',   // blue
    secondary: '#22C55E', // green
    accent: '#A855F7',    // purple
    highlight: '#F97316', // orange
    background: '#FFFFFF',
    text: '#1E293B',
  },
  parent: {
    primary: '#2563EB',
    secondary: '#64748B',
    background: '#FFFFFF',
    text: '#0F172A',
  },
  teacher: {
    primary: '#1E3A8A',
    secondary: '#0D9488',
    background: '#FFFFFF',
    text: '#0F172A',
  },
  admin: {
    primary: '#0F172A',
    secondary: '#334155',
    background: '#FFFFFF',
    text: '#0F172A',
  },
};

export const darkOverrides: Record<Role, Partial<Record<string, string>>> = {
  student: { background: '#0F172A', text: '#F1F5F9' },
  parent: { background: '#111827', text: '#F1F5F9' },
  teacher: { background: '#0B1220', text: '#F1F5F9' },
  admin: { background: '#020617', text: '#F1F5F9' },
};

export const animation = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '400ms ease-out',
};
