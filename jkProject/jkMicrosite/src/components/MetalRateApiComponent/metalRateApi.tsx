import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
// import APPCONFIG from "@config/app.config";
// import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { getCurrentSelectedCountry } from "@util/common";
import Head from "next/head";
import { useState } from "react";

const MetalRateApi = () => {
  const [show, setShow] = useState(false);
  const [className, SetClassName] = useState("");
  const [todayRate, setTodayRate] = useState<any>({});

  const toogleButton = (data: any) => {
    getMetalRateAPI();
    setShow(data);
    SetClassName("active");
  };
  const closeModal = (data: boolean) => {
    setShow(data);
    SetClassName("");
  };

  const getMetalRateAPI = () => {
    pagesServices
      ?.postPage(APICONFIG.METAL_RATE_API, {
        country_id: getCurrentSelectedCountry() ? getCurrentSelectedCountry() : APPCONFIG.DEFAULT_COUNTRY_ID,
      })
      .then((resp) => {
        if (resp) {
          setTodayRate(resp?.data);
        }
      })
      .catch((err) => err);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.metalRate +
            ".min.css"
          }
        />
      </Head>
      <div className="live-chat-sidemenu">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => toogleButton(true)}
        >
          <p>{"Today's Rate"} </p>
        </button>
        <div className={`slide-content ${className}`}>
          {show && (
            <>
              <ul>
                <li>
                  <span>GOLD ({"1 GM"})</span>
                  <span>{todayRate?.GOLD}</span>
                </li>
                <li>
                  <span>SILVER ({"1 GM"})</span>
                  <span>{todayRate?.SILVER}</span>
                </li>
                <li>
                  <span>PLATINUM ({"1 GM"})</span>
                  <span>{todayRate?.PLATINUM}</span>
                </li>
                {todayRate?.TITANIUM && (
                  <li>
                    <span>TITANIUM ({"1 GM"})</span>
                    <span>{todayRate?.TITANIUM}</span>
                  </li>
                )}
              </ul>
              <div
                className={"jkm-close"}
                onClick={() => closeModal(false)}
              ></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MetalRateApi;
