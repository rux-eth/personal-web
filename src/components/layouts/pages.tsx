import { Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { motion } from "framer-motion";
import Head from "next/head";
import { FC, forwardRef } from "react";
import { CommentedHeader } from "../commented";
import Seperator from "../seperator";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 },
};
interface LayoutProps {
  title?: string;
}
function SlideTransition(props: any) {
  return <Slide {...props} direction="down" />;
}

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={4} ref={ref as any} variant="filled" {...props} />
));
const Layout: FC<LayoutProps> = ({ children, title }) => {
  const t = title ? `${title} - Rux.eth` : "Rux.eth";
  return (
    <motion.article
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4, type: "easeInOut" }}
      style={{ position: "relative" }}
    >
      <>
        {t && (
          <Head>
            <title>{t}</title>
            <meta name="twitter:title" content={t} />
            <meta property="og:title" content={t} />
          </Head>
        )}
        {title && (
          <div className="text-white">
            <CommentedHeader content={title} />
            <Seperator />
          </div>
        )}
        {children}
      </>
    </motion.article>
  );
};

export default Layout;
