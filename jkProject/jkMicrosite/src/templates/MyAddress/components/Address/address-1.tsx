import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { ISignInReducerData } from "@type/Common/Base";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IAddressListPropsData } from ".";
import { IAddEditAddressForm } from "@templates/MyAddress/components/AddEditAddress";

import AddEditAddress from "@templates/MyAddress/components/AddEditAddress/addEditAddres-1";
import useAddressSelection from "@components/Hooks/AddressSelection";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch, useSelector } from "react-redux";
import APPCONFIG from "@config/app.config";
import { useToast } from "@components/Toastr/Toastr";
import Loader from "@components/customLoader/Loader";
import ErrorHandler from "@components/ErrorHandler";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import DeletePopup from "@components/Deletepopup/DeletePopup";
import Link from "next/link";

const MyAddressSection1 = ({
  useraddressDetails,
  showOption,
  getUpdateValue,
}: IAddressListPropsData) => {
  const [modal, setModal] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<IAddEditAddressForm>();
  const [editMode, setEditMode] = useState(false);
  const [stateId, setStateId] = useState<string | undefined>("");
  const [countryId, setCountryId] = useState<string | undefined>("");
  const [idOfAddress, setIdOfAddress] = useState("");
  const { setShippingAddress, setBillingAddress, shipping, billing } =
    useAddressSelection();
  const [isLoading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch();
  const toggleModal = () => {
    setModal(!modal);
    // if (modal) {
    //   setCountryId('')
    //   setStateId('')
    // }
  };
  const router = useRouter();
  const loaderData = useSelector((state) => state);
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
  const [deleteItemData, setDeleteItemData] = useState<any>();

  useEffect(() => {
    if (reduxData?.guestUserRootReducer?.guestUserFlag) {
      router.push("/sign-in");
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (showOption && getUpdateValue) {
      getUpdateValue(billing, shipping);
    }
    // eslint-disable-next-line
  }, [shipping, billing]);

  useEffect(() => {
    if (countryId) {
    }
    // eslint-disable-next-line
  }, [countryId]);

  useEffect(() => {
    if (stateId) {
    }
    // eslint-disable-next-line
  }, [stateId]);

  const deleteAddress = (id: string) => {
    // @ts-ignore
    dispatch(setLoader(true));
    pagesServices
      .DeletePage(id as string)
      .then((result) => {
        if (result.meta && result.meta.status) {
          if (showOption) {
            router.push("/cart/checkout_list/");
          } else {
            router.push("/user-address-book");
          }
          // @ts-ignore
          dispatch(setLoader(false));
          showSuccess(result?.meta?.message);
        }
      })
      .catch((error) => {
        ErrorHandler(error, showError);
      });
  };

  const editAddress = (id: string) => {
    if (id) {
      let address = useraddressDetails?.find((ele: any) => ele?._id == id);
      setCountryId(address?.country?.country_id);
      setStateId(address?.state_id);
      setIdOfAddress(id);
      setFilteredData(address);
      setLoading(true);
      setTimeout(() => {
        toggleModal();
        setEditMode(true);
        setLoading(false);
      }, 1000);

      // countryChange(address?.country?.country_id)
    }
  };

  useEffect(() => {
    if (useraddressDetails.length === 1) {
      setBillingAddress(useraddressDetails?.[0]?._id)
      setShippingAddress(useraddressDetails?.[0]?._id)
    }
    // eslint-disable-next-line
  }, [useraddressDetails]);

  const setFormEditMode = () => {
    setEditMode(false);
  };

  const clearFilteredData = () => {
    setFilteredData({
      address_line1: "",
      address_line2: "",
      country_id: "",
      city_id: "",
      pincode: "",
      mobile_number: "",
      is_active: undefined,
      state_id: "",
      country: undefined,
      country_phone_code: "",
    });
  };

  const stateChages = (state: string) => {
    setStateId(state);
  };
  const countryChange = (country: string | undefined) => {
    setCountryId(country);
  };

  const onCloseDeleteModal = () => {
    setIsDeletePopup(false);
  };

  const handleDeleteData = (isDelete: boolean) => {
    if (isDelete) {
      deleteAddress(deleteItemData);
      setDeleteItemData(null);
      onCloseDeleteModal();
    } else {
      onCloseDeleteModal();
      setDeleteItemData(null);
    }
  };

  const { showError, showSuccess } = useToast();
  return (
    <>
      {isLoading && <Loader />}
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.checkoutAddressDetails)}
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <section className="address-sec">
          <div className="order-summary-info-top address-section-top">
            <h4 className="sort-info-title">Address Details</h4>
            <a className="coupon-links pop-up-links" onClick={toggleModal}>
              + Add a New Address
            </a>
          </div>
          {useraddressDetails.length === 0 ? (
            <NoDataAvailable title="No addresses found..!!">
              <Link href="/">
                <a className="btn btn-secondary btn-small">Go to Home</a>
              </Link>
            </NoDataAvailable>
          ) : (
            useraddressDetails?.map((ele: any) => {
              return (
                <>
                  <div className="address-content">
                    <p className="address-content-para address">
                      {" "}
                      {ele?.fullname ?? `${reduxData?.signIn?.userData?.user_detail?.first_name} ${reduxData?.signIn?.userData?.user_detail?.last_name}`},
                    </p>
                    <p className="address-content-para address">
                      {" "}
                      {ele?.address_line1}, {ele?.address_line2},
                    </p>
                    <p className="address-content-para city-state">
                      {ele?.state?.name}, {ele?.city?.name}, {ele?.pincode}
                    </p>
                    <p className="address-content-para country">
                      {ele?.country?.name}
                    </p>
                    <p className="address-content-para contact-number">
                      <a>
                        {ele?.country?.country_phone_code}
                        {ele?.mobile_number}
                      </a>
                    </p>
                    <form action="#">
                      <div className="form-action">
                        {showOption ? (
                          <div className="address-content-option">
                            <div className="cmn-radio">
                              <input
                                type="checkbox"
                                checked={billing == ele?._id}
                                id={ele?._id + "billing"}
                                name={ele?._id}
                                onClick={() => setBillingAddress(ele?._id)}
                              />
                              <label htmlFor={ele?._id + "billing"}>
                                Billing
                              </label>
                            </div>
                            <div className="cmn-radio">
                              <input
                                type="checkbox"
                                id={ele?._id + "shipping"}
                                checked={shipping == ele?._id}
                                name={ele?._id}
                                onClick={() => setShippingAddress(ele?._id)}
                              />
                              <label htmlFor={ele?._id + "shipping"}>
                                Shipping{" "}
                              </label>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="address-content-action action-toolbar">
                          <a className="edit">
                            <i
                              onClick={() => editAddress(ele?._id)}
                              className="jkm-pencil jkm-pencil"
                            ></i>
                          </a>
                          <a className="remove">
                            <i
                              onClick={() => {
                                setIsDeletePopup(true);
                                setDeleteItemData(ele?._id);
                              }}
                              className="jkm-trash jkm-trash"
                            ></i>
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              );
            })
          )}
        </section>
      )}

      {modal ? (
        <AddEditAddress
          isModal={modal}
          onClose={toggleModal}
          editMode={editMode}
          idOfAddress={idOfAddress}
          filteredData={filteredData}
          // countryData={countryData}
          // stateData={stateData}
          // cityData={cityData}
          setFormEditMode={setFormEditMode}
          clearFilteredData={clearFilteredData}
          stateChages={stateChages}
          countryChange={countryChange}
          showOption={showOption}
        />
      ) : (
        <></>
      )}
      {isDeletePopup && (
        <DeletePopup
          onClose={onCloseDeleteModal}
          isDelete={(isDelete) => handleDeleteData(isDelete)}
          message="Are you sure you want to delete address?"
        />
      )}
    </>
  );
};

export default MyAddressSection1;
