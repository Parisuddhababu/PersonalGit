import { REACT_APP_API_GATEWAY_URL } from "@/config/app.config";
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { cookies, headers } from "next/headers";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { onError } from "@apollo/client/link/error";
import { LOCAL_STORAGE_KEY } from "@/constant/common";

const httpLink = new HttpLink({
  uri: `${REACT_APP_API_GATEWAY_URL}/gql`,
});

// Define custom error handling logic
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`GraphQL Error: ${message}`);
    });
  }

  if (networkError) {
    console.error("Network Error:", networkError);
  }
});

const authLink = setContext((_, { headers: existingHeaders }) => {
  const headersList = headers();
  const host = headersList.get('host') || '';
  const cookieStore = cookies();
  const token = cookieStore.get(LOCAL_STORAGE_KEY.authToken);
  return {
    headers: {
      ...existingHeaders,
      authorization: token?.value ? `Bearer ${token.value}` : "",
      host: host,
    },
  };
});

// Register the Apollo Client with the authLink and httpLink
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, errorLink, httpLink]),
  });
});
