// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputTextarea } from 'primereact/inputtextarea';
import { cilCheck, cilXCircle } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import useEditorImage from 'src/customHooks/useEditorImage';

import { CFormCheck } from '@coreui/react'
import { Jodit } from "jodit-react";

const EditSystemEmails = () => {
    let history = useHistory();
    const accountVal = localStorage.getItem('is_main_account')
    let editor = null;

    const [masterForm, setMasterForm] = useState({
        account: '',
        'template purpose': '',
        subject: '',
        content: '',
        is_active: 1,
    })
    const [accountData, setAccountData] = useState([]);
    const [description, setDescription] = useState('');
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [, setShowEditor] = useState(false);
    const {
        getEditorUploadedImagesURL,
        getEditorUploadedUserRemovedImages,
        removeImagesFromBucket,
        editorImages
    } = useEditorImage();

    useEffect(() => {
        getAccountData()

        editor = Jodit.make("#editor", {
            uploader: {
                insertImageAsBase64URI: true,
                imagesExtensions: ["jpg", "png", "jpeg"]
            }
        });
        editor.e.on("change", description => setDescription(description));

        if (id) {
            getSystemEmailDataById()
        }
    }, [])

    useEffect(() => {
        // getDisableVal()
    }, [masterForm])

    useEffect(() => {
        if (accountVal === '0') {
            setMasterForm({ ...masterForm, ['account']: localStorage.getItem('account_id') })

        }
    }, [accountData])

    const getSystemEmailDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.SHOWSYSTEMEMAILS);
    }

    const getAccountData = () => {
        // API.getAccountData(accountRes, "", true)
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
    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: () => { },
        success: response => {
            if (response.meta.status_code === 200) {
                const resVal = response.data
                let obj = {
                    subject: resVal.email_subject,
                    'template purpose': resVal.template_purpose,
                    email_key: resVal.email_key,
                    content: resVal.email_body,
                    is_active: resVal.is_active,
                }
                getEditorUploadedImagesURL(resVal.email_body);
                editor.setEditorValue(resVal.email_body);
                setDescription(resVal.email_body);

                setMasterForm({ ...obj });
                setIsLoading(false);
                setShowEditor(true);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            'template purpose': masterForm['template purpose'].trim(),
            subject: masterForm.subject.trim(),
        }

        for (const [key, value] of Object.entries(validationObj)) {
            if (!value) {
                formIsValid = false;
                errors[key] = `${key} is required`;
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
        }
        else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const oncancleForm = (e) => {
        e.preventDefault()
        history.push('/system-email')
    }

    const onUpdate = async e => {
        e.preventDefault()
        if (onHandleValidation()) {
            if (editorImages.length > 0) {
                let editorUploadedUserRemovedImages = getEditorUploadedUserRemovedImages(description);
                removeImagesFromBucket(editorUploadedUserRemovedImages);
            }

            let obj = {
                "template_purpose": masterForm['template purpose'],
                "email_key": masterForm.email_key,
                "email_subject": masterForm.subject,
                "email_body": description,
                "is_active": masterForm.is_active,
            };
            setIsLoading(true);
            API.UpdateCmsData(updateMasterDataRes, obj, true, id, Constant.UPDATESYSTEMEMAILS);
        }
    }

    const updateMasterDataRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);

                setTimeout(() => {
                    history.push("/system-email");
                }, 1000);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(error.meta.message);
        },
        complete: () => { },
    }

    return (

        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update System Email' : 'Add System Email'} </h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputTextarea className="form-control" name='template purpose' value={masterForm['template purpose']} onChange={(e) => onHandleChange(e)} required />
                                    <label>Template Purpose <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['template purpose']}</p>

                            </div>
                            <div className="col-md-12 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputTextarea className="form-control" name="subject" value={masterForm.subject} onChange={(e) => onHandleChange(e)} required />
                                    <label>Subject<span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['subject']}</p>

                            </div>
                            <div className="col-md-12 mb-3">
                                <label>Content <span className="text-danger">*</span></label>
                                <textarea id="editor"></textarea>
                                <p className="error">{error['content']}</p>
                            </div>

                            <div className="col-md-12 mb-3 d-flex align-items-center">
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
                        <button className="btn btn-primary mb-2 mr-2" onClick={onUpdate}><CIcon icon={cilCheck} className="mr-1" />{id ? 'Update' : 'Save'}</button>
                        <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditSystemEmails
