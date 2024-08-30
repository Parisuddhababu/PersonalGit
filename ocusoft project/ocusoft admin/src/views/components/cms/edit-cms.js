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
import * as Constant from "../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import { isTextValid } from 'src/shared/handler/common-handler';
import useEditorImage from 'src/customHooks/useEditorImage';
import { Jodit } from "jodit-react";

const EditCMS = () => {
    let history = useHistory();
    const search = useLocation().search;
    const { showError, showSuccess } = useToast();
    const id = new URLSearchParams(search).get("id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;
    const primaryHCPId = adminRole !== "SUPER_ADMIN" ? localStorage.getItem("account_id") : '';

    let editor = null;

    const [error, setErrors] = useState({});
    const [description, setDescription] = useState('');
    const [accountData, setAccountData] = useState([]);
    const [masterForm, setMasterForm] = useState({ slug: '', title: '', account: primaryHCPId });
    const [isLoading, setIsLoading] = useState(false)
    const {
        getEditorUploadedUserRemovedImages,
        getEditorUploadedImagesURL,
        removeImagesFromBucket,
        editorImages
    } = useEditorImage();

    useEffect(() => {
        editor = Jodit.make("#editor", {
            uploader: {
                insertImageAsBase64URI: true,
                imagesExtensions: ["jpg", "png", "jpeg"]
            }
        });
        editor.e.on("change", description => {
            setDescription(description);
        });

        if (id) {
            getCmsDataById();
        }
        getAccountData();
    }, []);

    const getCmsDataById = () => {
        API.getMasterDataById(getMasterRes, "", true, id, Constant.SHOWCMS);
    }

    const getAccountData = () => {
        API.getAccountDataByLoginId(accountRes, "", true)
    }

    const onAccountChange = (e) => {
        setMasterForm({ ...masterForm, ['account']: e.target.value })
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
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
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                let obj = {
                    title: resVal.page_title,
                    slug: resVal.slug,
                    account: resVal.account.account_id
                }
                getEditorUploadedImagesURL(resVal.description)
                editor.setEditorValue(resVal.description);
                setDescription(resVal.description);
                setMasterForm(obj)
            }
            setIsLoading(false);
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
            account: masterForm.account,
            title: masterForm.title.trim(),
            description: description.trim(),
            slug: masterForm.slug,
        }

        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');
            if (!value) {
                formIsValid = false;
                const displayedKey = key === "account" ? "HCP" : keyName;
                errors[key] = `${displayedKey} is required`;
            }

            if ((key == 'title') && isTextValid(value)) {
                formIsValid = false;
                errors[key] = `Please enter valid ${keyName}`;
            }

            if (key === "slug") {
                const textRegex = /[^(a-zA-Z-\d)]+/g;
                if (textRegex.test(value)) {
                    errors[key] = "slug must not contain special characters except '-'";
                    formIsValid = false;
                }
            }
            setErrors({ ...errors });
        }
        return formIsValid;
    }

    const onHandleChange = (event, radioVal) => {
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });

        if (event.target.name === "title") {
            getSlug(event.target.value);
        } else if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const oncancleForm = (e) => {
        e.preventDefault()
        history.push('/cms')
    }

    const onUpdate = async e => {
        e.preventDefault()
        const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');

        if (onHandleValidation()) {
            setIsLoading(true);

            if (editorImages.length > 0) {
                let editorUploadedUserRemovedImages = getEditorUploadedUserRemovedImages(description);
                if (editorUploadedUserRemovedImages?.length > 0) {
                    removeImagesFromBucket(editorUploadedUserRemovedImages);
                }
            }

            let obj = {
                "account_id": _accountId,
                "page_title": masterForm.title,
                "slug": trimDash(masterForm.slug),
                description,
                "is_active": 1
            }

            if (id) {
                API.UpdateCmsData(updateMasterDataRes, obj, true, id, Constant.UPDATECMS)
            } else {
                API.addMaster(addMasterDataRes, obj, true, Constant.ADDCMS);
            }
        }

    }

    // updateMasterDataRes Response Data Method
    const updateMasterDataRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)
                setTimeout(() => {
                    history.push('/cms');
                }, 1000);
            }
            setIsLoading(false);
        },
        error: err => {
            setIsLoading(false)
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => {
        },
    }

    // updateMasterDataRes Response Data Method
    const addMasterDataRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 201) {
                showSuccess(response.meta.message)
                setTimeout(() => {
                    history.push('/cms');
                }, 1000);
            }
            setIsLoading(false);
        },
        error: (error) => {
            setIsLoading(false)
            showError(error.meta.message)
        },
        complete: () => {
        },
    }

    const trimDash = str => {
        const oldSlug = str;
        let leftIndex = 0, rightIndex = oldSlug.length - 1;

        for (let i = 0; i < oldSlug.length; i++) {
            const char = oldSlug[i];
            if (char !== '-') {
                leftIndex = i;
                break;
            }
        }

        let newSlug = oldSlug.slice(leftIndex);

        for (let i = newSlug.length - 1; i >= 0; i--) {
            const char = newSlug[i];
            if (char !== '-') {
                rightIndex = i;
                break;
            }
        }

        newSlug = newSlug.slice(0, rightIndex + 1);
        return newSlug;
    }

    const getSlug = title => {
        const textRegexStr = "[^(a-zA-Z0-9)]+";
        const textRegex = new RegExp(textRegexStr, 'g');
        const slug = title.replaceAll(textRegex, '-').toLowerCase();
        const trimmedSlug = trimDash(slug);

        setMasterForm({ ...masterForm, title, slug: trimmedSlug });
        setErrors({ ...error, slug: '', title: '' });
    }

    const checkSlugEnabling = () => {
        return (id && !masterForm.title) || !masterForm.title;
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
                        <h5 className="card-title">{id ? 'Update CMS' : 'Add CMS'} </h5>
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
                                                onChange={onAccountChange} // NOSONAR
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

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        required
                                        name="title"
                                        maxLength="150"
                                        className="form-control"
                                        value={masterForm.title}
                                        onChange={onHandleChange} // NOSONAR
                                    />
                                    <label>Title <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['title']}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        name="slug"
                                        value={masterForm.slug}
                                        onChange={e => onHandleChange(e)}
                                        disabled={checkSlugEnabling()}
                                        required
                                    />
                                    <label>Slug <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['slug']}</p>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Description <span className="text-danger">*</span></label>
                                <textarea id="editor"></textarea>
                                <p className="error">{error['description']}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={e => onUpdate(e)}><CIcon icon={cilCheck} className="mr-1" />{id ? 'Update' : 'Save'}</button>
                        <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditCMS
