import SubscribeNewsLetter, { ISubscriptionProps } from "@components/SubscribeNewsLetter";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React, { Fragment } from "react";
const SubscribeNewsLetter1 = ({ dynamic_title }: ISubscriptionProps) => {
  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.newsLetter)} />
      </Head>
      <SubscribeNewsLetter dynamic_title={dynamic_title} />
    </Fragment>
  );
};

export default SubscribeNewsLetter1;
