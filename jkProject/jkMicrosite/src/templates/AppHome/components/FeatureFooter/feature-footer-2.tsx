import Modal from "@components/Modal";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import Loader from "@components/customLoader/Loader";
import CustomImage from "@components/CustomImage/CustomImage";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import http from "@util/axios";
import Link from "next/link";

const FeatureFooter2 = () => {
  const getFeatureFooter = () => {
    pagesServices.getPage(APICONFIG.FEATURE_FOOTER, {}).then((resp) => {
      setFeatureFooterData(resp?.data?.quick_link?.original?.data);
    });
  };

  const [findRingSizeURL] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const [featureFooter, setFeatureFooterData] = useState(getFeatureFooter);
  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getFeatureFooter();
    }
    // eslint-disable-next-line
  }, [http.defaults.headers.common["Accountcode"]]);

  // const initFMRS = async () => {
  //     setIsLoading(true);
  //     // @ts-ignore
  //     if (IsBrowser && window["FMRS"]) {
  //         //   @ts-ignore
  //         const initializeFMRS = new FMRS();
  //         await initializeFMRS.initialize({
  //             client: "JewellersKart",
  //             mode: "overlay",
  //             overlaySettings: { boxTheme: "facebook", shadowOverlay: true },
  //         });
  //         setFindRingSizeURL("https://" + initializeFMRS.targetUrl);
  //         toggleModal();
  //         setTimeout(() => { }, 1000);
  //         setIsLoading(false);
  //     }
  // };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(2, CSS_NAME_PATH.homeFeatureFooter2)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)} />
      </Head>
      <Script src="https://findmyringsize.com/Shared/Embed/fmrs-1.0.js" async />

      <section className="features_section">
        <div className="container">
          <div className="d-row">
            {/* @ts-ignore */}
            {featureFooter?.map((ele, index) => {
              return (
                <div className="d-col d-col-4 just-center" key={index}>
                  <Link href={ele?.url || ""}><a target="_blank">
                  <div className="box">
                    <CustomImage src={ele?.image?.path} height="62px" width="80px" />
                    <h3>{ele?.title}</h3>
                  </div>
                  </a>
                  </Link>
                </div>
              );
            })}

            {/* @ts-ignore */}
            {/* <div className="d-col d-col-4 just-center" onClick={test!==1 && initFMRS}>
              <div className="box">
                <i className="jkms2-wedding-ring" />
                <h3>Find your Ring Size</h3>
              </div>
            </div>
            <div
              className="d-col d-col-4 just-center"
              onClick={() => router.push("/jewellery/ready-to-ship")}
            >
              <div className="box">
                <i className="jkms2-delivery-truck" />
                <h3>Ready to Ship</h3>
              </div>
            </div>
            <div
              className="d-col d-col-4 just-center"
              onClick={() => router.push("/jewellery/new-arriaval")}
            >
              <div className="box">
                <i className="jkms2-new-arrival" />
                <h3>New Arrivals</h3>
              </div>
            </div>
            <div className="d-col d-col-4 just-center">
              <div className="box">
                <i className="jkms2-offer" />
                <h3>Offers</h3>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {modal ? (
        <Modal
          open={modal}
          headerName="Find your Ring Size"
          onClose={toggleModal}
          dimmer={false}
          className="find-ring-size"
        >
          <iframe src={findRingSizeURL} width="100%" height="500" />
        </Modal>
      ) : null}
    </>
  );
};

export default FeatureFooter2;
