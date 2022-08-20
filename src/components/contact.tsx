import snackbarAtom from "@src/store/jotai";
import { useAtom } from "jotai";
import { FC } from "react";
import { FaCopy, FaLink } from "react-icons/fa";
import Link from "./link";

export interface ContactItem {
  title: string;
  value: string;
  link?: string;
}
export interface ContactProps {
  items: ContactItem[];
}
const Contact: FC<ContactProps> = ({ items }) => {
  const [, setSnackbar] = useAtom(snackbarAtom);
  const trimLink = (l: string) => {
    return l.replace(/^https?:\/\/(www.)?/, "");
  };
  return (
    <div
      className="flex flex-wrap justify-center py-[3ch]"
      style={{
        gap: "1ch",
      }}
    >
      {items.map((c) => (
        <div
          className="flex flex-col space-y-[0.5ch] w-[20ch] items-center border border-[#CCCCCC] rounded-[0.5ch] text-center p-[0.7ch] "
          style={{
            lineHeight: "4ch",
          }}
        >
          <span className="text-[3ch]">{c.title}</span>
          <span
            className="text-blue-300 text-[1.4ch]"
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "20ch",
              display: "block",
              overflow: "hidden",
            }}
          >
            {trimLink(c.value)}
          </span>
          <div className="flex space-x-[0.5ch] text-[2.5ch]">
            {c.link && (
              <Link
                className="white-comp"
                href={c.link}
                target="_blank"
                style={{
                  padding: "0.5ch",
                  transitionDuration: "200ms",
                }}
              >
                <FaLink />
              </Link>
            )}
            <button
              className="white-comp"
              onClick={() => {
                navigator.clipboard.writeText(c.value);
                setSnackbar({
                  severity: "success",
                  isOpen: true,
                  message: `${c.title} Value Copied to Clipboard!`,
                });
              }}
              style={{
                padding: "0.5ch",
                transitionDuration: "200ms",
              }}
            >
              <FaCopy />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Contact;
