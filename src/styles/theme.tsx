import { createTheme } from "@material-ui/core/styles";

export type BreakpointVals = {
  [key in keyof typeof themeConstants.breakpoints]: number;
};
// THIS OBJECT SHOULD BE SIMILAR TO ../tailwind.config.js
const themeConstants = {
  paper: "#F9F9F9",
  primary: {
    main: "#ffffff",
    dark: "#3f3f3f",
  },
  secondary: {
    main: "#3f3f3f",
    dark: "#ffffff",
  },
  error: {
    main: "#b22222",
    dark: "#8b0000",
  },
  fg: { main: "#fff", dark: "rgba(55, 65, 81, 1)" },
  breakpoints: {
    xs: 350,
    mb: 600,
    sm: 960,
    md: 1280,
    lg: 1920,
    xl: 2560,
    "2xl": 3840,
  },
};

// Check here for more configurations https://material-ui.com/customization/default-theme/
export const theme = createTheme({
  palette: {
    primary: themeConstants.primary,
    secondary: themeConstants.secondary,
    background: { paper: themeConstants.paper },
    text: {
      primary: themeConstants.fg.main,
      secondary: themeConstants.fg.dark,
    },
    error: themeConstants.error,
  },
  breakpoints: {
    values: themeConstants.breakpoints as BreakpointVals,
  },
});
