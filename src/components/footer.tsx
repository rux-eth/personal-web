import { dynamicFont } from "@src/utils/hooks/getCurrentBreakpoint";
import Links from "./links";

const Footer = () => {
  return (
    <div
      className="flex flex-col bg-black items-center space-y-[0.1ch] py-[1ch]"
      style={{
        fontSize: dynamicFont(70),
      }}
    >
      {Links.internal}
      <div className="flex space-x-[2ch] items-center justify-center py-[0.6ch]">
        {Links.external}
      </div>
      <p className="text-white opacity-[50%] py-2 text-[1ch]">
        © 2022 Maxwell Rux. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
