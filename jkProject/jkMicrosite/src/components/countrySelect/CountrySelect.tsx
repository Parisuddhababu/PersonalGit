import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { ICountryData } from "@type/Common/Base";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
// Components
import { ICountrySelectProps } from ".";
import Cookies from "js-cookie";

const CountrySelect = (props: ICountrySelectProps) => {
  const [countryList, setCountryList] = useState<ICountryData[]>([]);
  const [filterCountryList, setFilterCountryList] = useState<ICountryData[]>(
    []
  );
  const [phone, setPhone] = useState(props?.phoneNumberProp);
  const [inputId] = useState<string>(props.inputId || "");
  const [contactPlaceholder] = useState<string>(
    props?.placeholder ?? "Phone Number"
  );
  const [countryCode, setCountryCode] = useState(
    props?.country?.country_phone_code ?? ""
  );
  const [countryLabel, setCountryLabel] = useState(
    props?.country?.country_code ?? ""
  );
  const [countryFlag, setCountryFlag] = useState(
    props?.country?.country_flag ?? ''
      ? props?.country?.country_flag[0]?.path
      : ("" as string)
  );
  const [filter, setFilter] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [otpFlow, setOtpFlow] = useState<boolean>(props?.otpFlow || false);
  const [otp, setOTP] = useState<string>("");
  const [oldCountryPhoneCode] = useState<string>(
    props?.country?.country_phone_code ?? ""
  );

  const pageList = ['signUp', 'address'];
  const [isOtpOptional,setIsOtpOptional] = useState<number>(1);
  const isOptionalCookie = Cookies.get("isOtpOptional")

  useEffect(() => {
    if (props?.country && Object.entries(props?.country).length) {
      setCountryCode(props?.country?.country_phone_code);
      setCountryLabel(props?.country?.country_code);
    }
    setCountryFlag(
      props?.country?.country_flag
        ? props?.country?.country_flag[0]?.path
        : ("" as string)
    );
  }, [props.country]);

  useEffect(() => {
    setOtpFlow(props?.otpFlow || false);
  }, [props?.otpFlow]);

  const toggleList = () => {
    if (!pageList.includes(props.page)) {
      if (countryList?.length == 0) {
        setCountryList([]);
        toggleClassList();

        setTimeout(() => {
          setCountryList({
            ...countryList,
            ...countryList?.slice(50, countryList?.length),
          });
        }, 10);
      } else {
        setFilter("");
        toggleClassList();
      }
    }

  };

  const toggleClassList = (hide = false) => {
    let nodes = document.querySelector(".country-list-drp");
    if (props?.id) {
      nodes = document.querySelector(`#${props.id}`);
    }
    if (nodes) {
      if (hide) {
        nodes.classList.add("hide");
        nodes.classList.remove("active");
        return true;
      }
      if (!nodes?.classList?.contains("active")) {
        nodes.classList.add("active");
        nodes.classList.remove("hide");
      } else {
        nodes.classList.add("hide");
        nodes.classList.remove("active");
      }
    }
  };

  const countryChange = (selected: ICountryData) => {
    if (!selected.country_code) {
      setCountryList(filterCountryList);
      return;
    }
    let result = countryList?.filter(
      (x: ICountryData) => x.country_code === selected.country_code
    );
    if (result.length > 0) {
      setCountryLabel(result?.[0]?.country_code);
      setCountryCode(result.length > 0 ? result[0].country_phone_code : "");
      setPhone("");
      setCountryFlag(result?.[0]?.country_flag?.[0]?.path);
      toggleClassList();
      const data = {
        countryId: result?.[0]?._id,
        country: result?.[0]?.country_code,
        countryCode: result.length > 0 ? result[0].country_phone_code : "",
        phone: "",
      };
      props.setCountryContact(data);
    }
  };

  const handleInputChange = (event: any) => {
    props?.changeHandler && props?.changeHandler(event)
    const value: string = event.target.value;
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setPhone(value);
      const data = {
        country: countryLabel,
        countryCode: countryCode,
        phone: event.target.value,
      };

      props.setCountryContact(data);
    }
  };

  const handleClickOutside = () => {
    if (countryList?.length > 0) {
      const node = document.querySelector(
        ".country-list .country-list-drp .active"
      );
      if (node) {
        toggleClassList(true);
      }
    }
  };

  const escFunction = (event: any) => {
    if (event.keyCode === 27) {
      if (countryList?.length > 0) {
        toggleClassList(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", escFunction, false);
  });

  useEffect(()=>{
    setIsOtpOptional(+isOptionalCookie!)
  },[isOptionalCookie])

  useEffect(() => {
    countryCodeList();
    // eslint-disable-next-line
  }, []);

  const handleChange = (event: any) => {
    const value: string = event.target.value.trimLeft();
    event.target.value = event.target.value.trimLeft();
    let arr = countryList?.filter(
      (val: ICountryData) =>
        val.country_code.toLowerCase().includes(value.toLowerCase()) == true
    );
    setFilter(value);
    if (value === "") {
      setCountryList(filterCountryList);
    } else {
      setCountryList(arr);
    }
  };

  /**
   * Get Country Code Data
   */
  const countryCodeList = async () => {
    await pagesServices
      .postPage(APICONFIG.GET_ALL_COUNTRIES_LIST, {})
      .then((result) => {
        setCountryList(result?.data?.country_list);
        setFilterCountryList(result?.data?.country_list);
      });
  };

  const resetMobile = () => {
    setCountryCode(oldCountryPhoneCode);
    setCountryFlag(
      props?.country?.country_flag
        ? props?.country?.country_flag[0]?.path
        : ("" as string)
    );
    setPhone(props?.phoneNumberProp);
    // @ts-ignore
    props?.resetPhone(true);
  };

  const handleOTPChange = (event: any) => {
    setOTP(event.target.value);
    // @ts-ignore
    props.updatedOTP(event.target.value);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.countryWithPhoneSelect +
            ".min.css"
          }
        />
      </Head>
      <div id="cNum" className="with-otp otp-wrapper">
        <div>
          <div id="countryList" onClick={toggleList} ref={buttonRef}>
            <img src={countryFlag} width="25" height="13" alt="Country" />
            <span>{countryCode}</span>
          </div>
          <div
            className={`country-list country-list-drp hide`}
            id={props.id}
            ref={wrapperRef}
          >
            <div className="input-col search-country-main">
              <input
                type="text"
                className="form-control search-country"
                name={`SearchCountry`}
                onChange={handleChange}
                value={filter}
                id={`SearchCountry${props.page || ""}`}
                placeholder="Search"
                autoComplete="off"
              />
            </div>
            <ul>
              {countryList &&
                countryList?.length > 0 &&
                countryList?.map((item: ICountryData, index: number) => {
                  return (
                    <li
                      id={`${index}`}
                      key={index}
                      onClick={() => countryChange(item)}
                      className={`flag top ${item.country_code === countryLabel ? "active" : ""
                        }`}
                    >
                      <div className="d-row">
                        <div className="d-col d-col-2 d-col-margin d-col-margin-right">
                          <img
                            src={item?.country_flag?.[0]?.path}
                            alt="country-flg"
                            className="country-flag"
                          />
                        </div>
                        <div className="d-col d-col-2 d-col-margin">
                          <label className="country-value">
                            {item?.country_phone_code}
                            &nbsp; {item.country_code}
                          </label>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <input
          type="text"
          placeholder={contactPlaceholder}
          className={"form-control " + props?.className}
          id={inputId}
          name={"mobile_phone"}
          value={phone}
          onChange={handleInputChange}
          maxLength={13}
          disabled={props?.disable ? true : false}
          autoFocus={props?.onTypeChangeToMobile ? true : false}
        />
        {otpFlow && isOtpOptional === 1 && (
          <>
            <button
              type="button"
              // @ts-ignore
              onClick={() => props.sendOTP(true)}
              className="btn btn-secondary btn-otp"
            >
              OTP
            </button>
            <a
              className="jkm-close btn btn-secondary"
              onClick={() => resetMobile()}
            ></a>
          </>
        )}
      </div>
      {props && isOtpOptional === 1 &&
        otpFlow &&
        // @ts-ignore
        props?.sendedOTP && (
          <div className="otp-wrapper">
            <input
              type="text"
              placeholder={contactPlaceholder}
              className={"form-control " + props?.className}
              id={inputId}
              name={"mobile_otp"}
              value={otp}
              onChange={(event) => handleOTPChange(event)}
              maxLength={13}
            />
            <button
              // @ts-ignore
              onClick={() => props?.verifyOTP(true)}
              type="button"
              className="btn btn-secondary"
            >
              Verify
            </button>
          </div>
        )}
    </>
  );
};

export default CountrySelect;
