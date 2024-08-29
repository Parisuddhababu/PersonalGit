import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import React, { useEffect, useState } from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";
import { cilCheck } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import * as Regex from "../../../../shared/regex/regex";
import { useForm } from "react-hook-form";
import { Message } from "src/shared/messages/errorMessage";
import FormValidationError from "src/shared/validator/FormValidationError";
import { API } from "src/services/Api";
import Loader from "../../common/loader/loader";
import { useToast } from "src/shared/toaster/Toaster";

const UpdateAddress = ({ close, id, completed, address }) => {
  const { showError, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues] = useState({
    account_id: id,
    address_line1: address?.address_line1, //NOSONAR
    country_id: address?.country?._id, //NOSONAR
    state_id: address?.state?._id, //NOSONAR
    city_id: address?.city?._id, //NOSONAR
    pincode: address?.pincode, //NOSONAR
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState({
    country_id: "",
    state_id: "",
    city_id: "",
  });
  const [initial, setInitial] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const Validations = {
    country_id: {
      required: Message.COUNTRY_REQUIRED,
    },
    state_id: {
      required: Message.STATE_REQUIRED,
    },
    city_id: {
      required: Message.CITY_REQUIRED,
    },
    address_line1: {
      required: Message.ADDRESS_REQUIRED,
    },
    pincode: {
      required: Message.PINCODE_REQUIRED,
      pattern: {
        value: Regex?.PINCODE_REGEX2,
        message: Message.PINCODE_REGEX_MESSAGE,
      },
    },
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    API.updateHcpAddress(updateAddress, data, true, address?._id); //NOSONAR
  };

  const updateAddress = {
    cancel: () => {
      setIsLoading(false);
    },
    success: (response) => {
      // NOSONAR
      setIsLoading(false);
      if (response.meta.status_code === 200) {
        close();
        showSuccess(response.meta?.message);
        completed();
        return;
      }
      showError(response.meta?.message);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      showError("Failed to Update an address, try again.");
    },
    complete: () => {},
  };

  const handleCountryChange = (e) => {
    setCountry({ ...country, country_id: e.value, state_id: "", city_id: "" });
    setCities([]);
    setValue("country_id", e.value);
    setValue("state_id", "");
    setValue("city_id", "");
  };

  const handleStateChange = (e) => {
    setCountry({ ...country, state_id: e.value, city_id: "" });
    setCities([]);
    setValue("state_id", e.value);
    setValue("city_id", "");
  };

  const handleCityChange = (e) => {
    setCountry({ ...country, city_id: e.value });
    setValue("city_id", e.value);
  };

  useEffect(() => {
    getCountryData();
  }, []);

  const getCountryData = async () => {
    API.getCountryList(getCountry, { for_phonecode: 1 }, true);
  };

  const getCountry = {
    cancel: () => {},
    success: (response) => {
      // NOSONAR
      if (response.meta.status_code === 200) {
        let result = response.data;
        if (!result?.length) {
          return;
        }
        if (!initial) {
          setCountry({
            ...country,
            country_id: address?.country?._id, //NOSONAR
          });
        }
        setCountries(
          result?.map((country) => ({
            value: country._id,
            label: country.name,
          }))
        );
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  };

  useEffect(() => {
    if (!country?.country_id) {
      return;
    }
    getStateData();
  }, [country?.country_id]);

  const getStateData = async () => {
    API.getStateList(getState, { country_id: country?.country_id }, true);
  };

  const getState = {
    cancel: () => {},
    success: (response) => {
      // NOSONAR
      if (response.meta.status_code === 200) {
        let result = response.data;
        if (!result?.length) {
          return;
        }
        if (!initial) {
          setCountry({
            ...country,
            state_id: address?.state?._id, //NOSONAR
          });
        }

        setStates(
          result?.map((country) => ({
            value: country._id,
            label: country.name,
          }))
        );
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  };

  useEffect(() => {
    if (!country?.state_id) {
      return;
    }
    getCityData();
  }, [country?.state_id]);

  const getCityData = async () => {
    API.getCityList(
      getCity,
      { country_id: country?.country_id, state_id: country?.state_id },
      true
    );
  };

  const getCity = {
    cancel: () => {},
    success: (response) => {
      // NOSONAR
      if (response.meta.status_code === 200) {
        let result = response.data;
        if (!result?.length) {
          return;
        }
        if (!initial) {
          setCountry({
            ...country,
            city_id: address?.city?._id, //NOSONAR
          });
          setInitial(true);
        }
        setCities(
          result?.map((country) => ({
            value: country._id,
            label: country.name,
          }))
        );
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  };
  return (
    <CModal scrollable visible size="lg">
      <CModalHeader>
        <h2>Update Address</h2>
        <CCloseButton
          onClick={(e) => {
            e.preventDefault();
            close();
          }}
        ></CCloseButton>
      </CModalHeader>

      <CModalBody>
        {isLoading && <Loader />}
        <form name="subMasterFrm" onSubmit={handleSubmit(onSubmit)}>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Update Address </h5>
            </div>
            <div className="card-body">
              <p className="col-sm-12 text-right">
                Fields marked with <span className="text-danger">*</span> are
                mandatory.
              </p>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <span className="p-float-label custom-p-float-label display-count">
                    <InputText
                      className="form-control"
                      name="title"
                      {...register("address_line1", Validations.address_line1)}
                    />
                    <label>
                      Address<span className="text-danger">*</span>
                    </label>
                  </span>
                  <FormValidationError errors={errors} name="address_line1" />
                </div>
                <div className="col-md-6 mb-3">
                  <span className="p-float-label custom-p-float-label display-count">
                    <Dropdown
                      {...register("country_id", Validations.country_id)}
                      filter
                      optionValue="value"
                      optionLabel="label"
                      name="prescriptionType"
                      className="form-control"
                      options={countries}
                      value={country?.country_id}
                      onChange={handleCountryChange}
                    />
                    <label>
                      Country<span className="text-danger">*</span>
                    </label>
                  </span>
                  {!getValues("country_id") && (
                    <FormValidationError errors={errors} name="country_id" />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <span className="p-float-label custom-p-float-label display-count">
                    <Dropdown
                      {...register("state_id", Validations.state_id)}
                      filter
                      optionValue="value"
                      optionLabel="label"
                      name="prescriptionType"
                      className="form-control"
                      options={states}
                      value={country?.state_id}
                      onChange={handleStateChange}
                    />
                    <label>
                      State/Province<span className="text-danger">*</span>
                    </label>
                  </span>
                  {!getValues("state_id") && (
                    <FormValidationError errors={errors} name="state_id" />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <span className="p-float-label custom-p-float-label display-count">
                    <Dropdown
                      {...register("city_id", Validations.city_id)}
                      filter
                      optionValue="value"
                      optionLabel="label"
                      name="prescriptionType"
                      className="form-control"
                      options={cities}
                      value={country?.city_id}
                      onChange={handleCityChange}
                    />
                    <label>
                      City<span className="text-danger">*</span>
                    </label>
                  </span>
                  {!getValues("city_id") && (
                    <FormValidationError errors={errors} name="city_id" />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <span className="p-float-label custom-p-float-label display-count">
                    <InputText
                      className="form-control"
                      name="title"
                      {...register("pincode", Validations.pincode)}
                    />
                    <label>
                      Zip/Postal Code<span className="text-danger">*</span>
                    </label>
                  </span>
                  <FormValidationError errors={errors} name="pincode" />
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary mb-2 mr-2">
                <CIcon icon={cilCheck} />
                Update
              </button>
            </div>
          </div>
        </form>
      </CModalBody>
    </CModal>
  );
};

export default UpdateAddress;
