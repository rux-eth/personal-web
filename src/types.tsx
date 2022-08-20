import { ethers } from "ethers";
import { Set } from "immutable";
export type WorkStatus = "Completed" | "Building" | "Deprecated";
export type Role = "Full-Stack" | "Back-End" | "Front-end";
export interface WorkInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: WorkStatus;
  role: Role;
  languages: Set<string>;
  stack: Set<string>;
  admins?: Set<string>;
  repo?: string;
  website?: string;
  article?: string;
  trello?: string;
}
export type Address = string;
export function assertAddress(str: string): asserts str is Address {
  if (!ethers.utils.isAddress(str)) throw Error("Not a valid address!");
  str = ethers.utils.getAddress(str);
}
export function assertAddressEq(a1: any, a2: any): boolean {
  if (typeof a1 !== typeof "string" || typeof a2 !== typeof "string")
    return false;
  return a1.toLowerCase() === a2.toLowerCase();
}
export function assertWorkInfo(obj: any): WorkInfo {
  if (
    !(
      "id" in obj &&
      "title" in obj &&
      "description" in obj &&
      "thumbnail" in obj &&
      "status" in obj &&
      "role" in obj &&
      "languages" in obj &&
      "stack" in obj
    )
  )
    throw Error("Missing keys!");
  let {
    id,
    title,
    description,
    thumbnail,
    status,
    role,
    languages,
    stack,
    authAddresses,
    repo,
    website,
    article,
    trello,
  } = obj;

  if (
    typeof id !== typeof "string" ||
    typeof title !== typeof "string" ||
    typeof description !== typeof "string" ||
    typeof thumbnail !== typeof "string" ||
    typeof status !== typeof "string" ||
    typeof role !== typeof "string" ||
    (!Set.isSet(languages) && !Array.isArray(languages)) ||
    (!Set.isSet(stack) && !Array.isArray(stack)) ||
    (authAddresses &&
      !Set.isSet(authAddresses) &&
      !Array.isArray(authAddresses)) ||
    (repo && typeof repo !== typeof "string") ||
    (website && typeof website !== typeof "string") ||
    (article && typeof article !== typeof "string") ||
    (trello && typeof trello !== typeof "string")
  )
    throw Error("Invalid Types!");
  if (languages && Array.isArray(languages)) {
    languages = Set(languages);
  }
  if (stack && Array.isArray(stack)) {
    stack = Set(stack);
  }
  if (authAddresses && Array.isArray(authAddresses)) {
    authAddresses = Set(authAddresses);
  }

  obj = {
    id,
    title,
    description,
    thumbnail,
    status,
    role,
    languages,
    stack,
    authAddresses,
    repo,
    website,
    article,
    trello,
  } as WorkInfo;
  return obj;
}
