import { FC } from "react";
interface Category {
  name: string;
  rgb: number[];
}
// testing git
const BuildCategory: FC<Category> = ({ name, rgb }) => {
  const textRGB = rgb.join(",");
  return (
    <span
      className={` font-Menlo rounded-[0.4ch] px-[0.5ch]`}
      style={{
        color: `rgba(${textRGB},1)`,
        backgroundColor: `rgba(${textRGB},0.4)`,
      }}
    >
      {`${name}`}
    </span>
  );
};
export const categories: { [key: string]: JSX.Element } = {
  // status
  Building: <BuildCategory name="Building" rgb={[255, 255, 0]} />,
  Deprecated: <BuildCategory name="Deprecated" rgb={[255, 35, 35]} />,
  Completed: <BuildCategory name="Completed" rgb={[0, 240, 0]} />,
  // stack
  node: <BuildCategory name="NodeJS" rgb={[83, 158, 67]} />,
  express: <BuildCategory name="ExpressJS" rgb={[247, 223, 30]} />,
  ethers: <BuildCategory name="EthersJS" rgb={[66, 97, 195]} />,
  hardhat: <BuildCategory name="Hardhat" rgb={[254, 176, 23]} />,
  foundry: <BuildCategory name="Foundry" rgb={[230, 230, 230]} />,
  mongodb: <BuildCategory name="MongoDB" rgb={[79, 171, 65]} />,
  next: <BuildCategory name="NextJS" rgb={[74, 179, 177]} />,
  web3: <BuildCategory name="Web3" rgb={[171, 79, 255]} />,
  tailwind: <BuildCategory name="TailwindCSS" rgb={[69, 140, 220]} />,
  fastify: <BuildCategory name="Fastify" rgb={[255, 90, 90]} />,
  wasm: <BuildCategory name="WebAssembly" rgb={[233, 10, 245]} />,
  // languagesß
  typescript: <BuildCategory name="Typescript" rgb={[49, 120, 198]} />,
  python: <BuildCategory name="Python" rgb={[112, 81, 162]} />,
  solidity: <BuildCategory name="Solidity" rgb={[98, 126, 234]} />,
  rust: <BuildCategory name="Rust" rgb={[230, 123, 16]} />,
  javascript: <BuildCategory name="Javascript" rgb={[240, 219, 79]} />,
  // misc.
  "Full-Stack": <BuildCategory name="Full-Stack" rgb={[255, 255, 0]} />,
  "Front-End": <BuildCategory name="Front-End" rgb={[0, 255, 0]} />,
  "Back-End": <BuildCategory name="Back-End" rgb={[255, 0, 0]} />,
  website: <BuildCategory name="Website" rgb={[0, 126, 220]} />,
  article: <BuildCategory name="Article" rgb={[0, 158, 95]} />,
  trello: <BuildCategory name="Trello" rgb={[230, 230, 230]} />,
} as const;

/**
 * ethersjs
 * hardhat
 * mongodb
 * NextJs
 *
 */
