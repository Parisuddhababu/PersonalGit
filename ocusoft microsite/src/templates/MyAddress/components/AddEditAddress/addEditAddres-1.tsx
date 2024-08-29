import React, { useCallback, useEffect, useState } from "react";
import {
  IAddEditAddressForm,
  IAddEditAddressProps,
} from "@templates/MyAddress/components/AddEditAddress/index";
import { SubmitHandler, useForm } from "react-hook-form";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { setLoader } from "src/redux/loader/loaderAction";
import { useDispatch } from "react-redux";
import { Message } from "@constant/errorMessage";
import { ONLY_CHARACTERS, PHONENUMBER_REGEX, PINCODE_REGEX } from "@constant/regex";
import FormValidationError from "@components/FormValidationError";
import Select from 'react-select';
import ErrorHandler from "@components/ErrorHandler";
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ICountryStateChange } from "@templates/SignUp/components/SIgnUpForm";
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: '30px',
    fontFamily: 'Calibri',
    fontWeight: 500,
    fontSize: '17.5px',
    lineHeight: '18px',
    border: '1px solid var(--data_site_gray_color)',
    width: '100%',
    padding: '5px 5px',
    outline: 0,
    color: 'var(--data_site_gray_color)',
  }),
};

const AddEditAddress = ({
  onClose,
  idOfAddress,
  editMode,
  showOption,
  filteredData,
  setFormEditMode,
  billingAddressId,
  shippingAdressId,
  onComplete
}: IAddEditAddressProps) => {
  const [defaultValues] = useState({
    first_name: "",
    last_name: "",
    country_id: "",
    city_id: "",
    mobile_number: "",
    pincode: "",
    state_id: "",
    address: "",
    is_default_shipped: 0,
    is_default_billing: 0
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IAddEditAddressForm>({ defaultValues });
  const [countryData, setCountryData] = useState<ICountryStateChange[]>([]);
  const [stateData, setStateData] = useState<ICountryStateChange[]>([]);
  const [cityData, setCityData] = useState<ICountryStateChange[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountryStateChange>();
  const [selectedState, setSelectedState] = useState<ICountryStateChange | null>();
  const [selectedCity, setSelectedCity] = useState<ICountryStateChange | null>();
  const dispatch = useDispatch();
  const { makeDynamicFormDataAndPostData } = usePostFormDataHook();
  const router = useRouter();

  //validations
  const Validations = {
    first_name: {
      required: Message.FIRSTNAME_REQUIRED,
      pattern: {
        value: ONLY_CHARACTERS,
        message: Message.ALLOW_ONLY_CHARACTERS,
      },
    },
    last_name: {
      required: Message.LASTNAME_REQUIRED,
      pattern: {
        value: ONLY_CHARACTERS,
        message: Message.ALLOW_ONLY_CHARACTERS,
      },
    },
    country_id: {
      required: Message.COUNTRY_REQUIRED,
    },
    city_id: {
      required: Message.CITY_REQUIRED,
    },
    mobile_number: {
      required: Message.MOBILENUMBER_REQUIRED,
      pattern: {
        value: PHONENUMBER_REGEX,
        message: Message.MOBILE_PATTERN,
      },
    },
    state_id: {
      required: Message.STATE_REQUIRED,
    },
    pincode: {
      required: Message.PINCODE_REQUIRED,
      pattern: {
        value: PINCODE_REGEX,
        message: Message.PINCODE_REGEX_MESSAGE,
      },
    },
    address: {
      required: Message.ADDRESS_REQUIRED,
    },
  };


  //on country change handler
  const onCountryChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("country_id", data?.value);
      setSelectedCountry(data);
      setValue("state_id", '');
      setSelectedState(null);
      setValue("city_id", '');
      setValue("pincode", '');
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  //on state change handler
  const onStateChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("state_id", data?.value);
      setSelectedState(data);
      setValue("city_id", '');
      setValue("pincode", '');
      setSelectedCity(null);
    }
  }, [selectedState]);

  //on city change handler
  const onCityChange = useCallback((data: ICountryStateChange | null) => {
    if (data) {
      setValue("city_id", data?.value);
      setValue("pincode", '');
      setSelectedCity(data);
    }
  }, [selectedCity]);

  //get country
  const getCountryData = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_COUNTRY, { for_phonecode: 1 })
      .then((result) => {
        if (result?.data?.country_list?.length) {
          setCountryData(result?.data?.country_list?.map((country: { _id: string, name: string }) => ({
            value: country._id,
            label: country.name
          })));
        }
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  //get state
  const getStateData = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_ALL_STATE_LIST, { country_id: selectedCountry?.value })
      .then((result) => {
        setStateData(result?.data?.state_list?.map((country: { _id: string, name: string }) => ({
          value: country._id,
          label: country.name
        })));
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  //get city
  const getCityData = async () => {
    setLoader(true);
    await pagesServices
      .postPage(APICONFIG.GET_CITY_NAME_API, { country_id: selectedCountry?.value, state_id: selectedState?.value })
      .then((result) => {
        setCityData(result.data.city_list.map((city: { _id: string, name: string }) => ({
          value: city._id,
          label: city.name
        })));
      })
  }


  useEffect(() => {
    getCountryData();
  }, [])

  useEffect(() => {
    if (selectedCountry?.value) {
      getStateData();
    }
  }, [selectedCountry,])

  useEffect(() => {
    getCityData();
  }, [selectedState])
  //add adress submit handler
  const addModeSubmitHandler = async (data: IAddEditAddressForm) => {
    const country_id_var = selectedCountry?.value;
    const responceData = makeDynamicFormDataAndPostData(
      { ...data, country_id: country_id_var },
      APICONFIG.CREATE_ADDRESS_BOOK
    );
    responceData
      ?.then((resp) => {
        toggleModal();
        dispatch(setLoader(false));
        if (resp?.data && resp?.meta) {
          if (!showOption) {
            router.push("/user-address-book");
          }
          onComplete()
          toast.success(resp?.meta?.message);

        } else {
          toggleModal();
          ErrorHandler(resp, toast.error);
        }
      })
      .catch((err) => {
        dispatch(setLoader(false));
        ErrorHandler(err, toast.error);
      });
  }
  //edit address submit handler
  const editModeSubmitHandler = async (idOfAddress: string, data: IAddEditAddressForm) => {
    const country_id_var = selectedCountry?.value;
    await pagesServices
      .updateAddressBook(
        idOfAddress,
        { ...data, country_id: country_id_var }
      )
      .then((res) => {
        dispatch(setLoader(false));
        toast.success(res?.meta?.message);
        toggleModal();
        onComplete()
        if (!showOption) {
          router.push("/user-address-book");
        }
      })
      .catch((err) => {
        toggleModal();
        dispatch(setLoader(false));
        ErrorHandler(err, toast.success);
      });
  }
  //edit billing adress handler
  const editBillingHandler = async (billingAddressId: string, data: IAddEditAddressForm) => {
    const country_id_var = selectedCountry?.value;
    await pagesServices
      .updateBillingShippingAddressBook(
        billingAddressId,
        { ...data, country_id: country_id_var }
      )
      .then((res) => {
        dispatch(setLoader(false));
        toast.success(res?.meta?.message);
        toggleModal();
        if (!showOption) {
          router.push("/user-address-book");
        }
      })
      .catch((err) => {
        toggleModal();
        ErrorHandler(err, toast.error);
        dispatch(setLoader(false));
      });
  }
  //edit shipping adress handler
  const editShippingHandler = async (shippingAddressId: string, data: IAddEditAddressForm) => {
    const country_id_var = selectedCountry?.value;
    await pagesServices
      .updateBillingShippingAddressBook(
        shippingAddressId,
        { ...data, country_id: country_id_var }
      )
      .then((res) => {
        dispatch(setLoader(false));
        toast.success(res?.meta?.message);
        toggleModal();
        if (!showOption) {
          router.push("/user-address-book");
        }
      })
      .catch((err) => {
        toggleModal();
        ErrorHandler(err, toast.error);
        dispatch(setLoader(false));
      });
  }

  //submit handler for add edit
  const onSubmit: SubmitHandler<IAddEditAddressForm> = async (data) => {
    dispatch(setLoader(true));
    const body = {
      ...data,
      is_default_billing: !data?.is_default_billing ? 0 : 1,
      is_default_shipped: !data?.is_default_shipped ? 0 : 1
    }
    if (editMode) {
      if (idOfAddress) {
        editModeSubmitHandler(idOfAddress, body)
      }
      if (billingAddressId) {
        editBillingHandler(billingAddressId, body)
      }
      if (shippingAdressId) {
        editShippingHandler(billingAddressId!, body)
      }
    } else {
      addModeSubmitHandler(body)
    }
  };

  //initialise data for edit
  const initializeData = () => {
    setValue('first_name', filteredData?.first_name as string);
    setValue('last_name', filteredData?.last_name as string);
    setValue('mobile_number', filteredData?.mobile_number as string);
    setValue('pincode', filteredData?.pincode as string);
    setValue('address', filteredData?.address as string);
    setSelectedCountry({ value: filteredData?.country?.country_id!, label: filteredData?.country?.name })
    setSelectedState({ value: filteredData?.state?.state_id!, label: filteredData?.state?.name });
    setSelectedCity({ value: filteredData?.city?.city_id!, label: filteredData?.city?.name })
    setValue("city_id", filteredData?.city?.city_id!);
    setValue('state_id', filteredData?.state?.state_id!);
    setValue('country_id', filteredData?.country?.country_id!);
    setValue('is_default_billing', filteredData?.is_default_billing!)
    setValue('is_default_shipped', filteredData?.is_default_shipped!)
  };

  useEffect(() => {
    if (editMode) {
      initializeData();
    }
    return () => {
      setFormEditMode();
    };
  }, [editMode]);

  const toggleModal = () => {
    onClose();
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.modalPopup)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addressPopup)}
        />
      </Head>

      <section className="modal modal-active new-address-popup">
        <div className="modal-container add-new-address-form-wrap">
          <form onSubmit={handleSubmit(onSubmit)} className="add-new-address-form">
            <h3 className="modal-header">
              {editMode ? "Edit Address" : "Add a New Address"}
              <em
                className="osicon-close close-btn"
                role="button"
                aria-label="close-btn"
                onClick={onClose}
              ></em>
            </h3>
            <div className="modal-content">
              <div className="row">
                <div className="d-col form-group">
                  <label className="control-label">First Name*</label>
                  <input
                    {...register("first_name", Validations.first_name)}
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="Enter first name"
                    className="form-control" />
                  <FormValidationError errors={errors} name="first_name" />
                </div>
                <div className="d-col form-group">
                  <label className="control-label">Last Name*</label>
                  <input
                    {...register("last_name", Validations.last_name)}
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Enter last name"
                    className="form-control" />
                  <FormValidationError errors={errors} name="last_name" />
                </div>
                <div className="d-col form-group">
                  <label className="control-label">Phone Number*</label>
                  <input
                    {...register("mobile_number", Validations.mobile_number)}
                    type="text"
                    name="mobile_number"
                    id="userMobile"
                    placeholder="Enter Phone Number"
                    className="form-control" />
                  <FormValidationError errors={errors} name="mobile_number" />
                </div>
                <div className="d-col form-group">
                  <label className="control-label">Address*</label>
                  <input
                    {...register("address", Validations.address)}
                    type="text"
                    name="address" id="address" placeholder="Enter your address" className="form-control" />
                  <FormValidationError errors={errors} name="address" />
                </div>
                <div className="d-col form-group">
                  <label className="control-label">Country*</label>
                  <Select
                    {...register("country_id", Validations.country_id)}
                    placeholder="Enter Country Name"
                    id="country_id"
                    name="country_id"
                    styles={customStyles}
                    value={selectedCountry}
                    onChange={onCountryChange}
                    options={countryData} />
                  {
                    !getValues('country_id') &&
                    <FormValidationError errors={errors} name="country_id" />
                  }
                </div>
                <div className="d-col form-group">
                  <label className="control-label">State/Province*</label>
                  <Select
                    {...register("state_id", Validations.state_id)}
                    placeholder="Enter State"
                    styles={customStyles}
                    id="state_id"
                    name="state_id"
                    value={selectedState}
                    onChange={onStateChange}
                    options={stateData} />
                  {
                    !getValues('state_id') &&
                    <FormValidationError errors={errors} name="state_id" />
                  }
                </div>
                <div className="d-col form-group">
                  <label className="control-label">City*</label>
                  <Select
                    {...register("city_id", Validations.city_id)}
                    placeholder="Enter city"
                    styles={customStyles}
                    id="city_id"
                    name="city_id"
                    value={selectedCity}
                    onChange={onCityChange}
                    options={cityData} />
                  {
                    !getValues('city_id') &&
                    <FormValidationError errors={errors} name="city_id" />
                  }
                </div>
                <div className="d-col form-group">
                  <label className="control-label">Zip/Postal Code*</label>
                  <input
                    {...register("pincode", Validations.pincode)}
                    type="text"
                    name="pincode" id="pincode" placeholder="Enter your Zip Code" className="form-control" />
                  <FormValidationError errors={errors} name="pincode" />
                </div>
                {
                  !editMode &&
                  <div className="add-new-address-bottom d-col">
                    <div className="checkboxes-wrap">
                      <div className="ocs-checkbox">
                        <input {...register("is_default_billing")}
                          name="is_default_billing"
                          type="checkbox"
                          className="form-control"
                          id="is_default_billing"
                          onChange={(e) => {
                            setValue('is_default_billing', e.target.checked ? 1 : 0);
                          }}
                        />
                        <label htmlFor="is_default_billing">
                          Use as a default billing address
                        </label>
                      </div>
                      <div className="ocs-checkbox">
                        <input {...register("is_default_shipped")}
                          name="is_default_shipped"
                          type="checkbox"
                          className="form-control"
                          id="is_default_shipped"
                          onChange={(e) => {
                            setValue('is_default_shipped', e.target.checked ? 1 : 0);
                          }}
                        />
                        <label htmlFor="is_default_shipped">
                          Use as a default shipping address
                        </label>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div className="modal-footer">
              <div className="address-submit-btn">
                <button
                  type="submit"
                  className="btn btn-primary"
                  typeof="save-address"
                  aria-label="save-address-btn"
                >{editMode ? "Update" : "save address"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default AddEditAddress;


