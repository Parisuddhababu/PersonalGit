import React from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import SubscribeNewsLetter from "@components/SubscribeNewsLetter";
import { SubscribeNewsLetterProps } from "@templates/BlogList/components/BlogSubscribeNewsLetter";

const IBlogSubscribeNewsLetterSection1 = (props: SubscribeNewsLetterProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            null,
            CSS_NAME_PATH.blogListSubscribeNewsLetter
          )}
        />
      </Head>
      <SubscribeNewsLetter maindata={props?.subs?.[0]} />
    </>
  );
};

export default IBlogSubscribeNewsLetterSection1;
