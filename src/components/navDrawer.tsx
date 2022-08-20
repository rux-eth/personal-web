import { Drawer, Stack } from "@mui/material";
import { navDrawerAtom } from "@src/store/jotai";
import { useAtom } from "jotai";
import { FC, useCallback } from "react";
import Links from "./links";

const NavDrawer: FC = () => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useAtom(navDrawerAtom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeNavDrawer = useCallback(() => setIsNavDrawerOpen(false), []);
  return (
    <Drawer
      anchor="top"
      open={isNavDrawerOpen}
      onClose={closeNavDrawer}
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(18, 18, 18, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.015)",
        },
        "& .MuiDrawer-paper": {
          background: "none",
        },
      }}
    >
      <Stack
        spacing={1.2}
        direction="column"
        textAlign={"center"}
        fontFamily="Menlo"
        fontSize={"2rem"}
        sx={{
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(18, 18, 18, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.015)",
          pt: "80px",
          pb: "1rem",
        }}
        onClick={closeNavDrawer}
      >
        {Links.internal}
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          mt="2rem !important"
        >
          {Links.external}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default NavDrawer;
