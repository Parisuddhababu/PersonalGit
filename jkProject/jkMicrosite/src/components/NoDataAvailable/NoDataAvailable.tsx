import React from "react";
import { INoDataAvailableProps } from "@components/NoDataAvailable";
import { IMAGE_PATH } from "@constant/imagepath";
import CustomImage from "@components/CustomImage/CustomImage";
import Head from "next/head";

function NoDataAvailable({ message, image, title, children }: INoDataAvailableProps) {
  return (
    <>
      <section className="no-records">
        <div className="container">
          <div className="no-records-content">
            <div className="details">
              <div className="image">
                <CustomImage
                  src={image ? image : IMAGE_PATH.noRecordsWebp}
                  alt={"No records found"}
                  title={"No Records Found"}
                  height="191px"
                  width="430px"
                />
              </div>
              <h3>{title}</h3>
              <p>{message}</p>
              {children}
            </div>
          </div>
        </div>
      </section>
      <Head>
        <link rel="stylesheet" href={"/assets/css/pages/no-records-found.min.css"} />
      </Head>
    </>
  );
}

export default NoDataAvailable;
