import { Stack } from "@mui/material";
import { CommentedContent, CommentedHeader } from "@src/components/commented";
import Seperator from "@src/components/seperator";
import { dynamicFont } from "@src/utils/hooks/getCurrentBreakpoint";
import { Set } from "immutable";
import React from "react";
import Link from "./link";
import { Works } from "./works";

interface Section {
  header: string;
  content: string;
  highlights?: { [key: string]: Array<string> };
  extraCompenent?: JSX.Element;
}

const TLDR: React.FC = () => {
  const fs = dynamicFont(70);
  const works = new Works();
  const sections: Section[] = [
    {
      header: "Introduction",
      content:
        "Hello, my name is Max, and I am a full-stack software engineer. I was born and raised in Minnesota, USA. Since I was young, I have had a strong interest in computers and gaming. This interest has eventually led me to my passion.",
    },
    {
      header: "Work",
      content:
        "I have been a software engineer for about 2 years. I have a strong passion for software development, especially cryptography and making decentralized applications. I have always been a learner, always researching interests until I have a deep understanding of the concept. This curiousity has led me to work with various frameworks and technologies.",

      extraCompenent: (
        <>
          <Seperator />
          <CommentedHeader content="Recent Works" />
          <div className="flex flex-col text-center space-y-[1.3ch]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 p-6">
              {works.getAllPreviews(Set(["Completed"])).slice(0, 3)}
            </div>
          </div>
          <Link className="white-comp text-[2.5ch]" href="/works">
            View All Works
          </Link>
        </>
      ),
    },
    {
      header: "Personal",
      content:
        "In my free time I am usually working on side-projects. However when I'm not developing software, I am usually either enjoying nature or playing videogames",
      highlights: {
        "My Hobbies": ["Fishing", "Hunting", "Cooking", "Learning"],
        "Interests/Passions": [
          "Music(all genres)",
          "Finance",
          "Crypto",
          "Dogs :P",
        ],
        "Favorite Movies/Videogames": [
          "Lord of the Rings",
          "Scarface",
          "American Psycho",
          "Gran Torino",
          "Red Dead Redemption",
          "Skyrim",
        ],
      },
    },
    {
      header: "Contact",
      content:
        "Feel free to contact me if you have any questions or business inquiries.",
      extraCompenent: (
        <Link className="white-comp text-[2.2ch]" href={"/contact"}>
          Contact Me
        </Link>
      ),
    },
  ];
  const compileHighlights = (hl: Section["highlights"]): string =>
    hl === undefined
      ? ""
      : `\n${Object.entries(hl)
          .map(([k, v]) => `\n${k}:${v.map((elem) => `\n - ${elem}`).join("")}`)
          .join("\n")}`;
  return (
    <div
      id="tldr"
      className="flex flex-col bg-inherit text-left text-primary-main space-y-[2%] pb-[3ch]"
      style={{ fontSize: fs }}
    >
      <CommentedHeader content="tl;dr" />

      <Seperator />
      <Stack
        direction={"row"}
        paddingX={"3ch"}
        fontFamily="Menlo"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="text-white flex flex-col space-y-[0.4ch]">
          <div>
            <p className="font-bold text-[3.4ch]">Max Rux</p>
            <p className="opacity-70 -mt-[1.2ch] text-[1.3ch]">ENS: rux.eth</p>
          </div>

          <p>Full-Stack Software Engineer</p>
        </div>
      </Stack>
      {sections.map((s) => (
        <>
          <Seperator />
          <CommentedContent
            content={
              s.highlights
                ? `${s.content}${compileHighlights(s.highlights)}`
                : `${s.content}`
            }
            header={s.header}
            fontSize={fs}
          />
          <>{s.extraCompenent ?? <></>}</>
        </>
      ))}
    </div>
  );
};
export default TLDR;
