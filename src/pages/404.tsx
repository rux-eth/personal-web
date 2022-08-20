import Layout from "@src/components/layouts/pages";
import Link from "@src/components/link";
import Seperator from "@src/components/seperator";
import { dynamicFont } from "@src/utils/hooks/getCurrentBreakpoint";
import { FC } from "react";
const NotFound: FC = () => {
  const fs = dynamicFont(100);
  return (
    <Layout title={"NOT FOUND"}>
      <div
        className="space-y-[1.5ch] text-white items-center font-Menlo py-14"
        style={{
          alignContent: "center",
          fontSize: fs,
        }}
      >
        <p className="text-[2ch] text-blue-500 opacity-90">Oops!</p>
        <p className="text-[1.2ch] opacity-80">
          The page you are looking for is not found!
        </p>
        <Seperator />
        <div className="flex flex-col">
          <Link className="white-comp text-[1.5ch]" href={"/"}>
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};
export default NotFound;
