import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { INewCollectionProps } from "@type/Pages/home";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

const NewCollections = (props: INewCollectionProps) => {
  const spliceCollectionData = () => {
    return props.data?.splice(3, props?.data?.length - 1);
  };

  useEffect(() => {
    spliceCollectionData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {props?.data?.length <= 3 && (
        <section className="product-collection-section">
          <div className="container">
            <div className="heading">
              <h2>New Collections</h2>
            </div>
            <div className="row">
              {props?.data?.map((ele, index) => {
                return (
                  <div className="d-col d-col-3" key={index}>
                    <div className="card">
                      <div className="card-head">
                        <CustomImage
                          src={ele?.desktop_image?.path}
                          height="480px"
                          width="480px"
                        />
                      </div>
                      <div className="card-body">
                        <Link href={ele?.collection_slug ? `collection/${ele?.collection_slug}` : ""}>{ele?.title}</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.CardCssTemplate2)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.productCollectionSection)}
        />
      </Head>
    </>
  );
};

export default NewCollections;
