import { FC } from "react";

const MainHeader: FC = ({ children }) => {
  return <div className="text-4xl text-white font-bold">{children}</div>;
};
const SubHeader: FC = ({ children }) => {
  return <div className="text-2xl text-white font-bold">{children}</div>;
};
export { MainHeader, SubHeader };
