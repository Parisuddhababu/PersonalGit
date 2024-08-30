import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ServerError,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
const httpLink = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      Authorization: "Parisudha Babu",
      ...headers,
    },
  }));
  return forward(operation).map((response: any) => {
    return response;
  });
});

const errorLink = onError(({ networkError }) => {
  if ((networkError as ServerError)?.statusCode === 400)
    alert(networkError?.message);
});

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache(),
  link: from([authMiddleware, errorLink, httpLink]),
});
