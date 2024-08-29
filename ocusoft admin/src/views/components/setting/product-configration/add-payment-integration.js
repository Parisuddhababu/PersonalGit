import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { cilCheck, cilTrash } from "@coreui/icons";
import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";

import OtpDialog from "./otp-dialog";
import { API } from "src/services/Api";
import Loader from "../../common/loader/loader";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import { isEmpty, uuid } from "src/shared/handler/common-handler";

const AddPaymentIntegration = ({ accountData }) => {
    const { showError, showSuccess } = useToast();
    const primaryAccountId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [paymentGatewayList, setPaymentGatewayList] = useState([]);
    const [paymentGatewayValues, setPaymentGatewayValues] = useState([]);
    const [paymentGatewayDetails, setPaymentGatewayDetails] = useState([]);
    const [selectedPaymentGateways, setSelectedPaymentGateways] = useState([]);
    const [paymentGatewayDetailsList, setPaymentGatewayDetailsList] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(adminRole !== "SUPER_ADMIN" ? primaryAccountId : '');

    useEffect(() => {
        getPaymentGatewayList();
    }, []);

    useEffect(() => {
        if (selectedAccount) getPaymentIntegrationByAccount(selectedAccount);
    }, [selectedAccount]);

    useEffect(() => { // NOSONAR
        if (paymentGatewayValues?.length) {
            let _paymentGatewayDetails = [], _selectedPaymentGateways = [];

            paymentGatewayValues.forEach(valueObj => {
                const id = valueObj.id;
                const valueKeys = valueObj.keys;
                const paymentGatewayObj = paymentGatewayDetailsList.find(details => details.id === id);

                if (paymentGatewayObj?.keys && paymentGatewayObj?.name !== "COD") {
                    const paymentKeys = paymentGatewayObj.keys;
                    const _selectedPaymentGatewayObj = { name: paymentGatewayObj.name, id: paymentGatewayObj.id };

                    for (const key in valueKeys) {
                        const value = valueKeys[key];
                        const keyObj = paymentKeys.find(paymentKey => paymentKey.name === key);
                        if (keyObj) keyObj.value = value;
                    }

                    _paymentGatewayDetails.push(paymentGatewayObj);
                    _selectedPaymentGateways.push(_selectedPaymentGatewayObj);
                } else if (valueObj?.name === "COD") {
                    _selectedPaymentGateways.push({ name: valueObj.name, id: valueObj.id });
                }
            });

            setSelectedPaymentGateways([..._selectedPaymentGateways]);
            setPaymentGatewayDetails([..._paymentGatewayDetails]);
        } else {
            setSelectedPaymentGateways([]);
            setPaymentGatewayDetails([]);
        }
    }, [paymentGatewayValues, paymentGatewayDetailsList]);

    const getPaymentIntegrationByAccount = account => {
        setIsLoading(true);
        API.getMasterDataById(getPaymentIntegrationByAccountResponse, '', true, account, Constant.SHOW_PAYMENT_INTEGRATION);
    }

    const getPaymentIntegrationByAccountResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                let responseData = response.data;
                let _paymentGatewayValues = [];

                if (responseData?.payment_gateway_details?.length) {
                    const responsePaymentGatewayValues = responseData.payment_gateway_details;

                    responsePaymentGatewayValues.forEach(paymentValueObj => {
                        const paymentGatewayObj = { keys: {} };
                        for (const key in paymentValueObj) {
                            const paymentValue = paymentValueObj[key];

                            if (key === "payment_gateway_id") {
                                paymentGatewayObj["id"] = paymentValue;
                            } else if (key === "payment_gateway_name") {
                                paymentGatewayObj["name"] = paymentValue;
                            } else {
                                paymentGatewayObj["keys"][key] = paymentValue;
                            }
                        }

                        _paymentGatewayValues.push(paymentGatewayObj);
                    });
                }

                setPaymentGatewayValues([..._paymentGatewayValues]);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
            setPaymentGatewayValues([]);
        },
        complete: () => { },
    }

    const getPaymentGatewayList = () => {
        API.getMasterList(onGetPaymentGatewayListResponse, null, true, Constant.PAYMENT_GATEWAY_LIST);
    }

    const onGetPaymentGatewayListResponse = {
        cancel: () => { },
        success: response => {
            let _paymentGatewayList = [];
            let _paymentGatewayDetailsList = [];

            if (response.meta.status && response?.data?.original?.data?.length > 0) {
                const responseData = response.data.original.data;

                _paymentGatewayList = responseData.map(paymentGatewayObj => {
                    return { name: paymentGatewayObj.name, id: paymentGatewayObj._id };
                });

                _paymentGatewayDetailsList = responseData.map(paymentGatewayObj => {
                    return {
                        id: paymentGatewayObj._id,
                        name: paymentGatewayObj?.name ?? '',
                        keys: paymentGatewayObj?.keys.map(keyObj => {
                            return {
                                name: keyObj?.name ?? '',
                                type: keyObj?.data_type ?? "TEXT",
                                value: '',
                            };
                        })
                    };
                });
            }

            setPaymentGatewayList([..._paymentGatewayList]);
            setPaymentGatewayDetailsList([..._paymentGatewayDetailsList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const handleAccountChange = e => {
        setErrors({});
        setSelectedAccount(e.target.value);
    }

    const handleSelectedPaymentGatewayChange = e => {
        const _selectedPaymentGateways = e.target.value;
        setSelectedPaymentGateways(_selectedPaymentGateways);

        let _paymentGatewayDetails = [];
        _selectedPaymentGateways.forEach(paymentGatewayObj => {
            const paymentGatewayId = paymentGatewayObj.id;
            const paymentGatewayDetailsObj = paymentGatewayDetailsList.find(paymentGateway => {
                return paymentGateway.id === paymentGatewayId;
            });

            if (paymentGatewayDetailsObj && paymentGatewayDetailsObj?.name !== "COD") {
                _paymentGatewayDetails.push(paymentGatewayDetailsObj);
            }
        });

        setPaymentGatewayDetails([..._paymentGatewayDetails]);
        setErrors({ ...errors, paymentGateway: '', paymentGatewayDetails: [] });
    }

    const handlePaymentGatewayGroupDelete = (paymentGatewayId, paymentGatewayDetailIndex) => {
        let _selectedPaymentGateways = selectedPaymentGateways;
        let _paymentGatewayDetails = paymentGatewayDetails;

        let _selectedPaymentGatewayIndex = _selectedPaymentGateways.findIndex(paymentGateway => {
            return paymentGateway.id === paymentGatewayId;
        });

        if (_selectedPaymentGatewayIndex > -1) _selectedPaymentGateways.splice(_selectedPaymentGatewayIndex, 1);
        _paymentGatewayDetails.splice(paymentGatewayDetailIndex, 1);

        setSelectedPaymentGateways(_selectedPaymentGateways);
        setPaymentGatewayDetails([..._paymentGatewayDetails]);
        setErrors({ ...errors, paymentGatewayDetails: [] });
    }

    const handleValidation = () => { // NOSONAR
        let _errors = {};
        let formIsValid = true;

        if (!selectedAccount) {
            _errors["account"] = "account is required.";
            formIsValid = false;
        }

        if (selectedPaymentGateways?.length === 0) {
            _errors["paymentGateway"] = "payment gateway is required.";
            formIsValid = false;
        }

        _errors["paymentGatewayDetails"] = [];

        for (let i = 0; i < paymentGatewayDetails.length; i++) {
            const paymentGatewayObj = paymentGatewayDetails[i];
            const paymentGatewayKeys = paymentGatewayObj.keys;
            _errors["paymentGatewayDetails"][i] = [];

            if (paymentGatewayKeys?.length > 0) {
                for (let j = 0; j < paymentGatewayKeys.length; j++) {
                    _errors["paymentGatewayDetails"][i][j] = '';

                    const paymentGatewayKey = paymentGatewayKeys[j].name;
                    const paymentGatewayValue = paymentGatewayKeys[j].value;
                    const paymentGatewayType = paymentGatewayKeys[j].type;
                    const numberRegex = /^\d/;

                    if (isEmpty(paymentGatewayValue)) {
                        formIsValid = false;
                        _errors["paymentGatewayDetails"][i][j] = `${paymentGatewayKey} is required.`;
                    }

                    if (paymentGatewayType === "NUMBER" && numberRegex.test(paymentGatewayValue)) {
                        formIsValid = false;
                        _errors["paymentGatewayDetails"][i][j] = `${paymentGatewayKey} must be a whole integer.`;
                    }
                }
            }
        }

        setErrors({ ..._errors });
        return formIsValid;
    }

    const sendOtp = e => {
        e.preventDefault();
        if (handleValidation()) {
            setIsLoading(true);
            const data = { account_id: selectedAccount };
            API.getMasterList(handleSendOtpResponseObj, data, true, Constant.SEND_PAYMENT_OTP);
        }
    }

    const handleSendOtpResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setShowOtpDialog(true);
                const email = response?.data?.email ?? '';
                if (email) showSuccess(`OTP has been successfully mailed to ${email}.`);
            }
        },
        error: err => {
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong.";
            showError(message);
        },
        complete: () => { }
    }

    const handleVerifyOtp = otp => {
        const data = { otp };
        setIsLoading(true);
        setShowOtpDialog(false);
        API.getMasterList(handleVerifyOtpResponseObj, data, true, Constant.VERIFY_PAYMENT_OTP);
    }

    const handleVerifyOtpResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
            handleSubmit();
        },
        error: err => {
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong.";
            showError(message);
        },
        complete: () => { }
    }

    const handleSubmit = () => {
        const _accountId = (adminRole === 'SUPER_ADMIN') ? selectedAccount : primaryAccountId;
        const data = { account_id: _accountId, payment_gateway_details: [] };

        paymentGatewayDetails.forEach(paymentGatewayObj => {
            let _paymentGatewayObj = {};
            _paymentGatewayObj["payment_gateway_id"] = paymentGatewayObj.id;
            _paymentGatewayObj["payment_gateway_name"] = paymentGatewayObj.name;

            if (paymentGatewayObj.name !== "COD") {
                paymentGatewayObj?.keys?.forEach(paymentGatewayKey => {
                    const key = paymentGatewayKey.name;
                    const value = paymentGatewayKey.value;
                    _paymentGatewayObj[key] = value;
                });
            }

            data["payment_gateway_details"].push(_paymentGatewayObj);
        });

        const codPaymentGatewayObj = selectedPaymentGateways.find(paymentGatewayObj => paymentGatewayObj.name === "COD");
        if (codPaymentGatewayObj) {
            data["payment_gateway_details"].push({
                payment_gateway_id: codPaymentGatewayObj.id,
                payment_gateway_name: codPaymentGatewayObj.name,
            });
        }

        setIsLoading(true);
        API.addMaster(addUpdatePaymentGatewayResponse, data, true, Constant.PAYMENT_INTEGRATION);
    }

    const addUpdatePaymentGatewayResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                console.log(response);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const handlePaymentGatewayValueChange = (id, name, value, mainIndex, keyIndex) => {
        const _paymentGatewayDetails = paymentGatewayDetails;
        let _errors = errors;
        const _paymentGatewayDetailsIndex = paymentGatewayDetails.findIndex(paymentGateway => paymentGateway.id === id);

        if (_paymentGatewayDetailsIndex > -1) {
            const _paymentGatewayDetailsObj = _paymentGatewayDetails[_paymentGatewayDetailsIndex];

            if (_paymentGatewayDetailsObj?.keys?.length) {
                const _paymentGatewayKeyIndex = _paymentGatewayDetailsObj.keys.findIndex(paymentGatewayKey => {
                    return paymentGatewayKey.name === name;
                });
                if (_paymentGatewayKeyIndex > -1) {
                    _paymentGatewayDetailsObj.keys[_paymentGatewayKeyIndex].value = value;
                    _paymentGatewayDetails[_paymentGatewayDetailsIndex] = _paymentGatewayDetailsObj;
                }
            }

            setPaymentGatewayDetails([..._paymentGatewayDetails]);
        }

        if (_errors?.["paymentGatewayDetails"]?.[mainIndex]?.[keyIndex]) {
            _errors["paymentGatewayDetails"][mainIndex][keyIndex] = '';
        }

        setErrors({ ..._errors });
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Integrated Payments</h5>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="row">
                                    {
                                        adminRole === "SUPER_ADMIN" && (
                                            <div className="col-md-4 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <Dropdown
                                                        filter
                                                        optionValue="_id"
                                                        options={accountData}
                                                        value={selectedAccount}
                                                        className="form-control"
                                                        optionLabel="company_name"
                                                        filterBy="company_name,code"
                                                        onChange={handleAccountChange}
                                                        itemTemplate={accountDataTemplate}
                                                        valueTemplate={accountDataTemplate}
                                                    />
                                                    <label>HCP<span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{errors["account"]}</p>
                                            </div>
                                        )
                                    }

                                    <div className="col-md-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <MultiSelect
                                                optionLabel={"name"}
                                                className={"form-control"}
                                                options={paymentGatewayList}
                                                value={selectedPaymentGateways}
                                                onChange={e => handleSelectedPaymentGatewayChange(e)}
                                            />
                                            <label>Payment Gateway <span className="text-danger">*</span></label>
                                        </span>

                                        <p className="error">{errors["paymentGateway"]}</p>
                                    </div>
                                </div>

                                {
                                    paymentGatewayDetails?.map((paymentGatewayObj, paymentGatewayIndex) => {
                                        const paymentGatewayKeys = paymentGatewayObj.keys;
                                        const paymentGatewayId = paymentGatewayObj.id;

                                        return (
                                            <fieldset className="fieldset" key={paymentGatewayId ?? uuid()}>
                                                <legend className="legend">
                                                    {`${paymentGatewayObj?.name ?? "Payment Gateway"} Details`}
                                                </legend>

                                                <div
                                                    className="text-danger fieldset-delete"
                                                    onClick={() => handlePaymentGatewayGroupDelete(
                                                        paymentGatewayId,
                                                        paymentGatewayIndex
                                                    )}
                                                >
                                                    <CIcon icon={cilTrash} title={"Delete Payment Gateway Group"} />
                                                </div>

                                                <div className="row" style={{ clear: "left" }}>
                                                    {
                                                        paymentGatewayKeys?.map((paymentGatewayKey, paymentGatewayKeyIndex) => (
                                                            <div className="col-md-3" key={paymentGatewayKey?.name ?? uuid()}>
                                                                <span className="p-float-label custom-p-float-label">
                                                                    <InputText
                                                                        value={paymentGatewayKey.value}
                                                                        className="form-control"
                                                                        onChange={e => handlePaymentGatewayValueChange(
                                                                            paymentGatewayId,
                                                                            paymentGatewayKey.name,
                                                                            e.target.value,
                                                                            paymentGatewayIndex,
                                                                            paymentGatewayKeyIndex
                                                                        )}
                                                                    />

                                                                    <label>
                                                                        {paymentGatewayKey?.name ?? ''}
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </span>

                                                                <p className="error">
                                                                    {
                                                                        errors
                                                                            ?.paymentGatewayDetails
                                                                            ?.[paymentGatewayIndex]
                                                                            ?.[paymentGatewayKeyIndex]
                                                                    }
                                                                </p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </fieldset>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button className="btn btn-primary mb-2 mr-2" onClick={sendOtp}>
                        <CIcon icon={cilCheck} className="mr-1" />Save
                    </button>
                </div>
            </form>

            {
                showOtpDialog && (
                    <OtpDialog handleCloseDialog={() => { setShowOtpDialog(false); }} handleVerifyOtp={handleVerifyOtp} /> // NOSONAR
                )
            }
        </div>
    );
};

export default AddPaymentIntegration
