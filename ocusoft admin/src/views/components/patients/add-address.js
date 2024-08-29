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
import * as Regex from "../../../shared/regex/regex";
import { useForm } from "react-hook-form";
import { Message } from "src/shared/messages/errorMessage";
import FormValidationError from "src/shared/validator/FormValidationError";
import { API } from "src/services/Api";
import { Checkbox } from "primereact/checkbox";
import Loader from "../common/loader/loader";
import { useToast } from "src/shared/toaster/Toaster";

const AddAddress = ({ close, id, completed }) => {
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const defaultValues = {
        user_id: id,
        first_name: "",
        last_name: "",
        mobile_number: "",
        address: "",
        country_id: "",
        state_id: "",
        city_id: "",
        pincode: "",
        is_default_shipped: 0,
        is_default_billing: 0
    }
    const [countryData, setCountryData] = useState({
        countries: [],
        states: [],
        cities: [],
    })
    const [country, setCountry] = useState({
        country_id: '',
        state_id: '',
        city_id: '',
    })
    const [checkbox, setCheckbox] = useState({
        is_default_shipped: false,
        is_default_billing: false,
    })

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors , touchedFields},
    } = useForm({ defaultValues });

    const Validations = {
        first_name: {
            required: Message.FIRSTNAME_REQUIRED,
            pattern: {
                value: Regex?.ONLY_CHARACTERS,
                message: Message.ALLOW_ONLY_CHARACTERS,
            },
        },
        last_name: {
            required: Message.LASTNAME_REQUIRED,
            pattern: {
                value: Regex?.ONLY_CHARACTERS,
                message: Message.ALLOW_ONLY_CHARACTERS,
            },
        },
        mobile_number: {
            required: Message.MOBILENUMBER_REQUIRED,
            pattern: {
                value: Regex?.PHONENUMBER_REGEX,
                message: Message.MOBILE_PATTERN,
            },
        },
        country_id: {
            required: Message.COUNTRY_REQUIRED,
        },
        state_id: {
            required: Message.STATE_REQUIRED,
        },
        city_id: {
            required: Message.CITY_REQUIRED,
        },
        address: {
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
        setIsLoading(true)
        API.addAddress(addAdress, data, true);
    };

    const addAdress = {
        cancel: () => {
            setIsLoading(false)
        },
        success: (response) => { // NOSONAR
            setIsLoading(false)
            if (response.meta.status_code === 201) {
                close()
                showSuccess(response.meta?.message)
                completed()
                return
            }
            showError(response.meta?.message)
        },
        error: err => {
            console.log(err);
            setIsLoading(false)
            showError('Failed to create an address, try again.')
        },
        complete: () => {
        },
    }

    const handleCountryChange = e => {
        setCountry({ ...country, country_id: e.value, state_id: '', city_id: '' });
        setCountryData({ ...countryData, cities: [] })
        setValue('country_id', e.value)
        setValue('state_id', '')
        setValue('city_id', '')
    }

    const handleStateChange = e => {
        setCountry({ ...country, state_id: e.value, city_id: '' });
        setCountryData({ ...countryData, cities: [] })
        setValue('state_id', e.value)
        setValue('city_id', '')
    }

    const handleCityChange = e => {
        setCountry({ ...country, city_id: e.value });
        setValue('city_id', e.value)
    }

    useEffect(() => {
        getCountryData()
    }, [])

    const getCountryData = async () => {
        API.getCountryList(getCountry, { for_phonecode: 1 }, true);
    };

    const getCountry = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            if (response.meta.status_code === 200) {
                let result = response.data
                if (!result?.length) {
                    return
                }
                setCountryData({
                    ...countryData,
                    countries: result?.map((country) => ({
                        value: country._id,
                        label: country.name
                    }))
                });
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => {
        },
    }

    useEffect(() => {
        if (!getValues('country_id')) {
            return
        }
        getStateData()
    }, [getValues('country_id')])

    const getStateData = async () => {
        API.getStateList(getState, { country_id: getValues('country_id') }, true);
    };

    const getState = {
        cancel: () => {
        },
        success: (response) => { // NOSONAR
            if (response.meta.status_code === 200) {
                let result = response.data
                if (!result?.length) {
                    return
                }
                setCountryData({
                    ...countryData,
                    states: result?.map((country) => ({
                        value: country._id,
                        label: country.name
                    }))
                });
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => {
        },
    }

    useEffect(() => {
        if (!getValues('state_id')) {
            return
        }
        getCityData()
    }, [getValues('state_id')])

    const getCityData = async () => {
        API.getCityList(getCity, { country_id: getValues('country_id'), state_id: getValues('state_id') }, true);
    };

    const getCity = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            if (response.meta.status_code === 200) {
                let result = response.data
                if (!result?.length) {
                    return
                }
                setCountryData({
                    ...countryData,
                    cities: result?.map((country) => ({
                        value: country._id,
                        label: country.name
                    }))
                });
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => {
        },
    }

    return (
        <CModal scrollable visible size="lg">
            <CModalHeader>
                <h2>Add Address</h2>
                <CCloseButton onClick={e => { e.preventDefault(); close() }}></CCloseButton>
            </CModalHeader>

            <CModalBody>
                {isLoading && <Loader />}
                <form name="subMasterFrm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Add Address </h5>
                        </div>
                        <div className="card-body">
                            <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <div className="p-inputgroup custom-inputgroup">
                                        <span className="p-float-label custom-p-float-label display-count">
                                            <InputText
                                                {...register("first_name", Validations.first_name)}
                                                className="form-control"
                                                name="first_name"
                                                id="first_name"
                                                onChange={register("first_name").onChange}
                                            />
                                            <label>First Name<span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                    <FormValidationError errors={errors} name="first_name" />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <div className="p-inputgroup custom-inputgroup">
                                        <span className="p-float-label custom-p-float-label display-count">
                                            <InputText
                                                {...register("last_name", Validations.last_name)}
                                                className="form-control"
                                                name="last_name"
                                                onChange={register("last_name").onChange}
                                            />
                                            <label>Last Name<span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                    <FormValidationError errors={errors} name="last_name" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-inputgroup custom-inputgroup">
                                        <span className="p-float-label custom-p-float-label display-count">
                                            <InputText
                                                {...register("mobile_number", Validations.mobile_number)}
                                                className="form-control"
                                                name="mobile_number"
                                                onChange={register("mobile_number").onChange}
                                            />
                                            <label>Phone Number<span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                    <FormValidationError errors={errors} name="mobile_number" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-inputgroup custom-inputgroup">
                                        <span className="p-float-label custom-p-float-label display-count">
                                            <InputText
                                                {...register("address", Validations.address)}
                                                className="form-control"
                                                name="address"
                                                onChange={register("address").onChange}
                                            />
                                            <label>Address<span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                    <FormValidationError errors={errors} name="address" />
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
                                            options={countryData?.countries}
                                            value={country?.country_id}
                                            onChange={handleCountryChange}
                                        />
                                        <label>Country<span className="text-danger">*</span></label>
                                    </span>
                                    {
                                        !getValues('country_id') &&
                                        <FormValidationError errors={errors} name="country_id" />
                                    }
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
                                            options={countryData?.states}
                                            value={country?.state_id}
                                            onChange={handleStateChange}
                                        />
                                        <label>State/Province<span className="text-danger">*</span></label>
                                    </span>
                                    {
                                        !getValues('state_id') &&
                                        <FormValidationError errors={errors} name="state_id" />
                                    }
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
                                            options={countryData?.cities}
                                            value={country?.city_id}
                                            onChange={handleCityChange}
                                        />
                                        <label>City<span className="text-danger">*</span></label>
                                    </span>
                                    {
                                        !getValues('city_id') &&
                                        <FormValidationError errors={errors} name="city_id" />
                                    }
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="p-inputgroup custom-inputgroup">
                                        <span className="p-float-label custom-p-float-label display-count">
                                            <InputText
                                                {...register("pincode", Validations.pincode)}
                                                className="form-control"
                                                name="pincode"
                                                onChange={register("pincode").onChange}
                                            />
                                            <label>Zip/Postal Code<span className="text-danger">*</span></label>
                                        </span>
                                    </div>
                                    <FormValidationError errors={errors} name="pincode" />
                                </div>

                                <div className="col-md-6 mb-3 d-flex align-items-center custom-checkbox">
                                    <Checkbox
                                        checked={checkbox.is_default_shipped}
                                        name="showToMicrosite"
                                        onChange={e => {
                                            setValue('is_default_shipped', e.checked ? 1 : 0); setCheckbox({
                                                ...checkbox,
                                                is_default_shipped: e?.checked
                                            })
                                        }}
                                    />
                                    <label className="checkbox-label-with-space">Use as a default shipping address</label>
                                </div>
                                <div className="col-md-6 mb-3 d-flex align-items-center custom-checkbox">
                                    <Checkbox
                                        checked={checkbox.is_default_billing}
                                        name="showToMicrosite"
                                        onChange={e => {
                                            setValue('is_default_billing', e.checked ? 1 : 0); setCheckbox({
                                                ...checkbox,
                                                is_default_billing: e?.checked
                                            })
                                        }}
                                    />
                                    <label className="checkbox-label-with-space">Use as a default billing address</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary mb-2 mr-2"><CIcon icon={cilCheck} />Save</button>
                        </div>
                    </div>
                </form>
            </CModalBody>
        </CModal>
    );
};

export default AddAddress;
