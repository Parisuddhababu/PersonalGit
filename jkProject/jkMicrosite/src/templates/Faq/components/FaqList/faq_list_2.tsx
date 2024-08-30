import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import SafeHtml from "@lib/SafeHTML";
import { Ifaq } from "@type/Pages/faq";
import { useState } from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Link from "next/link";
const FaqListSection2 = (props: Ifaq) => {
  const [activeClass, setActiveClass] = useState("item-que");
  const [mainIndex, setMainIndex] = useState(-1);

  const toggleAnswer = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setMainIndex(index);
    if (e.currentTarget.className === "item-que active") {
      setActiveClass("item-que");
    } else {
      setActiveClass("item-que active");
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.toasterDesign)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.faq)}
        />
      </Head>

      <section className="faq-section">
        <div className="container">
          <div className="accordion">
            {props?.data?.length === 0 ? (
              <NoDataAvailable title="No Faq found..!!">
                <Link href={"/"} className="btn btn-secondary btn-small">
                  <a>Go to Home</a>
                </Link>
              </NoDataAvailable>
            ) : (
              props?.data?.map((ele, index) => {
                return (
                  <div className="accordion-item" key={index}>
                    <div
                      className={index === mainIndex ? activeClass : "item-que"}
                      onClick={(e) => toggleAnswer(e, index)}
                      aria-expanded="false"
                    >
                      <h3 className="accordion-title">{ele?.question}</h3>
                      <span
                        className="jkms2-plus toggle-icon"
                        aria-hidden="true"
                      ></span>
                      <span
                        className="jkms2-minus toggle-icon"
                        aria-hidden="true"
                      ></span>
                    </div>
                    {index === mainIndex && (
                      <div className="accordion-content">
                        <div className="content-wrap">
                          <SafeHtml html={ele?.answer} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqListSection2;
