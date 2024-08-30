import React, { useEffect, useState } from "react";
import Head from "next/head";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import { IMAGE_PATH } from "@constant/imagepath";
import { useRouter } from "next/router";
import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import Loader from "@components/customLoader/Loader";
import { IVerifyEmailProps } from "@templates/VerifyEmail";
import { setDynamicDefaultStyle } from "@util/common";
import Link from "next/link";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const VerifyEmail = (props: IVerifyEmailProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const currentRouter = useRouter();
  const { showError, showSuccess } = useToast();
  useEffect(() => {
    VerifyEmailByToken();
    // eslint-disable-next-line
  }, []);

  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);

  const VerifyEmailByToken = async () => {
    const token = currentRouter.query ? currentRouter.query?.query : "";
    await pagesServices.getPage(CONFIG.VERIFY_EMAIL + token, {}).then(
      (result) => {
        if (result.meta && result.meta.status) {
          setIsLoading(false);
          setMessage(result?.meta?.message);
          showSuccess(result?.meta?.message);
        }
      },
      (error) => {
        setIsLoading(false);
        setMessage(error?.meta?.message);
        ErrorHandler(error, showError);
      }
    );
  };

  return (
    <>
      <Head>
        <title>{props?.meta?.title ? props?.meta?.title : props?.domainName}</title>
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + CSS_NAME_PATH.toasterDesign + ".css"} />
      </Head>
      {isLoading && <Loader />}
      <div className="wrapper">
        <NoDataAvailable
          title={isLoading ? "Please wait your Email Verification is in progress" : message}
          image={IMAGE_PATH.notFoundPageWebp}
        >
          <Link href="/sign-in">
            <a className="btn btn-primary">Go to Sign In</a>
          </Link>
        </NoDataAvailable>
      </div>
    </>
  );
};

export default VerifyEmail;
