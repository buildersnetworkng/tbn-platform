export const fontFamily = {
  serif: 'var(--font-instrument-serif), Georgia, serif',
  sans: 'var(--font-inter), system-ui, sans-serif',
} as const;

export const type = {
  display: { fontFamily: fontFamily.serif, fontSize: { desktop: '88px', tablet: '56px', mobile: '40px' }, lineHeight: 1.1 },
  h1: { fontFamily: fontFamily.serif, fontSize: { desktop: '56px', tablet: '40px', mobile: '32px' }, lineHeight: 1.1 },
  h2: { fontFamily: fontFamily.serif, fontSize: { desktop: '32px', tablet: '26px', mobile: '22px' }, lineHeight: 1.25 },
  bodyLarge: { fontFamily: fontFamily.sans, fontSize: { desktop: '20px', tablet: '18px', mobile: '16px' }, lineHeight: 1.5, color: 'textSecondary' },
  body: { fontFamily: fontFamily.sans, fontSize: '16px', lineHeight: 1.5, color: 'textSecondary' },
  caption: { fontFamily: fontFamily.sans, fontSize: '13px', lineHeight: 1.4, letterSpacing: '0.02em', color: 'textMuted' },
} as const;

export const maxLineLength = '68ch';
