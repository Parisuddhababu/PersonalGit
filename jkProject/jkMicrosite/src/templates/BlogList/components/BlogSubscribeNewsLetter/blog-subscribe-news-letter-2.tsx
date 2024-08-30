import SubscribeNewsLetter from "@components/SubscribeNewsLetter";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { SubscribeNewsLetterProps } from ".";

const IBlogSubscribeNewsLetterSection2 = (props: SubscribeNewsLetterProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            2,
            CSS_NAME_PATH.blogListSubscribeNewsLetter2
          )}
        />
      </Head>
      <SubscribeNewsLetter maindata={props?.subs?.[0]} />
    </>
  );
};

export default IBlogSubscribeNewsLetterSection2;
