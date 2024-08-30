import APPCONFIG from "@config/app.config";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IsBrowser } from "@util/common";
import Modal from "@components/Modal";
import BookAppointment from "@components/BookAppointments/BookAppointment";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMainMenuProps } from ".";
import SearchBarTemplate2 from "./SearchBar2";
import Link from "next/link";
import { IParentCategory } from "@type/Header";

const MainMenuTemplate2 = ({ menu, metal_type, logo }: IMainMenuProps) => {
  // @ts-ignore
  const [winSize, setWinSize] = useState<number>(0);
  const [mainActiveIndex, setMainActiveIndex] = useState<number>(-1);

  const [modal, setModal] = useState<boolean>(false);
  // @ts-ignore
  // eslint-disable-next-line
  const [viewMobileMenu, setviewMobileMenu] = useState(false);

  const parentRef = useRef<HTMLUListElement>(null);

  const mobileMenuLogoClick = () => {
    if (IsBrowser && winSize <= 1199) {
      setviewMobileMenu(true);

      const menuItem = document.querySelector(".main-menu");
      if (menuItem && !menuItem.classList.contains("active")) {
        menuItem.classList.add("active");
      }
    }
  };

  const getMenuMultipleDynamic = (menu: any) => {
    if (winSize >= 1199) {
      return menu?.categories?.slice(0, 5);
    }
    return menu?.categories;
  };

  const mobileMainCategoryClick = (activeIndex: number) => {
    setMainActiveIndex(activeIndex);
    setTimeout(() => {
      const mainCategory = document.querySelector(".menu-section");
      if (mainCategory && !mainCategory.classList.contains("active")) {
        mainCategory.classList.add("active");
      }
    }, 100);
  };

  const mobileMenuSingleBackClick = () => {
    const menuItem = document.querySelector(".main-menu");
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

  /**
   * Mobile Screen
   * Mobile Close button click remove drower from all the active class
   */
  const mobileCloseButtonClick = () => {
    const menuItem = document.querySelector(".main-menu");
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

  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (IsBrowser) {
      window.addEventListener("mouseover", handleMenuOutside, true);
      window.addEventListener("resize", checkWindowReziser);
      checkWindowReziser();
    }
    return () => {
      window.removeEventListener("resize", checkWindowReziser);
    };
    // eslint-disable-next-line
  }, []);

  // Screen Type & Size Checking
  const checkWindowReziser = () => {
    setWinSize(window.innerWidth);
  };

  const handleMenuOutside = (event: any) => {
    if (parentRef !== null && winSize > 1199) {
      if (parentRef?.current && parentRef.current !== null) {
        if (!parentRef.current.contains(event.target)) {
          setMainActiveIndex(-1);
        }
      }
    }
  };

  const closeMenu = () => {
    const menuItem = document.querySelector(".main-menu");
    if (menuItem && menuItem.classList.contains("active")) {
      menuItem.classList.remove("active");
    }
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
      <div className="bottom-header">
        {winSize <= 1199 && (
          <ul className="mobile-menu">
            <li className="logo">
              <Link href={"/"}>
                <a href="/">
                  <Image
                    src={logo || ""}
                    height="59"
                    width="190"
                    layout="intrinsic"
                    alt="logo"
                  />
                </a>
              </Link>
            </li>
            <span className="jkms2-menu" onClick={mobileMenuLogoClick} />
          </ul>
        )}
        {/* menu-over class needs to be added when menuitem is more than 5, in desktop only */}
        <ul className="main-menu menu-over">
          {winSize <= 1199 && (
            <>
              <li className="mobile-header">
                <button
                  type="button"
                  onClick={mobileMenuSingleBackClick}
                  className="menu-mobile-arrow"
                >
                  <span className="jkms2-arrow-left"></span>
                </button>
                <button
                  type="button"
                  onClick={mobileCloseButtonClick}
                  className="menu-mobile-close"
                >
                  <span className="jkms2-close"></span>
                </button>
              </li>
              <li className="mobile-search">
                <div className="search-section">
                  <SearchBarTemplate2 />

                  <button type="button" className="button-search">
                    <i className="icon jkms2-search"></i>
                  </button>
                </div>
              </li>
              <li className="mobile-book-btn">
                <a onClick={toggleModal} className="btn btn-primary btn-medium">
                  Book an Appointment
                </a>
              </li>
            </>
          )}

          {getMenuMultipleDynamic(menu)?.map((main: any, ind: any) => (
            <li key={ind + "_mc"} onMouseOver={() => setMainActiveIndex(ind)}>
              <Link href={`/${main?.url}`}>
                <a href={`/${main?.url}`} onClick={() => closeMenu()}>
                  {/* <i
                    className={`jkms2-${main.name.toLowerCase()} icon jkms2-left`}
                  /> */}
                  {main?.name}
                </a>
              </Link>
              <i
                className="jkms2-arrow-right"
                onClick={() => mobileMainCategoryClick(ind)}
              ></i>
              {main?.parent_category?.length > 0 && ind === mainActiveIndex && (
                <div className="menu-section">
                  <div className="left-section" id={`left-section-${ind}`}>
                    <ul ref={parentRef}>
                      {main?.parent_category?.map(
                        (parentCat: any, pInd: any) => (
                          <li
                            key={pInd + "_pc"}
                          // onMouseOver={() => setChildActiveIndex(pInd)}
                          >
                            <Link href={`/${parentCat?.url}`}>
                              <a href={`/${parentCat?.url}`} onClick={() => closeMenu()}>
                                {parentCat?.name}
                                {parentCat?.child_category?.length > 0 && (
                                  <i className="jkms2-arrow-right" />
                                )}
                              </a>
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
          {/* @ts-ignore */}
          {winSize >= 1199 && menu?.categories?.length > 5 && (
            <li className="extra-menu">
              <a>
                <i className="jkms2-more"></i>
              </a>
              <ul>
                {/* @ts-ignore */}
                {menu?.categories?.map(
                  (mega: IParentCategory, mInd: number) =>
                    mInd > 4 && (
                      <li key={mega.url}>
                        <a href={`/${mega?.url}`}>{mega?.name}</a>
                      </li>
                    )
                )}
              </ul>
            </li>
          )}
        </ul>
        <div className="book-btn">
          <a onClick={toggleModal} className="btn btn-primary btn-medium">
            Book an Appointment
          </a>
        </div>
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

export default MainMenuTemplate2;
