import React, { useEffect, useRef, useState } from "react";

// Components
import { IMainMenuProps } from "@components/Header";
import { IsBrowser } from "@util/common";
// import CustomImage from "@components/CustomImage/CustomImage";
// import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
// import usePriceDisplay from "@components/Hooks/priceDisplay";
import Modal from "@components/Modal";
import BookAppointment from "@components/BookAppointments/BookAppointment";

import SearchBar from "@components/Header/SearchBar";
// import { useRouter } from "next/router";
import IHeader from "@type/Header";
import Link from "next/link";

// import IHeader, { IParentCategory } from "@type/Header";
// import APPCONFIG from "@config/app.config";

const MainMenu = ({ menu, categoryTypeCount, logo, metal_type }: IMainMenuProps) => {
  const [mainActiveIndex, setMainActiveIndex] = useState<number>(-1);
  // const [childActiveIndex, setChildActiveIndex] = useState<number>(0);
  const parentRef = useRef<HTMLUListElement>(null);
  const [winSize, setWinSize] = useState<number>(0);
  // const currencySymbol = useCurrencySymbol();
  // const { isPriceDisplay } = usePriceDisplay();
  const [modal, setModal] = useState<boolean>(false);
  const [displaySeachbar, setDisplaySeachbar] = useState<boolean>(false);
  // const router = useRouter();

  const handleMenuOutside = (event: any) => {
    if (parentRef !== null && winSize > 1199) {
      if (parentRef?.current && parentRef.current !== null) {
        if (!parentRef.current.contains(event.target)) {
          setMainActiveIndex(-1);
          // setChildActiveIndex(0);
        }
      }
    }
  };
  // Screen Type & Size Checking
  // useEffect(() => {
  //   const windowWidth = window.innerWidth;
  //   setWinSize(windowWidth);
  // }, [winSize]);

  const toggleModal = () => {
    setModal(!modal);
  };

  /**
   * Mobile Screen
   * Mobile Menu Button Click then active class on menu-item beside
   */
  const mobileMenuLogoClick = () => {
    if (IsBrowser && winSize <= 1199) {
      const menuItem = document.querySelector(".menu-item");
      if (menuItem && !menuItem.classList.contains("active")) {
        menuItem.classList.add("active");
      }
    }
  };

  /**
   * Mobile Screen
   * Mobile Category Menu Button Click then active class on menu-section beside
   */
  const mobileMainCategoryClick = (activeIndex: number) => {
    setMainActiveIndex(activeIndex);
    setTimeout(() => {
      const mainCategory = document.querySelector(".menu-section");
      if (mainCategory && !mainCategory.classList.contains("active")) {
        mainCategory.classList.add("active");
      }
    }, 100);
  };

  /**
   * Mobile Screen
   * Mobile Sub Category Menu Button Click then active class on right-section beside
   */
  // const mobileSubCategoryClick = (activeIndex: number) => {
  //   setChildActiveIndex(activeIndex);
  //   setTimeout(() => {
  //     const childCategory = document.querySelector(".right-section");
  //     if (childCategory && !childCategory.classList.contains("active")) {
  //       childCategory.classList.add("active");
  //     }
  //   }, 100);
  // };

  /**
   * Mobile Screen
   * Mobile screen open menu single back button click remove single single active class
   */
  const mobileMenuSingleBackClick = () => {
    const menuItem = document.querySelector(".menu-item");
    const mainCategory = document.querySelector(".menu-section");
    const childCategory = document.querySelector(".right-section");
    if (childCategory && childCategory.classList.contains("active")) {
      childCategory.classList.remove("active");
      // setChildActiveIndex(-1);
    } else if (mainCategory && mainCategory.classList.contains("active")) {
      mainCategory.classList.remove("active");
      setMainActiveIndex(-1);
    } else if (menuItem && menuItem.classList.contains("active")) {
      menuItem.classList.remove("active");
    }
  };


  const closeMenu = () => {
    const menuItem = document.querySelector(".menu-item");
    if (menuItem && menuItem.classList.contains("active")) {
      menuItem.classList.remove("active");
    }
  };

  /**
   * Mobile Screen
   * Mobile Close button click remove drower from all the active class
   */
  const mobileCloseButtonClick = () => {
    const menuItem = document.querySelector(".menu-item");
    const mainCategory = document.querySelector(".menu-section");
    const childCategory = document.querySelector(".right-section");
    if (childCategory && childCategory.classList.contains("active")) {
      childCategory.classList.remove("active");
      // setChildActiveIndex(-1);
    }
    if (mainCategory && mainCategory.classList.contains("active")) {
      mainCategory.classList.remove("active");
      setMainActiveIndex(-1);
    }
    if (menuItem && menuItem.classList.contains("active")) {
      menuItem.classList.remove("active");
    }
  };

  useEffect(() => {
    if (IsBrowser) {
      window.addEventListener("mouseover", handleMenuOutside, true);
      window.addEventListener("resize", checkWindowReziser);
      checkWindowReziser();
    }
    return () => {
      window.removeEventListener("resize", checkWindowReziser);
    }
    // eslint-disable-next-line
  }, []);

  // Screen Type & Size Checking
  const checkWindowReziser = () => {
    setWinSize(window.innerWidth)
  }

  // const handleNewArriavalClick = (parentCat: IParentCategory) => {
  //   const url = parentCat?.url;
  //   if (url) {
  //     router.push(`/${url}/?${APPCONFIG.SEARCH_URL_TYPE.NEW_ARRIVAL}`);
  //   }
  // };


  // const handleShopByPriceFilter = (parentCat: IParentCategory, minPrice: string, maxPrice: string) => {
  //   const url = parentCat?.url;
  //   if (url) {
  //     router.push(`/${url}/?${APPCONFIG.SEARCH_URL_TYPE.PRICE_RANGE}${minPrice},${maxPrice}`);
  //   }
  // }

  // const handleShopForManWomen = (parentCat: IParentCategory, shopFor: string) => {
  //   const url = parentCat?.url;
  //   if (url) {
  //     router.push(`/${url}/?${APPCONFIG.SEARCH_URL_TYPE.SHOP}${shopFor}`);
  //   }
  // }

  // const handleMetalType = (parentCat: IParentCategory, metalFor: string) => {
  //   const url = parentCat?.url;
  //   if (url) {
  //     router.push(`/${url}/?${APPCONFIG.SEARCH_URL_TYPE.METAL_TYPE}${metalFor.replaceAll(" ", "+")}`);
  //   }
  // }

  /**
   * Split Menu if Desktop screen then return only 5 records
   * @param menu
   * @returns
   */
  const getMenuMultipleDynamic = (menu: IHeader[]) => {
    if (winSize >= 1199) {
      // @ts-ignore
      return menu?.categories?.slice(0, 5);
    }
    // @ts-ignore
    return menu?.categories;
  };


  return (
    <>
      <div className="main-header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="Logo" height="85" width="255" />
          </a>
        </div>
        {/* @ts-ignore */}
        <ul className={`${categoryTypeCount && categoryTypeCount > 1 ? 'single-menu-item' : ''} ${(winSize >= 1199 && menu?.categories?.length > 5) ? "menu-item menu-over" : "menu-item"}`}>
          {/* Mobile Screen Menu - Start */}
          {winSize <= 1199 ? (
            <>
              <li className="mobile-header">
                <button
                  type="button"
                  onClick={mobileMenuSingleBackClick}
                  className="menu-mobile-arrow"
                >
                  <span className="jkm-arrow-left"></span>
                </button>
                <button
                  type="button"
                  onClick={mobileCloseButtonClick}
                  className="menu-mobile-close"
                >
                  <span className="jkm-close"></span>
                </button>
              </li>
              <li className="mobile-search">
                <SearchBar onClose={() => setDisplaySeachbar(false)} />
              </li>
              <li className="mobile-book-btn">
                <a onClick={toggleModal} className="btn btn-primary btn-medium">
                  Book an Appointment
                </a>
              </li>
            </>
          ) : (
            <></>
          )}
          {/* Mobile Screen Menu - end */}
          {getMenuMultipleDynamic(menu)?.map((main: any, ind: number) => (
            <li key={ind + "_mc"} onMouseOver={() => setMainActiveIndex(ind)}>
              <Link href={`/${main?.url}`}>
                <a href={`/${main?.url}`} onClick={() => closeMenu()}>
                  {/* <i className="jkm-diamond-icon jkm-left" /> */}
                  {main?.name}
                  {/* <i className="jkm-arrow-down jkm-right" /> */}
                </a>
              </Link>
              {categoryTypeCount && categoryTypeCount > 1 && <i
                className="jkm-arrow-right"
                onClick={() => mobileMainCategoryClick(ind)}
              ></i>}

              {(main?.parent_category?.length > 0 && ind === mainActiveIndex && categoryTypeCount && categoryTypeCount > 1) && (
                <div className="menu-section">
                  <div className="left-section" id={`left-section-${ind}`}>
                    <ul ref={parentRef}>
                      {main?.parent_category?.map((parentCat: any, pInd: number) => (
                        <li
                          key={pInd + "_pc"}
                        // onMouseOver={() => setChildActiveIndex(pInd)}
                        >
                          <Link href={`/${parentCat?.url}`}>
                            <a href={`/${parentCat?.url}`} onClick={() => closeMenu()}>
                              {parentCat?.name}
                              {/* {parentCat?.child_category?.length > 0 && <i className="jkm-arrow-right" />}  */}
                            </a>
                          </Link>
                          {/* {parentCat?.child_category?.length > 0  &&  <i
                            className="jkm-arrow-right"
                            onClick={() => mobileSubCategoryClick(pInd)}
                          />}


                          {parentCat?.child_category?.length > 0 &&
                            pInd === childActiveIndex && (
                              <div className="right-section">
                                <div className="product-details">
                                  <div className="detail-wrapper">
                                    <h5>Shop By Style</h5>
                                    <ul>
                                      {parentCat?.child_category?.map(
                                        (childCat, ccInd) => (
                                          <li key={ccInd + "_cc"}>
                                            <a href={`/${childCat?.url}`}>
                                              {childCat?.name}
                                            </a>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <div className="detail-wrapper">
                                    <h5>Shop By Metal & Stone</h5>
                                    <ul>
                                      {
                                        metal_type?.map((mt, mIndex) => (
                                        <li key={"Metal_type_" + mIndex}>
                                          <a onClick={() => handleMetalType(parentCat, mt.name)}>{mt.name}</a>
                                        </li>

                                        ))
                                      }
                                    </ul>
                                  </div>
                                  <div className="detail-wrapper">
                                    <h5>Shop By</h5>
                                    <ul>
                                      <li>
                                        <a onClick={() => handleShopForManWomen(parentCat, "Men")}>For Men</a>
                                      </li>
                                      <li>
                                        <a onClick={() => handleShopForManWomen(parentCat, "Women")}>For Women</a>
                                      </li>
                                      {isPriceDisplay ? (
                                        <>
                                          <li>
                                            <a onClick={() => handleShopByPriceFilter(parentCat, "0","10000")}>
                                              Under {currencySymbol} 10k
                                            </a>
                                          </li>
                                          <li>
                                            <a onClick={() => handleShopByPriceFilter(parentCat, "10000","20000")}>
                                              {currencySymbol} 10k to{" "}
                                              {currencySymbol} 20k
                                            </a>
                                          </li>
                                          <li>
                                            <a onClick={() => handleShopByPriceFilter(parentCat, "20000","30000")}>
                                              {currencySymbol} 20k to{" "}
                                              {currencySymbol} 30k
                                            </a>
                                          </li>
                                          <li>
                                            <a onClick={() => handleShopByPriceFilter(parentCat, "30000","50000")}>
                                              Above {currencySymbol} 30k
                                            </a>
                                          </li>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </ul>
                                  </div>
                                  <a
                                    href={`/${parentCat?.url}`}
                                    className="btn btn-primary btn-medium"
                                  >
                                    View All
                                  </a>
                                </div>
                                <div className="product-image">
                                  <div
                                    className="image"
                                    onClick={() =>
                                      handleNewArriavalClick(parentCat)
                                    }
                                  >
                                    <CustomImage
                                      src={parentCat?.new_arrival_image?.path}
                                      alt={parentCat?.new_arrival_image?.name}
                                      title={parentCat?.new_arrival_image?.name}
                                      height="778px"
                                      width="1920px"
                                    />
                                    <h4>New Arrivals</h4>
                                  </div>
                                  <div
                                    className="image"
                                    onClick={() =>
                                      router.push("/recently_view/list")
                                    }
                                  >
                                    <CustomImage
                                      src={
                                        parentCat?.recently_viewed_image?.path
                                      }
                                      alt={
                                        parentCat?.recently_viewed_image?.name
                                      }
                                      title={
                                        parentCat?.recently_viewed_image?.name
                                      }
                                      height="778px"
                                      width="1920px"
                                    />
                                    <h4>Recently Viewed</h4>
                                  </div>
                                </div>
                              </div>
                            )} */}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
          {/* @ts-ignore */}
          {winSize >= 1199 && menu?.categories?.length > 5 &&
            <li className="extra-menu">
              <a><i className="jkm-more"></i></a>
              <ul>
                {/* @ts-ignore */}
                {menu?.categories?.map((mega, mInd) => (
                  mInd > 4 &&
                  <li key={"menu_higher_order" + mInd}>
                    <a href={`/${mega?.url}`}>
                      {/* <i className="jkm-diamond-icon jkm-left"></i> */}
                      {mega?.name}
                    </a>
                  </li>

                ))
                }
              </ul>
            </li>
          }
        </ul>
        {/* Mobile Screen Then only display button - Start */}
        {winSize <= 1199 ? (
          <div className="responsive-menu" onClick={mobileMenuLogoClick}>
            <span className="jkm-nav"></span>
            <span>Menu</span>
          </div>
        ) : (
          <></>
        )}
        {/* Mobile Screen Then only display button - end */}
        <ul className="rightside-btn">
          <li className="search-icon">
            <a
              onClick={() => setDisplaySeachbar(!displaySeachbar)}
              className="btn btn-primary btn-icon"
            >
              <i
                className={`${displaySeachbar ? "jkm-search" : "jkm-search"}`}
              ></i>
            </a>
            {displaySeachbar ? (
              <SearchBar onClose={() => setDisplaySeachbar(!displaySeachbar)} />
            ) : (
              <></>
            )}
          </li>
          <li className="book-btn">
            <a onClick={toggleModal} className="btn btn-primary btn-medium">
              Book an Appointment
            </a>
          </li>
        </ul>
      </div>
      {modal ? (
        <Modal
          className="book-appointment-popup"
          open={true}
          onClose={toggleModal}
          dimmer={false}
          headerName="Book an Appointment Now"
        >
          <BookAppointment toggleModal={toggleModal} />
        </Modal>
      ) : null}
    </>
  );
};

export default MainMenu;
