export const spacing = {
  0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px',
  10: '40px', 12: '48px', 14: '56px', 16: '64px', 20: '80px', 24: '96px', 30: '120px', 40: '160px', 50: '200px',
} as const;

export const sectionSpacing = { desktop: spacing[40], tablet: spacing[30], mobile: spacing[20] } as const;
export const sectionPadding = { desktop: spacing[24], tablet: spacing[14] as string, mobile: spacing[14] } as const;
export const sectionPaddingExplicit = { desktop: '96px', tablet: '72px', mobile: '56px' } as const;
export const cardGrid = { columnGap: spacing[6], rowGap: spacing[8] } as const;
