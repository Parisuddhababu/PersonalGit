import http from "@util/axios";
import CONFIG from "@config/api.config";
import { ISlug } from "@type/Pages/slug";
import { IPageServiceQuery } from "@type/Common/PageService";
import { getHostnameFromRegex, getWebsiteCode } from "@util/accountCode";

class PageServices {
  /**
   * @name : Homepage
   */
  public HomePage = async (canonical: string) => {
    const { accountCode } = await getWebsiteCode(canonical);
    http.defaults.headers.common["Accountcode"] = accountCode;
    return await http.get(CONFIG.HOMEPAGE_API).then((response) => {
      return response.data;
    });
  };

  /**
   * @name : /[slug]
   * @description : dynamic Template base api service
   */
  public slugPage = async (
    slug: string,
    query: IPageServiceQuery = {},
    canonical: string
  ) => {
    const params: object = {};
    // append filter params
    if ("page" in query) Object.assign(params, { page: query["page"] });
    if ("search" in query) Object.assign(params, { s: query["search"] });
    const { accountCode } = await getWebsiteCode(canonical);
    // @ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = accountCode;
    if (!slug.includes("assets")) {
      return await http
        .get<ISlug>(CONFIG.PageSlugAPI(slug), { params })
        .then((response) => response.data)
        .catch((err) => err);
    }
  };

  /**
   * @name : /[static route]
   * @description : static Template base api service
   */
  public getPage = async (url: string, params: object) => {
    return await http.get(url, { params }).then((response) => response.data);
  };

  /**
   *
   * @param url Api request Url
   * @param params Post method request parametes
   * @description post method api service
   */
  public postPage = async (url: string, params: object | any) => {
    return await http
      .post(url, params)
      .then((response) => response.data)
      .catch((error) => error);
  };

  public updateAddressBook = async (slug: string, data: string) => {
    return await http
      .post(CONFIG.UPDATE_ADDRESS_BOOK(slug), data)
      .then((response) => response.data);
  };

  public DeletePage = async (slug: string) => {
    return await http
      .delete(CONFIG.DELETE_ADDRESS_BOOK(slug))
      .then((response) => response.data);
  };

  public getHeader = async () => {
    const url = getHostnameFromRegex(window.location.href) || "";
    const { accountCode } = await getWebsiteCode(url);
    // @ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = accountCode;
    return await http
      .get<any>(CONFIG.HEADER_API)
      .then((respones) => respones.data);
  };

  public deleteData = async (url: string, params: object) => {
    return await http.delete(url, params).then((response) => response.data);
  };

  public getHeaderFooterData = async (url: string) => {
    const urlMain = getHostnameFromRegex(window.location.href) || "";
    const { accountCode } = await getWebsiteCode(urlMain);
    // @ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = accountCode;
    return await http.get(url).then((response) => response.data);
  };

  /**
   * Get Dynamic Account wise payment details key
   * @param url api end point URL string
   * @param req Request Object
   * @param params Parameters for api request
   * @returns
   */
  public paymentKeyDetailsForApi = async (
    url: string,
    req: any,
    params: object | any
  ) => {
    const host = req?.headers["host"];
    const canonical = `https://${host}${req?.url}`;
    const { accountCode } = await getWebsiteCode(canonical);
    if (accountCode) {
      // @ts-ignore
      http.defaults.headers["Accountcode"] = accountCode;
      http.defaults.headers.common["Accountcode"] = accountCode.toString();
    }
    return await http.post(url, params).then((response) => response.data);
  };

  public getSlugInfo = async (slug: string, accountCode?: string) => {
    if (accountCode) {
      // @ts-ignore
      http.defaults.headers["Accountcode"] = accountCode;
      http.defaults.headers.common["Accountcode"] = accountCode.toString();
    }
    return await http.post(CONFIG.GET_SLUG_INFO, { slug }).then((response) => response.data);
  }
}

export default new PageServices();
