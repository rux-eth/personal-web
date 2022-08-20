import { AppBar, Stack } from "@mui/material";
import { navDrawerAtom } from "@src/store/jotai";
import { theme } from "@src/styles/theme";
import transition from "@src/styles/utils";
import { dynamicFont } from "@src/utils/hooks/getCurrentBreakpoint";
import { ResizeContext } from "@src/utils/resize-observer";
import Hamburger from "hamburger-react";
import { useAtom } from "jotai";
import Image from "next/image";
import { FC, useContext } from "react";
import Connect from "./connect";
import Link from "./link";
import Links from "./links";

const Navbar: FC<{ path: any }> = ({ path }) => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useAtom(navDrawerAtom);
  const { showNavbar } = useContext(ResizeContext);
  const { w, h } = (() => {
    let dynHNum = parseInt(dynamicFont(110));
    return { w: dynHNum / 1.666, h: dynHNum };
  })();

  return (
    <AppBar
      className="font-Menlo px-[1.5ch]"
      elevation={0}
      sx={{
        fontSize: `${h}px`,
        transition,
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(18, 18, 18, 0.75)",
        border: "2px solid rgba(255, 255, 255, 0.015)",
        zIndex: 1201,
        transform: showNavbar ? "translateY(0%)" : "translateY(-100%)",
        opacity: showNavbar ? "100%" : "0%",
        position: path !== "/" ? "sticky" : "",
      }}
    >
      <div className="flex justify-between">
        <Link
          className="flex space-x-[0.5ch] items-center"
          href="/"
          style={{
            textDecoration: "none",
            alignItems: "center",
          }}
        >
          <Image
            className="grid-item-thumbnail"
            src="/eth-logo-white.png"
            width={w}
            height={h}
          />
          <span>Rux.eth</span>
        </Link>

        <div
          className="hidden md:flex space-x-[1ch] justify-end"
          style={{
            alignItems: "center",

            fontSize: `${h * 0.8}px`,
          }}
        >
          {Links.internal}
          {Links.external}
          <div
            className="text-[1ch]"
            style={{
              marginLeft: "2ch",
            }}
          >
            <Connect />
          </div>
        </div>
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ [theme.breakpoints.up("md")]: { display: "none" } }}
        >
          <div
            className="text-[1ch]"
            style={{
              marginRight: "0.7ch",
            }}
          >
            <Connect />
          </div>
          <Hamburger
            toggled={isNavDrawerOpen}
            toggle={setIsNavDrawerOpen}
            color={theme.palette.primary.main}
            hideOutline
          />
        </Stack>
      </div>
    </AppBar>
  );
};

export default Navbar;
