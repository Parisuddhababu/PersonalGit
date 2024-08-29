import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux';
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
import { Checkbox } from 'primereact/checkbox';
import { useHistory } from "react-router-dom";
import { API } from '../../../services/Api';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import logo from "../../../assets/images/ocusoft_logo.jpeg";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../../shared/regex/regex"
import * as Message from "../../../shared/constant/error-message"
import { Permission } from 'src/shared/enum/enum';
import { emailLowerCase } from 'src/shared/handler/common-handler';

const Login = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const toast = useRef(null);
  const superAdmin = [Permission.SUPER_ADMIN]
  const [user, setUser] = useState({ email: '', password: '' });
  const [isRemember, setIsRemember] = useState('');
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    getDisableValue()
  }, [user])

  useEffect(() => {
    let remData = JSON.parse(localStorage.getItem('remData'))
    if (remData) {
      setUser(remData)
      setIsRemember(true)
    }

  }, [])

  const getDisableValue = () => {
    if (user.email !== '' && user.password !== '') {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }

  const onLogin = (ev) => {
    ev.preventDefault();
    if (handleValidation()) {
      let obj = { ...user };
      obj.email = emailLowerCase(obj.email);
      obj.role = "ADMIN"
      API.login(loginRes, obj, false);
    }
  }
  const loginRes = {
    cancel: (c) => {
    },
    success: (response) => {
      if (response.meta.status_code === 200) {
        toast.current.show({ severity: 'success', detail: response.meta.message, life: 3000 });
        const resData = response.data;
        if (isRemember) {
          localStorage.setItem("remData", JSON.stringify(user))
        } else {
          localStorage.removeItem("remData")
        }
        if (response.data.user_detail) {
          localStorage.setItem("user_details", JSON.stringify(resData.user_detail))
        }
        if (response.data.user_detail.permission) {
          localStorage.setItem("permission", JSON.stringify(resData.user_detail.permission))
          dispatch({ type: 'permission', permission: resData.user_detail.permission })
        } else localStorage.setItem("permission", JSON.stringify(superAdmin))
        localStorage.setItem("token", resData.access_token)
        if (resData.user_detail.website_detail) {
          localStorage.setItem("is_main_website", resData.user_detail.website_detail.is_main_website)
          localStorage.setItem("website_id", resData.user_detail.website_detail._id)
        }
        if (resData?.user_detail?.account_detail) {
          localStorage.setItem("is_main_website", resData.user_detail.account_detail.is_main_website)
          localStorage.setItem("account_id", resData.user_detail.account_detail._id)
        }

        history.push("/dashboard");
        location.reload();
      }
    },
    error: (error) => {
      if (error?.meta) {
        toast.current.show({ severity: 'error', detail: error.meta.message, life: 3000 });
      } else {
        toast.current.show({ severity: 'error', detail: 'Something went wrong', life: 3000 });
      }
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
    } else if (!PASSWORD_REGEX.test(user.password)) {
      errorObj.password = Message.PASSWORDERR
      setErrors({ ...errorObj })
      return false

    } else {
      setErrors({ ...errorObj })
      return true
    }

  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    history.push("/forgot-password")
  }

  const setRememberMe = (e) => {
    e.preventDefault()
    setIsRemember(e.checked)
  }

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center login-page-wrap">
      <Toast ref={toast} />
      <CContainer fluid>
        <CRow className="justify-content-center">
          <CCol md={12} className="hide">
            <CCardGroup className="authbox-group justify-content-center">
              <CCard className="authbox">
                <CCardBody className="d-flex align-items-center justify-content-center">
                  <div className='text-center'>
                    <a href="#" className="logo-wrap">
                      <img src={logo} />
                    </a>
                  </div>
                  <CForm>
                    <h1 className="text-center">Log In</h1>
                    {/* <p className="text-medium-emphasis text-center">Sign In to your account</p> */}
                    <CInputGroup>
                      <CFormLabel>Email Address*</CFormLabel>
                      <CFormInput placeholder="Enter your email" value={user.email} name="email" onChange={(e) => onHandleChange(e)} autoComplete="username" />
                      {errors.email && <p className="error">{errors['email']}</p>}
                      {/* <InputText  placeholder="Enter your email" /> */}
                    </CInputGroup>
                    <CInputGroup>
                      <CFormLabel>Password*</CFormLabel>
                      <Password style={{ border: '1px solid white' }} value={user.password} name="password" onChange={(e) => onHandleChange(e)} placeholder="Enter your password" toggleMask />
                      {errors.password && <p className="error">{errors['password']}</p>}
                    </CInputGroup>
                    <CRow className="mx-0">
                      <CCol xs={6} className="py-0 px-0">
                        {/* <CFormLabel>Remember Me</CFormLabel> */}
                        <div className="mb-3 d-flex align-items-center custom-checkbox">
                          <Checkbox onChange={e => setRememberMe(e)} checked={isRemember}></Checkbox>
                          <label htmlFor="cb1" className="p-checkbox-label m-0 text-white pl-2">Remember Me</label>
                        </div>

                        {/* <CFormCheck checked={isRemember}  label="Remember me" onChange={(e) => setRememberMe(e)} /> */}
                      </CCol>
                      <CCol xs={6} className="text-right py-0 px-0">
                        <CButton color="link" onClick={(e) => handleForgotPassword(e)} className="px-0">
                          Forgot Password?
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className="mx-0">
                      <CCol xs={12} className="px-0">
                        {/* <CButton color="primary" className="px-4" onClick={() => onLogin()}>
                          Login
                        </CButton> */}
                        <div className="d-grid gap-2">
                          <CButton color="primary" type='submit' className="px-4" onClick={(e) => onLogin(e)} disabled={disable}>
                            Log In
                          </CButton>
                        </div>
                      </CCol>
                    </CRow>
                  </CForm>
                  <p className="copyright-text">
                    Copyright <a href="#">Ocusoft</a> © 2023
                  </p>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
