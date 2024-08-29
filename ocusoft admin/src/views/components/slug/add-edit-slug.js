// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';
import Loader from "../common/loader/loader"
import { cilCheck, cilXCircle } from '@coreui/icons';

import { CFormCheck } from '@coreui/react'
import { useToast } from '../../../shared/toaster/Toaster';
import { InputTextarea } from 'primereact/inputtextarea';
import { isEmpty, isTextValid } from 'src/shared/handler/common-handler';

const AddEditSlug = () => {
    let history = useHistory();
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;

    const [masterForm, setMasterForm] = useState({
        account: '',
        slug: '',
        is_active: 1,
        meta_title: '',
        meta_keyword: '',
        meta_robot_option: '',
        meta_description: '',
        script: '',
    })
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [accountData, setAccountData] = useState([])
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();

    useEffect(() => {
        getAccountData();
        if (id) getSlugDataById();
    }, []);

    useEffect(() => {
        setMasterForm({ ...masterForm, ['account']: localStorage.getItem('account_id') });
    }, [accountData])

    const getAccountData = () => {
        API.getAccountDataByLoginId(getAcccountDataResponse, '', true);
    }

    const onAccountChange = (e) => {
        setMasterForm({ ...masterForm, account: e.target.value });
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
    }

    const getSlugDataById = () => {
        setIsLoading(true);
        API.getMasterDataById(getSlugByIdResponse, '', true, id, Constant.SLUG_SHOW);
    }

    const getSlugByIdResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                let responseData = response.data;
                let obj = {
                    slug: responseData.slug ?? '',
                    is_active: responseData.is_active ?? '',
                    script: responseData?.slug_detail?.script ?? '',
                    account: responseData.account?.account_id ?? '',
                    meta_title: responseData?.slug_detail?.meta_title ?? '',
                    meta_keyword: responseData?.slug_detail?.meta_keyword ?? '',
                    meta_description: responseData?.slug_detail?.meta_description ?? '',
                    meta_robot_option: responseData?.slug_detail?.meta_robot_option ?? '',
                };

                setMasterForm({ ...obj });
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const getAcccountDataResponse = {
        cancel: () => { },
        success: response => {
            let _accountData = []
            if (response?.meta?.status) _accountData = response.data;
            setAccountData(_accountData);
        },
        error: err => {
            console.log(err);
            setAccountData([]);
        },
        complete: () => { },
    }

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let obj = { ...masterForm };

        if ("script" in obj) delete obj.script;
        if ("description" in obj) delete obj.description;

        for (const [key, value] of Object.entries(obj)) {
            if (isEmpty(value)) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} is required`;
            } else if ((key == 'meta_title' || key === 'slug') && isTextValid(value)) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `Please enter valid ${keyName}`;
            } else if (key === "meta_title" && value.length > 60) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} must not be longer than 60 characters.`;
            }

            setErrors({ ...errors });
        }

        return formIsValid;
    }

    const onHandleChange = (event, radioVal) => {
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        }
        else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const oncancleForm = (e) => {
        e.preventDefault()
        history.push('/slug')
    }

    const onSubmit = async e => {
        e.preventDefault()
        if (onHandleValidation()) {
            const _accountId = (adminRole === "SUPER_ADMIN") ? masterForm.account : localStorage.getItem("account_id");
            let resObj = {
                account_id: _accountId,
                slug: masterForm.slug,
                script: masterForm.script,
                is_active: masterForm.is_active,
                meta_title: masterForm.meta_title,
                meta_keyword: masterForm.meta_keyword,
                meta_description: masterForm.meta_description,
                meta_robot_option: masterForm.meta_robot_option,
            }

            let formData = new FormData();
            formData.append("data", JSON.stringify(resObj));

            if (id) {
                API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.SLUG_UPDATE)
            } else {
                API.addMaster(addEditMasterRes, formData, true, Constant.SLUG_CREATE);
            }
        }

    }

    const addEditMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                
                setTimeout(() => {
                    history.push('/slug')
                }, 1000);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err.errors) {
                Object.values(err.errors).map(err => {
                    showError(err);
                })
            } else if (err?.meta?.message) {
                showError(err.meta.message);
            }
        },
        complete: () => { },
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
                        <h5 className="card-title">{id ? 'Update Slug' : 'Add Slug'} </h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div>
                            <fieldset className="fieldset">
                                <legend className="legend">Basic Detail</legend>

                                <div className="row">
                                    {
                                        adminRole === "SUPER_ADMIN" && (
                                            <div className="col-md-6 col-lg-4 mb-3">
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
                                    <div className="col-md-6 col-lg-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText value={masterForm.slug} className="form-control" name="slug" onChange={(e) => onHandleChange(e)} />
                                            <label>Slug<span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['slug']}</p>
                                    </div>

                                    <div className="col-md-12 col-lg-6 mb-2 d-flex align-items-center">
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

                            </fieldset>

                            <fieldset className="fieldset">
                                <legend className="legend">SEO</legend>

                                <div className="row">
                                    <div className="col-md-6 col-lg-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText
                                                className="form-control"
                                                name="meta_title"
                                                value={masterForm.meta_title}
                                                onChange={e => onHandleChange(e)}
                                            />
                                            <label>Meta Title<span className="text-danger">*</span></label>
                                            <p className="error">{error['meta_title']}</p>
                                        </span>
                                    </div>

                                    <div className="col-md-6 col-lg-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText
                                                className="form-control"
                                                name="meta_keyword"
                                                value={masterForm.meta_keyword}
                                                onChange={(e) => onHandleChange(e)}
                                            />
                                            <label>Meta Keyword<span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['meta_keyword']}</p>
                                    </div>

                                    <div className="col-md-6 col-lg-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText
                                                className="form-control"
                                                name="meta_robot_option"
                                                value={masterForm.meta_robot_option}
                                                onChange={e => onHandleChange(e)}
                                            />
                                            <label>Meta Robot Option<span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['meta_robot_option']}</p>
                                    </div>

                                    <div className="col-md-12 col-lg-6 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputTextarea
                                                rows={5}
                                                cols={50}
                                                name='meta_description'
                                                value={masterForm.meta_description}
                                                onChange={(e) => onHandleChange(e)}
                                                className="w-100"
                                            />
                                            <label>Meta Description<span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['meta_description']}</p>
                                    </div>

                                    <div className="col-md-12 col-lg-6 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputTextarea
                                                rows={5}
                                                cols={50}
                                                name="script"
                                                value={masterForm.script}
                                                onChange={(e) => onHandleChange(e)}
                                                className="w-100"
                                            />
                                            <label>Script</label>
                                        </span>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={e => { onSubmit(e) }}>
                            <CIcon icon={cilCheck} className="mr-1" />{id ? "Update" : "Save"}
                        </button>

                        <button className="btn btn-danger mb-2" onClick={e => oncancleForm(e)}>
                            <CIcon icon={cilXCircle} className="mr-1" />Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditSlug
