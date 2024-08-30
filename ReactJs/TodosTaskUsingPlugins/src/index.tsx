import ReactDOM from "react-dom/client";
import { ApolloProvider} from "@apollo/client";

import App from "./App";
import { client } from "./framework/client/apoloClient";



const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
