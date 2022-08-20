import { CommentedHeader } from "@src/components/commented";
import Layout from "@src/components/layouts/pages";
import { NextPage } from "next";
/* @ts-ignore */
const Clients: NextPage = () => {
  return (
    <Layout title="Client Page">
      <div className="text-white">
        <CommentedHeader content="Under Construction..." />
      </div>
    </Layout>
  );
};
export default Clients;
