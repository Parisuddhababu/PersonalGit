import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";

// GTM Components
import { GTagScript, GTagNoScript } from "@components/GoogleGTM";
import IHome from "@type/Common/home";
// config
import React from "react";
import getConfig from "next/config";
import pagesServices from "@services/pages.services";
import MaintenanceMode from "@components/Maintenance/Maintenance";
import AppHome from "@templates/AppHome";
import { getWebsiteCode, getCountryIdFromServerside } from "@util/accountCode";
import http from "@util/axios";

const Page: NextPage<IHome, any> = ({ Context, canonical, host, domainName, micrositeName }) => {

  // Maintenance Page render if MAINTENANCE_MODE true
  const { publicRuntimeConfig } = getConfig();
  if (publicRuntimeConfig.MAINTENANCE_MODE) {
    return (
      <MaintenanceMode title="Site is under maintenance we will sortly available" />
    );
  }

  return (
    <>
      <GTagNoScript />
      <main>
        <Head>
          <GTagScript />
          {Context.meta.Alternate &&
            Context.meta.Alternate.map((meta, metaIndex: number) => {
              return (
                <link
                  key={metaIndex}
                  rel="alternate"
                  href={meta.href}
                  hrefLang={meta.hreflang}
                />
              );
            })}
        </Head>
        {/* <NextSeo
          nofollow={NoFollow}
          noindex={NoIndex}
          title={Context?.slugInfo?.slug_info?.slug_detail?.meta_title ? Context?.slugInfo?.slug_info?.slug_detail?.meta_title : domainName}
          description={Context?.meta?.description}
          canonical={Context?.meta?.canonical_url || canonical}
          openGraph={{
            locale: "en_US",
            type: "website",
            site_name: "Jewellers Kart",
            title: Context?.slugInfo?.slug_info?.slug_detail?.meta_title ? Context?.slugInfo?.slug_info?.slug_detail?.meta_title : domainName,
            description: Context?.slugInfo?.slug_info?.slug_detail?.meta_description ? Context?.slugInfo?.slug_info?.slug_detail?.meta_description : domainName,
          }}
          twitter={{
            cardType: "summary_large_image",
            site: "@Brainvire",
          }}
          additionalMetaTags={[
            {
              name: "twitter:title",
              content: Context?.meta?.title,
            },
            {
              name: "twitter:description",
              content: Context?.meta?.description,
            },
            // {
            //   name: "twitter:image",
            //   content: Context.slider[0].image,
            // },
          ]}
        /> */}
        <AppHome {...Context} host={host} canonical={canonical} domainName={domainName} micrositeName={micrositeName}/>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl }) => {
  const host = req?.headers["host"];
  const canonical = `https://${host}${req?.url}`;
  // if (canonical) {
  const { accountCode, domainName, micrositeName } = await getWebsiteCode(canonical);
  if (accountCode && accountCode !== undefined) {
    // @ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = await accountCode;
  }
  // }
  // res.setHeader("Set-Cookie", serialize("accountCode", accountCode, { path: "/" }))
  const country_id = await getCountryIdFromServerside(req);
  if (country_id !== "" && country_id !== undefined) {
    http.defaults.headers.common["countryid"] = country_id;
  }
  let slugInfo;
  if (resolvedUrl) {
    slugInfo = await pagesServices.getSlugInfo(resolvedUrl)
  }
  const Context: IHome = await pagesServices.HomePage(canonical);
  Context.slugInfo = slugInfo?.data
  const useragent = req?.headers["user-agent"];
  return {
    props: {
      Context,
      useragent,
      canonical,
      host,
      domainName: domainName,
      micrositeName: micrositeName
    },
  };
};

export default Page;
