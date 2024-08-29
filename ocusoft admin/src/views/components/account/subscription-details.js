import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import { cilCheck } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { API } from "src/services/Api";
import * as Constant from "../../../shared/constant/constant";
import { useLocation, useHistory } from "react-router-dom";
import Loader from "../common/loader/loader";
import { useToast } from '../../../shared/toaster/Toaster';
import { Calendar } from "primereact/calendar";

const SubscriptionHistoryDetails = props => {
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const displayedErrorKeys = { country: "country", planType: "plan type", plan: "duration" };
    const { showSuccess, showError } = useToast();
    let history = useHistory();

    const [countryList, setCountryList] = useState([]);
    const [planTypeList, setPlanTypeList] = useState([]);
    const [planList, setPlanList] = useState([]);
    const [currencySymbol, setCurrencySymbol] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionDetails, setSubscriptionDetails] = useState({
        id: '',
        status: 0,
        duration: '',
        planType: '',
        expiryDate: '',
    });
    const [masterForm, setMasterForm] = useState({ country: '', planType: '', plan: '', price: '' });
    const [errors, setErrors] = useState({ country: '', planType: '', plan: '' });
    const [selectedFinalExpiryDate, setSelectedFinalExpiryDate] = useState('');
    const [finalExpiryDate, setFinalExpiryDate] = useState('');

    useEffect(() => {
        getCountryList();
        getSubscriptionHistoryList();
    }, []);

    useEffect(() => {
        if (masterForm.country) {
            const countryId = masterForm.country;
            const countryObj = countryList.find(country => country._id === countryId);

            let _currencySymbol = '';
            if (countryObj?.currency_symbol) _currencySymbol = countryObj.currency_symbol;
            setCurrencySymbol(_currencySymbol);

            getPlanTypeList();
        }
    }, [masterForm.country]);

    useEffect(() => {
        if (masterForm.planType) {
            getPlanList();
        }
    }, [masterForm.planType]);

    useEffect(() => {
        const _finalExpiryDate = props.finalExpiryDate ?? '';
        setFinalExpiryDate(_finalExpiryDate);
    }, [props]);

    const saveExpiryDate = e => {
        e.preventDefault();
        if (selectedFinalExpiryDate) {
            setIsLoading(true);
            const data = { account_id: id, expiry_date: selectedFinalExpiryDate };
            API.addMaster(onSaveExpiryDateResponse, data, true, Constant.SAVE_EXPIRY_DATE);
        }
    }

    const onSaveExpiryDateResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
            props.changeFinalExpiryDate(finalExpiryDate);
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showSuccess(err.meta.message);
            console.log(err);
        },
        complete: () => { }
    }

    const getSubscriptionHistoryList = () => {
        if (id) {
            const data = { account_id: id, is_active: 1 };
            API.getMasterList(onGetSubscriptionHistoryListResponse, data, true, Constant.SUBSCRIPTION_HISTORY_LIST);
        }
    }

    const onGetSubscriptionHistoryListResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data?.original?.data?.length > 0) {
                const responseData = response.data.original.data[0];
                const _subscriptionDetails = {
                    planType: responseData?.subscription_plan_type ?? '',
                    expiryDate: responseData?.plan_expire_at ?? '',
                    duration: responseData?.duration ?? '',
                    status: responseData?.payment_status ?? 0,
                    id: responseData?._id ?? '',
                }

                const dateDetails = _subscriptionDetails.expiryDate.split("-");
                const year = dateDetails[0];
                const month = dateDetails[1];
                const date = dateDetails[2];
                _subscriptionDetails.expiryDate = `${date}-${month}-${year}`;

                setSubscriptionDetails({ ..._subscriptionDetails });
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getPlanList = () => {
        const planTypeId = masterForm.planType;
        const planTypeObj = planTypeList.find(planType => planType._id === planTypeId);

        let _planList = [];
        if (planTypeObj?.plan?.length > 0) _planList = planTypeObj.plan;

        setPlanList([..._planList]);
    }

    const getPlanTypeList = () => {
        const data = { country_id: masterForm.country };
        API.getMasterList(onGetPlanListResponse, data, true, Constant.ACTIVE_PLAN_LIST);
    }

    const onGetPlanListResponse = {
        cancel: () => { },
        success: response => {
            const responseData = response.data;

            let _planTypeList = [];
            if (responseData?.length > 0) _planTypeList = responseData;

            setPlanTypeList([..._planTypeList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getCountryList = () => {
        if (id) {
            const data = { account_id: id };
            API.getMasterList(onGetCountryListResponse, data, true, Constant.ACTIVE_ACCOUNT_COUNTRY);
        }
    }

    const onGetCountryListResponse = {
        cancel: () => { },
        success: response => {
            let _countryList = [];
            if (response?.data?.length > 0) _countryList = response.data.filter(country => country);
            setCountryList([..._countryList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const onHandleChange = (key, value) => {
        let planObj = null;
        let _price = '';
        let dateObj = null;
        let date = '';
        let month = '';
        let year = '';

        switch (key) {
            case "country":
                setPlanList([]);
                setMasterForm({ ...masterForm, planType: '', plan: '', price: '', country: value });
                break;
            case "planType":
                setMasterForm({ ...masterForm, plan: '', price: '', planType: value });
                break;
            case "plan":
                planObj = planList.find(plan => plan.duration === value);
                _price = planObj?.discount_price ?? planObj?.price ?? '';
                setMasterForm({ ...masterForm, price: _price, plan: value });
                break;
            case "date":
                dateObj = new Date(value);

                date = parseInt(dateObj.getUTCDate()) + 1;
                month = parseInt(dateObj.getUTCMonth()) + 1;
                year = parseInt(dateObj.getUTCFullYear());

                month = month > 9 ? month.toString() : `0${month}`;
                date = date > 9 ? date.toString() : `0${date}`;
                setSelectedFinalExpiryDate(`${date}-${month}-${year}`);

                setFinalExpiryDate(value);
                break;
            default:
                setMasterForm({ ...masterForm, [key]: value });
                break;
        }

        setErrors({ ...errors, [key]: '' });
    }

    const onHandleValidation = () => {
        let formIsValid = true;
        let _errors = errors;

        const validationObj = { country: masterForm.country, planType: masterForm.planType, plan: masterForm.plan };

        for (const key in validationObj) {
            const value = validationObj[key];
            if (!value) {
                formIsValid = false;
                _errors[key] = `${displayedErrorKeys[key]} is required`;
            }
        }

        setErrors({ ..._errors });
        return formIsValid;
    }

    const onSubmit = () => {
        if (onHandleValidation()) {
            const data = {
                account_id: id,
                country_id: masterForm.country,
                period: masterForm.plan,
                subscription_plan_id: masterForm.planType
            };
            setIsLoading(true);
            API.addMaster(createSubscriptionDetails, data, true, Constant.CREATE_SUBSCRIPTION_HISTORY);
        }
    }

    const createSubscriptionDetails = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) {
                showSuccess(response.meta.message);
                history.push('/account');
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
            console.log(err);
        },
        complete: () => { }
    }

    return (
        <div>
            {isLoading && <Loader />}

            {
                subscriptionDetails?.id && (
                    <fieldset className="fieldset mb-4">
                        <legend className="legend">Subscription Details</legend>

                        <div>
                            <div><b>Plan Type: </b>{subscriptionDetails.planType}</div>

                            <div className="mt-3"><b>Expiry Date: </b>{subscriptionDetails.expiryDate}</div>

                            <div className="mt-3"><b>Duration: </b>{subscriptionDetails.duration}</div>

                            <div className="mt-3"><b>Payment Status: </b>{subscriptionDetails.status ? "Paid" : "Not Paid"}</div>

                            <div className="mt-3">
                                <b>Expiry Date With Cooling Period</b>
                                &nbsp;&nbsp;
                                <Calendar
                                    id="navigatorstemplate"
                                    value={finalExpiryDate}
                                    onChange={e => onHandleChange("date", e.value)}
                                    monthNavigator
                                    yearNavigator
                                    yearRange="1969:2030"
                                    dateFormat="dd/mm/yy"
                                />
                                &nbsp;&nbsp;
                                <button className="btn btn-primary" onClick={e => saveExpiryDate(e)}>
                                    <CIcon icon={cilCheck} />Save Final Expiry Date
                                </button>
                            </div>
                        </div>
                    </fieldset>
                )
            }

            <fieldset className="fieldset mb-4">
                <legend className="legend">Create Subscription</legend>

                <div name="subMasterFrm" noValidate>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <span className="p-float-label custom-p-float-label">
                                <Dropdown
                                    value={masterForm.country}
                                    options={countryList}
                                    optionLabel={"name"}
                                    optionValue={"_id"}
                                    className={"form-control"}
                                    onChange={e => onHandleChange("country", e.target.value)}
                                />
                                <label>Country <span className="text-danger">*</span></label>
                            </span>
                            <p className="error">{errors["country"]}</p>
                        </div>

                        <div className="col-md-3 mb-3">
                            <span className="p-float-label custom-p-float-label">
                                <Dropdown
                                    value={masterForm.planType}
                                    options={planTypeList}
                                    optionLabel={"plan_type"}
                                    optionValue={"_id"}
                                    className={"form-control"}
                                    onChange={e => onHandleChange("planType", e.target.value)}
                                />
                                <label>Plan Type <span className="text-danger">*</span></label>
                            </span>
                            <p className="error">{errors["planType"]}</p>
                        </div>

                        <div className="col-md-3 mb-3">
                            <span className="p-float-label custom-p-float-label">
                                <Dropdown
                                    value={masterForm.plan}
                                    options={planList}
                                    optionLabel={"duration"}
                                    optionValue={"duration"}
                                    className={"form-control"}
                                    onChange={e => onHandleChange("plan", e.target.value)}
                                />
                                <label>Duration <span className="text-danger">*</span></label>
                            </span>
                            <p className="error">{errors["plan"]}</p>
                        </div>

                        {
                            masterForm.price && (
                                <div className="col-md-3 mb-3 position-relative">
                                    <b style={{ fontSize: "15px", top: "7px" }} className="position-absolute">
                                        Price: {`${currencySymbol} ${masterForm.price ?? ''}`}
                                    </b>
                                </div>
                            )
                        }
                    </div>

                    <div className="row">
                        <div className="col-md-3 mt-3">
                            <button className="btn btn-primary" onClick={onSubmit}>
                                <CIcon icon={cilCheck} />Save
                            </button>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    )
}

export default SubscriptionHistoryDetails;
