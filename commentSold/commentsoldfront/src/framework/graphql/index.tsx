"use client";
// ^ this file needs the "use client" pragma
import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloNextAppProvider, NextSSRInMemoryCache, NextSSRApolloClient, SSRMultipartLink } from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";
import { LOCAL_STORAGE_KEY } from "@/constant/common";
import { REACT_APP_API_GATEWAY_URL } from "@/config/app.config";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Message } from "@/constant/errorMessage";

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    uri: `${REACT_APP_API_GATEWAY_URL}/gql`,
    fetchOptions: { cache: "no-store" },
  });

  // Define a middleware link to set the authentication token in the headers
  const authLink = setContext((_, { headers }) => {
    const token = Cookies.get(LOCAL_STORAGE_KEY.authToken);
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`, // Include the token in the authorization header
      },
    };
  });
  // Custom error link to handle unauthorized errors
  const errorLink = new ApolloLink((operation, forward) => {
    const currentRoute = window.location.pathname;
    Cookies.set(LOCAL_STORAGE_KEY.lastVisitedRoute, currentRoute);
    return forward(operation).map((response) => {
      const { errors } = response;

      if (errors?.length) {
        // Check if any of the errors indicate unauthorized access
        const isUnauthorized = errors.some((error) => error.extensions?.code === "INVALID_TOKEN");

        if (isUnauthorized) {
          // Redirect to the sign-in page
          localStorage.clear();
          toast.error(Message.SESSION_EXPIRED_TOAST);
          window.location.href = "/sign-in";
          Cookies.set(LOCAL_STORAGE_KEY.lastVisitedRoute, currentRoute);
        }
      }
      return response;
    });
  });
  // Custom success handler
  const successHandler = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      return response;
    });
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: ApolloLink.from([
      new SSRMultipartLink({ stripDefer: true }),
      authLink, // Concatenate the authLink with the httpLink
      errorLink, // Include the custom error link
      successHandler.concat(httpLink),
    ]),
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
