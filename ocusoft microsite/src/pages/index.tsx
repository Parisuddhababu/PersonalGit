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

const Page: NextPage<IHome, any> = ({ Context, canonical, host }) => {

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
          {Context?.meta?.Alternate?.map((meta) => {
            return (
              <link
                key={meta.href}
                rel="alternate"
                href={meta.href}
                hrefLang={meta.hreflang}
              />
            );
          })}
        </Head>
        <AppHome {...Context} host={host} canonical={canonical} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl }) => {
  const host = req?.headers["host"];
  const canonical = `https://${host}${req?.url}`;
  const { accountCode, domainName, isPreview } = await getWebsiteCode(canonical);
  if (accountCode && accountCode !== undefined) {
    // @ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = await accountCode;

    //@ts-ignore
    http.defaults.headers["Ispreview"] = isPreview;
    http.defaults.headers.common['Ispreview'] = isPreview;
  }
  const country_id = await getCountryIdFromServerside(req);
  if (country_id !== "" && country_id !== undefined) {
    http.defaults.headers.common["countryid"] = country_id;
  }
  const Context: IHome = await pagesServices.HomePage(canonical);
  // Context.slugInfo = slugInfo?.data
  const useragent = req?.headers["user-agent"];
  return {
    props: {
      Context,
      useragent,
      canonical,
      host,
      domainName: domainName,
    },
  };
};

export default Page;
