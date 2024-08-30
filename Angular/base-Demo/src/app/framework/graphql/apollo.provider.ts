

import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApplicationConfig, inject } from '@angular/core';
import { ApolloClientOptions, ApolloLink, from, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../../../environments/environment.prod';

const uri = `${environment.API_Url}`;
console.log(uri);

export function apolloOptionsFactory(): ApolloClientOptions<any> {
  const httpLink = inject(HttpLink);
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth-token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  return {
    link: from([authLink, httpLink.create({ uri })]),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
];

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth-token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  const http = httpLink.create({ uri });
  return {
    cache: new InMemoryCache(),
    link: from([authLink, http]),
  };
}
