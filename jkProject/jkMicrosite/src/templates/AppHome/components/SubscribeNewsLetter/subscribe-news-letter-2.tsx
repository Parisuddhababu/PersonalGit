import SubscribeNewsLetter from "@components/SubscribeNewsLetter";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";

const SubscribeNewsLetter2 = ({dynamic_title}:any) => {
  return (
    <>
      <SubscribeNewsLetter dynamic_title= {dynamic_title}/>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.homeSubscribeNewsLetter2)}
        />
      </Head>
    </>
  );
};

export default SubscribeNewsLetter2;
