import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "./i18n";
import * as CryptoJS from "crypto-js";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_GATEWAY_URL,
});
// decryption
const decryption = (encryptedData: string) => {
  const decryptionKey = "mySecretKey"; 
  const decrypted = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
  const decryptedText = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  return decryptedText;
};

const encryptedData = localStorage.getItem("authToken");

const authLink = setContext((_, { headers }) => {
  const token = encryptedData && decryption(encryptedData);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
