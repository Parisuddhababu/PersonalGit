import { GetServerSideProps } from "next";
import React from "react";

const getRobots = (host:string|undefined) => `User-agent: *
Sitemap: https://${host}/sitemap.xml`;

class Sitemap extends React.Component {}

export const getServerSideProps: GetServerSideProps = async ({ req,res }) => {
  if (res) {
    res.setHeader("Content-Type", "text/plain");
    res.write(getRobots(req?.headers?.host));
    res.end();
  }
  return {
    props: {
      res,
    },
  };
};

export default Sitemap;
