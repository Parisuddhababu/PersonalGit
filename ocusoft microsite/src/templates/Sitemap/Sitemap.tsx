import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import { ISiteMapProps } from "@templates/Sitemap";
import SitemapList from "@templates/Sitemap/component/SitemapList";
import { getTypeBasedCSSPathPages } from "@util/common";

const Sitemap = (props: ISiteMapProps) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.sitemap)} />
      </Head>
      <SitemapList data={props?.data?.sitemap} />
    </>
  );
};

export default Sitemap;
