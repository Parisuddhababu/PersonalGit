import FormValidationError from "@components/FormValidationError";
import { IMobilePhoneNumberProps } from "@components/mobilePhoneNumber";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { Message } from "@constant/errorMessage";
import { PHONENUMBER_REGEX } from "@constant/regex";
import Head from "next/head";
import { useForm } from "react-hook-form";

const MobilePhoneNumberComponent = (props: IMobilePhoneNumberProps) => {
  const Validations = {
    country_phone_code: {
      required: Message.COUNTRY_REQUIRED,
    },

    mobile: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
  };

  const {
    register,
    // setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      country_phone_code: props?.country_id ?? "hello",
      mobile: props?.mobile_number ?? "Hello",
    },
  });

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.countryPhoneCode +
            ".min.css"
          }
        />
      </Head>

      <div className="form-group">
        <label>Mobile Number*</label>
        <div className="code-n-number">
          <div className="country_phone_code" id="country_phone_code">
            <input
              {...register(
                "country_phone_code",
                Validations.country_phone_code
              )}
              type="text"
              name="country_phone_code"
              className="form-control"
              id="country_phone_code"
            />
            <div id="country-drop" className="dropdown">
              <input
                type="text"
                name="search-country"
                className="form-control"
                id="search-country"
              />
              <ul>
                <li data-code="AF" data-name="Afghanistan" data-cid="c32">
                  <i className="jkm-heart"></i>Afghanistan (+93)
                </li>
                <li data-code="AL" data-name="Albania" data-cid="c33">
                  <i className="jkm-heart"></i>Albania (+355)
                </li>
                <li data-code="DZ" data-name="Algeria" data-cid="c34">
                  <i className="jkm-heart"></i>Algeria (+213)
                </li>
                <li data-code="AS" data-name="American Samoa" data-cid="c35">
                  <i className="jkm-heart"></i>American Samoa (+1-684)
                </li>
                <li data-code="AD" data-name="Andorra" data-cid="c36">
                  <i className="jkm-heart"></i>Andorra (+376)
                </li>
              </ul>
            </div>
          </div>
          <input
            {...register("mobile", Validations.mobile)}
            type="text"
            className="form-control"
            id="mobile-number"
            name="mobile"
            placeholder="0123456789"
          />
        </div>

        <FormValidationError errors={errors} name="mobile" />
      </div>
    </>
  );
};

export default MobilePhoneNumberComponent;
