import { GetServerSideProps, NextPage } from "next";

// Template, Component and Services
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import { RenderTemplate } from "@templates/index";
import Templates from "@templates/index";
import { ErrorPage } from "@components/Error";
import {removeLoginData, setAuthHeader } from "@util/common";
import http from "@util/axios";
import { getCountryIdFromServerside, getWebsiteCode } from "@util/accountCode";
import APICONFIG from "@config/api.config";
// @ts-ignore
const Page: NextPage<ISlugPageProps> = ({ ctx, host, canonical, domainName, micrositeName}) => {
  // template is exist
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx.page_template];

  const splitCanonical = canonical?.split("?");
  let filterCanonical = "";
  if (splitCanonical && splitCanonical?.length > 0) {
    filterCanonical = splitCanonical[0];
  }

  // render error template if template is not found
  if (!IsTemplate)
    return <ErrorPage code={ctx.status} message="Template not Found" domainName={domainName}/>;

  // render template
  return <Templates {...ctx} host={host} canonical={filterCanonical} domainName={domainName} micrositeName={micrositeName}/>;
};
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query: params,
  resolvedUrl
}) => {
  const useragent = req?.headers["user-agent"];

  const host = req?.headers["host"];
  const canonical = `https://${host}${req?.url}`;
  let ctx: any;

  // if (canonical) {
  const {accountCode, domainName, micrositeName} = await getWebsiteCode(canonical);
  if (accountCode && accountCode !== undefined) {
    // @ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = await accountCode;
  }
  // }

  let slugInfo;
  if (resolvedUrl) {
    slugInfo = await pagesServices.getSlugInfo(resolvedUrl)
  }

  const token = await setAuthHeader(req);
  if (token) {
    http.defaults.headers.common["Authorization"] = token;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
  const country_id = await getCountryIdFromServerside(req);
  if (country_id !== "" && country_id !== undefined) {
    http.defaults.headers.common["countryid"] = country_id;
  }

  ctx = await pagesServices.postPage(
    APICONFIG.RECENT_PRODUCT_LIST_BY_ID as string,
    params
  );

  if (ctx?.status_code === 401) {
    ctx.page_template = "SIGNIN_BANNER";
    removeLoginData();
    res?.writeHead(301, {
      Location: "/sign-in",
    });
    res?.end();
    return {
      props: {
        ctx,
        useragent,
        host: req ? req.headers.host : "",
        canonical,
        sequence: ctx.sequence,
        domainName: domainName,
        micrositeName: micrositeName
      },
    };
  }
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx?.page_template];

  // set response 404 if portfolio not found
  if (ctx?.status === 404 || !IsTemplate) {
    ctx.status = 404;

    // set request header status : 404
    if (res) res.statusCode = 404;
  }
  ctx.slugInfo = slugInfo?.data
  return {
    props: {
      ctx,
      useragent,
      host: req ? req.headers.host : "",
      canonical,
      sequence: ctx?.sequence || null,
      domainName: domainName,
      micrositeName: micrositeName
    },
  };
};

export default Page;
