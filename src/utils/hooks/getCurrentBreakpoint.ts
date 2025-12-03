import { Breakpoint } from "@mui/material";
import { theme } from "@src/styles/theme";
import useMatchesMediaQuery from "./useMatchesMediaQuery";
const getCurrentBreakpoint = (): [string, number] => {
  const breakpoints: Array<[string, number]> = Object.entries(
    theme.breakpoints.values
  );
  let res: [string, number] = breakpoints[0];
  for (let i = 1; i < breakpoints.length; i++) {
    let curr = breakpoints[i];
    if (useMatchesMediaQuery("up", breakpoints[i][0] as Breakpoint)) {
      res = curr;
    }
  }
  return res;
};
export default getCurrentBreakpoint;
export const dynamicFont = (scale: number = 100, onlyWidth = false): string => {
  return `${
    Math.pow(getCurrentBreakpoint()[1], onlyWidth ? 1 : 0.5) * (scale / 100)
  }px`;
};
export const dynamicFontNum = (scale: number = 100, onlyWidth = false): number => {
  return Math.pow(getCurrentBreakpoint()[1], onlyWidth ? 1 : 0.5) * (scale / 100);
};
