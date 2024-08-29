// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import React, { useState, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { cilCheck, cilXCircle } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import { CFormCheck } from '@coreui/react'
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import { isEmpty, isTextValid, uuid } from 'src/shared/handler/common-handler';

const AddEditRolePermission = () => {

    let initialState = {
        name: '',
        code: '',
        is_active: 1,
        showToMicrosite: false,
    }
    const [masterForm, setMasterForm] = useState(initialState)
    let history = useHistory();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [error, setErrors] = useState(initialState)
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const statusOption = Constant.STATUS_OPTION

    useEffect(() => {
        if (id) {
            getRoleDataById()
        }
    }, [])

    const getRoleDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.ROLE_SHOW);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                let resVal = response.data
                let obj = {
                    name: resVal.name,
                    code: resVal.code,
                    is_active: resVal.is_active,
                    showToMicrosite: resVal?.is_show == 1 ? true : false,
                }
                setMasterForm({ ...obj });
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
        for (const [key, value] of Object.entries(masterForm)) {
            const keyName = key.replace(/_/g, ' ');

            if (isEmpty(value)) {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            }
            
            if ((key == 'name') && isTextValid(value)) {
                formIsValid = false;
                errors[key] = `Please enter valid ${keyName}`;
            }
            setErrors({ ...errors });
        }
        return formIsValid;
    }

    const onHandleChange = (event) => {
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
    }

    const oncancleForm = () => {
        history.push(`/roles-permission`);
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (onHandleValidation()) {
            const reqData = {
                name: masterForm.name,
                code: masterForm.code,
                is_active: masterForm.is_active,
                is_show: masterForm.showToMicrosite ? 1 : 0,
            }
            setIsLoading(true)
            if (id) {
                API.UpdateMasterData(addEditMasterRes, reqData, true, id, Constant.ROLE_UPDATE)
            } else {
                API.addMaster(addEditMasterRes, reqData, true, Constant.ROLE_CREATE);
            }
        }
    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                showSuccess(response.meta.message)
                oncancleForm();
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

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate onSubmit={(e) => { onSubmit(e) }}>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update' : 'Add'} Role </h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        name="name"
                                        value={masterForm.name}
                                        onChange={(e) => onHandleChange(e)}
                                    />
                                    <label>Name <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['name']}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        name="code"
                                        value={masterForm.code}
                                        onChange={(e) => onHandleChange(e)}
                                    />
                                    <label>Code <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['code']}</p>
                            </div>

                            <div className="col-md-2 d-flex align-items-center custom-checkbox">
                                <Checkbox
                                    checked={masterForm.showToMicrosite}
                                    name="showToMicrosite"
                                    onChange={e => setMasterForm({ ...masterForm, showToMicrosite: e.checked })}
                                />
                                <label className="checkbox-label-with-space">Show To Microsite</label>
                            </div>

                            <div className="col-md-12 col-lg-6 mb-3 d-flex">
                                <div>
                                    <label className="mr-2">Status</label>
                                    <div>
                                        {statusOption.map((val, idx) => <CFormCheck
                                            key={uuid()}
                                            inline
                                            type="radio"
                                            name="is_active"
                                            id={val.name}
                                            value={val.code}
                                            checked={val.code == masterForm.is_active}
                                            label={val.name}
                                            onChange={(e) => onHandleChange(e)}
                                            className="customradiobutton"
                                        />)}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="card-footer">
                        <button type='submit' className="btn btn-primary mb-2 mr-2">
                            <CIcon icon={cilCheck} className='mr-1' />{id ? 'Update' : 'Save'}
                        </button>

                        <button type='button' className="btn btn-danger mb-2" onClick={() => oncancleForm()}>
                            <CIcon icon={cilXCircle} className="mr-1" />Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditRolePermission
