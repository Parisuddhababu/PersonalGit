import React, { useEffect, useState } from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getCountryName, getCountryObj, getCurrentSelectedCountry, getTypeBasedCSSPath } from "@util/common";
import Modal from "@components/Modal";
import { useRouter } from "next/router";

import {
  IAddEditAddressForm,
  IAddEditAddressProps,
} from "@templates/MyAddress/components/AddEditAddress/index";
import { SubmitHandler, useForm } from "react-hook-form";
import APICONFIG from "@config/api.config";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import pagesServices from "@services/pages.services";
import { Message } from "@constant/errorMessage";
import { PHONENUMBER_REGEX } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/customLoader/Loader";
import CountrySelect from "@components/countrySelect";
import DropdownWithSearch from "@components/DropdownWithSearch/DropdownWithSearch";
import APPCONFIG from "@config/app.config";
// import { ICountry } from "@type/Pages/contactUsList";
import { ICountryData, ISignInReducerData } from "@type/Common/Base";

const AddEditAddress = ({
  onClose,
  isModal,
  filteredData,
  clearFilteredData,
  // cityData,
  // stateData,
  editMode,
  setFormEditMode,
  idOfAddress,
  stateChages,
  countryChange,
  showOption,
}: IAddEditAddressProps) => {
  const [defaultValues] = useState({
    address_line1: filteredData?.address_line1 ?? "",
    address_line2: filteredData?.address_line2 ?? "",
    country_id: getCurrentSelectedCountry(),
    city_id: "",
    state_id: '',
    pincode: filteredData?.pincode ?? "",
    mobile_number: filteredData?.mobile_number ?? "",
    is_active: 1,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IAddEditAddressForm>({ defaultValues });
  const dispatch = useDispatch();
  const stateId = watch("state_id");
  const countryId = watch("country_id");
  const [selectCountry, setSelectedCountry] = useState<ICountryData | {} | undefined>(APPCONFIG.DEFAULT_COUNTRY);
  const [countryVal, setCountryVal] = useState<string | undefined>(getCountryName())
  const [cityVal, setCityVal] = useState<string | undefined>('')
  const [stateVal, setStateVal] = useState<string | undefined>('')
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const toggleModal = () => {
    onClose();
  };
  const loaderData = useSelector((state) => state);

  const Validations = {
    fullname: {
      required: Message.FULLNAME_REQUIRED,
    },
    addressLine: {
      required: Message.ADDRESS_REQUIRED,
    },
    country: {
      required: Message.COUNTRY_REQUIRED,
    },
    state: {
      required: Message.STATE_REQUIRED,
    },
    city: {
      required: Message.CITY_REQUIRED,
    },
    mobile: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
    pincode: {
      required: Message.PINCODE_REQUIRED,
    },
  };

  useEffect(() => {
    if (stateId) stateChages(stateId);
    // eslint-disable-next-line
  }, [stateId]);

  useEffect(() => {
    if (countryId) countryChange(countryId);
    const countryObj = getCountryObj();
    if (countryObj?._id === countryId) {
      setSelectedCountry(countryObj)
    }
    // eslint-disable-next-line
  }, [countryId]);

  // useEffect(() => {
  //   const findCountry = countryData?.find((ele) => ele?._id == countryId);
  //   if (findCountry) {
  //     setSelectedCountry(findCountry);
  //   }
  //   // eslint-disable-next-line
  // }, [countryId]);

  const setCountryId = (data: any) => {
    setValue("country_phone_code", data?.countryCode);
    setValue("mobile_number", data?.phone);
  };

  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();

  const router = useRouter();
  const onSubmit: SubmitHandler<IAddEditAddressForm> = async (data) => {
    const country_id_var = data?.country_id;
    // @ts-ignore
    dispatch(setLoader(true));
    if (editMode) {
      if (idOfAddress) {
        await pagesServices
          // @ts-ignore
          .updateAddressBook(
            idOfAddress as string,
            // @ts-ignore
            { ...data, country: country_id_var } as string
          )
          .then((res) => {
            showSuccess(res?.meta?.message);
            toggleModal();
            if (!showOption) {
              router.push("/user-address-book");
            }
            // @ts-ignore
            dispatch(setLoader(false));
          })
          .catch((err) => {
            ErrorHandler(err, showError);
          });
      }
    } else {
      const responceData = makeDynamicFormDataAndPostData(
        { ...data, country: country_id_var },
        APICONFIG.CREATE_ADDRESS_BOOK
      );
      responceData
        ?.then((resp) => {
          if (resp?.data && resp?.meta) {
            if (!showOption) {
              router.push("/user-address-book");
            }
            showSuccess(resp?.meta?.message);
            toggleModal();
            // @ts-ignore
            dispatch(setLoader(false));
          } else {
            ErrorHandler(resp, showError);
          }
        })
        .catch((err) => {
          ErrorHandler(err, showError);
        });
    }
  };

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (editMode) {
      initializeData();
    } else {
      setValue("fullname", `${reduxData?.signIn?.userData?.user_detail?.first_name} ${reduxData?.signIn?.userData?.user_detail?.last_name}`);
      setValue("mobile_number", reduxData?.signIn?.userData?.user_detail?.mobile);
    }
    return () => {
      clearFilteredData();
      setFormEditMode();
    };

    // eslint-disable-next-line
  }, [editMode]);

  const initializeData = () => {
    setCountryVal(filteredData?.country?.name)
    setValue("fullname", filteredData?.fullname ?? `${reduxData?.signIn?.userData?.user_detail?.first_name} ${reduxData?.signIn?.userData?.user_detail?.last_name}`);
    setValue("country_id", filteredData?.country?.country_id);
    setValue("city_id", filteredData?.city_id);
    setCityVal(filteredData?.city?.name)
    setValue("state_id", filteredData?.state_id);
    setStateVal(filteredData?.state?.name)
    setSelectedCountry(filteredData?.country)
  };

  const onCountryChange = (data: any) => {
    setValue("country_id", data._id)
    setCountryVal(data.name)
    countryChange(data._id)
    setValue("state_id", '')
    setValue("city_id", '')
    setStateVal('')
    setCityVal('')
    setSelectedCountry(data)
  }

  const onCityChange = (data: any) => {
    setValue("city_id", data._id)
    setCityVal(data.name)
  }

  const onStateChange = (data: any) => {
    setValue("state_id", data._id)
    setStateVal(data.name)
  }

  return (
    <>
      <Head>
        {/* <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        /> */}
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addNewAddressPopUp)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <div className="page-wrapper">
          <Modal
            className="add-new-address-popup"
            open={isModal}
            onClose={toggleModal}
            dimmer={false}
            headerName={editMode ? "Edit Address" : "Add a New Address"}
          >
            <div className="modal-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-row form-content">
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label htmlFor="addressLine_1">Full Name</label>
                      <input
                        {...register("fullname", Validations.fullname)}
                        type="text"
                        name="fullname"
                        className="form-control"
                        id="fullname"
                      />
                      <FormValidationError
                        errors={errors}
                        name="fullname"
                      />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label htmlFor="addressLine_1">Address Line1</label>
                      <input
                        {...register("address_line1", Validations.addressLine)}
                        type="text"
                        name="address_line1"
                        className="form-control"
                        id="address_line1"
                      />
                      <FormValidationError
                        errors={errors}
                        name="address_line1"
                      />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label htmlFor="addressLine_2">Address Line2</label>
                      <input
                        {...register("address_line2", Validations.addressLine)}
                        type="text"
                        name="address_line2"
                        className="form-control"
                        id="address_line2"
                      />
                      <FormValidationError
                        errors={errors}
                        name="address_line2"
                      />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Select Country</label>
                      <DropdownWithSearch
                        {...register("country_id", Validations.country)}
                        name="country_id"
                        className="form-control"
                        id={'country_id'}
                        inputId="country_address"
                        placeholder="Enter Country Name"
                        url={APICONFIG.GET_ALL_COUNTRIES_LIST}
                        onChange={onCountryChange}
                        value={countryVal}
                        disable={true}
                        page={'address'}
                        label="country"
                      // editmode={editMode}
                      // filteredData={filteredData}
                      />

                      {/* <select
                        className="custom-select"
                        {...register("country_id", Validations.country)}
                      >
                        {countryData?.map((ele) => {
                          return (
                            <>
                              <option value={ele?._id}>{ele?.name}</option>
                            </>
                          );
                        })}
                      </select> */}
                      <FormValidationError errors={errors} name="country_id" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Select State</label>
                      <DropdownWithSearch
                        {...register("state_id", Validations.state)}
                        name="state_id"
                        className="form-control"
                        id={'state_id'}
                        inputId="state_id"
                        placeholder="Enter State"
                        url={APICONFIG.GET_ALL_STATE_LIST}
                        onChange={onStateChange}
                        value={stateVal}
                        disable={true}
                        page={'sign-up'}
                        countryId={getValues("country_id")}
                        label="state"
                      />

                      {/* <select
                        className="custom-select"
                        {...register("state_id", Validations.state)}
                      >
                        <option value="">Select State </option>

                        {stateData?.map((ele) => {
                          return (
                            <>
                              <option value={ele?._id}>{ele?.name}</option>
                            </>
                          );
                        })}
                      </select> */}
                      <FormValidationError errors={errors} name="state_id" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label>Select City</label>
                      <DropdownWithSearch
                        {...register("city_id", Validations.city)}
                        name="city_id"
                        className="form-control"
                        id={'city_id'}
                        inputId="city_id"
                        placeholder="Enter City"
                        url={APICONFIG.GET_CITY_NAME_API}
                        onChange={onCityChange}
                        value={cityVal}
                        disable={true}
                        page={'sign-up'}
                        countryId={getValues("country_id")}
                        stateId={getValues("state_id")}
                        label="city"
                      />

                      {/* <select
                        className="custom-select"
                        {...register("city_id", Validations.city)}
                      >
                              <option value="">Select City</option>

                        {cityData?.map((ele) => {
                          return (
                            <>
                              <option value={ele?._id}>{ele?.name}</option>
                            </>
                          );
                        })}
                      </select> */}
                      <FormValidationError errors={errors} name="city_id" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label htmlFor="Pincode">Pincode/Postcode</label>
                      <input
                        {...register("pincode", Validations.pincode)}
                        type="text"
                        name="pincode"
                        className="form-control"
                        id="pincode"
                      />
                      <FormValidationError errors={errors} name="pincode" />
                    </div>
                  </div>
                  <div className="d-col d-col-2">
                    <div className="form-group">
                      <label htmlFor="mobileNumber">Mobile Number</label>
                      <CountrySelect
                        setCountryContact={(d) => setCountryId(d)}
                        placeholder=""
                        page="address"
                        inputId={"mobile_number"}
                        country={selectCountry}
                        phoneNumberProp={
                          filteredData?.mobile_number ?? reduxData?.signIn?.userData?.user_detail?.mobile ?? ''
                        }
                        {...register("mobile_number", Validations.mobile)}
                      />
                      <FormValidationError
                        errors={errors}
                        name="mobile_number"
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className=" btn btn-primary">
                  {editMode ? "Update" : "Save"}
                </button>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};
export default AddEditAddress;
