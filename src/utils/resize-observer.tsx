import { refs } from "@src/components/commented";
import { Map as IMap } from "immutable";
import React, { useCallback, useEffect, useState } from "react";

interface LineValues {
  numLines: IMap<string, number>;
  scrollY: number;
  showNavbar: boolean;
}
export const ResizeContext = React.createContext<LineValues>({
  numLines: IMap(),
  scrollY: 0,
  showNavbar: false,
});
const ResizeObserver: React.FC = ({ children }) => {
  const [numLines, setNumLines] = useState<IMap<string, number>>(IMap());
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(false);
  const handleResize = useCallback(() => {
    setScrollY(window.scrollY);
    let temp = numLines;
    const divs = document.querySelectorAll(".commented");
    setShowNavbar(
      (document.getElementById("tldr")?.getBoundingClientRect()?.y ?? 0) <= 0
    );
    divs.forEach((elem) => {
      const refContainer = refs.get(elem.id);
      if (refContainer) {
        const { current: el } = refContainer!;
        let lines = numLines.get(elem.id) ?? 0;
        if (el) {
          const paraHt = el.offsetHeight;
          const lineHeight = parseInt(el.style.lineHeight);
          lines = Math.floor(paraHt / lineHeight) - 2;
        }
        temp = temp.set(elem.id, lines);
      }
    });
    setNumLines(temp);
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    setTimeout(handleResize, 1000);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [handleResize]);

  return (
    <ResizeContext.Provider value={{ numLines, scrollY, showNavbar }}>
      {children}
    </ResizeContext.Provider>
  );
};
export default ResizeObserver;
