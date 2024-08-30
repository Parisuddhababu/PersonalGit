// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { API } from '../../../../services/Api';
import { Password } from 'primereact/password';
import * as Constant from "../../../../shared/constant/constant"
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import { cilCheck } from '@coreui/icons';
import { Dropdown } from 'primereact/dropdown';

const AddSMSIntegration = ({accountData}) => {
    const { showError, showSuccess } = useToast();
    const primaryHcpId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;

    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [masterForm, setMasterForm] = useState({
        host: '',
        port: '',
        driver: '',
        username: '',
        password: '',
        from_name: '',
        encryption: '',
        from_address: '',
        account: adminRole !== "SUPER_ADMIN" ? primaryHcpId : '',
    });

    useEffect(() => {
        if (masterForm.account) getSMSIntegrationByAccount();
    }, [masterForm.account]);

    const onAccountChange = e => {
        setMasterForm({ ...masterForm, account: e.target.value });
        setErrors({ ...error, account: '' });
    }

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            account: masterForm.account,
            driver: masterForm.driver,
            host: masterForm.host,
            port: masterForm.port,
            username: masterForm.username,
            password: masterForm.password,
            encryption: masterForm.encryption,
            from_address: masterForm.from_address,
            from_name: masterForm.from_name,
        }
        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');
            if (!value) {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            }
            setErrors({ ...errors });
        }
        return formIsValid;
    }

    const onHandleChange = (event) => {
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
    }

    const getSMSIntegrationByAccount = () => {
        setIsLoading(true);
        API.getMasterDataById(getMasterRes, null, true, masterForm.account, Constant.SHOW_SMS_INTEGRATION_SCRIPT);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false)
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                let resVal = response.data
                let obj = {
                    account: resVal?.account?.account_id ?? accountId,
                    driver: resVal.mailgun_driver ?? '',
                    host: resVal.mailgun_host ?? '',
                    port: resVal.mailgun_port ?? '',
                    username: resVal.user_name ?? '',
                    password: resVal.password ?? '',
                    encryption: resVal.encrytion ?? '',
                    from_address: resVal.from_address ?? '',
                    from_name: resVal.from_name ?? '',
                }
                setMasterForm({ ...obj })
                setErrors({})
            }
        },
        error: (error) => {
            setIsLoading(false)
            // Reset form field when change account and data not found
            if(error?.meta.status_code === 404){
                resetForm();
            }
        },
        complete: () => {
        },
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (onHandleValidation()) {
            const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
            let resObj = {
                mailgun_driver: masterForm.driver,
                mailgun_host: masterForm.host,
                mailgun_port: masterForm.port,
                user_name: masterForm.username,
                password: masterForm.password,
                encrytion: masterForm.encryption,
                from_address: masterForm.from_address,
                from_name: masterForm.from_name,
                account_id: _accountId
            }
            setIsLoading(true)
            API.addMaster(addEditMasterRes, resObj, true, Constant.SMS_INTEGRATION_SCRIPT);
        }
    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(message);
        },
        error: (error) => {
            setIsLoading(false)
            if (error.errors) {
                Object.values(error.errors).map(err => {
                    showError(err)
                })
            } else if (error?.meta?.message) {
                showError(error.meta.message);
            } else {
                showError("Something went wrong!");
            }
        },
        complete: () => {
        },
    }


    const resetForm = () => {
        let obj = {
            driver: "",
            host: "",
            port: "",
            username: "",
            password: "",
            encryption: "",
            from_address: "",
            from_name: "",
            account: masterForm.account
        }
        setMasterForm(obj)
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
                <div className="">

                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Mail Integrations</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className='col-xl-12'>
                                    {
                                        adminRole === 'SUPER_ADMIN' && (
                                            <div className="col-md-4 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <Dropdown
                                                        value={masterForm.account}
                                                        className="form-control"
                                                        options={accountData}
                                                        onChange={onAccountChange}
                                                        itemTemplate={accountDataTemplate}
                                                        valueTemplate={accountDataTemplate}
                                                        optionLabel="company_name"
                                                        optionValue="_id"
                                                        filter
                                                        filterBy="company_name,code"
                                                    />
                                                    <label>HCP<span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['account']}</p>
                                            </div>
                                        )
                                    }
                                    <fieldset className="fieldset">
                                        <legend className="legend">Mail Integration</legend>


                                        <div className="row">
                                            <div className="col-md-12 col-lg-4 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label">
                                                    <InputText className="form-control" name="driver" autoFocus value={masterForm.driver} onChange={(e) => onHandleChange(e)} />
                                                    <label>Driver <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['driver']}</p>
                                            </div>
                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputText className="form-control" name="host" value={masterForm.host} onChange={(e) => onHandleChange(e)} />
                                                    <label>Host <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['host']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputText className="form-control" name="port" value={masterForm.port} onChange={(e) => onHandleChange(e)} />
                                                    <label>PORT <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['port']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputText className="form-control" name="username" value={masterForm.username} onChange={(e) => onHandleChange(e)} />
                                                    <label>User Name <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['username']}</p>
                                            </div>


                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <Password value={masterForm.password} name='password' className="form-control" onChange={(e) => onHandleChange(e)} toggleMask />
                                                    <label>Password <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['password']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputText className="form-control" name="encryption" value={masterForm.encryption} onChange={(e) => onHandleChange(e)} />
                                                    <label>Encryption <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['encryption']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputText className="form-control" name="from_address" value={masterForm.from_address} onChange={(e) => onHandleChange(e)} />
                                                    <label>From Address <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['from_address']}</p>
                                            </div>

                                            <div className="col-md-12 col-lg-6 col-xl-4 mb-3">
                                                <span className="p-float-label custom-p-float-label color-picker-wrapper">
                                                    <InputText className="form-control" name="from_name" value={masterForm.from_name} onChange={(e) => onHandleChange(e)} />
                                                    <label>From Name <span className="text-danger">*</span></label>
                                                </span>
                                                <p className="error">{error['from_name']}</p>
                                            </div>


                                        </div>

                                    </fieldset>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onSubmit(e) }}><CIcon icon={cilCheck} className="mr-1" />Save</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddSMSIntegration
