import DefaultMeta from "@components/DefaultMeta";
import Document, { Main, Html, NextScript } from "next/document";
import HeadCustom from "../components/NonPages/headCustom";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <HeadCustom>
          <DefaultMeta />
        </HeadCustom>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
