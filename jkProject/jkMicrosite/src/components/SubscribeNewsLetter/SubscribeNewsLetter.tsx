import {
  ISubscriptionProps,
  ISubScriptionState,
} from "@components/SubscribeNewsLetter/index";
import pagesServices from "@services/pages.services";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX } from "@constant/regex";
import { useToast } from "@components/Toastr/Toastr";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import ErrorHandler from "@components/ErrorHandler";
import Head from "next/head";
import FormValidationError from "@components/FormValidationError";
import { useRouter } from "next/router";

const SubscribeNewsLetter = (props: ISubscriptionProps) => {
  const [defaultValues] = useState<ISubScriptionState>({
    email: "",
  });
  const [isDisabled, setisDisabled] = useState<boolean>(false);
  const { showError, showSuccess }: any = useToast();
  const Router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const submitLetter = async (data: ISubScriptionState) => {
    setisDisabled(true);
    const formData = new FormData();
    formData.append("email", data.email?.toLowerCase());
    await pagesServices
      .postPage(CONFIG.SUBSCRIBE_REQUEST, formData)
      .then((result) => {
        if (result.meta && (result.meta.status_code === 201 || result.meta.status_code === 200) ) {
          showSuccess(result?.meta?.message);
          reset();
          setisDisabled(false);
        } else {
          setisDisabled(false);
          ErrorHandler(result, showError);
        }
      })
      .catch((error) => {
        setisDisabled(false);
        ErrorHandler(error, showError);
      });
  };
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>
      <section className={Router?.asPath == "/" ? "subscribe-newsletter-sec subscribe-home" : "subscribe-newsletter-sec" }>
        <div className="subscribe-newsletter-bg-image" />
        <h2>
          {props?.maindata?.banner_title
            ? props?.maindata?.banner_title
            : props?.dynamic_title?.subscribe_news_title ? props?.dynamic_title?.subscribe_news_title : "Subscribe to Our Newsletter"}
        </h2>
        <div className="subscribe-sec">
          <p className="subscribe-sub-title">{props?.dynamic_title?.subscribe_news_tagline||"Sign up to be a smart Jeweller !"}</p>
          <form
            noValidate={true}
            onSubmit={handleSubmit(submitLetter)}
            className="subscribe-form d-flex"
          >
            <div className="subscribe-from-field">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: Message.EMAIL_REQUIRED,
                  pattern: {
                    value: EMAIL_REGEX,
                    message: Message.EMAIL_PATTERN,
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Email"
                      id={field.name}
                      {...field}
                    />
                  </>
                )}
              />
              <FormValidationError errors={errors} name="email" />
            </div>
            <div className="subscribe-button-field">
              <button
                type="submit"
                disabled={isDisabled}
                className="btn btn-secondary btn-small"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default SubscribeNewsLetter;
