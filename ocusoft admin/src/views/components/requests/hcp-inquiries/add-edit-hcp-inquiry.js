import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import ReCaptcha from "react-google-recaptcha";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { cilCheck, cilXCircle } from "@coreui/icons";
import { InputTextarea } from "primereact/inputtextarea";
import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import { API } from "src/services/Api";
import * as Regex from "src/shared/regex/regex";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";

const AddEditHcpInquiry = () => {
    const search = useLocation().search;
    const { showError, showSuccess } = useToast();
    const id = new URLSearchParams(search).get("id");
    const reCaptchaRef = useRef(null), history = useHistory();
    const initialFormInputs = { name: '', email: '', country: '', message: '' };

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [showSubmit, setShowSubmit] = useState(false);
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [formInputs, setFormInputs] = useState({ ...initialFormInputs });

    useEffect(() => {
        getCountryData();
        if (id) getInquiryDetails();
    }, []);

    useEffect(() => {
        if (id && countryList?.length && formInputs.country) {
            const _countryName = countryList.find(country => country._id === formInputs.country)?.name ?? '';
            setSelectedCountryName(_countryName);
        }
    }, [countryList, formInputs.country]);

    const handleFormInputChange = e => {
        const key = e.target.name;
        const value = e.target.value;
        setFormInputs({ ...formInputs, [key]: value });
        setErrors({ ...errors, [key]: '' });
    }

    const getCountryData = () => {
        setIsLoading(true);
        API.getDrpData(handleCountryListResponse, null, true, Constant.GET_ACTIVE_COUNTRY);
    }

    const handleCountryListResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            let _countryList = [];
            if (response?.data?.length) _countryList = response.data.filter(country => country);
            setCountryList([..._countryList]);
        },
        error: err => {
            setIsLoading(false);
            setCountryList([]);
            console.log(err);
        },
        complete: () => { }
    }

    const getInquiryDetails = () => {
        setIsLoading(true);
        API.getDrpData(handleGetInquiryDetailsResponseObj, null, true, `${Constant.HCP_INQUIRY_SHOW}/${id}`);
    }

    const handleGetInquiryDetailsResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status && response?.data) {
                const responseData = response.data;
                setFormInputs({
                    name: responseData?.name ?? '',
                    email: responseData?.email ?? '',
                    message: responseData?.enquiry ?? '',
                    country: responseData?.country?.country_id ?? '',
                });
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const handleReCaptchaInput = () => {
        setShowSubmit(true);
    }

    const handleValidation = () => {
        let isFormValid = true;
        const _errors = {};

        for (const key in formInputs) {
            const value = formInputs[key];
            if (!value) {
                isFormValid = false;
                _errors[key] = `${key} is required.`;
            } else if (key === "email" && value && !Regex.EMAIL_REGEX.test(value)) {
                isFormValid = false;
                _errors[key] = `${key} must be valid.`;
            } else if (key === "name" && value && !Regex.ONLY_LETTERS.test(value)) {
                isFormValid = false;
                _errors[key] = `${key} must have only letters.`;
            }
        }

        setErrors({ ..._errors });
        return isFormValid;
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (handleValidation()) {
            const data = {
                name: formInputs.name,
                email: formInputs.email,
                enquiry: formInputs.message,
                country_id: formInputs.country,
                account_id: localStorage.getItem("account_id"),
            };

            setIsLoading(true);
            API.getMasterList(handleInquirySubmitResponseObj, data, true, Constant.HCP_INQUIRY_CREATE);
        }
    }

    const handleInquirySubmitResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) {
                showSuccess(response.meta.message);
                history.push("/hcp-inquiries");
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const handleMoveBack = e => {
        e.preventDefault();
        history.push("/hcp-inquiries");
    }

    return (
        <>
            {isLoading && <Loader />}
            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Contact OcuSoft Admin</h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row">
                            <div className="col-lg-4 mb-3 mt-4">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        required
                                        name="name"
                                        disabled={id}
                                        value={formInputs.name}
                                        className="form-control"
                                        onChange={e => { if (!id) handleFormInputChange(e); }} // NOSONAR
                                    />
                                    <label>Name <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.name ?? ''}</p>
                            </div>

                            <div className="col-lg-4 mb-3 mt-4">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        required
                                        name="email"
                                        disabled={id}
                                        className="form-control"
                                        value={formInputs.email}
                                        onChange={e => { if (!id) handleFormInputChange(e); }} // NOSONAR
                                    />
                                    <label>
                                        Email
                                        {!id && <span className="text-danger">*</span>}
                                    </label>
                                </span>
                                <p className="error">{errors?.email ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3 mt-4">
                                <span className="p-float-label custom-p-float-label">
                                    {
                                        id ? (
                                            <InputText disabled className="form-control" value={selectedCountryName} />
                                        ) : (
                                            <Dropdown
                                                filter
                                                name="country"
                                                filterBy="name"
                                                optionValue="_id"
                                                optionLabel="name"
                                                options={countryList}
                                                className="form-control"
                                                value={formInputs.country}
                                                onChange={e => { if (!id) handleFormInputChange(e); }} // NOSONAR
                                            />
                                        )
                                    }

                                    <label>Country {!id && <span className="text-danger">*</span>}</label>
                                </span>
                                <p className="error">{errors?.country ?? ''}</p>
                            </div>

                            <div className="col-md-6 mb-3 mt-4">
                                <span className="p-float-label custom-p-float-label">
                                    <InputTextarea
                                        disabled={id}
                                        name="message"
                                        className="form-control"
                                        value={formInputs.message}
                                        onChange={e => { if (!id) handleFormInputChange(e); }} // NOSONAR
                                    />
                                    <label>Inquiry {!id && <span className="text-danger">*</span>}</label>
                                </span>
                                <p className="error">{errors?.message ?? ''}</p>
                            </div>

                            {
                                !id && (
                                    <div className="col-md-6 mb-3 mt-4">
                                        <ReCaptcha
                                            ref={reCaptchaRef}
                                            onChange={handleReCaptchaInput} // NOSONAR
                                            sitekey={Constant.RECAPTCHA_SITE_KEY}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className="card-footer">
                            {
                                showSubmit && (
                                    <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                                        <CIcon icon={cilCheck} />Save
                                    </button>
                                )
                            }

                            <button className="btn btn-danger mb-2" onClick={handleMoveBack}>
                                <CIcon icon={cilXCircle} className="mr-1" />Back
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddEditHcpInquiry;
