import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { cilCheck, cilXCircle } from "@coreui/icons";

import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import { isEmpty } from "src/shared/handler/common-handler";
import Loader from "src/views/components/common/loader/loader";
import { PASSWORDERR } from "src/shared/constant/error-message";
import { EMAIL_REGEX, PASSWORD_REGEX, PHONENUMBER_REGEX, POSTAL_CODE_REGEX } from "src/shared/regex/regex";

const AddPatient = () => {
    let history = useHistory();
    const primaryHcpId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? '';
    const variableSet = {
        city: '',
        email: '',
        phone: '',
        state: '',
        country: '',
        password: '',
        lastName: '',
        firstName: '',
        postalCode: '',
        addressLine: '',
        hcp: adminRole !== "SUPER_ADMIN" ? primaryHcpId : '',
    };

    const { showError, showSuccess } = useToast();

    const [hcpData, setHcpData] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [masterForm, setMasterForm] = useState({ ...variableSet });
    const [errors, setErrors] = useState({ ...variableSet, hcp: '' });

    useEffect(() => {
        getHcpData();
        getCountryData();
    }, []);

    useEffect(() => {
        setCityList([]);
        setStateList([]);
        setMasterForm({ ...masterForm, city: '', state: '' });
        if (masterForm.country) getStateList(masterForm.country);
    }, [masterForm.country]);

    useEffect(() => {
        setCityList([]);
        setMasterForm({ ...masterForm, city: '' });
        if (masterForm.state) getCityList(masterForm.state);
    }, [masterForm.state]);

    const getHcpData = () => {
        API.getAccountDataByLoginId(getHcpDataResponseObj, null, true);
    }

    const getCountryData = () => {
        API.getDrpData(handleGetCountryListResponseObj, null, true, Constant.GET_ACTIVE_COUNTRY);
    }

    const handleGetCountryListResponseObj = {
        cancel: () => { },
        success: response => {
            let _countryData = [];
            if (response?.data?.length > 0) _countryData = response.data.filter(country => country);
            setCountryList([..._countryData]);
        },
        error: err => {
            console.log(err);
            setCountryList([]);
        },
        complete: () => { }
    }

    const handleHcpChange = e => {
        setErrors({ ...errors, hcp: '' });
        setMasterForm({ ...masterForm, hcp: e.target.value });
    }

    const getHcpDataResponseObj = {
        cancel: () => { },
        success: response => {
            let _hcpData = [];
            if (response?.meta?.status) _hcpData = response.data;
            setHcpData([..._hcpData]);
        },
        error: err => {
            console.log(err);
            setHcpData([]);
        },
        complete: () => { },
    }

    const getStateList = countryId => {
        const data = { country_id: countryId };
        API.getMasterList(handleGetStateListResponseObj, data, true, Constant.STATE_ACTIVE_LIST);
    }

    const handleGetStateListResponseObj = {
        cancel: () => { },
        success: response => {
            let _stateList = [];
            if (response?.meta?.status && response?.data?.length) _stateList = response.data;
            setStateList([..._stateList]);
        },
        error: err => {
            console.log(err);
            setStateList([]);
        },
        complete: () => { },
    }

    const getCityList = stateId => {
        const data = { state_id: stateId };
        API.getMasterList(handleGetCityListResponseObj, data, true, Constant.CITY_ACTIVE_LIST);
    }

    const handleGetCityListResponseObj = {
        cancel: () => { },
        success: response => {
            let _cityList = [];
            if (response?.meta?.status && response?.data?.length) _cityList = response.data;
            setCityList([..._cityList]);
        },
        error: err => {
            console.log(err);
            setCityList([]);
        },
        complete: () => { },
    }

    const getVariableTitle = key => {
        switch (key) {
            case "firstName":
                return "first name";
            case "lastName":
                return "last name";
            case "postalCode":
                return "postal code";
            case "addressLine":
                return "street address";
            case "hcp":
                return "HCP";
            case "phone":
                return "mobile no.";
            default:
                return key;
        }
    }

    const getRegexSet = key => {
        switch (key) {
            case "phone":
                return { expr: PHONENUMBER_REGEX, message: "Please enter a valid phone number." };
            case "email":
                return { expr: EMAIL_REGEX, message: "Please enter a valid email address." };
            case "password":
                return { expr: PASSWORD_REGEX, message: PASSWORDERR };
            case "postalCode":
                return {
                    expr: POSTAL_CODE_REGEX,
                    message: "Postal code must have only numbers and its length must lie between 5 & 6 (inclusive)"
                };
            default:
                return null;
        }
    }

    const handleValidation = () => {
        let _errors = {}, isFormValid = true, validationParams = [];
        for (const key in variableSet) {
            validationParams.push({
                key,
                value: masterForm[key],
                regexSet: getRegexSet(key),
                title: getVariableTitle(key),
            });
        }

        for (const { key, value, title, regexSet } of validationParams) {
            if (isEmpty(value)) {
                isFormValid = false;
                _errors[key] = `${title} is required`;
            } else if (regexSet && !isEmpty(value) && !regexSet?.expr?.test(value)) {
                isFormValid = false;
                _errors[key] = regexSet.message;
            }
        }

        setErrors({ ..._errors });
        return isFormValid;
    }

    const handleValueChange = e => {
        const { name, value } = e?.target ?? {};
        if (name) {
            setErrors({ ...errors, [name]: '' });
            setMasterForm({ ...masterForm, [name]: value });
        }
    }

    const handleCancel = e => {
        e.preventDefault();
        history.push("/patients");
    }

    const handleSubmit = e => {
        e.preventDefault()
        const hcpId = adminRole === "SUPER_ADMIN" ? masterForm.hcp : primaryHcpId;
        if (handleValidation()) {
            const data = {
                account_id: hcpId,
                city: masterForm.city,
                email: masterForm.email,
                state: masterForm.state,
                mobile: masterForm.phone,
                country: masterForm.country,
                password: masterForm.password,
                last_name: masterForm.lastName,
                first_name: masterForm.firstName,
                postal_code: masterForm.postalCode,
                street_address: masterForm.addressLine,
            };

            setIsLoading(true);
            API.addMaster(handleSubmitPatientAddResponseObj, data, true, Constant.PATIENT_ADD);
        }
    }

    const handleSubmitPatientAddResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                setTimeout(() => { history.push("/patients"); }, 1000);
            }
        },
        error: (err) => {
            setIsLoading(false);
            if (err.errors) Object.values(err.errors).map(err => { if (err) showError(err); });
            else if (err?.meta?.message) showError(err.meta.message);
            else showError("Something went wrong!");
        },
        complete: () => { },
    }

    const accountDataTemplate = option => {
        return <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>;
    }

    const countryOptionTemplate = option => {
        return (
            <div className="country-item">
                {/* <img alt="flag" src={option?.country_flag?.[0]?.path ?? ''} /> */}
                <div>{option?.name ?? ''}</div>
            </div>
        );
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Add Patient</h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row">
                            {
                                adminRole === "SUPER_ADMIN" && (
                                    <div className="col-md-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                filter
                                                optionValue="_id"
                                                options={hcpData}
                                                value={masterForm.hcp}
                                                className="form-control"
                                                optionLabel="company_name"
                                                onChange={handleHcpChange}
                                                filterBy="company_name,code"
                                                itemTemplate={accountDataTemplate}
                                                valueTemplate={accountDataTemplate}
                                                disabled={adminRole !== "SUPER_ADMIN"}
                                            />
                                            <label>HCP<span className="text-danger">*</span></label>
                                        </span>

                                        <p className="error">{errors["hcp"]}</p>
                                    </div>
                                )
                            }
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        name="firstName"
                                        className="form-control"
                                        onChange={handleValueChange}
                                        value={masterForm.firstName}
                                    />
                                    <label>First Name<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.firstName ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        name="lastName"
                                        className="form-control"
                                        value={masterForm.lastName}
                                        onChange={handleValueChange}
                                    />
                                    <label>Last Name<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.lastName ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        name="email"
                                        className="form-control"
                                        value={masterForm.email}
                                        onChange={handleValueChange}
                                    />
                                    <label>Email<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.email ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        name="phone"
                                        className="form-control"
                                        value={masterForm.phone}
                                        onChange={handleValueChange}
                                    />
                                    <label>Mobile<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.phone ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        name="addressLine"
                                        className="form-control"
                                        onChange={handleValueChange}
                                        value={masterForm.addressLine}
                                    />
                                    <label>Street Address<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.addressLine ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        filter
                                        name="country"
                                        optionValue="_id"
                                        optionLabel="name"
                                        options={countryList}
                                        className="form-control"
                                        value={masterForm.country}
                                        onChange={handleValueChange}
                                        filterBy="country_code,name"
                                        itemTemplate={countryOptionTemplate}
                                    />
                                    <label>Country<span className="text-danger">*</span></label>
                                </span>

                                <p className="error">{errors?.country ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        filter
                                        name="state"
                                        optionValue="_id"
                                        optionLabel="name"
                                        options={stateList}
                                        filterBy="name,code"
                                        className="form-control"
                                        value={masterForm.state}
                                        onChange={handleValueChange}
                                    />
                                    <label>State<span className="text-danger">*</span></label>
                                </span>

                                <p className="error">{errors?.state ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        filter
                                        name="city"
                                        optionValue="_id"
                                        options={cityList}
                                        optionLabel="name"
                                        filterBy="name,code"
                                        value={masterForm.city}
                                        className="form-control"
                                        onChange={handleValueChange}
                                    />
                                    <label>City<span className="text-danger">*</span></label>
                                </span>

                                <p className="error">{errors?.city ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        name="postalCode"
                                        className="form-control"
                                        onChange={handleValueChange}
                                        value={masterForm.postalCode}
                                    />
                                    <label>Postal Code<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.postalCode ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Password
                                        toggleMask
                                        name="password"
                                        className="form-control"
                                        value={masterForm.password}
                                        onChange={handleValueChange}
                                    />

                                    <label>Password<span className="text-danger">*</span></label>
                                </span>

                                <p className="error">{errors?.password ?? ''}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                            <CIcon icon={cilCheck} />Save
                        </button>

                        <button className="btn btn-danger mb-2" onClick={handleCancel}>
                            <CIcon icon={cilXCircle} className="mr-1" />Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddPatient;
