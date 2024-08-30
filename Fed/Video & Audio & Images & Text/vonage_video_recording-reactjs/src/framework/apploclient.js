import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import config from '../config.json'

const xOpentokAuth = localStorage.getItem('openTock-Token');
const httpLink = new HttpLink({ uri: config.REACT_APP_API_GATEWAY_URL });
const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiZGQ0NGM5MGU3Mjc5NThkNWVkYTViZjAwODc4MjJhZWMxZDcyMWFhNzk1NTU4MjA1NWU4MDhiNGU0MDdlY2MyNjE2Yzc2MjM1MDNlMzI5NTYiLCJpYXQiOjE2OTA5NTkyODEuNTI2NDksIm5iZiI6MTY5MDk1OTI4MS41MjY0OTIsImV4cCI6MTY5MTA0NTY4MS4zOTExNDUsInN1YiI6Ijc3Iiwic2NvcGVzIjpbIioiXX0.BpWcLG1uOT7__N_JeAi11W5qJNE28LDImuRu58-081M6cZg3pNho6pOvegRHM9GZptu7x-dbqT2o8UQlbSd5GjJtKhHwf_yeDf-TUD4pJmmjfKiGfR1AssCzpHEkHVnrAAw0Q3TmTG0uHYoGYzDXtja1p92FEahwZO2kGGMK0uOSE2xBcD2va_zSpZGLXISfeeXf1llhJQONqWc_lyPVeOHd93AH6zLSAmUMYisZgtE2_hBzdtdEKtaPSvU0S02yB0Up8Nx0CA_bMTUJdDjisspy2aO3UsKWS386zwCM-4qrRWzv6qDA1jr0ueHfSKEHetit3cYUnV95whNrqEBhEceudRIvuz_NHd_Rpmy_AHha_nKwxbm9KgIcUE3LpiBTM0t2XBKIfCaKh4QYzMeZybmoEW7c1dPo3zc8yJcMrEChpX6mf-IPPMWxR2DtlnJGVykHHmJNi4by4KeR8fxpdrMDTqFdslZZsEmwOG-zjyOERHlXpYphHwixBUX5y7dHvOESAvaMPJipo8eQf0Tqo5ECj3HbtCVgWjUWNKEQq1YYU649uHmK2saedmOq6jfeud1vA3-v9cIoa6m91kjFZnuNLGG6wADte9oPh7DGhZ9HATrM-e7P1LppG2nZmZJhSsoH8dmkhQ7eeGHi06IJmbXChO34Wzj7E1y-1ppfqvU`;

const authMiddleware = new ApolloLink((operation, forward) => {

    const customHeaders = {
        Authorization: `Bearer ${token}`,
        'x-opentok-auth': xOpentokAuth,
        'Content-Type': 'application/json',
    }

    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...customHeaders,
            ...headers,
        },
    }));
    return forward(operation);
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
        authMiddleware,
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );
            if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        httpLink,
    ]),
});

export default client;