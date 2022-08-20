import Layout from "@src/components/layouts/pages";
import LoadingPage from "@src/components/loadingPage";
import { NextPage } from "next";

const Loading: NextPage = () => {
  return (
    <Layout title="Loading">
      <LoadingPage />
    </Layout>
  );
};
export default Loading;
