import React, { useState, useEffect } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CFormLabel,
    CInputGroup,
    CRow,
} from '@coreui/react'
import { EMAIL_REGEX } from "../../../shared/regex/regex"
import { useHistory } from "react-router-dom";
import { API } from '../../../services/Api';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import logo from "../../../assets/images/ocusoft_logo.jpeg"
import left_arrow from "../../../assets/images/arrow-left.svg"
import { useToast } from '../../../shared/toaster/Toaster';
import { emailLowerCase } from 'src/shared/handler/common-handler'
import * as Message from "../../../shared/constant/error-message"

const ForgotPassword = (props) => {
    const { showError, showSuccess } = useToast();

    let history = useHistory();
    const [disable, setDisable] = useState(false)

    const [user, setUser] = useState({
        email: ''
    })
    const [errors, setErrors] = useState({ email: '' })


    useEffect(() => {
        getDisableValue()
    }, [user])

    const getDisableValue = () => {
        if (user.email !== '') {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }

    const onBack = () => {
        history.push('/')
    }

    const handleForgorPassword = (e) => {
        e.preventDefault()
        if (handleValidation()) {
            let obj = {
                "email": emailLowerCase(user.email),
                "role": "ADMIN"
            }
            setDisable(true);
            API.forgotPassword(forgotPassRes, obj, true);
        }
    }

    // forgotPassRes Response Data Method
    const forgotPassRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)
                setDisable(false);
            }
        },
        error: (error) => {
            setDisable(false);
            showError(error.meta.message)
        },
        complete: () => {
        },
    }

    const onHandleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleValidation = () => {
        let errorObj = {}
        if (!EMAIL_REGEX.test(user.email)) {
            errorObj.email = Message.EMAILERR
            setErrors({ ...errorObj })

            return false
        } else {
            setErrors({ ...errorObj })
            return true
        }

    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-page-wrap">
            <CContainer fluid>
                <CRow className="justify-content-center">
                    <CCol md={12} className="text-center">
                        <a href="#" className="logo-wrap">
                            <img src={logo} />
                        </a>
                    </CCol>
                    <CCol md={12}>
                        <CCardGroup className="authbox-group justify-content-center">
                            <CCard className="authbox">
                                <CCardBody className="d-flex align-items-center justify-content-center">
                                    <div className="title-wrap">
                                        <img src={left_arrow} onClick={onBack} />
                                        <h1 className="text-center">Forgot Password</h1>
                                    </div>
                                    <CForm>
                                        <p className="sub-title text-center">{'Enter your email address and'} <br />{"we'll send you a link to reset your password"}</p>
                                        <CInputGroup>
                                            <CFormLabel>Enter Email Id</CFormLabel>
                                            <CFormInput placeholder="Enter your email" value={user.email} name="email" onChange={(e) => onHandleChange(e)} autoComplete="username" />
                                            <p className="error">{errors['email']}</p>
                                        </CInputGroup>
                                        <CRow className="mx-0">
                                            <CCol xs={12} className="px-0">

                                                <div className="d-grid gap-2">
                                                    <CButton color="primary" className="px-4" onClick={(e) => handleForgorPassword(e)} disabled={disable}>
                                                        Submit
                                                    </CButton>
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                    <CCol md={12}>
                        <p className="copyright-text">
                            Copyright <a href="#">Occusoft</a> © 2023
                        </p>
                    </CCol>
                </CRow>
            </CContainer>
        </div>

    )
}

export default ForgotPassword
