import { GetServerSideProps, NextPage } from "next";

// Template, Component and Services
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import Templates, { RenderTemplate } from "@templates/index";
import { ErrorPage } from "@components/Error";
import { removeLoginData, returnPropsHandler, setAuthHeader, setHeaders } from "@util/common";
import http from "@util/axios";
import STATICURL, { StaticURLTemplate } from "@config/staticurl.config";
import { getCountryIdFromServerside, getWebsiteCode } from "@util/accountCode";
// @ts-ignore
const Page: NextPage<ISlugPageProps> = ({ ctx, host, canonical }) => {
  // template is exist
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx.page_template];
  const splitCanonical = canonical?.split("?");
  let filterCanonical = "";
  if (splitCanonical && splitCanonical?.length > 0) {
    filterCanonical = splitCanonical[0];
  }

  // render error template if template is not found
  if (!IsTemplate || ctx.status === 404)
    return <ErrorPage code={ctx.status} message="Template not Found" />;

  // render template
  return <Templates {...ctx} host={host} canonical={filterCanonical} />;
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
  const { accountCode, cmsPageStatic, domainName, isPreview } = await getWebsiteCode(canonical);
  if (accountCode) {
    setHeaders(accountCode, isPreview)
  }
  if (cmsPageStatic?.includes(params.slug)) {
    params.slug = "cms/" + params.slug;
  }

  const token = await setAuthHeader(req);
  if (token) {
      if (token) {
    http.defaults.headers.common["Authorization"] = token;
  }
  }

  const country_id = await getCountryIdFromServerside(req);
  if (country_id) {
    http.defaults.headers.common["countryid"] = country_id;
  }

  const staticURL = STATICURL;
  let slugInfo = { data: {} };
  if (resolvedUrl) {
    try {
      slugInfo = await pagesServices.getSlugInfo(resolvedUrl)
    } catch (error) { }
  }

  if (staticURL.includes(params.slug as string) || ((params.slug === 'newsletter-subscription' || params.slug === 'my-orders') && typeof token === 'string')) {
    ctx = {
      // @ts-ignore
      page_template: StaticURLTemplate[params.slug as string],
    };
    ctx.slugInfo = slugInfo?.data
    return returnPropsHandler(ctx, useragent, req, canonical, domainName)
  } else {
    ctx = await pagesServices.slugPage(params.slug as string, params, canonical);
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
  if (!ctx) {
    ctx = {}
  }
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx?.page_template];
  if (ctx?.status === 404 || !IsTemplate) {
    ctx.status = 404;
    if (res) res.statusCode = 404;
  }
  ctx.slugInfo = slugInfo?.data
  return returnPropsHandler(ctx, useragent, req, canonical, domainName)
};

export default Page;
