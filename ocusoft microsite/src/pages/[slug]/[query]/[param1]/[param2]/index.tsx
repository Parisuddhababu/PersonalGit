import { GetServerSideProps, NextPage } from "next";
import { ISlugPageProps } from "@type/Pages/slug";
import pagesServices from "@services/pages.services";
import Templates,{ RenderTemplate } from "@templates/index";
import RequestParams from "@util/request";
import {isParamUrlValid, removeLoginData, setAuthHeader } from "@util/common";
import { ErrorPage } from "@components/Error";
import STATICURL, { StaticURLTemplate } from "@config/staticurl.config";
import http from "@util/axios";
import { getCountryIdFromServerside, getWebsiteCode } from "@util/accountCode";
// @ts-ignore
const Page: NextPage<ISlugPageProps, any> = ({ ctx, host, canonical}) => {
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx.page_template];

  const splitCanonical = canonical?.split("?");
  let filterCanonical = "";
  if (splitCanonical && splitCanonical?.length > 0) {
    filterCanonical = splitCanonical[0];
  }
  if (!IsTemplate || ctx.status === 404)
    return <ErrorPage code={ctx.status} message="Template not Found"/>;

  // render template
  return <Templates {...ctx} host={host} canonical={filterCanonical}/>;
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


  const { accountCode, domainName} = await getWebsiteCode(canonical);
  
  let slugInfo;
  if (resolvedUrl) {
    slugInfo = await pagesServices.getSlugInfo(resolvedUrl, accountCode)
  }

  const country_id = await getCountryIdFromServerside(req);
  if (country_id) {
    http.defaults.headers.common["countryid"] = country_id;
  }

  const token = await setAuthHeader(req);
    if (token) {
    http.defaults.headers.common["Authorization"] = token;
  }

  const returnPropsHandler = (ctx : any) => {
    return {
      props: {
        ctx,
        useragent,
        host: req?.headers.host ?? "",
        canonical,
        domainName: domainName
      },
    };
  }

  if (ctx?.status_code === 401) {
    ctx.page_template = "SIGNIN_BANNER";
    removeLoginData();
    res?.writeHead(301, {
      Location: "/sign-in",
    });
    res?.end();
    return returnPropsHandler(ctx)
  }
  const staticURL = STATICURL;
  if (staticURL.includes(query.slug as string)) {
    ctx = {
      // @ts-ignore
      page_template: StaticURLTemplate[query.slug as string],
    };
    ctx.slugInfo = slugInfo?.data
    return returnPropsHandler(ctx)
  }
  if (isParamUrlValid(query)) {
    if (query.slug === "products") {
      ctx = {
        page_template: StaticURLTemplate[query.slug],
      };
      ctx.slugInfo = slugInfo?.data
      return returnPropsHandler(ctx)
    } else {
      ctx = await pagesServices.slugPage(
        `${query.slug}/${query.param1}`, {}, canonical
      );
    }

  } else {
    ctx = await pagesServices.slugPage(`${query.slug}`, params, canonical);
  }
  // @ts-ignore
  const IsTemplate = RenderTemplate[ctx?.page_template];

  // set response 404 if portfolio not found
  if (ctx?.status === 404|| ctx?.status_code === 422 || !IsTemplate) {
    ctx.status = 404;
    if (res) res.statusCode = 404;
  }
  ctx.slugInfo = slugInfo?.data
  return returnPropsHandler(ctx)
};

export default Page;
