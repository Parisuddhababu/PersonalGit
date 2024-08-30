import { IMAGE_PATH } from "@constant/imagepath";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import pagesServices from "@services/pages.services";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import FormValidationError from "@components/FormValidationError";
import { Message } from "@constant/errorMessage";
import { EMAIL_REGEX, PHONENUMBER_REGEX } from "@constant/regex";
import { IProductInquiryProps } from "@type/Pages/product-inquiry";
import { ICountryData, ISignInReducerData } from "@type/Common/Base";
import { IProductInquiryState } from ".";
import { useSelector } from "react-redux";
import APICONFIG from "@config/api.config";
import Loader from "@components/customLoader/Loader";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import CountrySelect from "@components/countrySelect";

const ProductInquiry = (props: IProductInquiryProps) => {
  const [, setCountryList] = useState<ICountryData[]>([]);
  const { showError, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signIndata = useSelector((state: ISignInReducerData) => state);

  const [defaultValues] = useState<IProductInquiryState>({
    name: "",
    country_code: "",
    mobile_no: "",
    email: "",
    inquiry_description: "",
    country_id: "",
  });

  const {
    formState: { errors },
    handleSubmit,
    // reset,
    setValue,
    register,
    getValues
  } = useForm({ defaultValues });

  useEffect(() => {
    if (signIndata?.signIn?.userData) {
      setValue(
        "name",
        signIndata?.signIn?.userData?.user_detail?.first_name +
          " " +
          signIndata?.signIn?.userData?.user_detail?.last_name
      );
      setValue(
        "country_code",
        signIndata?.signIn?.userData?.user_detail?.country?.country_id
      );
      setValue("mobile_no", signIndata?.signIn?.userData?.user_detail?.mobile);
      setValue("email", signIndata?.signIn?.userData?.user_detail?.email);
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Get Country Code Data
   */
  const countryCodeList = async () => {
    await pagesServices.postPage(APICONFIG.GET_ALL_COUNTRIES_LIST, {}).then(
      (result) => {
        setCountryList(result?.data?.country_list);
      },
      (error) => {
        ErrorHandler(error, showError);
      }
    );
  };

  useEffect(() => {
    countryCodeList();
    // eslint-disable-next-line
  }, []);

  const onInquirySubmit = async (data: IProductInquiryState) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("mobile", data.mobile_no);
    formData.append("email", data.email);
    formData.append("enquiry_message", data.inquiry_description);
    formData.append("country_id", data.country_code);
    formData.append("product_id", props.product_id);
    await pagesServices.postPage(APICONFIG.PRODUCT_INQUIRY, formData).then(
      (res) => {
        if (res.meta && res.meta.status) {
          // reset();
          setIsLoading(false);
          showSuccess(res?.meta?.message);
        }
      },
      (error) => {
        setIsLoading(false);
        ErrorHandler(error, showError);
      }
    );
  };

  const Validations = {
    name: {
      required: Message.NAME_REQUIRED,
    },
    email: {
      required: Message.EMAIL_REQUIRED,
      pattern: {
        value: EMAIL_REGEX,
        message: Message.EMAIL_PATTERN,
      },
    },
    mobile: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
    inquiry_description: {
      required: Message.DESCRIPTION_REQUIRED,
    },
  };

  const setCountryId = (data: any) => {
    setValue("mobile_no", data?.phone);
  };

  return (
    <>
      <Head>
      <title>{props?.pageTitle ? props?.pageTitle : props?.domainName}</title>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.productInquiry +
            ".min.css"
          }
        />
      </Head>
      {isLoading && <Loader />}
      <div className="product-inquiry-wrapper">
        <div className="container">
          <div className="inquiry-heading">
            <h2 className="h4">
              {props?.title}{" "}
              {props?.sku ? `(${props?.sku})` : ""}
            </h2>
          </div>

          <div className="inquiry-section">
            <div className="left-section">
              <img
                src={
                  props?.images?.length > 0
                    ? props?.images?.[0]?.path
                    : IMAGE_PATH.noImagePng
                }
                alt={props?.title}
              />
            </div>
            <div className="right-section">
              <form
                className="inquiry-form"
                noValidate
                onSubmit={handleSubmit(onInquirySubmit)}
              >
                <div className="row">
                  <div className="form-group">
                    <label>Name*</label>
                    <input
                      {...register("name", Validations.name)}
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Name"
                    />
                    <FormValidationError errors={errors} name="name" />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <CountrySelect
                      setCountryContact={(d: any) => setCountryId(d)}
                      placeholder="Phone Number"
                      page="enquiry"
                      inputId="enquiry-page"
                      phoneNumberProp={getValues("mobile_no")}
                      country={getValues("country_code")}
                      disable={false}
                    />
                    <FormValidationError errors={errors} name="mobile_no" />
                  </div>
                  <div className="form-group">
                    <label>Email Address*</label>
                    <input
                      {...register("email", Validations.email)}
                      type="email"
                      className="form-control"
                      name="email"
                      id="userEmail"
                      placeholder="xyz@gmail.com"
                    />
                    <FormValidationError errors={errors} name="email" />
                  </div>
                  <div className="form-group">
                    <label>Inquiry*</label>
                    <textarea
                      {...register(
                        "inquiry_description",
                        Validations.inquiry_description
                      )}
                      name="inquiry_description"
                      className="form-control"
                      placeholder="Description"
                    ></textarea>
                    <FormValidationError
                      errors={errors}
                      name="inquiry_description"
                    />
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary">Send</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInquiry;
