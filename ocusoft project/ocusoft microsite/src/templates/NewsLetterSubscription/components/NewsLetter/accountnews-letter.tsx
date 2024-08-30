import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import BreadCrumbs from "@components/BreadCrumbs";
import ErrorHandler from "@components/ErrorHandler";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from "@config/api.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoader } from "src/redux/loader/loaderAction";

const AccountNewsLetter1 = () => {
  const [newsletterSelection, setNewsletterSelection] = useState(0);
  const dispatch = useDispatch();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterSelection(e.target.checked ? 1 : 0);
  };


  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      newsletter_selection: newsletterSelection
    };


    const responceData = makeDynamicFormDataAndPostData(
      data,
      APICONFIG.UPDATE_PROFILE_DATA
    );
    dispatch(setLoader(true));
    responceData
      ?.then((resp) => {
        dispatch(setLoader(false));
        if (resp?.meta?.status) {
          toast.success(resp?.meta?.message);
          return
        }
        toast.error(resp?.meta?.message);
      })
      .catch((err) => {
        ErrorHandler(err, toast.error);
        dispatch(setLoader(false));
      });
  };
  //get profile data
  const getProfileData = async () => {
    pagesServices
      .getPage(APICONFIG.GET_PROFILE_DATA, {})
      .then((resp) => {
        dispatch(setLoader(true))
        setNewsletterSelection(resp?.data?.user_account_details[0]?.newsletter_selection || 0);
        dispatch(setLoader(false))
      })
      .catch(() => {
        dispatch(setLoader(false))
      });
  };

  useEffect(() => {
    getProfileData();

  }, [])


  return (
    <>
      <Head>
        <title>Newsletter Subscription</title>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.accountTabbing)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.accountNewsLetter)}
        />
      </Head>
      <main>
        <BreadCrumbs item={[{ slug: '/newsletter-subscription', title: 'Newsletter Subscription' }]} />
        <section className="account-information-section">
          <div className="container">
            <MyAccountHeaderComponent />
            <div className="account-right-content-wrap news-letter-content-wrap">
              <div className="account-content-title">
                <h2>Newsletter Subscription</h2>
              </div>
              <form onSubmit={onSubmit} >
                <div className="account-news-letter-section">
                  <h3>Subscription option</h3>
                  <div className="ocs-checkbox">
                    <input
                      type="checkbox"
                      name="checkBox"
                      className="form-control"
                      id="check1"
                      checked={newsletterSelection == 1}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="check1">General Information</label>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    SAVE
                  </button>
                </div>
              </form>

            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AccountNewsLetter1;
