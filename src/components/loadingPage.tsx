import { dynamicFont } from "@src/utils/hooks/getCurrentBreakpoint";
import { FC, useEffect, useState } from "react";
const FailedLoad: FC<{ error: any }> = ({ error }) => {
  let err = "";
  try {
    err = JSON.stringify(error, null, 3);
  } catch {
    err = `${error}`;
  }
  console.error(err);
  return (
    <div
      className="text-red-500 font-Menlo italic opacity-80 text-center items-center"
      style={{
        whiteSpace: "pre",
        fontSize: dynamicFont(100),
      }}
    >
      <p>{`ERROR: failed to load works`}</p>
      <p>{`check console for log`}</p>
      <p>{`probably a db issue tbh`}</p>
    </div>
  );
};
const LoadingPage: FC = () => {
  const [dots, setDots] = useState("   ");
  let interval = null;
  useEffect(() => {
    interval = setInterval(() => {
      setDots((prevDots) => {
        let counter = 0;
        for (let i = 0; i < 3; i++) {
          if (prevDots[i] === ".") {
            counter++;
            continue;
          }
          break;
        }
        if (counter >= 3) return "   ";
        return prevDots.replace(" ", ".");
      });
    }, 300);
  }, []);
  return (
    <div className="text-white text-[11vw] font-Menlo italic opacity-80 text-center">
      <p
        className=""
        style={{
          whiteSpace: "pre",
        }}
      >{`loading${dots}`}</p>
    </div>
  );
};
export default LoadingPage;
export { FailedLoad };
