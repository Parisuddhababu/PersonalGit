import React, { useEffect, useState } from "react";
import Head from "next/head";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import { IMAGE_PATH } from "@constant/imagepath";
import { useRouter } from "next/router";
import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import ErrorHandler from "@components/ErrorHandler";
import Loader from "@components/customLoader/Loader";
import { IVerifyEmailProps } from "@templates/VerifyEmail";
import { getTypeBasedCSSPath, setDynamicDefaultStyle } from "@util/common";
import Link from "next/link";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { StaticRoutes } from "@config/staticurl.config";
import { toast } from "react-toastify";

const VerifyEmail = (props: IVerifyEmailProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSucess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const currentRouter = useRouter();

  useEffect(() => {
    VerifyEmailByToken();
  }, []);

  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);

  const VerifyEmailByToken = async () => {
    const token = currentRouter.query ? currentRouter.query?.query : "";
    await pagesServices.getPage(CONFIG.VERIFY_EMAIL + token, {}).then(
      (result) => {
        setIsLoading(false);
        setMessage(result?.meta?.message);
        if (result?.meta?.status) {
          toast.success(result?.meta?.message)
          setIsSucess(true)
          return
        }
        toast.error(result?.meta?.message)
      },
      (error) => {
        setIsLoading(false);
        setMessage(error?.meta?.message);
        ErrorHandler(error, toast.error);
      }
    );
  };

  return (
    <>
      <Head>
        <title>Verify Email</title>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.toasterDesign)} />
      </Head>
      {isLoading && <Loader />}
      <div className="wrapper">
        <NoDataAvailable
          title={isLoading ? "Please wait your Email Verification is in progress" : message}
          image={IMAGE_PATH.notFoundPageWebp}
          isSuccess={isSuccess}
        >
          <Link href={StaticRoutes.signIn}>
            <button
              type="button"
              aria-label="go-to-signin"
              className="btn btn-primary"
            >
              Go to Sign In
            </button>
          </Link>
        </NoDataAvailable>
      </div>
    </>
  );
};

export default VerifyEmail;
