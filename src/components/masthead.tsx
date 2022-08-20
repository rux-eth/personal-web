import { Stack } from "@mui/material";
import useMatchesMediaQuery from "@src/utils/hooks/useMatchesMediaQuery";
import { ResizeContext } from "@src/utils/resize-observer";
import React, { useContext, useRef } from "react";
import Rain, { Slot } from "./rain";

interface Pieces {
  [key: string]: JSX.Element;
}

const pieces = ["R", "U", "X", "dot", "E", "T", "H"];
const Masthead: React.FC<{ scale?: number }> = ({ scale }) => {
  scale = scale ?? 1;
  const refContainer = useRef<HTMLDivElement>(null);
  const { scrollY } = useContext(ResizeContext);
  let progress = 0;
  const { current: elContainer } = refContainer;
  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  const allPieces = ((): Pieces => {
    let pieceMap: Map<String, JSX.Element> = new Map();

    pieces.forEach((p, index) => {
      pieceMap.set(
        p,
        p !== "dot" ? (
          <div
            key={`masthead_${p}`}
            className="relative text-[30vw] sm:text-[15vw]"
          >
            <Rain refContain={refContainer} variant={index} />

            <div
              style={{
                backgroundColor: "black",
                color: "white",
                font: "SF Pro Display",
                fontWeight: "bold",
                textAlign: "center",
                mixBlendMode: "darken",
              }}
            >
              {p}
            </div>
          </div>
        ) : (
          <div
            key={`masthead_${p}`}
            className="relative h-[10vw] w-[10vw] self-center justify-self-center"
          >
            <Slot refContain={refContainer} />
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                font: "SF Pro Display",
                fontWeight: "bold",
                textAlign: "center",
                mixBlendMode: "darken",
              }}
            ></div>
          </div>
        )
      );
    });
    return Object.fromEntries(pieceMap) as Pieces;
  })();
  return (
    <div
      ref={refContainer}
      className={`w-screen flex items-center justify-center text-center bg-black sticky top-0 -z-10`}
      style={{
        transform: `translateY(-${progress * 30}vh) `,
        height: `${scale * 100}vh`,
      }}
    >
      <div
        style={{
          transform: `scale(${100 * Math.pow(scale, 1 / 4)}%)`,
        }}
      >
        {useMatchesMediaQuery("up", "sm") ? (
          <Stack direction={"row"} spacing={2} fontSize={"18vw"}>
            {Object.values(allPieces).map((elem) => elem)}
          </Stack>
        ) : (
          <Stack direction={"column"} spacing={-3}>
            <Stack direction={"row"}>
              {Object.values(allPieces)
                .slice(0, 3)
                .map((elem, index) => (
                  <div key={`elem_${index}`} className="min-w-[25vw]">
                    {elem}
                  </div>
                ))}
            </Stack>
            <Stack className="flex items-center" zIndex={100}>
              {allPieces.dot}
            </Stack>
            <Stack direction={"row"}>
              {Object.values(allPieces)
                .slice(4)
                .map((elem, index) => (
                  <div key={`elem_${index}`} className="min-w-[25vw]">
                    {elem}
                  </div>
                ))}
            </Stack>
          </Stack>
        )}
      </div>
    </div>
  );
};
export default Masthead;
