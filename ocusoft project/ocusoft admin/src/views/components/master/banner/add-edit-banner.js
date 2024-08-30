// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect, useRef } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { CImage, CFormCheck } from '@coreui/react'
import { cilCheck, cilXCircle, cilCloudUpload } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';
import Closeicon from '../../../../assets/images/close.svg'
import Loader from "../../common/loader/loader"

import infoIcon from "../../../../assets/images/info-icon.png";
import { Tooltip } from 'primereact/tooltip';
import ImageCropModal from "../../../../modal/ImageCropModal";
import { useToast } from '../../../../shared/toaster/Toaster';
import * as Regex from "../../../../shared/regex/regex";
import { isTextValid } from 'src/shared/handler/common-handler';
import dimensionProvider from './preferred-image-dimensions/dimension-provider';
import { imageDimension } from 'src/shared/constant/image-dimension';

const AddEditBanner = () => {
    let history = useHistory();
    const primaryHcpId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const { showError, showSuccess } = useToast();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const { width: logoWidth, height: logoHeight } = imageDimension.BANNER;

    const [accountData, setAccountData] = useState([])
    const [error, setErrors] = useState({})
    const [displayDialog, setDisplayDialog] = useState(false);
    const [browseNote, setBrowseNote] = useState('');
    const [bannerTypeData, setBannerTypeData] = useState([]);
    const [masterForm, setMasterForm] = useState({
        link: '',
        title: '',
        is_active: 1,
        banner_type: '',
        account: adminRole !== "SUPER_ADMIN" ? primaryHcpId : '',
        cover_image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        // TO BE CARRIED OUT IN NEXT PHASE
        /*banner_mobile_image: { url: '', noPicture: false, obj: '', uuid: '' },*/
    })

    const setFormImageData = (imgData) => {
        setDisplayDialog(false)
        setMasterForm({ ...masterForm, ['cover_image']: { url: imgData.url, noPicture: imgData.noPicture, obj: imgData.obj } })
        let errors = error
        errors['logo'] = ''
        setErrors({ ...errors });
    }

    const [isLoading, setIsLoading] = useState(false)
    const fileUploadRef = useRef(null);
    const mobileImageRef = useRef(null);

    useEffect(() => {
        getAccountData()
        getBannerTypeData()
        if (id) {
            getBannerDataById()
        }
    }, []);

    useEffect(() => {
        if (masterForm.banner_type && masterForm.account) {
            const page = masterForm.banner_type;
            const account = masterForm.account;
            let _browseNote = '';
            const dimensionKey = dimensionProvider(page, account);

            if (dimensionKey) {
                const width = dimensionKey.width;
                const height = dimensionKey.height;
                if (width && height) {
                    _browseNote = `We recommend you to upload the image of ${width} / ${height} for exact results`;
                }
            }

            setBrowseNote(_browseNote);
        }
    }, [masterForm.banner_type, masterForm.account]);

    const getBannerTypeData = () => {
        setIsLoading(true);
        API.getBannerTypeData(bannerRes, "", true)
    }

    const bannerRes = {
        cancel: () => { },
        success: response => {
            if (response.meta.status_code === 200) {
                let resVal = response.data;
                setBannerTypeData(resVal);
                setIsLoading(false);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
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

    const bannerTypeChange = e => {
        setMasterForm({ ...masterForm, banner_type: e.target.value });
        let errors = error;
        errors.banner_type = '';
        setErrors({ ...errors });
    }

    const getBannerDataById = () => {
        setIsLoading(true)

        API.getMasterDataById(getMasterRes, "", true, id, Constant.SHOWBANNER);
    }

    const getMasterRes = {
        cancel: () => { },
        success: response => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                let obj = {
                    account: resVal?.account?.account_id,
                    title: resVal.banner_title,
                    is_active: resVal.is_active,
                    link: resVal.link,
                    'banner_type': resVal.type

                }
                if (resVal.banner_image) {
                    obj['cover_image'] = { 'url': resVal?.banner_image?.path, 'noPicture': resVal?.banner_image?.path ? true : false, 'obj': '', uuid: resVal?.banner_image?._id }
                } else {
                    obj['cover_image'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }

                // TO BE CARRIED OUT IN NEXT PHASE
                /*obj["banner_mobile_image"] = {
                    url: resVal?.banner_mobile_image?.path ?? '',
                    noPicture: resVal?.banner_mobile_image?.path ? true : false,
                    obj: '',
                    uuid: resVal?.banner_mobile_image?._id ?? '',
                }*/

                setMasterForm({ ...obj });
                setIsLoading(false);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const accountRes = {
        cancel: () => { },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setAccountData(resVal)
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const onHandleValidation = () => {
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            account: masterForm.account,
            banner_type: masterForm.banner_type,
            image: masterForm?.cover_image?.url,
            // TO BE CARRIED OUT IN NEXT PHASE
            /*mobile_image: masterForm.banner_mobile_image?.url,*/
            link: masterForm?.link
        }

        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');
            if (!value && key !== "title") {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            }
            if ((key == "title") && value && isTextValid(value)) {
                formIsValid = false;
                errors[key] = `Please enter valid ${keyName}`;
            }
            if (key === 'link' && (value === '' || value === null)) {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            } else if (key === 'link' && value !== '' && !isUrlValid(value)) {
                formIsValid = false;
                errors[key] = `Please enter valid ${keyName}`;
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
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        }
        else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const oncancleForm = (e) => {
        e.preventDefault();
        history.push('/banner');
    }

    const onSubmit = e => {
        e.preventDefault()
        const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
        if (onHandleValidation()) {
            let resObj = {
                account_id: _accountId,
                banner_title: masterForm.title ?? '',
                link: masterForm.link,
                is_active: masterForm.is_active,
                type: masterForm.banner_type,
            }

            let formData = new FormData();
            formData.append('data', JSON.stringify(resObj));

            if (masterForm?.cover_image?.obj) {
                formData.append('banner_image', masterForm?.cover_image?.obj, masterForm?.cover_image?.obj?.name);
            }

            setIsLoading(true)
            if (id) {
                API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.UPDATEBANNER)

            } else {
                API.addMaster(addEditMasterRes, formData, true, Constant.ADDBANNER);
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
                    history.push('/banner')

                }, 1000);
                setIsLoading(false)
            }
        },
        error: (err) => {
            setIsLoading(false)
            if (err.errors) {
                Object.values(err.errors).map(err => {
                    showError(err);
                })
            } else if (err?.meta?.message) {
                showError(err.meta.message);
            } else {
                showError("Something went wrong!");
            }
        },
        complete: () => {
        },
    }

    const onRemoveImage = (e, name, index) => {
        if (masterForm[name]?.uuid) {
            setIsLoading(true);
            API.deleteDocument(
                removeImageFromServerResponse,
                '',
                true,
                masterForm[name].uuid,
                Constant.DELETECATEGORYDOC
            );
            setMasterForm({ ...masterForm, [name]: { uuid: '', url: '', noPicture: false, obj: '' } });
        } else {
            setMasterForm({ ...masterForm, [name]: { ...masterForm[name], url: '', noPicture: false, obj: '' } })
        }
    }

    const removeImageFromServerResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(error.meta.message);
        },
        complete: () => { },
    };

    const isUrlValid = (userInput) => {
        let res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g); // NOSONAR
        if (res == null)
            return false;
        else {
            return (userInput.indexOf("http://") == 0 || userInput.indexOf("https://") == 0);
        }
    }

    const onHandleUpload = (e, key) => {
        const targetImg = e.target.files[0];
        let ref = null;
        if (key === "cover_image") ref = fileUploadRef;
        else ref = mobileImageRef;

        if (targetImg !== undefined) {
            const imgSize = Constant.IMAGE_SIZE;
            const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (fileTypes.includes(targetImg.type) === false) {
                showError('Allow only image file of jpeg, jpg or png extensions are allowed.');
                resetFileCache(ref);
            } else if ((targetImg.size / 1000) / 1024 < imgSize) {
                const reader = new FileReader();
                reader.onload = e => {
                    setMasterForm({ ...masterForm, [key]: { url: e.target.result, noPicture: true, obj: targetImg } });
                    let errors = error;
                    errors[key] = '';
                    setErrors({ ...errors });
                };
                reader.readAsDataURL(targetImg);
            } else {
                showError(Constant.IMAGE_MAX_SIZE)
                resetFileCache(ref);
            }
        }
    }

    const resetFileCache = ref => {
        ref.current.value = '';
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (

        <div>
            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update Banner' : 'Add Banner'} </h5>
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
                                                disabled={adminRole !== 'SUPER_ADMIN'}
                                                filter
                                                filterBy="company_name,code"
                                            />
                                            <label>HCP<span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['account']}</p>
                                    </div>
                                )
                            }

                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm['banner_type']}
                                        className="form-control"
                                        options={bannerTypeData}
                                        onChange={bannerTypeChange}
                                        optionLabel="name"
                                        optionValue="key"
                                        filter
                                        filterBy="name"
                                    />
                                    <label>Banner_Type <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['banner_type']}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText
                                        className="form-control"
                                        name="title"
                                        maxLength={Regex.TITLE_MAXLENGTH}
                                        value={masterForm.title}
                                        onChange={e => onHandleChange(e)}
                                        required
                                    />
                                    <span className="character-count">{masterForm?.title?.length}/{Regex.TITLE_MAXLENGTH}</span>
                                    <label>Title</label>
                                </span>
                            </div>

                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="link" value={masterForm.link} onChange={(e) => onHandleChange(e)} />
                                    <label>Link <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['link']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label>Banner Image <span className="text-danger">* </span>
                                    {
                                        browseNote && (
                                            <>
                                                <Tooltip target="#cover-image">{browseNote}</Tooltip>
                                                <img className="custom-tooltip-btn" id="cover-image" src={infoIcon} alt="!" />
                                            </>
                                        )
                                    }
                                </label>

                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {masterForm.cover_image.url ? (
                                        <div className="profile mb-3">
                                            <div className="profile-wrapper">
                                                <CImage
                                                    src={masterForm.cover_image.url}
                                                    alt="File"
                                                    className={`profile-img ${masterForm.cover_image.obj ? 'canvas' : ''}`}
                                                />
                                            </div>
                                            {
                                                masterForm.cover_image.noPicture && (
                                                    <img
                                                        src={Closeicon}
                                                        className="remove-profile"
                                                        onClick={(e) => { onRemoveImage(e, 'cover_image') }}
                                                    />
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div className='p-fileupload'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                ref={fileUploadRef}
                                                onChange={e => onHandleUpload(e, "cover_image")}
                                            />
                                            <button
                                                type='button'
                                                className='p-button p-fileupload-choose'
                                                onClick={() => fileUploadRef.current.click()}
                                            >
                                                <span className='p-button-label p-clickable'>
                                                    <CIcon size="xl" icon={cilCloudUpload} />
                                                    <p className="mb-0">Add Images</p>
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="error">{error['image']}</p>
                            </div>

                            { /* TO BE CARRIED OUT IN NEXT PHASE */}
                            {/* <div className="col-md-3 mb-3">
                                <label>Banner Image (Mobile) <span className="text-danger">*</span>
                                    {
                                        mobileBrowseNote && (
                                            <>
                                                <Tooltip target="#mobile-image">{mobileBrowseNote}</Tooltip>
                                                <img className="custom-tooltip-btn" id="mobile-image" src={infoIcon} alt="!" />
                                            </>
                                        )
                                    }
                                </label>

                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {masterForm.banner_mobile_image.url ? (
                                        <div className="profile mb-3">
                                            <div className="profile-wrapper">
                                                <CImage
                                                    src={masterForm.banner_mobile_image.url}
                                                    alt="File"
                                                    className={`profile-img ${masterForm.banner_mobile_image.obj ? "canvas" : ''}`}
                                                />
                                            </div>
                                            {
                                                masterForm.banner_mobile_image.noPicture && (
                                                    <img
                                                        src={Closeicon}
                                                        className="remove-profile"
                                                        onClick={e => { onRemoveImage(e, "banner_mobile_image") }}
                                                    />
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div className='p-fileupload'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                ref={mobileImageRef}
                                                onChange={e => onHandleUpload(e, "banner_mobile_image")}
                                            />
                                            <button
                                                type='button'
                                                className='p-button p-fileupload-choose'
                                                onClick={() => mobileImageRef.current.click()}
                                            >
                                                <span className='p-button-label p-clickable'>
                                                    <CIcon size="xl" icon={cilCloudUpload} />
                                                    <p className="mb-0">Add Images</p>
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="error">{error["mobile_image"]}</p>
                            </div> */}

                            <div className="col-md-12 col-lg-6 mb-3 d-flex">
                                <div>
                                    <label className="mr-2">Status</label>
                                    <div>
                                        <CFormCheck
                                            inline
                                            type="radio"
                                            name="is_active"
                                            id="active"
                                            value={Boolean(masterForm.is_active === 1)}
                                            checked={Boolean(masterForm.is_active === 1)}
                                            label="Active"
                                            onChange={(e) => onHandleChange(e, true)}
                                            className="customradiobutton"
                                        />
                                        <CFormCheck
                                            inline
                                            type="radio"
                                            name="is_active"
                                            id="inactive"
                                            value={Boolean(masterForm.is_active !== 1)}
                                            checked={Boolean(masterForm.is_active !== 1)}
                                            label="Inactive"
                                            onChange={(e) => onHandleChange(e, false)}
                                            className="customradiobutton"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        {displayDialog && <ImageCropModal visible={displayDialog} logoWidth={logoWidth} logoHeight={logoHeight}
                            onCloseModal={() => setDisplayDialog(false)}
                            cropImageData={imageData => setFormImageData(imageData)} />}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onSubmit(e) }}><CIcon icon={cilCheck} />{id ? 'Update' : 'Save'}</button>
                        <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditBanner
