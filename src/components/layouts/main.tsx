import { Box, Slide, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import snackbarAtom from "@src/store/jotai";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import Head from "next/head";
import { Router } from "next/router";
import React, { forwardRef, useCallback } from "react";
import Footer from "../footer";
import Masthead from "../masthead";
import Navbar from "../navbar";
import NavDrawer from "../navDrawer";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 },
};
interface LayoutProps {
  router: Router;
  title?: string;
}
function SlideTransition(props: any) {
  return <Slide {...props} direction="down" />;
}

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={4} ref={ref as any} variant="filled" {...props} />
));
const Layout: React.FC<LayoutProps> = ({ children, router }) => {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom);
  const handleClose = useCallback(
    () => setSnackbar({ ...snackbar, isOpen: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [snackbar.isOpen]
  );

  return (
    <motion.article
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, type: "easeInOut" }}
      style={{ position: "relative" }}
    >
      <Head>
        <title>Rux.eth - Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Maxwell Rux" />
        <meta name="twitter:site" content="@rux_eth" />
        <meta name="twitter:creator" content="@rux_eth" />
        <meta property="og:site_name" content="Rux.eth" />
        <meta name="og:title" content="Rux.eth" />
        <meta property="og:type" content="website" />
        <link rel="stylesheet" href="/fonts/sf-pro.css" />
        <link rel="stylesheet" href="/fonts/menlo.css" />
      </Head>

      <Navbar path={router.asPath} />
      {router.asPath === "/" && <Masthead />}

      <Box bgcolor={"#333333"}>
        <div className="container auto min-h-screen">{children}</div>
      </Box>
      <Footer />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.isOpen}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={3000}
      >
        {/* @ts-ignore */}
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={
            snackbar.severity === "success"
              ? { width: "100%", backgroundColor: "#06ff76", color: "black" }
              : {}
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <NavDrawer />
    </motion.article>
  );
};

export default Layout;
