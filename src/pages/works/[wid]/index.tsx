import { Works } from "@src/components/works";
import { useRouter } from "next/router";

const Work = () => {
  const router = useRouter();
  const works = new Works();
  const { wid } = router.query;
  return works.workPage(wid as string);
};

export default Work;
