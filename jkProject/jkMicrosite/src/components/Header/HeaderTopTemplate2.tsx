import {
  IHeaderTopState,
  IPopupData,
  IPopupUseData,
  ISlug_Details,
} from "@components/Header";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import http from "@util/axios";
import Cookies from "js-cookie";
import Link from "next/link";
import pagesServices from "@services/pages.services";
import { setGuestUser } from "src/redux/guestUser/guestUserAction";
import APICONFIG from "@config/api.config";
import {
  IAPIResponse,
  ICountryData,
  ISignInReducerData,
} from "@type/Common/Base";
import {
  getCurrentSelectedCountry,
  getTodayRateDisplay,
  removeLoginData,
  setUpdatedCountryGlobal,
} from "@util/common";
import APPCONFIG from "@config/app.config";
import { useDispatch, useSelector } from "react-redux";
import { IMAGE_PATH } from "@constant/imagepath";
import {
  Action_UserDetails,
  updateCartCounter,
  updateWishListCounter,
} from "src/redux/signIn/signInAction";
import { useRouter } from "next/router";
import SearchBarTemplate2 from "@components/Header/SearchBar2";
import { Action_UpdateCurrencySymbol } from "src/redux/currencySymbol/currencySymbolAction";
import MetalRateApi from "@components/MetalRateApiComponent";
import {
  Action_Update_generalconf_country,
  Action_Update_generalconf_phone_number,
} from "src/redux/whatsApp/whatsAppAction";
import useOfferPopup from "@components/Hooks/OfferPopup/offerPopup";
import OfferPopup from "@templates/OfferPopup";
import { Action_UpdateDisplayQuickViewSKUReducer } from "src/redux/displayQuickViewSKU/displayQuickViewSKUAction";

