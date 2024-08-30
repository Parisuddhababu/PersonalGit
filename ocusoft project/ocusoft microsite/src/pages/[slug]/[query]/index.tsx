import { GetServerSideProps, NextPage } from "next";
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import { RenderTemplate } from "@templates/index";
import Templates from "@templates/template";
import STATICURL, { StaticURLTemplate } from "@config/staticurl.config";
import { isParamUrlValid, removeLoginData, returnPropsHandler, setAuthHeader } from "@util/common";
import http from "@util/axios";
import { getCountryIdFromServerside, getWebsiteCode } from "@util/accountCode";
import { ErrorPage } from "@components/Error";
// @ts-ignore
const Page: NextPage<ISlugPageProps> = ({ ctx, host, canonical }) => {
  const splitCanonical = canonical?.split("?");
  let filterCanonical = "";
  if (splitCanonical && splitCanonical?.length > 0) {
    filterCanonical = splitCanonical[0];
  }

  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx?.page_template];

  if (!IsTemplate || ctx.status === 404)
    return <ErrorPage code={ctx?.status} message="Template not Found" />;

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

  const { accountCode, domainName } = await getWebsiteCode(canonical);

  const country_id = await getCountryIdFromServerside(req);
  if (country_id) {
    http.defaults.headers.common["countryid"] = country_id;
  }

  const token = await setAuthHeader(req);
    if (token) {
    http.defaults.headers.common["Authorization"] = token;
  }

  let ctx: any;
  const staticURL = STATICURL;
  let slugInfo = { data: {} };
  if (resolvedUrl) {
    try {
      slugInfo = await pagesServices.getSlugInfo(resolvedUrl, accountCode)
    } catch (error) { }
  }

  if (staticURL.includes(query.slug as string)) {
    ctx = {
      // @ts-ignore
      page_template: StaticURLTemplate[query.slug as string],
    };
    ctx.slugInfo = slugInfo?.data
    return returnPropsHandler(ctx, useragent, req, canonical, domainName)
  }

  if (isParamUrlValid(query)) {
    ctx = await pagesServices.slugPage(
      `${query.slug}/${query.query}`, {}, canonical
    );
    ctx.slugInfo = slugInfo?.data
  }
  if (ctx?.status_code === 401) {
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
    if (ctx?.status) {
      ctx.status = 404;
    }
    if (res) res.statusCode = 404;
  }
  return returnPropsHandler(ctx, useragent, req, canonical, domainName)
};

export default Page;
