import { createTheme, Theme } from '@mui/material/styles';

// Vuexy Color Palette
export const colors = {
  // Primary Colors
  primary: {
    main: '#7367F0', // Vuexy Purple
    light: '#8A7FF3',
    dark: '#5E50EE',
    50: '#F3F2FF',
    100: '#E8E5FF',
    200: '#C9C0FF',
    300: '#A595FF',
    400: '#816AFF',
    500: '#7367F0',
    600: '#5E50EE',
    700: '#4A3FE8',
    800: '#3C32D4',
    900: '#2E26B8',
  },
  // Success Colors
  success: {
    main: '#28C76F', // Vuexy Green
    light: '#4CD964',
    dark: '#1E9B5A',
    50: '#E8F8F0',
    100: '#D1F2E1',
    200: '#A3E5C3',
    300: '#75D8A5',
    400: '#47CB87',
    500: '#28C76F',
    600: '#1E9B5A',
    700: '#146F45',
    800: '#0A4330',
    900: '#05171B',
  },
  // Warning Colors
  warning: {
    main: '#FF9F43', // Vuexy Orange
    light: '#FFB976',
    dark: '#E68A3A',
    50: '#FFF5E6',
    100: '#FFEACC',
    200: '#FFD599',
    300: '#FFC066',
    400: '#FFAB33',
    500: '#FF9F43',
    600: '#E68A3A',
    700: '#CC7531',
    800: '#B36028',
    900: '#994B1F',
  },
  // Error Colors
  error: {
    main: '#EA5455', // Vuexy Red
    light: '#F08182',
    dark: '#D73B3C',
    50: '#FDEAEA',
    100: '#FBD5D5',
    200: '#F7ABAB',
    300: '#F38181',
    400: '#EF5757',
    500: '#EA5455',
    600: '#D73B3C',
    700: '#C42223',
    800: '#B1090A',
    900: '#9E0001',
  },
  // Info Colors
  info: {
    main: '#00CFE8', // Vuexy Cyan
    light: '#33D9ED',
    dark: '#00B8D1',
    50: '#E6F9FC',
    100: '#CCF3F9',
    200: '#99E7F3',
    300: '#66DBED',
    400: '#33CFE7',
    500: '#00CFE8',
    600: '#00B8D1',
    700: '#00A1BA',
    800: '#008AA3',
    900: '#00738C',
  },
  // Neutral Grays
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Background Colors
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    sidebar: '#283046',
    sidebarDark: '#161D31',
  },
  // Text Colors
  text: {
    primary: '#2C2C2C',
    secondary: '#6E6B7B',
    disabled: '#B9B9C3',
    inverse: '#FFFFFF',
  },
};

// Typography Scale
export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing Scale
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Create MUI Theme
export const theme: Theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.text.inverse,
    },
    secondary: {
      main: colors.info.main,
      light: colors.info.light,
      dark: colors.info.dark,
      contrastText: colors.text.inverse,
    },
    success: {
      main: colors.success.main,
      light: colors.success.light,
      dark: colors.success.dark,
      contrastText: colors.text.inverse,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
      dark: colors.warning.dark,
      contrastText: colors.text.inverse,
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
      contrastText: colors.text.inverse,
    },
    info: {
      main: colors.info.main,
      light: colors.info.light,
      dark: colors.info.dark,
      contrastText: colors.text.inverse,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    grey: {
      50: colors.gray[50],
      100: colors.gray[100],
      200: colors.gray[200],
      300: colors.gray[300],
      400: colors.gray[400],
      500: colors.gray[500],
      600: colors.gray[600],
      700: colors.gray[700],
      800: colors.gray[800],
      900: colors.gray[900],
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    h1: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h2: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h5: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    h6: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
      color: colors.text.primary,
    },
    body1: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.secondary,
    },
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'none',
      lineHeight: typography.lineHeight.tight,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.secondary,
    },
    overline: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: parseInt(borderRadius.md),
  },
  shadows: [
    'none',
    shadows.sm,
    shadows.base,
    shadows.md,
    shadows.lg,
    shadows.xl,
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
    shadows['2xl'],
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          textTransform: 'none',
          fontWeight: typography.fontWeight.medium,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
        contained: {
          '&:hover': {
            boxShadow: shadows.lg,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.base,
          border: `1px solid ${colors.gray[200]}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.base,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.md,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: typography.fontWeight.medium,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.xl,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: shadows.lg,
        },
      },
    },
  },
});

// Export theme utilities
export const themeUtils = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
};

export default theme;
