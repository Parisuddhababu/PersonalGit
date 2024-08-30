import React from "react";
import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import { GetServerSideProps } from "next";
import { getWebsiteCode } from "@util/accountCode";
import http from "@util/axios";

 interface ISiteMap {
  data : ISiteMapObject[]
}

interface ISiteMapObject{
  "title": string,
  "loc": string,
  "lastmod": string,
  "changefreq":string,
  "priority":number
}

const sitemapXml = (data: ISiteMap) => {
  let projectsXML = "";
  data.data.map((post: any) => {
      projectsXML += `
      <url>
      <loc>${post.loc}</loc>
      <lastmod>${post.lastmod}</lastmod>
      <changefreq>${post.changefreq}</changefreq>
      <priority>${post.priority}</priority>
    </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${projectsXML}
    </urlset>`;
};

class Sitemap extends React.Component {}
export const getServerSideProps: GetServerSideProps = async ({req, res}) => {

  const host = req?.headers["host"];
  const canonical = `https://${host}${req?.url}`;
  // fetch data from api
  const { accountCode } = await getWebsiteCode(canonical);
  // @ts-ignore
  http.defaults.headers["Accountcode"] = accountCode;
  http.defaults.headers.common["Accountcode"] = accountCode;
  const ctx = await pagesServices.getPage(CONFIG.SITEMAP_API, {});
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemapXml(ctx));
  res.end();
  return {
    props: { ctx },
  };
};

export default Sitemap;
