import { GetServerSideProps, NextPage } from "next";
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import { RenderTemplate } from "@templates/index";
import Templates from "@templates/template";
import { removeLoginData, returnPropsHandler, setAuthHeader } from "@util/common";
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

  if (!IsTemplate)
    return <ErrorPage code={ctx?.status} message="Template not Found" />;

  return <Templates {...ctx} host={host} canonical={filterCanonical} />;
};

const temp = {
  "sequence": [
    "cart_items"
  ],
  "slug": "cart-list",
  "page_template": "CART_LIST",
};
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl, query }) => {
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

  let ctx: any = temp

  let slugInfo = { data: {} as any };
  if (resolvedUrl) {
    try {
      slugInfo = await pagesServices.getSlugInfo(resolvedUrl, accountCode)
    } catch (error) { }
  }

  if (typeof token !== 'string') {
    ctx = { page_template: "SIGNIN_BANNER" };
    removeLoginData();
    res?.writeHead(301, {
      Location: "/sign-in",
    });
    res?.end();
    ctx.slugInfo = slugInfo?.data
    return returnPropsHandler(ctx, useragent, req, canonical, domainName)
  }

  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx?.page_template];
  if (ctx?.status === 404 || !IsTemplate) {
    if (ctx?.status) {
      ctx.status = 404;
    }
    if (res) res.statusCode = 404;
  }
  ctx.slugInfo = slugInfo?.data
  return returnPropsHandler(ctx, useragent, req, canonical, domainName)
};

export default Page;
