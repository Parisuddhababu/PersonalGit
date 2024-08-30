import { GetServerSideProps, NextPage } from "next";
import Templates from "@templates/index";
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import { RenderTemplate } from "@templates/index";
import RequestParams from "@util/request";
import {isParamUrlValid, removeLoginData, setAuthHeader } from "@util/common";
import { ErrorPage } from "@components/Error";
import STATICURL, { StaticURLTemplate } from "@config/staticurl.config";
import http from "@util/axios";
import { getCountryIdFromServerside, getWebsiteCode } from "@util/accountCode";

// @ts-ignore
const Page: NextPage<ISlugPageProps> = ({ ctx, host, canonical,domainName, micrositeName }) => {
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx.page_template];

  const splitCanonical = canonical?.split("?");
  let filterCanonical = "";
  if (splitCanonical && splitCanonical?.length > 0) {
    filterCanonical = splitCanonical[0];
  }
  if (!IsTemplate)
    return <ErrorPage code={ctx.status} message="Template not Found" domainName={domainName}/>;

  // render template
  return <Templates {...ctx} host={host} canonical={filterCanonical} domainName = {domainName} micrositeName={micrositeName}/>;
};

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
  resolvedUrl
}) => {
  const useragent = req?.headers["user-agent"];
  const host = req?.headers["host"];
  const canonical = `https://${host}${req?.url}`;
  const params = RequestParams(query);
  let ctx: any;

  // if (canonical) {
  const { accountCode, domainName, micrositeName} = await getWebsiteCode(canonical);
  // if (accountCode && accountCode !== undefined) {
  //   // @ts-ignore
  //   http.defaults.headers["Accountcode"] = accountCode;
  //   http.defaults.headers.common["Accountcode"] = await accountCode;
  // }
  // }
  let slugInfo;
  if (resolvedUrl) {
    slugInfo = await pagesServices.getSlugInfo(resolvedUrl, accountCode)
  }
  const country_id = await getCountryIdFromServerside(req);
  if (country_id !== "" && country_id !== undefined) {
    http.defaults.headers.common["countryid"] = country_id;
  }

  const token = await setAuthHeader(req);
  if (token) {
    http.defaults.headers.common["Authorization"] = token;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }

  const staticURL = STATICURL;
  if (staticURL.includes(query.slug as string)) {
    ctx = {
      // @ts-ignore
      page_template: StaticURLTemplate[query.slug as string],
    };
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
  }
  if (isParamUrlValid(query)) {
    if (query.slug === "jewellery") {
      ctx = {
        // @ts-ignore
        page_template: StaticURLTemplate[query.slug as string],
      };
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
    } else {
      ctx = await pagesServices.slugPage(
        `${query.slug}/${query.query}/${query.param1}` as string, {}, canonical
      );
    }
  } else {
    ctx = await pagesServices.slugPage(`${query.slug}` as string, params, canonical);
  }

  if (ctx?.meta?.status_code === 401) {
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
        sequence: ctx?.sequence,
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
    if (res) res.statusCode = 404;
  }
  ctx.slugInfo = slugInfo?.data
  return {
    props: {
      ctx,
      useragent,
      host: req ? req.headers.host : "",
      canonical,
      sequence: ctx?.sequence || [],
      domainName: domainName,
      micrositeName: micrositeName
    },
  };
};

export default Page;
