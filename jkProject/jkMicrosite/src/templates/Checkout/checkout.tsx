import React, { useEffect } from "react";
import { ICheckoutMain } from "@templates/Checkout";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { setDynamicDefaultStyle } from "@util/common";
import WrapComponent1 from "./components/WrapComponent";

const Checkout = (props: ICheckoutMain) => {
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.checkout +
            ".min.css"
          }
        />
      </Head>
      <div className="page-wrapper">
        <main>
          <div className="wrapper">
            <section className="heading-sec">
              <div className="container">
                <div className="heading-title-wrap">
                  <h2 className="heading-title">Checkout</h2>
                </div>
              </div>
            </section>

            <section className="content">
              <div className="container">
                <ul className="progress-bar">
                  <li className="active process-complete">
                    <a>
                      1 <i className="jkm-check complete-mark"></i>
                    </a>
                    <span>Shopping Cart</span>
                  </li>
                  <li className="active">
                    <a>
                      2<i className="jkm-check complete-mark"></i>
                    </a>
                    <span>Checkout</span>
                  </li>
                  <li>
                    <a>
                      3<i className="jkm-check complete-mark"></i>{" "}
                    </a>
                    <span>Order Confirmation</span>
                  </li>
                </ul>
              </div>
            </section>
            <WrapComponent1 {...props} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Checkout;
