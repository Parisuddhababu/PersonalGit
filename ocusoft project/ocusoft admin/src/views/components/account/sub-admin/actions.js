import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { CFormCheck } from "@coreui/react";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { cilCheck, cilXCircle } from "@coreui/icons";

import { API } from "src/services/Api";
import * as Regex from "src/shared/regex/regex";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { camelCaseToLabel, isEmpty } from "src/shared/handler/common-handler";
import { EMAILERR, PASSWORDERR, PHONEERR } from "src/shared/constant/error-message";

const AddEditSubAdmin = ({ hcpId, changeSection, subAdminId }) => {
    const { showError, showSuccess } = useToast();
    const _subAdminData = {
        email: '',
        phone: '',
        lastName: '',
        password: '',
        firstName: '',
        isActive: true,
        confirmPassword: '',
    };

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [subAdminData, setSubAdminData] = useState({ ..._subAdminData });

    useEffect(() => {
        if (subAdminId) getSubAdminData(subAdminId);
    }, [subAdminId]);

    const getSubAdminData = subAdminId => {
        setIsLoading(true);
        const url = `${Constant.EDIT_SUB_ADMIN}/${subAdminId}`;
        API.getDrpData(handleGetSubAdminDataResponseObj, null, true, url);
    }

    const handleGetSubAdminDataResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const responseData = response?.data ?? null;
            if (responseData) {
                const responseSubAdminData = {
                    ...subAdminData,
                    email: responseData?.email ?? '',
                    phone: responseData?.mobile ?? '',
                    lastName: responseData?.last_name ?? '',
                    firstName: responseData?.first_name ?? '',
                    isActive: Boolean(responseData?.is_active ?? 0),
                };

                setSubAdminData({ ...responseSubAdminData });
            } else {
                showError("Unable to fetch data.");
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            showError("Unable to fetch data.");
        },
        complete: () => { },
    }

    const handleSubAdminDataChange = e => {
        const { name, value } = e?.target ?? {};

        setErrors({ ...errors, [name]: '' });
        setSubAdminData({ ...subAdminData, [name]: value });
    }

    const handleValidation = () => {
        const _errors = {};
        let isFormValid = true;

        for (const key in subAdminData) {
            const value = subAdminData[key];
            const isValueEmpty = isEmpty(value);
            const isEncryptedKey = key === "password" || key === "confirmPassword";

            if (isEncryptedKey && subAdminId) continue;

            if (isValueEmpty) {
                isFormValid = false;
                _errors[key] = `${camelCaseToLabel(key)} is required.`;
            } else {
                if (key === "email" && !Regex.EMAIL_REGEX.test(value)) {
                    isFormValid = false;
                    _errors[key] = EMAILERR;
                } else if ((key === "firstName" || key === "lastName") && !Regex.ONLY_CHARACTERS.test(value)) {
                    isFormValid = false;
                    _errors[key] = "The value must contain only letters.";
                } else if (key === "phone" && !Regex.PHONENUMBER_REGEX.test(value)) {
                    isFormValid = false;
                    _errors[key] = PHONEERR;
                } else if (isEncryptedKey) {
                    const { password, confirmPassword } = subAdminData;
                    const areInputsSame = password === confirmPassword;
                    const isRegexCleared = Regex.PASSWORD_REGEX.test(value);

                    if (!(isRegexCleared && areInputsSame)) {
                        isFormValid = false;
                        _errors[key] = !isRegexCleared ? PASSWORDERR : "password and confirm password must be same.";
                    }
                }
            }
        }

        setErrors({ ..._errors });
        return isFormValid;
    }

    const handleMoveBack = () => {
        changeSection("list");
    }

    const handleSubmitSubAdminData = () => {
        if (handleValidation()) {
            const data = {
                account_id: hcpId ?? '',
                email: subAdminData?.email ?? '',
                mobile: subAdminData?.phone ?? '',
                last_name: subAdminData?.lastName ?? '',
                is_active: subAdminData?.isActive ? 1 : 0,
                first_name: subAdminData?.firstName ?? '',
            };

            if (!subAdminId) {
                data["password"] = subAdminData?.password ?? '';
                data["confirm_password"] = subAdminData.confirmPassword ?? '';
            }

            setIsLoading(true);
            const url = subAdminId ? `${Constant.UPDATE_SUB_ADMIN}/${subAdminId}` : Constant.ADD_SUB_ADMIN;
            API.getMasterList(handleSubmitResponseObj, data, true, url);
        }
    }

    const handleSubmitResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(message);
            changeSection("list");
        },
        error: err => {
            console.log(err);
            const message = err?.meta?.message ?? "Something went wrong.";
            showError(message);
            setIsLoading(false);
        },
        complete: () => { },
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="row">
                <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText
                            name="firstName"
                            className="form-control"
                            onChange={handleSubAdminDataChange}
                            value={subAdminData.firstName ?? ''}
                        />
                        <label>First name<span className="text-danger">*</span></label>
                    </span>
                    <p className="error">{errors?.firstName ?? ''}</p>
                </div>

                <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText
                            name="lastName"
                            className="form-control"
                            onChange={handleSubAdminDataChange}
                            value={subAdminData.lastName ?? ''}
                        />
                        <label>Last name<span className="text-danger">*</span></label>
                    </span>
                    <p className="error">{errors?.lastName ?? ''}</p>
                </div>

                <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText
                            name="email"
                            className="form-control"
                            value={subAdminData.email ?? ''}
                            onChange={handleSubAdminDataChange}
                        />
                        <label>Email<span className="text-danger">*</span></label>
                    </span>
                    <p className="error">{errors?.email ?? ''}</p>
                </div>

                <div className="col-md-3 mb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText
                            name="phone"
                            className="form-control"
                            value={subAdminData.phone ?? ''}
                            onChange={handleSubAdminDataChange}
                        />
                        <label>Mobile no.<span className="text-danger">*</span></label>
                    </span>
                    <p className="error">{errors?.phone ?? ''}</p>
                </div>
            </div>

            <div className="row">
                {
                    !subAdminId && (
                        <>
                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Password
                                        toggleMask
                                        name="password"
                                        className="form-control"
                                        value={subAdminData.password}
                                        onChange={handleSubAdminDataChange}
                                    />
                                    <label>Password<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.password ?? ''}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Password
                                        toggleMask
                                        name="confirmPassword"
                                        className="form-control"
                                        onChange={handleSubAdminDataChange}
                                        value={subAdminData.confirmPassword}
                                    />
                                    <label>Confirm password<span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.confirmPassword ?? ''}</p>
                            </div>
                        </>
                    )
                }

                <div className="col-md-3 mb-3">
                    <div className="align-items-center">
                        <div className="d-flex flex-column">
                            <label>Status</label>
                            <div>
                                <CFormCheck
                                    inline
                                    id="active"
                                    type="radio"
                                    label="Active"
                                    name="isActive"
                                    className="customradiobutton"
                                    value={subAdminData.isActive}
                                    checked={subAdminData.isActive}
                                    onChange={() => {
                                        setSubAdminData({ ...subAdminData, isActive: true });
                                    }}
                                />

                                <CFormCheck
                                    inline
                                    type="radio"
                                    id="inactive"
                                    name="isActive"
                                    label="Inactive"
                                    className="customradiobutton"
                                    value={subAdminData.isActive}
                                    checked={!subAdminData.isActive}
                                    onChange={() => {
                                        setSubAdminData({ ...subAdminData, isActive: false });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <button type="button" className="btn btn-primary mb-2 mr-2" onClick={handleSubmitSubAdminData}>
                    <CIcon icon={cilCheck} className="mr-1" />Save
                </button>

                <button type="button" className="btn btn-danger mb-2" onClick={handleMoveBack}>
                    <CIcon icon={cilXCircle} className="mr-1" />Back
                </button>
            </div>
        </>
    );
};

export default AddEditSubAdmin;
