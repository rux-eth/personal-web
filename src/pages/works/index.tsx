import { Works } from "@src/components/works";
import { NextPage } from "next";
const WorksPage: NextPage = () => {
  const works = new Works();
  return works.worksPage();
};
export default WorksPage;