const HeaderTopTemplate2 = (props: IHeaderTopState) => {
  const dispatch = useDispatch();
  let [isActive, setActive] = useState(false);
  const [showOfferPopup, setOfferPopup] = useState(false);
  const [offerPopupData, setOfferPopupData] = useState<IPopupData[]>();
  const [inputSelection, setInputSelection] = useState<IPopupUseData>({
    form_field: [],
    image: null,
  });
  const [defaultProfile] = useState<string>(IMAGE_PATH.userProfile);
  const router = useRouter();
  const { getOfferData } = useOfferPopup();
  // eslint-disable-next-line
  const [countryList, setCountryList] = useState<ICountryData[]>([]);
  // eslint-disable-next-line
  const [selectedCountry, setSelectedCountry] = useState<string>(
    getCurrentSelectedCountry() || ""
  );
  const wrapperRef = useRef<HTMLLIElement>(null);
  const countryRef = useRef<HTMLLIElement>(null);
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const userDetails = useSelector(
    (state: ISignInReducerData) => state?.signIn?.userData?.user_detail
  );

  const [selectedCountryData, setSelectCountryData] = useState<{
    name: string;
    flag: string;
  }>({
    name: "",
    flag: "",
  });
  const handleHideDropdown = (event: { key: string }) => {
    if (event.key === "Escape") {
      setActive(false);
    }
  };

  const handleClickOutside = (event: Event) => {
    if (wrapperRef.current && wrapperRef.current !== null) {
      if (!wrapperRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    }
    const node = document.getElementById("country-list");
    if (node) {
      node.classList.remove("active");
    }
  };

  const updateGeneralConNumber = (generalConNumber: string) => {
    dispatch(Action_Update_generalconf_phone_number(generalConNumber));
  };

  useEffect(() => {
    updateGeneralConNumber(props?.generalconf_phone_number);
    // eslint-disable-next-line
  }, [props?.generalconf_phone_number]);

  const updateGeneralConCountry = (country: string) => {
    dispatch(Action_Update_generalconf_country(country));
  };

  useEffect(() => {
    if (props?.contact_header?.country?.country_phone_code)
      updateGeneralConCountry(
        props?.contact_header?.country?.country_phone_code
      );
    // eslint-disable-next-line
  }, [props?.contact_header?.country?.country_phone_code]);

  useEffect(() => {
    if (countryList && countryList.length) updateCountryData();
    // eslint-disable-next-line
  }, [countryList, selectedCountry]);

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  useEffect(() => {
    checkLoginUserSessionTimeout();
    // eslint-disable-next-line
  }, [reduxData]);

  const checkLoginUserSessionTimeout = () => {
    if (userDetails?.session_start_time) {
      const msBetweenDates = Math.abs(
        new Date(userDetails?.session_start_time)?.getTime() -
        new Date().getTime()
      );
      // 👇️ convert ms to hours                  min  sec   ms
      const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

      if (hoursBetweenDates >= APPCONFIG.SESSION_TIME_OUT_HOURS) {
        logOut(true);
      }
    }
  };

  const updateCountOfAction = () => {
    dispatch(updateCartCounter(props.cartCount));
    dispatch(updateWishListCounter(props.wishlistCount));
  };

  useEffect(() => {
    updateCountOfAction();
    // eslint-disable-next-line
  }, [props?.cartCount, props?.wishlistCount]);

  useEffect(() => {
    updateCountOfAction();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getActiveCountryList();
    }
    // eslint-disable-next-line
  }, [http.defaults.headers.common["Accountcode"]]);

  useEffect(() => {
    const profileWrapper = document.getElementById("UserProfileDropdown");
    if (profileWrapper) {
      if (reduxData?.signIn?.userData?.user_detail?.email) {
        if (!profileWrapper?.classList?.contains("user-dropdown")) {
          profileWrapper.classList.add("user-dropdown");
          profileWrapper.classList.remove("signin-link");
        }
      } else {
        profileWrapper.classList.remove("user-dropdown");
        profileWrapper.classList.add("signin-link");
      }
    }
  }, [reduxData?.signIn?.userData?.user_detail?.email]);

  const logOut = async (session_out = false) => {
    const formData = new FormData();
    formData.append("is_login", "0");
    await pagesServices.postPage(APICONFIG.LOGOUT_LOG, formData).then(
      (result) => {
        if (result && result?.meta) {
          clearLoginUserData(session_out, result);
        }
      },
      (error) => {
        clearLoginUserData(session_out, error);
      }
    );
  };

  const clearLoginUserData = (session_out = false, result: IAPIResponse) => {
    removeLoginData();
    // @ts-ignore
    dispatch(Action_UserDetails(null));
    dispatch(updateCartCounter(0));
    dispatch(updateWishListCounter(0));
    // @ts-ignore
    dispatch(setGuestUser(true));

    localStorage.removeItem("auth");
    setActive(false);
    if (!session_out) {
      if (result) {
      }
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    getPopupData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);

  const checkSlug = async (data: IPopupData[]) => {
    const { asPath } = router;
    let endpoint = asPath;
    const lastChar = asPath.charAt(asPath.length - 1);
    if (lastChar == "/" && 1 < asPath.length) {
      endpoint = asPath.slice(0, -1);
    }
    data?.forEach((element: IPopupData) => {
      element?.slug_master_details.forEach((value: ISlug_Details) => {
        if (value?.slug_name == endpoint) {
          if (canRenderPopup(element)) {
            // setInputSelection(element?.form_field)
            setInputSelection({
              form_field: element?.form_field,
              image: element?.image,
            });
            setOfferPopup(true);
            return;
          }
        }
      });
    });
  };

  const canRenderPopup = (data: IPopupData) => {
    if (data.duration == 0) {
      let pArr = JSON.parse(
        localStorage.getItem(APPCONFIG.LOCALSTORAGEKEY.oneTimePopup) as string
      );
      pArr = pArr != null ? pArr : [];
      if (pArr.length == 0) {
        pArr.push(data._id);
        localStorage.setItem(
          APPCONFIG.LOCALSTORAGEKEY.oneTimePopup,
          JSON.stringify(pArr)
        );
      } else {
        if (
          JSON.parse(
            localStorage.getItem(
              APPCONFIG.LOCALSTORAGEKEY.oneTimePopup
            ) as string
          )?.includes(data._id)
        ) {
          return false;
        }
      }
      return true;
    } else return true;
  };

  const getPopupData = async () => {
    if (offerPopupData && offerPopupData.length) {
      checkSlug(offerPopupData);
    } else {
      const response = await getOfferData();
      checkSlug(response?.data?.popup_form?.data);
      setOfferPopupData(response?.data?.popup_form?.data);
    }
  };
  const onCloseQuickView = () => {
    setInputSelection({
      form_field: [],
      image: null,
    });
    setOfferPopup(false);
  };

  const getActiveCountryList = async () => {
    const country_id = getCurrentSelectedCountry();

    const response = await pagesServices.getPage(
      APICONFIG.GET_ACCOUNT_COUNTRY_LIST,
      {}
    );
    if (response.status) {
      setCountryList(response?.data?.country_list);
      setSelectedCountry(getCurrentSelectedCountry() ?? "");
      const index = response?.data?.country_list?.findIndex(
        (ele: any) => ele?._id === country_id
      );
      if (index !== -1) {
        Cookies.set(
          "currencySymbol",
          response?.data?.country_list[index]?.currency_symbol || "₹",
          { expires: 365 }
        );
      }
      if (!getCurrentSelectedCountry()) {
        await setUpdatedCountryGlobal(
          response?.data?.country_list?.[0]?._id ?? "",
          response?.data?.country_list?.[0]?.currency_code ?? "",
          response?.data?.country_list?.[0]?.name ?? "",
          response?.data?.country_list?.[0] ?? {},
          response?.data?.country_list?.[0]?.currency_symbol ?? "₹"
        );
      }

      if (
        response?.data?.country_list &&
        response?.data?.country_list?.length > 0
      ) {
        const index = response?.data?.country_list?.findIndex(
          (ele: ICountryData) => ele?._id === country_id
        );
        if (index !== -1) {
          dispatch(
            // @ts-ignore
            Action_UpdateCurrencySymbol(
              response?.data?.country_list[index]?.currency_symbol || "₹"
            )
          );
        } else {
          dispatch(
            // @ts-ignore
            Action_UpdateCurrencySymbol(
              response?.data?.country_list?.[0]?.currency_symbol || "₹"
            )
          );
        }
      }
    }
    getDisplaySKUQuickView();
  };

  const getDisplaySKUQuickView = async () => {
    const response = await pagesServices.getPage(
      APICONFIG.GET_SHOW_SKU_QUICK_VIEW,
      {}
    );
    if (response?.status && response?.status_code === 200) {
      const showQuickView = response?.data?.is_show_quick_view;
      const showProductSku = response?.data?.is_show_sku;
      const showAddToCart = response?.data?.is_show_add_to_cart;
      const isShowProductDetails = response?.data?.is_show_product_detail ?? 1;
      Cookies.set("showQuickView", showQuickView?.toString());
      Cookies.set("showProductSku", showProductSku?.toString());
      Cookies.set("showAddToCart", showAddToCart?.toString());
      Cookies.set("isShowProductDetails", isShowProductDetails);
      dispatch(
        // @ts-ignore
        Action_UpdateDisplayQuickViewSKUReducer({
          showQuickView: showQuickView?.toString() === "1" ? true : false,
          showProductSku: showProductSku?.toString() === "1" ? true : false,
          showAddToCart: showAddToCart?.toString() === "1" ? true : false,
        })
      );
    }
  };

  const onChangeSelectedCountry = async (data: ICountryData) => {
    await setUpdatedCountryGlobal(
      data?._id,
      data?.currency_code || "INR",
      data?.name || "India",
      data || APPCONFIG.DEFAULT_COUNTRY,
      data?.currency_symbol || "₹"
    );
    setSelectCountryData({
      name: data?.name as string,
      flag: data?.country_flag[0].path as string,
    });
    setSelectedCountry(data?._id);
    router.reload();
  };

  const activeCountry = () => {
    const countryElement = document.getElementById("country-list");
    if (countryElement) {
      countryElement.classList.add("active");
    }
  };

  const updateCountryData = () => {
    const country_id = getCurrentSelectedCountry();
    if (country_id) {
      const index = countryList.findIndex((ele) => ele?._id === country_id);
      if (index !== -1) {
        setSelectCountryData({
          name: countryList?.[index]?.name as string,
          flag: countryList?.[index]?.country_flag[0].path as string,
        });
      } else {
        setSelectCountryData({
          name: countryList?.[0]?.name as string,
          flag: countryList?.[0]?.country_flag[0].path as string,
        });
      }
    } else {
      setSelectCountryData({
        name: countryList?.[0]?.name as string,
        flag: countryList?.[0]?.country_flag[0].path as string,
      });
    }
  };

  return (
    <>
      {/*section start - Please create component for this same as template1 */}
      {getTodayRateDisplay() === "1" && (
        <MetalRateApi/>
      )}
      {/* section end */}
      <div className="top-header">
        <p className="click">
          <Link href={props?.generalconf_link || ""}>
            <a>{props?.announcement}</a>
          </Link>
        </p>
      </div>

      <div className="main-header">
        <ul>
          <li className="logo">
            <a href="/">
              <Image
                src={props?.generalconf_logo?.path || ""}
                height="59"
                width="190"
                layout="intrinsic"
                alt="logo"
              />
            </a>
          </li>
          <li className="header-search">
            <div className="search-section">
              <SearchBarTemplate2 />
              <button type="button" className="button-search">
                <i className="icon jkms2-search"></i>
              </button>
            </div>
          </li>
          {
              props?.menu?.type ? 
          <li
            className="country"
            id="countryList"
            ref={countryRef}
            onClick={() => activeCountry()}
          >
            <div className="country-details">
              <div className="selected-country">
                <img
                  src={selectedCountryData?.flag}
                  alt={selectedCountryData?.name}
                />
              </div>
            </div>
            <ul className="country-list" id="country-list" role="listbox">
              {countryList?.map((option, index) => (
                <li
                  className="list-item"
                  onClick={() => onChangeSelectedCountry(option)}
                  key={"country_ID_Header_" + index}
                >
                  <div className="country-item">
                    <img
                      src={option?.country_flag[0].path}
                      alt={option?.name}
                    />
                    <div>{option?.name}</div>
                  </div>
                </li>
              ))}
            </ul>
          </li> : <></>}
          <li className="call">
            <Link
              href={
                props?.generalconf_phone_number
                  ? `tel:${props?.contact_header?.country?.country_phone_code}${props?.generalconf_phone_number}`
                  : "#"
              }
            >
              <a>
                <i className="jkms2-call" />
                {props?.generalconf_phone_number
                  ? `${props?.contact_header?.country?.country_phone_code}  ${props?.generalconf_phone_number}`
                  : ""}
              </a>
            </Link>
          </li>
          {props?.availablePages?.includes(
            APPCONFIG.AVAILABLE_PAGES.blogList
          ) && (
              <li>
                <Link href="/blog">
                  <a title="blog">Blogs</a>
                </Link>
              </li>
            )}
          {props?.availablePages?.includes(
            APPCONFIG.AVAILABLE_PAGES.contactUs
          ) && (
              <li>
                <Link href="/contact-us">
                  <a title="contactUs">Contact Us</a>
                </Link>
              </li>
            )}
          <li className="divider">&nbsp;</li>

          <>
            <li className="header-wishlist item-count">
              <Link href={"/my-wishlist"}>
                <a>
                  <i title="wishlist" className="jkms2-heart" />
                  <span className="item-count-circle">
                    {reduxData?.signIn?.wishlist_count || 0}
                  </span>
                </a>
              </Link>
            </li>
            <li className="mincart-link item-count">
              <Link href={"/cart/list"}>
                <a>
                  <i title="cart" className="jkms2-add-to-cart" />
                  <span className="item-count-circle">
                    {reduxData?.signIn?.cart_count || 0}
                  </span>
                </a>
              </Link>
            </li>
          </>

          {reduxData?.signIn?.userData?.user_detail?.email ? (
            <li
              title="Profile Details"
              className={`top-header-link user-dropdown ${isActive ? "active" : ""
                }`}
              ref={wrapperRef}
              id="UserProfileDropdown"
            >
              <img
                src={
                  reduxData?.signIn?.userData?.user_detail?.profile_image
                    ?.path || defaultProfile
                }
                alt=""
                className="user-dropdown-btn"
                onClick={() => setActive((isActive = !isActive))}
              />
              {/* </span> */}

              <div className="user-dropdown-menu">
                <div className="user-dropdown-menu-item user-profile-details">
                  <img
                    src={
                      reduxData?.signIn?.userData?.user_detail?.profile_image
                        ?.path || defaultProfile
                    }
                    alt=""
                    className="user-profile-image lazy"
                    loading="lazy"
                  />
                  <div className="user-profile-content">
                    <h5 className="user-name">
                      {reduxData?.signIn?.userData?.user_detail?.first_name +
                        " " +
                        reduxData?.signIn?.userData?.user_detail?.last_name}
                    </h5>
                    <p className="user-email">
                      {reduxData?.signIn?.userData?.user_detail?.email}
                    </p>
                  </div>
                </div>

                <div className="user-dropdown-menu-item">
                  <Link href="/my-profile">
                    <a className="user-dropdown-menu-link">
                      <div
                        onClick={() => setActive(false)}
                        className="user-dropdown-menu-inner"
                      >
                        <i className="jkms2-user"></i>
                        My Account
                      </div>
                    </a>
                  </Link>
                </div>

                <div className="user-dropdown-menu-item">
                  <Link href="#">
                    <a className="user-dropdown-menu-link">
                      <div
                        className="user-dropdown-menu-inner"
                        onClick={() => logOut()}
                      >
                        <i className="jkms2-logout"></i>
                        Logout
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </li>
          ) : (
            <li>
              <Link href="/sign-in">
                <a>
                  <i className="jkms2-user" title="user" />
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
      {showOfferPopup && (
        <OfferPopup
          isModal={showOfferPopup}
          onClose={onCloseQuickView}
          InputSelection={inputSelection}
        />
      )}
    </>
  );
};

export default HeaderTopTemplate2;
