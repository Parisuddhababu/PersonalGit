import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import { ISiteMapProps } from "@templates/Sitemap";
import SitemapList from "@templates/Sitemap/component/SitemapList";

const Sitemap = (props: ISiteMapProps) => {
  return (
    <>
      <Head>
        
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.sitemap + ".min.css"
          }
        />
      </Head>
      <SitemapList data={props?.data?.sitemap} />
    </>
  );
};

export default Sitemap;
