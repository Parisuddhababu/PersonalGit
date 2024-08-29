import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import {
    CCol,
    CRow,
    CForm,
    CCard,
    CButton,
    CCardBody,
    CCardGroup,
    CContainer,
    CFormLabel,
    CInputGroup,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { Password } from "primereact/password";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import logo from "src/assets/images/ocusoft_logo.jpeg";
import { PASSWORD_REGEX } from "src/shared/regex/regex";
import * as Constants from "src/shared/constant/constant";
import left_arrow from "src/assets/images/arrow-left.svg";
import { isEmpty } from "src/shared/handler/common-handler";
import Loader from "src/views/components/common/loader/loader";
import { PASSWORDERR } from "src/shared/constant/error-message";

const ResetPassword = () => {
    const { showSuccess, showError } = useToast();
    let history = useHistory(), { search } = useLocation();
    const userObj = { newPassword: '', confirmPassword: '' };
    const token = new URLSearchParams(search).get('t');

    const [errorText, setErrorText] = useState('');
    const [user, setUser] = useState({ ...userObj });
    const [isLoading, setIsLoading] = useState(false);
    const [isResetDisabled, setIsResetDisabled] = useState(true);

    useEffect(() => {
        getDisableValue();
    }, [user]);

    const getDisableValue = () => {
        const { newPassword: newPass, confirmPassword: conPass } = user;
        setIsResetDisabled(isEmpty(newPass) || isEmpty(conPass) || newPass !== conPass);
    }

    const handleUserInput = e => {
        setErrorText('');
        const { name, value } = e?.target ?? {};
        setUser({ ...user, [name]: value });
    }

    const moveBack = () => {
        history.push('/');
    }

    const handlePasswordValidation = () => {
        let isFormValid = !isResetDisabled;

        if (isFormValid) {
            if (!PASSWORD_REGEX.test(user.confirmPassword)) {
                isFormValid = false;
                setErrorText(PASSWORDERR);
            } else if (!token) {
                isFormValid = false;
                showError("Token is unavailable. Please reopen this page from the link given in the mail.");
            }
        }

        return isFormValid;
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (handlePasswordValidation()) {
            const data = {
                token,
                new_password: user.newPassword ?? '',
                confirm_password: user.confirmPassword ?? '',
            };

            setIsLoading(true);
            API.putData(handleResetPasswordResponseObj, data, false, Constants.RESET_PASSWORD);
        }
    }

    const handleResetPasswordResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(message);
            setTimeout(() => { history.push("/login"); }, 3000);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong!";
            showError(message);
        },
        complete: () => { }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-page-wrap">
            <CContainer fluid>
                <CRow className="justify-content-center">
                    <CCol md={12} className="text-center">
                        <a href="#" className="logo-wrap"><img alt="logo" src={logo} /></a>
                    </CCol>

                    <CCol md={12} className="hide">
                        <CCardGroup className="authbox-group justify-content-center">
                            <CCard className="authbox">
                                {
                                    isLoading ? <Loader /> : (
                                        <CCardBody className="d-flex align-items-center justify-content-center">
                                            <div className="title-wrap">
                                                <img src={left_arrow} onClick={moveBack} />
                                                <h1 className="text-center">Reset Password</h1>
                                            </div>

                                            <CForm>
                                                <CInputGroup>
                                                    <CFormLabel>New Password*</CFormLabel>

                                                    <Password
                                                        toggleMask
                                                        name="newPassword"
                                                        className="form-control"
                                                        value={user.newPassword}
                                                        onChange={handleUserInput}
                                                        placeholder="Enter your new password"
                                                    />
                                                </CInputGroup>

                                                <CInputGroup>
                                                    <CFormLabel>Confirm Password*</CFormLabel>

                                                    <Password
                                                        toggleMask
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        onChange={handleUserInput}
                                                        value={user.confirmPassword}
                                                        placeholder="Enter your confirm password"
                                                    />
                                                    {Boolean(errorText) && <p className="error">{errorText ?? ''}</p>}
                                                </CInputGroup>

                                                <CRow className="mx-0">
                                                    <CCol xs={12} className="px-0">
                                                        <div className="d-grid gap-2">
                                                            <CButton
                                                                color="primary"
                                                                className="px-4"
                                                                onClick={handleSubmit}
                                                                disabled={isResetDisabled}
                                                            >
                                                                Reset
                                                            </CButton>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                        </CCardBody>
                                    )
                                }
                            </CCard>
                        </CCardGroup>
                    </CCol>

                    <CCol md={12}>
                        <p className="copyright-text">Copyright <a href="#">Occusoft</a> © 2023</p>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default ResetPassword;
