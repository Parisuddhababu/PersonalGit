import {
  ISubscriptionProps,
  ISubScriptionState,
} from "@components/SubscribeNewsLetter/index";
import pagesServices from "@services/pages.services";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX } from "@constant/regex";
import ErrorHandler from "@components/ErrorHandler";
import FormValidationError from "@components/FormValidationError";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";

const SubscribeNewsLetter = (props: ISubscriptionProps) => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const subscribe_news_title = props?.dynamic_title?.subscribe_news_title ? props?.dynamic_title?.subscribe_news_title : "Join us our Newsletter";

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
    }
  });

  const submitLetter = async (data: ISubScriptionState) => {
    setIsDisabled(true);
    const formData = new FormData();
    formData.append("email", data.email?.toLowerCase());
    dispatch(setLoader(true));
    await pagesServices
      .postPage(CONFIG.SUBSCRIBE_REQUEST, formData)
      .then((result) => {
        dispatch(setLoader(false));
        if (result.meta && (result.meta.status_code === 201 || result.meta.status_code === 200)) {
          toast.success(result?.meta?.message);
          reset();
          setIsDisabled(false);
        } else {
          setIsDisabled(false);
          ErrorHandler(result, toast.error);
        }
      })
      .catch((error) => {
        dispatch(setLoader(false));
        setIsDisabled(false);
        ErrorHandler(error, toast.error);
      });
  };

  const emailHandler = useCallback(({ field }: { field: { name: string } }) => (
    <input
      type="email" placeholder="Your Email Address" className="email-input"
      id={field.name}
      {...field}
    />
  ), [])

  return (
    <div className="news-letter-section">
      <div className="container">
        <div className="news-letter-title">
          <em className="osicon-email"></em>
          <div>
            <h2>{props?.maindata?.banner_title ?? subscribe_news_title}</h2>
            <h3>{props?.dynamic_title?.subscribe_news_tagline ?? "FOR NEW OFFERS, PROMOTIONS AND NEWS"}</h3>
          </div>
        </div>
        <form
          noValidate={true}
          onSubmit={handleSubmit(submitLetter)}

        >
          <div className="news-letter-form">
            <div className="email-input-wrap">
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
                render={emailHandler}
              />
            </div>
            <button type="submit"
              className="btn btn-primary-large"
              aria-label="subscribe-btn"
              disabled={isDisabled}
            >SUBSCRIBE</button>
          </div>
          <FormValidationError errors={errors} name="email" />
        </form>
      </div>
    </div>
  );
};

export default SubscribeNewsLetter;
