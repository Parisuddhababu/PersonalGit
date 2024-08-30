import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { useLocation, useHistory } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash, cilCheck, cilXCircle } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import { useToast } from 'src/shared/toaster/Toaster';

import Loader from '../../common/loader/loader';
import { API } from 'src/services/Api';
import * as  Constant from "src/shared/constant/constant";
import { Dropdown } from 'primereact/dropdown';
import { uuid } from 'src/shared/handler/common-handler';

const AddEditPaymentGateway = () => {
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const { showError, showSuccess } = useToast();
    const history = useHistory();
    const availableDataTypes = ["TEXT", "NUMBER"];
    const unitKey = { name: '', dataType: '', id: '' };

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ title: '', keys: [{ ...unitKey }]});
    const [masterForm, setMasterForm] = useState({ title: '', code: '', isActive: true, keys: [{ ...unitKey }]});

    useEffect(() => {
        if (id) getPaymentGatewayById(id);
    }, []);

    const getPaymentGatewayById = id => {
        setIsLoading(true);
        API.getMasterDataById(onGetPaymentGatewayByIdResponse, null, true, id, Constant.SHOW_PAYMENT_GATEWAY);
    }

    const onGetPaymentGatewayByIdResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response.data) {
                let _paymentGatewayData = {
                    title: response?.data?.name ?? '',
                    isActive: response?.data?.is_active ?? true,
                    code: response?.data?.code ?? '',
                    keys: response?.data?.keys?.map(paymentGatewayObj => {
                        return { id: uuid(), name: paymentGatewayObj?.name, dataType: paymentGatewayObj?.data_type };
                    }),
                };

                setMasterForm(_paymentGatewayData);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const onHandleChange = (key, value, index = null) => { // NOSONAR
        if (key === "title") {
            const _title = value.replaceAll(/[^a-zA-Z\s]/gm, '');
            const _code = _title.trim().toUpperCase().replaceAll(/\s+/gm, '_');
            const _keys = _title === "COD" ? [] : masterForm.keys;

            if (_code !== "COD" && !masterForm.keys.length) _keys.push(unitKey);

            if (id) setMasterForm({ ...masterForm, title: _title, keys: _keys });
            else setMasterForm({ ...masterForm, title: _title, code: _code, keys: _keys });

            if (errors?.title) {
                let _errors = errors;
                delete _errors["title"];
                setErrors({ ..._errors });
            }
        } else if (key === "name" && index != null) {
            let _keys = masterForm.keys;
            _keys[index].name = value;
            setMasterForm({ ...masterForm, keys: [..._keys] });

            if (errors?.keys?.[index]?.name) {
                let _errors = errors;
                delete _errors.keys[index].name;
                setErrors({ ..._errors });
            }
        } else if (key === "dataType" && index != null) {
            let _keys = masterForm.keys;
            _keys[index].dataType = value;
            setMasterForm({ ...masterForm, keys: [..._keys] });

            if (errors?.keys?.[index]?.dataType) {
                let _errors = errors;
                delete _errors.keys[index].dataType;
                setErrors({ ..._errors });
            }
        }
    }

    const addKey = () => {
        let _keys = masterForm.keys;
        _keys.push({ name: '', dataType: '', id: uuid() });
        setMasterForm({ ...masterForm, keys: [..._keys] });
    }

    const deleteKey = index => {
        let _keys = masterForm.keys;
        _keys.splice(index, 1);
        setMasterForm({ ...masterForm, keys: [..._keys] });

        if (errors?.keys?.[index]) {
            let _errors = errors;
            _errors.keys.splice(index, 1);
            setErrors({ ..._errors });
        }
    }

    const onHandleValidation = () => { // NOSONAR
        let _errors = {};
        let formIsValid = true;

        if (!masterForm.title) {
            _errors["title"] = "title is required.";
            formIsValid = false;
        }

        if (masterForm.title.trim() !== "COD") {
            if (masterForm?.keys?.length === 0) {
                _errors["keyLength"] = "please add atleast one key";
                formIsValid = false;
            } else {
                _errors["keys"] = [];
                let _keys = masterForm.keys;
    
                for (let i = 0; i < _keys.length; i++) {
                    _errors["keys"][i] = {};
                    const spaceRegex = /\s+/g;
                    const typeRegex = /[^a-zA-Z_]/g;
    
                    if (!_keys[i].name) {
                        _errors["keys"][i].name = "key is required.";
                        formIsValid = false;
                    } else if (spaceRegex.test(_keys[i].name)) {
                        _errors["keys"][i].name = "space is not allowed in key.";
                        formIsValid = false;
                    } else if (typeRegex.test(_keys[i].name)) {
                        _errors["keys"][i].name = "key must have only letters and/or underscore(_).";
                        formIsValid = false;
                    }
    
                    if (!_keys[i].dataType) {
                        _errors["keys"][i].dataType = "data type is required.";
                        formIsValid = false;
                    }
                }
            }
        }

        setErrors({ ..._errors });
        return formIsValid;
    }

    const moveToListPage = e => {
        e.preventDefault();
        history.push("/payment-gateway-configuration");
    }

    const onSubmit = e => {
        e.preventDefault();
        if (onHandleValidation()) {
            let data = {
                name: masterForm.title.trim(),
                code: masterForm.code,
                keys: masterForm.keys.map(key => {
                    return { name: key.name.toString(), data_type: key.dataType };
                }),
                is_active: masterForm.isActive ? 1 : 0,
            };

            const url = id ? `${Constant.UPDATE_PAYMENT_GATEWAY}/${id}` : Constant.CREATE_PAYMENT_GATEWAY;
            setIsLoading(true);
            API.addMaster(onCreatePaymentGateway, data, true, url);
        }
    }

    const onCreatePaymentGateway = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response.meta.status) {
                showSuccess(response.meta.message);
                history.push("/payment-gateway-configuration");
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.meta?.message) {
                showError(err.meta.message);
            }
        },
        complete: () => { },
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update' : 'Add'} Payment Gateway</h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row">
                            <div className="col-md-6 mb-3 col-lg-4">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        value={masterForm.title}
                                        onChange={e => onHandleChange("title", e.target.value)}
                                        required
                                    />
                                    <label>Payment Gateway title <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors['title']}</p>

                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" value={masterForm.code} required disabled />
                                    <label>Payment Gateway code <span className="text-danger">*</span></label>
                                </span>

                                <div className="col-md-12 col-lg-6 mb-3 d-flex align-items-center">
                                    <div>
                                        <label className="mr-2">Status</label>
                                        <div>
                                            <CFormCheck
                                                inline
                                                type="radio"
                                                name="is_active"
                                                id="active"
                                                checked={masterForm.isActive ? true : false}
                                                label="Active"
                                                onChange={() => {
                                                    setMasterForm({ ...masterForm, isActive: true });
                                                }}
                                                className="customradiobutton"

                                            />
                                            <CFormCheck
                                                inline
                                                type="radio"
                                                name="is_active"
                                                id="inactive"
                                                checked={masterForm.isActive ? false : true}
                                                label="In Active"
                                                onChange={() => {
                                                    setMasterForm({ ...masterForm, isActive: false });
                                                }}
                                                className="customradiobutton"

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 container">
                                {errors["keyLength"] && <p className="error">{errors["keyLength"]}</p>}
                                {
                                    masterForm.title.trim() !== "COD" && masterForm?.keys?.map((keyObj, index) => (
                                        <div key={keyObj.id} className={`row ml-6 ${index > 0 ? 'mt-3' : ''}`}>
                                            <div className="col-md-4">
                                                <span className="p-float-label custom-p-float-label">
                                                    <InputText
                                                        className="form-control"
                                                        value={keyObj.name}
                                                        onChange={e => onHandleChange("name", e.target.value, index)}
                                                        required
                                                    />

                                                    <label className="ml-0">
                                                        Key {index + 1} <span className="text-danger">*</span>
                                                    </label>
                                                </span>
                                                <p className="error">{errors?.["keys"]?.[index]?.["name"]}</p>
                                            </div>

                                            <div className="col-md-4">
                                                <span className="p-float-label custom-p-float-label">
                                                    <Dropdown
                                                        className="form-control"
                                                        value={keyObj.dataType}
                                                        options={availableDataTypes}
                                                        onChange={e => onHandleChange("dataType", e.target.value, index)}
                                                        required
                                                    />

                                                    <label className="ml-0">
                                                        Data Type {index + 1} <span className="text-danger">*</span>
                                                    </label>
                                                </span>
                                                <p className="error">{errors?.["keys"]?.[index]?.["dataType"]}</p>
                                            </div>

                                            <div className="col-md-3 position-relative">
                                                {
                                                    index == 0 ? (
                                                        <CIcon
                                                            icon={cilPlus}
                                                            title="Add a key"
                                                            onClick={() => addKey()}
                                                            style={{ top: "11px", left: "1px" }}
                                                            className="text-primary cursor-pointer position-absolute"
                                                        />
                                                    ) : (
                                                        <CIcon
                                                            icon={cilTrash}
                                                            title="Delete a key"
                                                            onClick={() => deleteKey(index)}
                                                            style={{ top: "11px", left: "1px" }}
                                                            className="text-danger cursor-pointer position-absolute"
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={onSubmit}>
                            <CIcon icon={cilCheck} className="mr-1" />{id ? "Update" : "Save"}
                        </button>

                        <button type="button" className="btn btn-danger mb-2" onClick={moveToListPage}>
                            <CIcon icon={cilXCircle} className="mr-1" />Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditPaymentGateway;
