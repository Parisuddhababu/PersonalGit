// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import * as Message from "../../../shared/constant/error-message"
import Closeicon from '../../../assets/images/close.svg'
import { cilCheck, cilCloudUpload } from '@coreui/icons';
import Loader from "../common/loader/loader"
import { useToast } from '../../../shared/toaster/Toaster';
import { emailLowerCase, isEmpty } from 'src/shared/handler/common-handler';
import * as Regex from "../../../shared/regex/regex";
import { Tooltip } from 'primereact/tooltip';
import ImageCropModal from "../../../modal/ImageCropModal";
import { CImage } from '@coreui/react'
import infoIcon from "../../../assets/images/info-icon.png";
import { Dropdown } from 'primereact/dropdown';

const BasicDetails = () => {
    const { showError, showSuccess } = useToast();
    const dispatch = useDispatch();
    const logoWidth = 120;
    const logoHeight = 120;
    const browseNote = `We recommend to you to please upload the image of : ${logoWidth} / ${logoHeight} for exact results`;

    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [displayDialog, setDisplayDialog] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [masterForm, setMasterForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        cover_image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        country: '',
    });

    useEffect(() => {
        getProfileData()
        getCountryData()
    }, [])

    const showDialog = () => {
        setDisplayDialog(true);
    }

    const setFormImageData = (imgData) => {
        setDisplayDialog(false)
        setMasterForm({ ...masterForm, ['cover_image']: { url: imgData.url, noPicture: imgData.noPicture, obj: imgData.obj } })
        let errors = error
        errors['logo'] = ''
        setErrors({ ...errors });
    }

    const getProfileData = () => {
        API.getActiveDataList(Constant.PROFILE_SHOW, profileListRes, null, true);
    }

    const profileListRes = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                dispatch({ type: "signin", signin: response.data })
                let resVal = response.data;

                let obj = {
                    first_name: resVal.first_name ?? '',
                    last_name: resVal.last_name ?? '',
                    email: resVal.email ?? '',
                    phone_number: resVal.mobile ?? '',
                    country: resVal?.country?.country_id ?? '',
                };

                obj["cover_image"] = {
                    url: resVal?.profile_image?.path ?? '',
                    noPicture: resVal?.profile_image?.path ? true : false,
                    obj: '',
                    uuid: resVal?.profile_image?._id ?? ''
                };

                setMasterForm(obj);
            }
        },
        error: err => {
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const onHandleChange = (event, radioVal) => {
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

    const getCountryData = () => {
        API.getDrpData(CountryRes, '', true, Constant.COUNTRY_LIST_ACTIVE);
    }

    const CountryRes = {
        cancel: () => { },
        success: response => {
            let _countryList = [];
            if (response?.meta?.status && response?.data?.length) {
                _countryList = response.data;
            }

            setCountryList(_countryList);
        },
        error: (err) => {
            console.log(err);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const onHandleValidation = () => { // NOSONAR
        let errors = {}, formIsValid = true, obj = masterForm;
        obj['image'] = masterForm?.cover_image?.url;
        delete obj["country"];
        delete obj["phone_number"];

        for (const [key, value] of Object.entries(obj)) {
            if (isEmpty(value)) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} is required`;
            } else if (key === 'first_name' || key === 'last_name') {
                if (value && !Regex.ONLY_CHARACTERS.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.ALLOW_ONLY_CHARACTERS;
                }
            } else if (key === 'email') {
                if (value && !Regex.EMAIL_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.EMAILERR;
                }
            } else if (key === 'phone_number') {
                if (value && !Regex.PHONENUMBER_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.CONTACTEERR;
                }
            }

            setErrors({ ...errors });
        }

        return formIsValid;
    }

    const onUpdate = (e) => {
        e.preventDefault()
        if (onHandleValidation()) {
            let resObj = {
                "first_name": masterForm.first_name,
                "last_name": masterForm.last_name,
                "email": emailLowerCase(masterForm.email),
                "mobile": masterForm.phone_number ?? '',
                'country': masterForm.country ?? '',
            }

            let formData = new FormData();
            formData.append('data', JSON.stringify(resObj));

            if (masterForm?.cover_image?.obj) {
                formData.append('profile_image', masterForm?.cover_image?.obj, masterForm?.cover_image?.obj?.name);
            }

            let userDetails = JSON.parse(localStorage.getItem("user_details"));
            userDetails = { ...userDetails, first_name: masterForm.first_name, last_name: masterForm.last_name };
            localStorage.setItem("user_details", JSON.stringify(userDetails));

            API.UpdateProfileData(addEditMasterRes, formData, true, '', Constant.PROFILE_UPDATE);
        }
    }

    const addEditMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                getProfileData();
            }
        },
        error: err => {
            setIsLoading(false);
            if (err.errors) Object.values(err.errors).map(err => { showError(err); });
            else if (error?.meta?.message) showError(err.meta.message);
            else showError("Something went wrong!");
        },
        complete: () => { },
    }

    const onRemoveImage = (e, name, index) => {
        setMasterForm({ ...masterForm, [name]: { url: '', noPicture: false, obj: {} } })
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
                    <img
                        alt={option.name}
                        src={(option?.country_flag && option?.country_flag[0] ? option?.country_flag[0]?.path : '')}
                    />
                    <div>{option.country_phone_code}</div>
                </div>
            );
        }

        return (<span>{props.country_phone_code}</span>);
    }

    const countryOptionTemplate = (option) => {
        return (
            <div className="country-item">
                <img src={(option?.country_flag && option?.country_flag[0] ? option?.country_flag[0]?.path : '')} />
                <div>{option.name}
                    <span>{option?.country_phone_code}</span></div>
            </div>
        );
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText className="form-control" name="first_name" maxLength={Regex.FIRSTNAME_MAXLENGTH} value={masterForm.first_name} onChange={(e) => onHandleChange(e)} />
                                    <span className="character-count">{masterForm.first_name.length}/{Regex.FIRSTNAME_MAXLENGTH}</span>
                                    <label>First Name <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error["first_name"]}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText
                                        className="form-control"
                                        name="last_name"
                                        maxLength={Regex.LASTNAME_MAXLENGTH}
                                        value={masterForm.last_name}
                                        onChange={(e) => onHandleChange(e)}
                                    />

                                    <span className="character-count">
                                        {masterForm.last_name.length}/{Regex.LASTNAME_MAXLENGTH}
                                    </span>

                                    <label>Last Name <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error["last_name"]}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="email" disabled value={masterForm.email} onChange={(e) => onHandleChange(e)} />
                                    <label>Email <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['email']}</p>
                            </div>

                            <div className="col-md-6 mb-3 country-code">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        disabled
                                        optionValue="_id"
                                        options={countryList}
                                        value={masterForm.country}
                                        placeholder="Country Code"
                                        optionLabel="country_phone_code"
                                        itemTemplate={countryOptionTemplate}
                                        valueTemplate={selectedCountryTemplate}
                                        className="form-control country-code-back"
                                        onChange={e => onDropdownChangeAddress(e, 'country')}
                                    />

                                    <InputText
                                        maxLength={14}
                                        name="phone_number"
                                        className="form-control"
                                        placeholder='Phone Number'
                                        value={masterForm.phone_number}
                                        onChange={(e) => onHandleChange(e)}
                                    />
                                    <label>Phone Number <span className="text-danger">*</span></label>
                                </span>

                                <p className="error">{error["country"]}</p>
                                <p className="error">{error["phone_number"]}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Profile Image <span className="text-danger">* </span>
                                    <Tooltip target=".custom-tooltip-btn">{browseNote}</Tooltip>
                                    <img className="custom-tooltip-btn" src={infoIcon} alt="!" />
                                </label>

                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {
                                        masterForm.cover_image.url ? (
                                            <div className="profile mb-3">
                                                <div className="profile-wrapper">
                                                    {masterForm.cover_image.obj ?
                                                        <CImage src={masterForm.cover_image.url} alt="File" className="profile-img canvas" />
                                                        :
                                                        <CImage src={masterForm.cover_image.url} alt="File" className="profile-img" />
                                                    }
                                                </div>
                                                {masterForm.cover_image.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'cover_image') }} />}
                                            </div>
                                        ) : (
                                            <div className="profile mb-3">
                                                <div className="profile-wrapper" onClick={() => showDialog()}>
                                                    <CIcon icon={cilCloudUpload} size="xl" className="mr-1" />
                                                    <p className="mb-0">Add Image</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <p className="error">{error['image']}</p>
                            </div>
                        </div>

                        {
                            displayDialog && (
                                <ImageCropModal
                                    visible={displayDialog}
                                    logoWidth={logoWidth}
                                    logoHeight={logoHeight}
                                    onCloseModal={() => setDisplayDialog(false)}
                                    cropImageData={imageData => setFormImageData(imageData)}
                                />
                            )
                        }
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onUpdate(e) }}>
                            <CIcon icon={cilCheck} />{'Update'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default BasicDetails
