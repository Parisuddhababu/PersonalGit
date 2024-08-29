import { GetServerSideProps, NextPage } from "next";
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import Templates, { RenderTemplate } from "@templates/index";
import RequestParams from "@util/request";
import { isParamUrlValid, removeLoginData, returnPropsHandler, setAuthHeader } from "@util/common";
import { ErrorPage } from "@components/Error";
import STATICURL, { StaticURLTemplate } from "@config/staticurl.config";
import http from "@util/axios";
import { getCountryIdFromServerside, getWebsiteCode } from "@util/accountCode";

// @ts-ignore
const Page: NextPage<ISlugPageProps> = ({ ctx, host, canonical }) => {
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx.page_template];

  const splitCanonical = canonical?.split("?");
  let filterCanonical = "";
  if (splitCanonical && splitCanonical?.length > 0) {
    filterCanonical = splitCanonical[0];
  }
  if (!IsTemplate || ctx.status === 404)
    return <ErrorPage code={ctx.status} message="Template not Found" />;

  // render template
  return <Templates {...ctx} host={host} canonical={filterCanonical} />;
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
  let ctx: any = {};

  const { domainName } = await getWebsiteCode(canonical);

  const country_id = await getCountryIdFromServerside(req);
  if (country_id) {
    http.defaults.headers.common["countryid"] = country_id;
  }

  const token = await setAuthHeader(req);
    if (token) {
    http.defaults.headers.common["Authorization"] = token;
  }

  const staticURL = STATICURL;

  if (staticURL.includes(query.slug as string)) {
    ctx = {
      // @ts-ignore
      page_template: StaticURLTemplate[query.slug as string],
    };
    return returnPropsHandler(ctx, useragent, req, canonical, domainName)
  }
  if (isParamUrlValid(query)) {
    try {
      ctx = await pagesServices.slugPage(
        `${query.slug}/${query.query}/${query.param1}`, {}, canonical
      );
    } catch (error) {
    }
  } else {
    try {
      ctx = await pagesServices.slugPage(`${query.slug}`, params, canonical);
    } catch (error) {
    }
  }

  if (ctx?.meta?.status_code === 401) {
    ctx.page_template = "SIGNIN_BANNER";
    removeLoginData();
    res?.writeHead(301, {
      Location: "/sign-in",
    });
    res?.end();
    return returnPropsHandler(ctx, useragent, req, canonical, domainName)
  }
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx?.page_template];
  if (!ctx) {
    ctx = {}
  }
  // set response 404 if portfolio not found
  if (ctx?.status === 404 || ctx?.status_code === 422 || !IsTemplate) {
    ctx.status = 404;
    if (res) res.statusCode = 404;
  }
  return returnPropsHandler(ctx, useragent, req, canonical, domainName)
};

export default Page;
