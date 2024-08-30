// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { useLocation } from "react-router-dom";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import * as Message from "../../../../shared/constant/error-message"
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { cilCheck } from '@coreui/icons';
import { EMAIL_REGEX } from '../../../../shared/regex/regex'
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import { emailLowerCase } from 'src/shared/handler/common-handler';

const ContactUs = () => {
    const accountId = localStorage.getItem('account_id');
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;

    const [masterForm, setMasterForm] = useState({
        'contact number': '',
        // "meet link": '',
        // 'whatsapp number': '',
        email: '',
        account: '',
        country: '',
    })
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [accountData, setAccountData] = useState([])
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [countryList, setCountryList] = useState([]);


    useEffect(() => {
        setMasterForm({ ...masterForm, ['account']: accountId })
        getContactByAccount(accountId);
    }, [accountData])

    useEffect(() => {
        getCountryData()
        getAccountData()
    }, [])

    const onAccountChange = (e) => {
        const data = masterForm;
        data['account'] = e.target.value;
        setMasterForm({ ...data })
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
        getContactByAccount(e.target.value);
    }
    const getContactByAccount = (val) => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, val, Constant.SHOWCONTACTUSCOMMON);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data;
                if (resVal) {
                    let obj = {
                        'contact number': resVal?.contactus_contact_number ? resVal?.contactus_contact_number : '',
                        email: resVal?.contactus_email ? resVal?.contactus_email : '',
                        // "meet link": resVal?.contactus_meetlink ? resVal?.contactus_meetlink : '',
                        // 'whatsapp number': resVal?.contactus_whatsapp_number ? resVal?.contactus_whatsapp_number : '',
                        account: resVal?.account?.account_id ? resVal?.account?.account_id : masterForm.account,
                        country: resVal?.country?.country_id ? resVal?.country?.country_id : ''
                    }
                    setMasterForm({ ...obj })
                }
                setErrors({})
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)


        },
        complete: () => {
        },
    }

    const getCountryData = () => {
        API.getDrpData(CountryRes, "", true, Constant.COUNTRY_LIST_ACTIVE);
    }

    // Country Response Data Method
    const CountryRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setCountryList(resVal)
            }
        },
        error: (error) => {


        },
        complete: () => {
        },
    }

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

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            account: masterForm.account,
            'country code and phone number': (masterForm['contact number'] && masterForm.country),
            // "meet link": masterForm["meet link"].trim(),
            // 'whatsapp number': masterForm['whatsapp number'],
            email: masterForm.email.trim(),
        }

        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');

            if (!value) {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            }
            // else if(key === "meet link"){
            //     if (!isUrlValid(value)) {
            //         formIsValid = false;
            //         errors[key] = Message.URLERR;
            //     }
            // }
            else if (key === 'email') {
                if (!EMAIL_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.EMAILERR;
                }
            }
            setErrors({ ...errors });
        }
        return formIsValid;

    }

    const onHandleChange = (event, radioVal, isAddress) => {
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        }
        else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }



    const onSubmit = (e) => {
        e.preventDefault()
        if (onHandleValidation()) {
            const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
            let resObj = {
                'contactus_contact_number': masterForm['contact number'],
                'contactus_email': emailLowerCase(masterForm?.email),
                'account_id': _accountId,
                'country': masterForm.country,
            }

            setIsLoading(true)

            API.addMaster(addMasterRes, resObj, true, Constant.ADDCONTACTUSCOMMON);
        }
    }

    const addMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                showSuccess(response.meta.message)
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

    const onDropdownChangeAddress = (e, key) => {
        setMasterForm({ ...masterForm, [key]: e.target.value })
        let errors = error
        errors[key] = ''
        setErrors({ ...errors });
    }

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    <img alt={option.name} src={(option?.country_flag && option?.country_flag[0] ? option?.country_flag[0]?.path : '')} />
                    <div>{option.country_phone_code}</div>
                </div>
            );
        }
        return (
            <span>
                {props.country_phone_code}
            </span>
        );
    }

    const countryOptionTemplate = (option) => {
        return (
            <div className="country-item">
                <img src={(option?.country_flag && option?.country_flag[0] ? option?.country_flag[0]?.path : '')} />
                <div>{option.name}
                    <span><b>{' '}{option?.country_phone_code}</b></span></div>
            </div>
        );
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (

        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update Contact Us' : 'Add Contact Us'} </h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">

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
                                                optionLabel="name"
                                                optionValue="_id"
                                                filter
                                                filterBy="name,code"
                                            />
                                            <label>Account <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['account']}</p>
                                    </div>
                                )
                            }

                            <div className="col-md-4 mb-3 country-code">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm.country}
                                        className="form-control country-code-back"
                                        options={countryList}
                                        filter filterBy="country_code,country_phone_code"
                                        onChange={(e) => onDropdownChangeAddress(e, 'country')}
                                        optionLabel="country_phone_code"
                                        optionValue="_id"
                                        placeholder="Country Code"
                                        itemTemplate={countryOptionTemplate}
                                        valueTemplate={selectedCountryTemplate}
                                    />
                                    <InputMask id="phone" placeholder='Phone Number' mask="9999999999" className="form-control" name='contact number' value={masterForm['contact number']} onChange={(e) => onHandleChange(e)}></InputMask>
                                    <label>Contact Number <span className="text-danger">*</span> </label>
                                </span>
                                <p className="error">{error['country code and phone number']}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="email" value={masterForm.email} onChange={(e) => onHandleChange(e)} />
                                    <label>Email <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['email']}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={onSubmit}>
                            <CIcon icon={cilCheck} />{id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ContactUs
