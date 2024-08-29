import http from "@util/axios";
import CONFIG from "@config/api.config";
import { ISlug } from "@type/Pages/slug";
import { IPageServiceQuery } from "@type/Common/PageService";
import { getHostnameFromRegex, getWebsiteCode } from "@util/accountCode";
import Cookies from "js-cookie";
import { IAddEditAddressForm } from "@templates/MyAddress/components/AddEditAddress";
import { removeLoginData } from "@util/common";

class PageServices {
  /**
   * @name : Homepage
   */
  public HomePage = async (canonical: string) => {
    const { accountCode, isPreview } = await getWebsiteCode(canonical);
    http.defaults.headers.common["Accountcode"] = accountCode;
    //@ts-ignore
    http.defaults.headers["Ispreview"] = isPreview;
    http.defaults.headers.common['Ispreview'] = isPreview;
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
    query: IPageServiceQuery,
    canonical: string
  ) => {
    const newQuery = query ?? {}
    const params: object = {};
    // append filter params
    if ("page" in newQuery) Object.assign(params, { page: newQuery["page"] });
    if ("search" in newQuery) Object.assign(params, { s: newQuery["search"] });
    const { accountCode, isPreview } = await getWebsiteCode(canonical);
    //@ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = accountCode;
    //@ts-ignore
    http.defaults.headers["Ispreview"] = isPreview;
    http.defaults.headers.common['Ispreview'] = isPreview;
    if (!slug.includes("assets")) {
      return await http
        .get<ISlug>(CONFIG.PageSlugAPI(slug), { params })
        .then((response) => {
     
          if (response?.data?.meta?.status_code === 401) {
            this.logOut()
          }
          return response.data
        })
        .catch((error) => {
          if (error?.meta?.status_code === 401) {
            this.logOut()
          }
          return error
        });
    }
  };

  /**
   * @name : /[static route]
   * @description : static Template base api service
   */
  public getPage = async (url: string, params: object) => {
    return await http.get(url, { params }).then((response) => {
      console.log()
      if (response?.data?.meta?.status_code === 401) {
        this.logOut()
      }
      return response.data
    }).catch((error) => {
      if (error?.meta?.status_code === 401) {
        this.logOut()
      }
      return error
    });
  };

  /**
   *
   * @param url Api request Url
   * @param params Post method request parametes
   * @description post method api service
   */
  public postPage = async (url: string, params: object | any) => {
    let isPreview = Cookies.get("isPreview") ?? "0"
    //@ts-ignore
    http.defaults.headers["Ispreview"] = isPreview;
    http.defaults.headers.common['Ispreview'] = isPreview;

    return await http
      .post(url, params)
      .then((response) => {
        if (response?.data?.meta?.status_code === 401) {
          this.logOut()
        }
        return response.data
      })
      .catch((error) => {
        if (error?.meta?.status_code === 401) {
          this.logOut()
        }
        return error
      });
  };

  public updateAddressBook = async (slug: string, data: IAddEditAddressForm) => {
    return await http
      .post(CONFIG.UPDATE_ADDRESS_BOOK(slug), data)
      .then((response) => {
        if (response?.data?.meta?.status_code === 401) {
          this.logOut()
        }
        return response.data
      }).catch((error) => {
        if (error?.meta?.status_code === 401) {
          this.logOut()
        }
        return error
      });
  };
  public updateBillingShippingAddressBook = async (slug: string, data: IAddEditAddressForm) => {
    return await http
      .post(CONFIG.UPDATE_BILLING_SHIPPING_ADDRESS(slug), data)
      .then((response) => {
        if (response?.data?.meta?.status_code === 401) {
          this.logOut()
        }
        return response.data
      }).catch((error) => {
        if (error?.meta?.status_code === 401) {
          this.logOut()
        }
        return error
      });
  };
  public DeletePage = async (slug: string) => {
    return await http
      .delete(CONFIG.DELETE_ADDRESS_BOOK(slug))
      .then((response) => {
        if (response?.data?.meta?.status_code === 401) {
          this.logOut()
        }
        return response.data
      }).catch((error) => {
        if (error?.meta?.status_code === 401) {
          this.logOut()
        }
        return error
      });
  };

  public getHeader = async () => {
    const url = getHostnameFromRegex(window.location.href) || "";
    const { accountCode, isPreview } = await getWebsiteCode(url);
    //@ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = accountCode;
    //@ts-ignore
    http.defaults.headers["Ispreview"] = isPreview;
    http.defaults.headers.common['Ispreview'] = isPreview;
    return await http
      .get<any>(CONFIG.HEADER_API)
      .then((respones) => respones.data);
  };

  public deleteData = async (url: string, params: object) => {
    return await http.delete(url, params).then((response) => {
      if (response?.data?.meta?.status_code === 401) {
        this.logOut()
      }
      return response.data
    });
  };

  public getHeaderFooterData = async (url: string) => {
    const urlMain = getHostnameFromRegex(window.location.href) || "";
    const { accountCode, isPreview } = await getWebsiteCode(urlMain);
    //@ts-ignore
    http.defaults.headers["Accountcode"] = accountCode;
    http.defaults.headers.common["Accountcode"] = accountCode;
    //@ts-ignore
    http.defaults.headers["Ispreview"] = isPreview;
    http.defaults.headers.common['Ispreview'] = isPreview;
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
    const { accountCode, isPreview } = await getWebsiteCode(canonical);
    if (accountCode) {
      //@ts-ignore
      http.defaults.headers["Accountcode"] = accountCode;
      http.defaults.headers.common["Accountcode"] = accountCode.toString();
      //@ts-ignore
      http.defaults.headers["Ispreview"] = isPreview;
      http.defaults.headers.common['Ispreview'] = isPreview;
    }
    return await http.post(url, params).then((response) => {
      if (response?.data?.meta?.status_code === 401) {
        this.logOut()
      }
      return response.data
    }).catch((error) => {
      if (error?.meta?.status_code === 401) {
        this.logOut()
      }
      return error
    });
  };

  public getSlugInfo = async (slug: string, accountCode?: string) => {
    if (accountCode) {
      //@ts-ignore
      http.defaults.headers["Accountcode"] = accountCode;
      http.defaults.headers.common["Accountcode"] = accountCode.toString();
    }
    return await http.post(CONFIG.GET_SLUG_INFO, { slug }).then((response) => response.data);
  }

  public logOut = async () => {
    removeLoginData();
    localStorage.removeItem("auth")
    window.location.href = '/sign-in'
  };

}

export default new PageServices();
