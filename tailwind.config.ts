import type { Config } from 'tailwindcss';
import { colors } from './lib/design-tokens/colors';
import { radius } from './lib/design-tokens/radius';
import { spacing } from './lib/design-tokens/spacing';

const screens = {
  tablet: '768px',
  desktop: '1280px',
};

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens,
    extend: {
      colors: {
        background: {
          primary: colors.primaryBackground,
          secondary: colors.secondaryBackground,
        },
        surface: {
          DEFAULT: colors.surface,
          elevated: colors.elevatedSurface,
        },
        accent: {
          DEFAULT: colors.interactiveBlue,
          hover: colors.hoverBlue,
        },
        text: {
          primary: colors.textPrimary,
          secondary: colors.textSecondary,
          muted: colors.textMuted,
          disabled: colors.textDisabled,
        },
        border: {
          DEFAULT: colors.borderDefault,
          hover: colors.borderHover,
        },
        hairline: colors.hairline,
        status: {
          success: colors.success,
          warning: colors.warning,
          error: colors.error,
        },
      },
      borderRadius: radius,
      spacing,
      maxWidth: {
        content: '1440px',
        contentNarrow: '1280px',
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
