import React from "react";
import { MaintenanceModeProps } from "@components/Maintenance";
import { IMAGE_PATH } from "@constant/imagepath";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import { useRouter } from "next/router";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

function MaintenanceMode({ image}: MaintenanceModeProps) {

  const router = useRouter();

  const goHome = () => {
    router.push('/')
  }
  return (
    <>
      <Head>
      <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.maintenance +
            ".min.css"
          }
        />
      </Head>
      <section className="error404">
        <div className="container">
          <div className="maintenance-content">
            <div className="d-row">
              <div className="d-col align-center ">
                <div className="box just-end">
                  <h2>Ooooops!... <br />We are Under Maintenance.</h2>
                  <h4>The page you are looking for might have been removed, or is temporarily unavailble</h4>
                  <button type="button" className="btn btn-secondary btn-small" onClick={goHome}>Go to Home</button>
                </div>
                <div className="maintenance-image">
                  <CustomImage
                    src={image ? image : IMAGE_PATH.maintenanceMode}
                    alt={"Maintenace Mode"}
                    title={"Maintenace Mode"}
                    height=""
                    width=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default MaintenanceMode;
