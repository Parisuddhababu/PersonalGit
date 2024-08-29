import Link from "next/link";
import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { IMainMenuProps } from ".";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { ISignInReducerData } from "@type/Common/Base";
import { ReducerState } from "@type/Redux";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { removeLoginData } from "@util/common";
import { useRouter } from "next/router";
import { Action_UserDetails } from "src/redux/signIn/signInAction";
import { setLoader } from "src/redux/loader/loaderAction";
import useIsMobile from "@components/Hooks/Responsive/useMobile";
import { RootState } from "src/redux/rootReducers";

const MainMenu = ({ menu }: IMainMenuProps) => {
  const dispatch = useDispatch()
  const router = useRouter();
  const [categoryMenuVisible, setCategoryMenuVisible] = useState<number | null>(null)
  const [hambergerMenu, setHambergerMenu] = useState(false)
  const reduxData = useSelector((state: ISignInReducerData) => state)
  const productReducer = useSelector((state: ReducerState) => state?.productReducer);
  const { whatsAppReducer: { logo } } = useSelector((state: RootState) => state);
  const [myAccount, setMyaccount] = useState(false)
  const wrapperRef = useRef<HTMLLIElement>(null);
  const isMobile = useIsMobile()
  let styleElement: any
  const toggleOnHover = (key: number | null, enter = false) => {
    if (enter && categoryMenuVisible === key) {
      return
    }
    setCategoryMenuVisible((prev: number | null) => prev === key ? null : key)
  }

  const logOut = async () => {
    dispatch(setLoader(true))
    setMyaccount(false)
    const formData = new FormData();
    formData.append("is_login", "0");
    await pagesServices.postPage(APICONFIG.LOGOUT_LOG, formData).then(
      (result) => {
        dispatch(setLoader(false))
        if (result?.meta) {
          clearLoginUserData();
        }
      },
      () => {
        dispatch(setLoader(false))
        clearLoginUserData();
      }
    );
  };

  const clearLoginUserData = (session_out = false) => {
    removeLoginData();
    // @ts-ignore
    dispatch(Action_UserDetails(null))
    localStorage.removeItem("auth")
    if (!session_out) {
      router.push("/sign-in");
    }
  };

  const handleClickOutside = (event: Event) => {
    if (wrapperRef.current && wrapperRef.current !== null) {
      if (!wrapperRef.current.contains(event.target as Node)) {
        setMyaccount(false);
      }
    }
  };

  const handleHideDropdown = (event: { key: string }) => {
    if (event.key === "Escape") {
      setMyaccount(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const onArrowHandle = (event: MouseEvent<HTMLButtonElement>, key: number) => {
    event.stopPropagation();
    event.preventDefault(); // Prevent Link redirection
    setCategoryMenuVisible((prev: number | null) => prev === key ? null : key)
  }

  const onRedirect = (key: number) => {
    router.push('/products')
    closeHambergerMenu()
  }

  const closeHambergerMenu = () => {
    setHambergerMenu(false)
    setCategoryMenuVisible(null)
  }

  useEffect(() => {
    if (!styleElement) {
      styleElement = document.createElement('style');
      const dynamicStyles = `
        body {
          overflow: hidden;
        }
      `;
      styleElement.appendChild(document.createTextNode(dynamicStyles));
    }

    if (hambergerMenu && !document.head.contains(styleElement)) {
      document.head?.appendChild(styleElement);
    } else if (!hambergerMenu && document.head.contains(styleElement)) {
      document.head?.removeChild(styleElement);
    }

    return () => {
      if (document.head.contains(styleElement)) {
        document.head?.removeChild(styleElement);
      }
    };
  }, [hambergerMenu]);


  return (
    <div className="main-header">
      <div className="container">
        <Link href={'/'}>
          <a className="logo">
            <picture>
              <source srcSet={logo} type="image/webp" />
              <img src={logo} alt="logo" title="logo" height="55" width="198" />
            </picture>
          </a>
        </Link>

        <div className={`menu-list-wrapper ${hambergerMenu ? 'active' : ''}`}>
          <ul className="menu-list">
            <li className="icon-close">
              <a href="#" onClick={() => setHambergerMenu(false)}><i className="osicon-close"></i></a>
            </li>
            <li className="menu-list-item search-wrapper">
              <SearchBar />
            </li>
            <li className="menu-list-item">
              <Link href="/about">
                <a className="menu-list-action" onClick={closeHambergerMenu}>About us</a>
              </Link>
            </li>
            <li className="menu-list-item">
              <Link href="/resources">
                <a className="menu-list-action" onClick={closeHambergerMenu}>Resources</a>
              </Link>
            </li>
            {
              menu?.categories?.map((item, key) => (
                item?.url === 'products' ?
                  <li className="menu-list-item" key={item.name}
                    onMouseEnter={() => !isMobile && toggleOnHover(key, true)}
                    onMouseLeave={() => !isMobile && toggleOnHover(key)}>
                    <a className="menu-list-action" onClick={() => onRedirect(key)} href="#">
                      Products
                      <i className={`osicon-cheveron-down ${categoryMenuVisible === key ? 'menu-active' : ''}`}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => onArrowHandle(event, key)}
                      />
                      <i className={`osicon-arrow sub-list-arrow ${categoryMenuVisible === key ? 'active' : ''}`}
                        onClick={(event: MouseEvent<HTMLButtonElement>) => onArrowHandle(event, key)}
                      />
                    </a>
                    <ul className="sub-list" style={{
                      display: categoryMenuVisible === key ? 'flex' : 'none'
                    }}>
                      {
                        item?.parent_category?.map((product) => (
                          <li key={product?.name} >
                            <Link href={`/products/${product.url}`}>
                              <a onClick={closeHambergerMenu}>
                                <i className="osicon-dry-eye"></i>
                                <span className="sub-list-item">
                                  <h3>{product.name}</h3>{
                                    product?.description?.length && product?.description?.length > 0 &&
                                    <span>{product?.description}</span>
                                  }
                                </span>
                              </a>
                            </Link>
                          </li>
                        ))
                      }
                    </ul>
                  </li> :
                  null
              ))
            }
            <li className="menu-list-item">
              <Link href="/contact-us">
                <a className="menu-list-action" onClick={closeHambergerMenu}>Contact us</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="search-section">
          <SearchBar />
        </div>
        {
          !isMobile && !reduxData?.signIn?.userData?.user_detail?.email ? null :
            <ul className="my-profile">
              {
                !reduxData?.signIn?.userData?.user_detail?.email ? null :
                  <>
                    <li id="user-dropdown" className={`user-dropdown ${myAccount ? 'active' : ''}`} ref={wrapperRef}>
                      <a href="#" aria-label="user-dropdown"><i className="osicon-user"
                        onClick={() => setMyaccount(!myAccount)}></i></a>
                      <div className="user-dropdown-menu">
                        <div className="user-dropdown-menu-item user-profile-details">
                          <img src="/assets/images/default-avatar.png" alt="" className="user-profile-image lazy" loading="lazy" />
                          <div className="user-profile-content">
                            <h5 className="user-name">
                              {reduxData?.signIn?.userData?.user_detail?.first_name}{" "}
                              {reduxData?.signIn?.userData?.user_detail?.last_name}
                            </h5>
                            <p className="user-email">
                              {reduxData?.signIn?.userData?.user_detail?.email}
                            </p>
                          </div>
                        </div>
                        <div className="user-dropdown-menu-item">
                          <Link href='/my-account'>
                            <a className="user-dropdown-menu-link" onClick={() => setMyaccount(false)}>
                              <span className="user-dropdown-menu-inner">
                                <i className="osicon-user">
                                </i>My Account</span>
                            </a>
                          </Link>

                        </div>
                        <div className="user-dropdown-menu-item">
                          <a href="#" className="user-dropdown-menu-link" onClick={logOut}>
                            <span className="user-dropdown-menu-inner">
                              <i className="osicon-power">
                              </i>Logout</span>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative">
                        <Link href='/cart/list'>
                          <a><i className="osicon-bag"></i> <span>{productReducer.cartCount}</span></a>
                        </Link>
                      </div>
                    </li>
                  </>
              }
              <li className="hamburger-icon">
                <a href="#" aria-label="hamburger-menu" onClick={() => setHambergerMenu(!hambergerMenu)}><i className="osicon-bar"></i></a>
              </li>
            </ul>
        }

      </div>
    </div >
  );
};

export default MainMenu;
