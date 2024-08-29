import APICONFIG from "@config/api.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { ICountryData } from "@type/Common/Base";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { ICountrySelectProps } from ".";
import { getTypeBasedCSSPath } from "@util/common";

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
  const [countryFlag, setCountryFlag] = useState(props?.country?.country_flag[0]?.path ?? "");
  const [filter] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props?.country && Object.entries(props.country).length) {
      setCountryCode(props.country.country_phone_code);
      setCountryLabel(props.country.country_code);
    }
    setCountryFlag(props?.country?.country_flag?.[0]?.path ?? "");
  }, [props.country]);



  const countryChange = (selected: ICountryData) => {
    if (!selected.country_code) {
      setCountryList(filterCountryList);
      return;
    }
    let result = countryList?.filter(
      (x: ICountryData) => x.country_code === selected.country_code
    );
    if (result.length > 0) {
      setCountryLabel(result[0]?.country_code);
      setCountryCode(result[0].country_phone_code ?? "");
      setPhone("");
      setCountryFlag(result[0]?.country_flag?.[0]?.path);

    }
  };
  useEffect(() => {
    countryCodeList();
  }, []);

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

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.countryWithPhoneSelect)} />
      </Head>
      <div id="cNum" className="with-otp otp-wrapper">
        <div>
          <div id="countryList" ref={buttonRef}>
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
                      key={item.country_id}
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
          maxLength={13}
          disabled={props?.disable ? true : false}
        />

      </div>

    </>
  );
};

export default CountrySelect;
