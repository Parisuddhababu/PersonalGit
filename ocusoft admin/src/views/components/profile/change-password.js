// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import * as Message from "../../../shared/constant/error-message"
import {  cilCheck } from '@coreui/icons';
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import { Password } from 'primereact/password';
import { isEmpty } from 'src/shared/handler/common-handler';
import * as Regex from "../../../shared/regex/regex";
import { useHistory, useLocation } from "react-router-dom";

const ChangePassword = () => {
    let history = useHistory(), location = useLocation();

    const [masterForm, setMasterForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    })
    const [error, setErrors] = useState({ emails: [], phones: [] })
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();

    const onHandleChange = (event, radioVal) => {
        let errors = error, value = '';
        errors[event.target.name] = '';
        setErrors({ ...errors });

        const { type, name, value: eventValue } = event?.target ?? {};

        switch (type) {
            case "checkbox":
                value = event.target.checked ? 1 : 0;
                break;
            case "radio":
                value = radioVal ? 1 : 0;
                break;
            default:
                value = eventValue;
                break;
        }

        setMasterForm({ ...masterForm, [name]: value });
    }

    const onUpdate = (e) => {
        e.preventDefault()
        if (onHandleValidation()) {
            let resObj = {
                "old_password": masterForm.old_password,
                "new_password": masterForm.new_password,
                "confirm_password": masterForm.confirm_password
            }

            API.UpdateStatus(addEditMasterRes, resObj, true, '', Constant.PROFILE_CHANGE_PASSWORD)

        }
    }

    const logout = () => {
        localStorage.removeItem('is_main_website')
        localStorage.removeItem('permission')
        localStorage.removeItem('current-path')
        localStorage.removeItem('website_id')
        localStorage.removeItem('token')
        localStorage.removeItem('user_details')        
        history.push("/login");
        location.reload();
    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                showSuccess(response.meta.message)
                setTimeout(() => {
                    logout()
                }, 2000);
            }
        },
        error: (error) => {
            setIsLoading(false)
            if (error.errors) {
                Object.values(error.errors).map(err => {
                    showError(err)
                })
            } else {
                showError(error.meta.message)
            }
        },
        complete: () => {
        },
    }

    const onHandleValidation = () => { // NOSONAR
        let errors = {}
        let formIsValid = true;
        for (const [key, value] of Object.entries(masterForm)) {
            if (isEmpty(value)) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} is required`;
            }

            if (key === 'old_password') {
                if (value && !Regex.PASSWORD_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.PASSWORDERR;
                }
            }
            if (key === 'new_password') {
                if (value && !Regex.PASSWORD_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.PASSWORDERR;
                }
            }
            if (key === 'confirm_password') {
                if (value && value !== masterForm.new_password) {
                    formIsValid = false;
                    errors[key] = Message.CONFPASSERR;
                }
            }
            setErrors({ ...errors });
        }
        return formIsValid;
    }


    return (

        <div>
            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">

                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Password value={masterForm.old_password} name='old_password' className="form-control" onChange={(e) => onHandleChange(e)} toggleMask />
                                    <label>Old Password <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['old_password']}</p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Password value={masterForm.new_password} name='new_password' className="form-control" onChange={(e) => onHandleChange(e)} toggleMask />
                                    <label>New Password <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['new_password']}</p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Password value={masterForm.confirm_password} name='confirm_password' className="form-control" onChange={(e) => onHandleChange(e)} toggleMask />
                                    <label>Confirm Password <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['confirm_password']}</p>
                            </div>

                        </div>

                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onUpdate(e) }}><CIcon icon={cilCheck} />{'Update'}</button>
                        {/* <button className="btn btn-success mr-2"><CIcon icon={cilCheckCircle} className="mr-1" />Save & Continue</button> */}
                        {/* <button className="btn btn-warning mr-2" onClick={(e) => onResetForm(e)}><CIcon icon={cilReload} className="mr-1" />Reset</button> */}
                        {/* <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button> */}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
