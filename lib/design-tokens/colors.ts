export const PRIMARY_BACKGROUND = '#050608';
export const PRIMARY_ACCENT = '#C7D9FF';

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const newR = Math.round(r + (255 - r) * percent);
  const newG = Math.round(g + (255 - g) * percent);
  const newB = Math.round(b + (255 - b) * percent);
  return `#${[newR, newG, newB].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export const SECONDARY_BACKGROUND = lighten(PRIMARY_BACKGROUND, 0.02);
export const SURFACE = lighten(PRIMARY_BACKGROUND, 0.04);
export const ELEVATED_SURFACE = lighten(PRIMARY_BACKGROUND, 0.07);
export const INTERACTIVE_BLUE = PRIMARY_ACCENT;
export const HOVER_BLUE = lighten(PRIMARY_ACCENT, 0.06);
export const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.92)';
export const TEXT_SECONDARY = 'rgba(255, 255, 255, 0.70)';
export const TEXT_MUTED = 'rgba(255, 255, 255, 0.50)';
export const TEXT_DISABLED = 'rgba(255, 255, 255, 0.35)';
export const BORDER_DEFAULT = 'rgba(255, 255, 255, 0.10)';
export const BORDER_HOVER = 'rgba(255, 255, 255, 0.17)';
export const HAIRLINE = 'rgba(255, 255, 255, 0.06)';
export const DISABLED_FILL = 'rgba(255, 255, 255, 0.08)';
export const SUCCESS = '#A9C9B4';
export const WARNING = '#D9C79A';
export const ERROR = '#CDA3A3';

export const colors = {
  primaryBackground: PRIMARY_BACKGROUND,
  secondaryBackground: SECONDARY_BACKGROUND,
  surface: SURFACE,
  elevatedSurface: ELEVATED_SURFACE,
  primaryAccent: PRIMARY_ACCENT,
  interactiveBlue: INTERACTIVE_BLUE,
  hoverBlue: HOVER_BLUE,
  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textMuted: TEXT_MUTED,
  textDisabled: TEXT_DISABLED,
  borderDefault: BORDER_DEFAULT,
  borderHover: BORDER_HOVER,
  hairline: HAIRLINE,
  disabledFill: DISABLED_FILL,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
} as const;

export type ColorToken = keyof typeof colors;
