// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect, useRef } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { cilCheck, cilXCircle, cilCloudUpload } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { CImage, CFormCheck } from '@coreui/react';
import Closeicon from "src/assets/images/close.svg";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import * as Message from "../../../../shared/constant/error-message"
import { Dropdown } from 'primereact/dropdown';
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import * as Regex from "../../../../shared/regex/regex";
import { Password } from 'primereact/password';
import { UserEnum, UserTitleEnum, UserUrlEnum } from 'src/shared/enum/enum';
import { emailLowerCase, isEmpty, uuid } from 'src/shared/handler/common-handler';

const AddEditUserManagement = () => {
    const fileUploadRef = useRef(null);
    const accountId = localStorage.getItem('account_id');
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    let initialState = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        is_active: 1,
        password: '',
        confirm_password: '',
        country_id: '',
        country: '',
        profileImg: { url: '', noPicture: '', obj: '', uuid: '' },
    }
    const [masterForm, setMasterForm] = useState(initialState)
    let history = useHistory();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const userType = new URLSearchParams(search).get('type');
    const micrositeAccountId = new URLSearchParams(search).get('accountId');
    const [error, setErrors] = useState(initialState)
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const statusOption = Constant.STATUS_OPTION
    const [accountData, setAccountData] = useState([]);
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        getPhoneCountryData()
        if (isB2BUser()) GetGenderData();
        if (accountDropdownEnabled() && adminRole === "SUPER_ADMIN") getAccountData();
        if (id) getUserDataById();
    }, []);

    useEffect(() => {
        setMasterForm({ ...masterForm, ['country']: masterForm.country_id })
    }, [masterForm.country_id]);

    const getAccountData = () => {
        API.getMasterList(accountRes, null, true, Constant.ACTIVE_ACCOUNT_LIST);
    }

    const accountRes = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status_code === 200) {
                let resVal = response.data
                setAccountData(resVal);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const isB2BUser = () => {
        return userType == UserEnum.B2B_USERS;
    }

    const isMicrositeAdminUser = () => {
        return userType == UserEnum.MICROSITE_ADMIN_USERS;
    }

    const getUserDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.SHOWUSER);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            if (response?.meta?.status_code === 200) {
                let resVal = response.data
                let obj = {
                    first_name: resVal?.first_name ?? '',
                    last_name: resVal?.last_name ?? '',
                    email: resVal?.email ?? '',
                    phone_number: resVal?.mobile ?? '',
                    is_active: resVal?.is_active ?? '',
                    country: resVal?.country?.country_id ?? '',
                    country_id: resVal?.country?.country_id ?? ''
                }

                if (isB2BUser()) {
                    obj['gender'] = resVal?.gender_id ?? ''
                }

                if (accountDropdownEnabled()) {
                    obj['account'] = resVal?.account_id ?? accountId;
                }

                obj["profileImg"] = {
                    obj: '',
                    uuid: resVal?.banner_image?._id ?? '',
                    url: resVal?.profile_image?.path ?? '',
                    noPicture: Boolean(resVal?.profile_image?.path),
                };

                setMasterForm({ ...obj });
                setIsLoading(false)
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => {
        },
    }

    const getPhoneCountryData = () => {
        API.getDrpData(CountryRes, "", true, Constant.COUNTRY_LIST_ACTIVE);
    }

    const CountryRes = {
        cancel: () => { },
        success: response => {
            let _countryList = [];
            if (response?.data?.length > 0) _countryList = response.data.filter(country => country);
            setCountryList([..._countryList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const onHandleValidation = () => { // NOSONAR
        let errors = {}
        let formIsValid = true;

        if (id) {
            delete masterForm.password
            delete masterForm.confirm_password
        }

        for (const [key, value] of Object.entries(masterForm)) {
            if (key === "account") {
                continue;
            }

            if (isEmpty(value)) {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} is required`;
            }

            if (key === 'first_name' || key === 'last_name') {
                if (value && !Regex.ONLY_CHARACTERS.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.ALLOW_ONLY_CHARACTERS;
                }
            }

            if (key === 'email') {
                if (value && !Regex.EMAIL_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.EMAILERR;
                }
            }

            if (key === 'phone_number') {
                if (value && !Regex.PHONENUMBER_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.CONTACTEERR;
                }
            }

            if (key === 'country') {
                if (!masterForm.country) {
                    formIsValid = false;
                    errors['phone_number'] = Message.CONTACTEERR;
                }
            }

            if (key === 'password') {
                if (value && !Regex.PASSWORD_REGEX.test(value)) {
                    formIsValid = false;
                    errors[key] = Message.PASSWORDERR;
                }
            }

            if (key === 'confirm_password') {
                if (value && value !== masterForm.password) {
                    formIsValid = false;
                    errors[key] = Message.CONFPASSERR;
                }
            }
        }

        if (accountDropdownEnabled() && !masterForm.account && !isB2BUser()) {
            formIsValid = false;
            errors['account'] = Message.ACCOUNTERR;
        }
        setErrors({ ...errors });
        return formIsValid;
    }

    const onHandleChange = (event) => {
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
    }

    const oncancleForm = () => {
        if (accountId) {
            // history.push('/account')
            // Go back to Account add/edit page with selected Admin User Tab
            localStorage.setItem('isFromAdminUser', 'Yes');
            window.history.back();
        } else {
            history.push(`/${UserUrlEnum[userType]}`);

        }
    }

    const onSubmit = e => {
        e.preventDefault()
        if (onHandleValidation()) {
            let resObj = {
                type: 3,
                first_name: masterForm.first_name,
                last_name: masterForm.last_name,
                email: emailLowerCase(masterForm.email),
                mobile: masterForm.phone_number,
                is_active: masterForm.is_active,
                country: masterForm.country,
                password: masterForm.password,
                confirm_password: masterForm.confirm_password,
            }

            if (accountDropdownEnabled() && masterForm.account) {
                resObj['account_id'] = masterForm.account;
            }

            if (micrositeAccountId) {
                resObj['account_id'] = micrositeAccountId;
            }

            const formData = new FormData();
            formData.append("data", JSON.stringify(resObj));

            if (masterForm?.profileImg?.obj) {
                formData.append("profile_image", masterForm.profileImg.obj);
            }

            setIsLoading(true);
            if (id) API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.UPDATEUSER);
            else API.addMaster(addEditMasterRes, formData, true, Constant.CREATEUSER);
        }

    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {
                showSuccess(response.meta.message)
                oncancleForm();
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
    const onAccountChange = (e) => {
        setMasterForm({ ...masterForm, ['account']: e.target.value })
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
    }

    const onCountryChange = (e) => {
        setMasterForm({ ...masterForm, ['country_id']: e.target.value })
        // setMasterForm({ ...masterForm, ['country']: e.target.value })
        let errors = error
        errors['country_id'] = ''
        setErrors({ ...errors });
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
                    <img alt={option.name} src={(option?.country_flag && option?.country_flag[0] ? option?.country_flag[0]?.path : '')} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
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
                <img alt={option.name} src={(option?.country_flag && option?.country_flag[0] ? option?.country_flag[0]?.path : '')} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
                <div>
                    {option.name}
                    <span><b>{' '}{option.country_phone_code}</b></span>
                </div>
            </div>
        );
    }

    const accountDropdownEnabled = () => { // NOSONAR
        return isMicrositeAdminUser() || (isB2BUser() && id);
    }

    const resetFileCache = () => {
        fileUploadRef.current.value = '';
    }

    const onHandleUpload = e => {
        const targetImg = e.target.files[0];

        if (targetImg) {
            const imgSize = Constant.IMAGE_SIZE;
            const fileTypes = ["image/jpeg", "image/jpg", "image/png"];

            if (!fileTypes.includes(targetImg.type)) {
                showError('Only image file of jpeg, jpg or png extensions are allowed.');
                resetFileCache();
            } else if ((targetImg.size / 1000) / 1024 < imgSize) {
                const reader = new FileReader();
                reader.onload = e => {
                    setMasterForm({ ...masterForm, profileImg: { url: e.target.result, noPicture: true, obj: targetImg } });
                    let errors = error;
                    errors["profileImg"] = '';
                    setErrors({ ...errors });
                };

                reader.readAsDataURL(targetImg);
            } else {
                showError(Constant.IMAGE_MAX_SIZE)
                resetFileCache();
            }
        }
    }

    const onRemoveImage = () => {
        if (masterForm["profileImg"]?.uuid) {
            setIsLoading(true);
            API.deleteDocument(
                removeImageFromServerResponse,
                '',
                true,
                masterForm["profileImg"].uuid,
                Constant.DELETEDOCUMENT
            );
            setMasterForm({ ...masterForm, ["profileImg"]: { uuid: '', url: '', noPicture: false, obj: '' } });
        } else {
            setMasterForm({
                ...masterForm,
                profileImg: {
                    ...masterForm["profileImg"],
                    url: '',
                    noPicture: false,
                    obj: ''
                }
            });
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
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    };

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate onSubmit={(e) => { onSubmit(e) }}>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update' : 'Add'} {UserTitleEnum[userType]} </h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">

                            {
                                accountDropdownEnabled() && adminRole === "SUPER_ADMIN" && (
                                    <div className={`col-md-3 mb-3 ${isMicrositeAdminUser() ? 'col-lg-12' : 'col-lg-4'}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                value={masterForm.account}
                                                className="form-control"
                                                options={accountData}
                                                onChange={onAccountChange}
                                                optionLabel="code"
                                                optionValue="_id"
                                                filter
                                                filterBy="code"
                                            />

                                            <label>Account Code<span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['account']}</p>
                                    </div>
                                )
                            }

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText className="form-control" name="first_name" maxLength={Regex.FIRSTNAME_MAXLENGTH} value={masterForm.first_name} onChange={(e) => onHandleChange(e)} />
                                    <span className="character-count">{masterForm.first_name.length}/{Regex.FIRSTNAME_MAXLENGTH}</span>
                                    <label>First Name <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['first_name']}</p>
                            </div>
                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText className="form-control" name="last_name" maxLength={Regex.LASTNAME_MAXLENGTH} value={masterForm.last_name} onChange={(e) => onHandleChange(e)} />
                                    <span className="character-count">{masterForm.last_name.length}/{Regex.LASTNAME_MAXLENGTH}</span>
                                    <label>Last Name <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['last_name']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm.country_id}
                                        className="form-control"
                                        options={countryList}
                                        onChange={onCountryChange}
                                        optionLabel="name"
                                        optionValue="_id"
                                        filter
                                        filterBy="name"
                                    />
                                    <label>Country <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['country_id']}</p>
                            </div>

                            <div className="col-md-3 mb-3 country-code">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm.country}
                                        className="form-control country-code-back"
                                        options={countryList}
                                        onChange={(e) => onDropdownChangeAddress(e, 'country')}
                                        optionLabel="country_phone_code"
                                        optionValue="_id"
                                        placeholder="Country Code"
                                        filter filterBy="country_code,country_phone_code"
                                        disabled={masterForm.country_id}
                                        valueTemplate={selectedCountryTemplate}
                                        itemTemplate={countryOptionTemplate}
                                    />
                                    <InputText className="form-control" name="phone_number" placeholder='Phone Number' value={masterForm.phone_number} onChange={(e) => onHandleChange(e)} maxLength={14} />
                                    <label>Phone Number <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['phone_number']}</p>
                            </div>
                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText disabled={id} className="form-control" name="email" value={masterForm.email} onChange={(e) => onHandleChange(e)} />
                                    <label>Email <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{error['email']}</p>
                            </div>
                            {
                                !id && (
                                    <>
                                        <div className="col-md-3 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <Password
                                                    value={masterForm.password}
                                                    name="password"
                                                    className="form-control"
                                                    onChange={onHandleChange} // NOSONAR
                                                    toggleMask
                                                />
                                                <label>Password <span className="text-danger">*</span></label>
                                            </span>
                                            <p className="error">{error["password"]}</p>
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <Password
                                                    toggleMask
                                                    name="confirm_password"
                                                    className="form-control"
                                                    onChange={onHandleChange} // NOSONAR
                                                    value={masterForm.confirm_password}
                                                />
                                                <label>Confirm Password <span className="text-danger">*</span></label>
                                            </span>
                                            <p className="error">{error['confirm_password']}</p>
                                        </div>
                                    </>
                                )
                            }

                            <div className="col-md-3">
                                <label>Profile Image</label>
                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {masterForm.profileImg.url ? (
                                        <div className="profile mb-3">
                                            <div className="profile-wrapper">
                                                <CImage
                                                    alt="File"
                                                    src={masterForm.profileImg.url}
                                                    className={`profile-img ${masterForm.profileImg.obj ? "canvas" : ''}`}
                                                />
                                            </div>
                                            {
                                                masterForm.profileImg.noPicture && (
                                                    <img
                                                        src={Closeicon}
                                                        onClick={onRemoveImage}
                                                        className="remove-profile"
                                                    />
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div className='p-fileupload'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileUploadRef}
                                                onChange={onHandleUpload}
                                                style={{ display: "none" }}
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
                            </div>
                        </div>

                        <div className="col-lg-6 mb-3">
                            <div>
                                <label className="mr-2">Status</label>
                                <div>
                                    {statusOption.map((val, idx) => <CFormCheck
                                        inline
                                        key={uuid()}
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

                    <div className="card-footer">

                        <button type='submit' className="btn btn-primary mb-2 mr-2"><CIcon icon={cilCheck} />{id ? 'Update' : 'Save'}</button>
                        <button type='button' className="btn btn-danger mb-2" onClick={() => oncancleForm()}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditUserManagement
