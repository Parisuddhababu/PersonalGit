import axios from "axios";

// Set config defaults when creating the instance
const http = axios.create({});

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorResponse = error.response;
    /**
     * API Response status 401 : Unauthorize
     * navigate : redirect to login page
     * event : Generate popup error!
     * Here If we redirect then can't handle last page redirect after login
     */
    let err = errorResponse.data || errorResponse.statusText;
    if (err && err.statusCode) {
      err.statusCode = errorResponse?.data?.meta?.status_code;
    }
    return Promise.reject(err);
  }
);

export const CancelToken = axios.CancelToken;
export default http;
