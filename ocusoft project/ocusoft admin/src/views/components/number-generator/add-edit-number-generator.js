// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { cilCheck, cilXCircle } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant";
import { Dropdown } from 'primereact/dropdown';
import {
    CFormCheck,
} from '@coreui/react';
import Loader from "../common/loader/loader";
import { useToast } from '../../../shared/toaster/Toaster';
import * as Regex from "../../../shared/regex/regex";
import * as Message from "../../../shared/constant/error-message"

const AddEditNumberGenerator = () => {
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    let history = useHistory();

    const [masterForm, setMasterForm] = useState({
        type: '',
        account: '',
        is_active: 1,
        start_from: '',
        prefix: '',
        postfix: ''
    })
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [accountData, setAccountData] = useState([])
    const [typeData, setTypeData] = useState([])
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [, setFinancialData] = useState(null)

    useEffect(() => {
        getAccountData()
        getTypeData()
        if (id) {
            getNumberGenerateDataById()
        }
    }, [])

    useEffect(() => {
        setMasterForm({ ...masterForm, ['account']: localStorage.getItem('account_id') });
    }, [accountData])

    const getAccountData = () => {
        API.getAccountDataByLoginId(accountRes, "", true)
    }

    // accountRes Response Data Method
    const accountRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setAccountData(resVal)
            }
        },
        error: (error) => {


        },
        complete: () => {
        },
    }

    const getTypeData = () => {
        API.getActiveDataList(Constant.NUMBER_GENERATOR_TYPE_LIST, typeRes, "", true)
    }

    // typeRes Response Data Method
    const typeRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                const resVal = response.data;
                setFinancialData(resVal?.financial_year)
                setTypeData(resVal?.type)
            }
        },
        error: (error) => {
        },
        complete: () => {
        },
    }

    const getNumberGenerateDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.NUMBER_GENERATOR_SHOW);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                let obj = {
                    type: resVal.type,
                    is_active: resVal.is_active,
                    start_from: resVal.start_from,
                    account: resVal.account?.account_id,
                    prefix: resVal.prefix,
                    postfix: resVal.postfix,
                }
                setMasterForm({ ...obj })
                setIsLoading(false)
                // setMasterForm(resVal)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            type: masterForm.type,
            account: masterForm.account,
            start_from: masterForm.start_from,
            // prefix: masterForm.prefix,
            // postfix: masterForm.postfix,
        }

        for (const [key, value] of Object.entries(validationObj)) {
            if (!value) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} is required`;
            }
            if (key === 'start_from') {
                if (value && !Regex.ONLY_NUMBER_DASH.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.NUMBER_DASH_ERR;
                }
            }
            setErrors({ ...errors });
        }
        return formIsValid;

    }


    const onHandleChange = (event, radioVal) => {
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const oncancleForm = (e) => {
        e.preventDefault()
        history.push('/number-generator')
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
        if (onHandleValidation()) {
            const reqData = {
                type: masterForm.type,
                account_id: _accountId,
                is_active: masterForm.is_active,
                start_from: masterForm.start_from,
                prefix: masterForm.prefix,
                postfix: masterForm.postfix
            }


            setIsLoading(true)

            if (id) {
                API.UpdateMasterData(addEditMasterRes, reqData, true, id, Constant.NUMBER_GENERATOR_UPDATE);
            } else {
                API.addMaster(addEditMasterRes, reqData, true, Constant.NUMBER_GENERATOR_ADD);
            }
        }

    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                showSuccess(response.meta.message)

                setTimeout(() => {
                    history.push('/number-generator')
                }, 1000);
                setIsLoading(false)
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

    const onTypeChange = (e) => {
        setMasterForm({ ...masterForm, [e.target.name]: e.target.value })
        let errors = error
        errors[e.target.name] = ''
        setErrors({ ...errors });
    }

    const onAccountChange = (e) => {
        setMasterForm({ ...masterForm, ['account']: e.target.value })
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (

        <div>
            {isLoading && <Loader />}

            <form name="numberGeneratorFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update Number Generator' : 'Add Number Generator'} </h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">
                            {
                                adminRole === 'SUPER_ADMIN' && (
                                    <div className="col-md-12 mb-3">
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
                                            <label>HCP <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['account']}</p>
                                    </div>
                                )
                            }

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown value={masterForm.type} className="form-control" name="type" options={typeData} onChange={onTypeChange} optionLabel="code" optionValue="name" required />
                                    <label>Type <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['type']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="start_from" value={masterForm.start_from} onChange={(e) => onHandleChange(e)} required />
                                    <label>Start From <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['start_from']}</p>
                            </div>
                            <div className="col-md-3 mb-lg-6">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText className="form-control" name="prefix" value={masterForm.prefix} maxLength={Regex.NUMBER_GENERATOR_MAXLENGTH} onChange={(e) => onHandleChange(e)} />
                                    <span className="character-count">{masterForm.prefix ? masterForm.prefix.length : 0}/{Regex.NUMBER_GENERATOR_MAXLENGTH}</span>
                                    <label>Prefix </label>
                                </span>
                            </div>
                            <div className="col-md-3 mb-lg-6">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText className="form-control" name="postfix" value={masterForm.postfix} maxLength={Regex.NUMBER_GENERATOR_MAXLENGTH} onChange={(e) => onHandleChange(e)} />
                                    <span className="character-count">{masterForm.postfix ? masterForm.postfix.length : 0}/{Regex.NUMBER_GENERATOR_MAXLENGTH}</span>
                                    <label>Postfix </label>
                                </span>
                            </div>
                            <div className="col-md-3 mb-3 d-flex">
                                <div>
                                    <label className="mr-2">Status</label>
                                    <div>
                                        <CFormCheck
                                            inline
                                            type="radio"
                                            name="is_active"
                                            id="active"
                                            value={masterForm.is_active === 1 ? true : false}
                                            checked={masterForm.is_active === 1 ? true : false}
                                            label="Active"
                                            onChange={(e) => onHandleChange(e, true)}
                                            className="customradiobutton"
                                        />
                                        <CFormCheck
                                            inline
                                            type="radio"
                                            name="is_active"
                                            id="inactive"
                                            value={masterForm.is_active !== 1 ? true : false}
                                            checked={masterForm.is_active !== 1 ? true : false}
                                            label="In Active"
                                            onChange={(e) => onHandleChange(e, false)}
                                            className="customradiobutton"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onSubmit(e) }}><CIcon icon={cilCheck} className="mr-1" />{id ? 'Update' : 'Save'}</button>
                        {/* <button className="btn btn-success mr-2"><CIcon icon={cilCheckCircle} className="mr-1" />Save & Continue</button> */}
                        {/* <button className="btn btn-warning mr-2" onClick={(e) => onResetForm(e)}><CIcon icon={cilReload} className="mr-1" />Reset</button> */}
                        <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditNumberGenerator
