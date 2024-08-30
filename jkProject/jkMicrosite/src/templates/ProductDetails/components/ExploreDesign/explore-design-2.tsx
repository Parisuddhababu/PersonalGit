import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IExploreDesignProps } from "@templates/ProductDetails/components/ExploreDesign";
import Link from "next/link";

const ExploreDesign2 = (props: IExploreDesignProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.prodDetailExploreDesign)}
        />
      </Head>
      {props?.data?.explore_other_designs ? (
        <section className="explore-design">
          <div className="container">
            <div className="heading">
              <h2>Explore Other Designs</h2>
            </div>
            <div className="explore-item-group">
              {props?.data?.explore_other_designs?.data?.map((item, eInd) => (
                <div key={eInd} className="item-box">
                  <Link href={`/${item?.slug}`}>
                    <a target="_blank">{item?.name}</a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default ExploreDesign2;
