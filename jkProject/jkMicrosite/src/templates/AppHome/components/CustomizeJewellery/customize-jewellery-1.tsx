import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import React, { useEffect } from "react";
import { ICustomizeJewellery1Props } from "@templates/AppHome/components/CustomizeJewellery";
import APPCONFIG from "@config/app.config";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import SafeHtml from "@lib/SafeHTML";
import Link from "next/link";

const CustomizeJewellery1 = ({ data ,dynamic_title }: ICustomizeJewellery1Props) => {
  const [index, setIndex] = React.useState(0);
  const delay = APPCONFIG.defaultSliderDelay;

  useEffect(() => {
    setTimeout(() => setIndex((prevIndex) => (prevIndex === data?.length - 1 ? 0 : prevIndex + 1)), delay);
    // eslint-disable-next-line
    return () => {};
    // eslint-disable-next-line
  }, [index]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeCustomizeJewellery)}
        />
      </Head>
      <section className="customize-jewellery-inner">
        <div className="container">
          <h2>
            {dynamic_title?.customise_jewellery_title ||
              "Customize Your Jewellery"}
          </h2>
          <div className="slider-wrapper">
            <div className="left-slider-sec">
              <div className="track">
                {data?.map(
                  (ele, ind) =>
                    index === ind && (
                      <div
                        key={ind}
                        className={"slide" + (index === ind ? " active" : "")}
                      >
                        <div className="left-side-img-wrap">
                          <CustomImage
                            src={ele?.image?.path}
                            alt={ele?.image?.name}
                            title={ele?.image?.name}
                            width="650px"
                            height="400px"
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="numbers">
                <ul>
                  {data?.map((count, cind) => (
                    <li
                      onClick={() => setIndex(cind)}
                      key={cind}
                      className={index === cind ? "active" : ""}
                    >
                      <div>{cind + 1}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="right-slider-sec">
              {data?.map(
                (element, eIndex) =>
                  index === eIndex && (
                    <div
                      key={eIndex}
                      className={"slide" + (index === eIndex ? " active" : "")}
                    >
                      <h3 className="right-side-title">{element?.title}</h3>
                      {/* <p> */}
                      <SafeHtml
                        removeAllTags={true}
                        html={element.description}
                      />
                      {/* </p> */}
                      <Link href="/customise-design">
                        <a className="btn btn-secondary">
                          Customize Your Jewellery
                        </a>
                      </Link>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomizeJewellery1;
