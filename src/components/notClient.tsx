import { dynamicFont } from "@src/utils/hooks/getCurrentBreakpoint";
import { FC } from "react";
import Layout from "./layouts/pages";

const NotClient: FC = () => {
  return (
    <Layout title="Not a Client">
      <div
        className="text-red-500 font-Menlo italic opacity-80 text-center items-center"
        style={{
          whiteSpace: "pre",
          fontSize: dynamicFont(100),
        }}
      >
        <p>{`Please make sure your wallet is connected`}</p>
        <p>{`and you are a registered client.`}</p>
        <p>{`Contact me to register.`}</p>
      </div>
    </Layout>
  );
};
export default NotClient;
