const defaultTheme = require("tailwindcss/defaultTheme");
const themeConstants = {
  paper: "#F9F9F9",
  primary: {
    main: "#ffffff",
    dark: "#000000",
  },
  secondary: {
    main: "#000000",
    dark: "#ffffff",
  },
  error: {
    main: "#b22222",
    dark: "#8b0000",
  },
  fg: { main: "#fff", dark: "rgba(55, 65, 81, 1)" },
  breakpoints: {
    xs: "350px",
    mb: "600px",
    sm: "960px",
    md: "1280px",
    lg: "1920px",
    xl: "2560px",
    "2xl": "3840px",
  },
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./pages/*.{html,js,jsx,ts,tsx}",
  ],
  //darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      SF_Pro_Display: ["SF Pro"],
      Menlo: ["Menlo"],
    },
    extend: {
      colors: {
        paper: themeConstants.paper,
        primary: themeConstants.primary,
        secondary: themeConstants.secondary,
        error: themeConstants.error,
        fg: themeConstants.fg.main,
        "fg-dark": themeConstants.fg.dark,
      },
    },

    // We over ride the whole screens with breakpoints for width. The 'ha' breakpoint will help us in blocking hover animations on devices not supporting hover.
    screens: {
      ...defaultTheme.screens,
      ...themeConstants.breakpoints,
      ha: { raw: "(hover: hover)" },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
