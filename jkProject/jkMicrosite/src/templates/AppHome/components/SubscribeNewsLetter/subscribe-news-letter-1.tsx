import SubscribeNewsLetter from "@components/SubscribeNewsLetter";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React from "react";
const SubscribeNewsLetter1 = ({dynamic_title}:any) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            null,
            CSS_NAME_PATH.homeSubscribeNewsLetter
          )}
        />
      </Head>
      <SubscribeNewsLetter dynamic_title= {dynamic_title} />
    </>
  );
};

export default SubscribeNewsLetter1;
