import APPCONFIG from "@config/app.config";
import axios from "axios";
import { getCurrentWebsite } from "@util/accountCode";
import { getCurrentSelectedCountry, getUserToken } from "@util/common";

// Set config defaults when creating the instance
const http = axios.create({});
http.defaults.headers.common['Countryid'] = '5a1bdf3e9769540e64000887';

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    if (config && config.headers) {
      const accountCode = getCurrentWebsite();
      if (config.headers["Accountcode"] === undefined) {
        config.headers["Accountcode"] = accountCode
          ? accountCode
          : "";
      }
      const country_id = getCurrentSelectedCountry();
      if (country_id !== "" && country_id !== undefined) {
        config.headers["countryid"] = country_id;
      } else if (
        config.headers["countryid"] !== "" &&
        config.headers["countryid"] !== undefined
      ) {
        config.headers["countryid"] = APPCONFIG.DEFAULT_COUNTRY_ID;
      }

      const token = getUserToken();
      if (token) {
        config.headers["Authorization"] = token;
      }
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const errorResponse = error?.response;

    const err = errorResponse?.data || errorResponse?.statusText;
    if (err && err?.statusCode) {
      err.statusCode = errorResponse?.data?.meta?.status_code;
    }
    return Promise.reject(err);
  }
);

export const CancelToken = axios.CancelToken;
export default http;
