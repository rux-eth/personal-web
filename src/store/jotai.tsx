import { atom } from "jotai";

const snackbarAtom = atom({
  isOpen: false,
  message: "",
  severity: "success",
});

export const navDrawerAtom = atom(false);
export default snackbarAtom;
