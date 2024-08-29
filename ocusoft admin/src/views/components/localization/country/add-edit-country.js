// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { cilCheck, cilXCircle, cilCloudUpload } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { isUrlValid } from '../../../../shared/validator/validator'
import ImageCropModal from "../../../../modal/ImageCropModal";
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import * as Message from "../../../../shared/constant/error-message"
import { CFormCheck, CImage } from '@coreui/react'
import { InputNumber } from 'primereact/inputnumber';
import { isTextValid, isEmpty } from 'src/shared/handler/common-handler';
import { Checkbox } from 'primereact/checkbox';
import { Tooltip } from 'primereact/tooltip';
import infoIcon from "../../../../assets/images/info-icon.png";
import Closeicon from '../../../../assets/images/close.svg'

const AddeditCountry = () => {
    let history = useHistory();

    const accountVal = localStorage.getItem('is_main_account')

    const [masterForm, setMasterForm] = useState({
        name: '',
        country_code: '',
        is_active: 1,
        country_phone_code: '',
        currency_code: '',
        currency_symbol: '',
        gold_custom_duty: null,
        silver_custom_duty: null,
        platinum_custom_duty: null,
        titanium_custom_duty: null,
        is_show_in_top: false,
        is_default: false,
        tax: null,
        total_carat: null,
        percentage: null,
        below_carat_rate: null,
        above_carat_rate: null,
        country_flag: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
    })
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const [accountData] = useState([])
    const [error, setErrors] = useState({})
    const [displayDialog, setDisplayDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const logoWidth = 500;
    const logoHeight = 250;
    const browseNote = `We recommend to you to please upload the image of : ${logoWidth} / ${logoHeight} for exact results`;
    const { showError, showSuccess } = useToast();

    const showDialog = () => {
        setDisplayDialog(true);
    }
    const setFormImageData = (imgData) => {
        setDisplayDialog(false)
        setMasterForm({ ...masterForm, ['country_flag']: { url: imgData.url, noPicture: imgData.noPicture, obj: imgData.obj } })
        let errors = error
        errors['country_flag'] = ''
        setErrors({ ...errors });
    }

    useEffect(() => {
        if (accountVal === '0') {
            setMasterForm({ ...masterForm, ['account']: localStorage.getItem('account_id') })
        }
    }, [accountData])

    useEffect(() => {
        if (id) {
            getClientDataById()
        }
    }, [])

    const getClientDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.COUNTRY_SHOW);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data;
                setIsLoading(false)
                let obj = {
                    name: resVal.name,
                    country_code: resVal.country_code,
                    is_active: resVal.is_active,
                    country_phone_code: resVal?.country_phone_code,
                    currency_code: resVal.currency_code,
                    currency_symbol: resVal.currency_symbol,
                    gold_custom_duty: resVal.gold_custom_duty,
                    silver_custom_duty: resVal.silver_custom_duty,
                    platinum_custom_duty: resVal.platinum_custom_duty,
                    titanium_custom_duty: resVal.titanium_custom_duty,
                    is_show_in_top: Boolean(resVal.is_show_in_top == '1'),
                    is_default: Boolean(resVal.is_default == '1'),
                    tax: resVal?.tax,
                    total_carat: resVal.total_carat,
                    percentage: resVal.percentage,
                    below_carat_rate: resVal.below_carat_rate,
                    above_carat_rate: resVal.above_carat_rate,
                };
                if (resVal.country_flag) {
                    obj['country_flag'] = { 'url': resVal?.country_flag[0]?.path, 'noPicture': Boolean(resVal?.country_flag[0]?.path), 'obj': '', uuid: resVal?.country_flag[0]?._id }
                } else {
                    obj['country_flag'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }
                setMasterForm(obj)
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
            if (!value && (key !== 'above_carat_rate' && key !== 'total_carat' && key !== 'percentage' && key !== 'below_carat_rate'
                && key !== 'gold_custom_duty' && key !== 'silver_custom_duty' && key !== 'platinum_custom_duty' && key !== 'titanium_custom_duty') && key !== 'country_flag' && key !== "is_show_in_top" && key !== 'is_default') {
                formIsValid = false;
                const keyName = key.replace(/_/g, ' ');
                errors[key] = `${keyName} is required`;
            } else if (key === 'link') {
                if (value && !isUrlValid(value)) {
                    formIsValid = false;
                    errors[key] = Message.URLERR;
                }
            } else if ((key == 'name') && isTextValid(masterForm.name)) {
                formIsValid = false;
                errors[key] = Message.VALID_DATA;
            }
            else if (key === 'country_flag' && masterForm.country_flag && masterForm.country_flag.url == '') {
                formIsValid = false;
                errors['country_flag'] = `country_flag is required`;
            }
            setErrors({ ...errors });

        }
        return formIsValid;

    }

    const onRemoveImage = (e, name, index) => {
        setMasterForm({ ...masterForm, [name]: { url: '', noPicture: false, obj: {} } })
    }

    const onHandleChange = (event, radioVal, isAddress) => {
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        }
        else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const oncancleForm = (e) => {
        e.preventDefault()
        history.push('/country')
    }

    const onSubmit = (e) => { // NOSONAR
        e.preventDefault()
        if (onHandleValidation()) {

            const resObj = Object.assign(
                !isEmpty(masterForm.name) && { name: masterForm.name },
                !isEmpty(masterForm.country_code) && { country_code: masterForm.country_code },
                !isEmpty(masterForm.country_phone_code) && { country_phone_code: masterForm.country_phone_code },
                !isEmpty(masterForm.currency_code) && { currency_code: masterForm.currency_code },
                !isEmpty(masterForm.currency_symbol) && { currency_symbol: masterForm.currency_symbol },
                { is_active: masterForm.is_active },
                !isEmpty(masterForm.gold_custom_duty) && { gold_custom_duty: masterForm.gold_custom_duty },
                !isEmpty(masterForm.silver_custom_duty) && { silver_custom_duty: masterForm.silver_custom_duty },
                !isEmpty(masterForm.platinum_custom_duty) && { platinum_custom_duty: masterForm.platinum_custom_duty },
                !isEmpty(masterForm.titanium_custom_duty) && { titanium_custom_duty: masterForm.titanium_custom_duty },
                !isEmpty(masterForm.is_show_in_top) && { is_show_in_top: masterForm.is_show_in_top ? 1 : 0 },
                { is_default: masterForm.is_default ? 1 : 0 },
                !isEmpty(masterForm.tax) && { tax: masterForm.tax },
                !isEmpty(masterForm.total_carat) && { total_carat: masterForm.total_carat },
                !isEmpty(masterForm.percentage) && { percentage: masterForm.percentage },
                !isEmpty(masterForm.below_carat_rate) && { below_carat_rate: masterForm.below_carat_rate },
                !isEmpty(masterForm.above_carat_rate) && { above_carat_rate: masterForm.above_carat_rate }
            );

            let formData = new FormData();
            formData.append('data', JSON.stringify(resObj))
            masterForm.country_flag.obj && formData.append('country_flag', masterForm?.country_flag.obj);

            setIsLoading(true);
            if (id) {
                API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.COUNTRY_UPDATE);
            } else {
                API.addMaster(addEditMasterRes, formData, true, Constant.COUNTRY_CREATE);
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
                    history.push('/country')
                }, 1000);
                setIsLoading(false)
            }
        },
        error: err => {
            setIsLoading(false)
            if (err.errors) {
                Object.values(err.errors).map(err => { showError(err); });
            } else if (err?.meta?.message) {
                showError(err.meta.message);
            } else {
                showError("Something went wrong!");
            }
        },
        complete: () => {
        },
    }

    return (

        <div>
            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{'Country'} </h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="name" value={masterForm.name} onChange={(e) => onHandleChange(e)} required />
                                    <label>Name <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['name']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="country_code" value={masterForm.country_code} onChange={(e) => onHandleChange(e)} required />
                                    <label>Country Code <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['country_code']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="country_phone_code" value={masterForm.country_phone_code} onChange={(e) => onHandleChange(e)} required />
                                    <label>Country Phone Code <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['country_phone_code']}</p>
                            </div><div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="currency_code" value={masterForm.currency_code} onChange={(e) => onHandleChange(e)} required />
                                    <label>Currency Code <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['currency_code']}</p>
                            </div><div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" name="currency_symbol" value={masterForm.currency_symbol} onChange={(e) => onHandleChange(e)} required />
                                    <label>Currency Symbol <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['currency_symbol']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputNumber inputClassName="form-control" min={0} max={100} value={masterForm.gold_custom_duty} name="gold_custom_duty" onValueChange={(e) => onHandleChange(e)} />
                                    <label>Gold Custom Duty
                                        {/* <span className="text-danger">*</span> */}
                                    </label>
                                </span>
                                <p className="error">{error['gold_custom_duty']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputNumber inputClassName="form-control" min={0} max={100} value={masterForm.silver_custom_duty} name="silver_custom_duty" onValueChange={(e) => onHandleChange(e)} />
                                    <label>Silver Custom Duty
                                        {/* <span className="text-danger">*</span> */}
                                    </label>
                                </span>
                                <p className="error">{error['silver_custom_duty']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputNumber inputClassName="form-control" min={0} max={100} value={masterForm.platinum_custom_duty} name="platinum_custom_duty" onValueChange={(e) => onHandleChange(e)} />
                                    <label>Platinum Custom Duty
                                        {/* <span className="text-danger">*</span> */}
                                    </label>
                                </span>
                                <p className="error">{error['platinum_custom_duty']}</p>
                            </div>

                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputNumber inputClassName="form-control" min={0} max={100} value={masterForm.titanium_custom_duty} name="titanium_custom_duty" onValueChange={(e) => onHandleChange(e)} />
                                    <label>Titanium Custom Duty
                                        {/* <span className="text-danger">*</span> */}
                                    </label>
                                </span>
                                <p className="error">{error['titanium_custom_duty']}</p>
                            </div>
                            <div className="col-md-3 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputNumber inputClassName="form-control"
                                        min={0} max={100}
                                        name="tax"
                                        value={masterForm.tax}
                                        onValueChange={(e) => onHandleChange(e)} />
                                    <label>
                                        Tax Percentage (%) <span className="text-danger">*</span>
                                    </label>
                                </span>
                                <p className="error">{error["tax"]}</p>
                            </div>
                            <div className="col-md-6 col-lg-3 mb-3">
                                <span className="p-float-label custom-p-float-label display-count d-flex align-items-center custom-checkbox">
                                    <label className="mr-2 mb-0">Is Show in Top?</label>
                                    <Checkbox name="is_show_in_top" onChange={e => onHandleChange(e)} checked={masterForm?.is_show_in_top}>
                                    </Checkbox>
                                </span>
                            </div>
                            <div className="col-md-6 col-lg-3 mb-3">
                                <span className="p-float-label custom-p-float-label display-count d-flex align-items-center custom-checkbox">
                                    <label className="mr-2 mb-0">Is Default?</label>
                                    <Checkbox name="is_default" onChange={e => onHandleChange(e)} checked={masterForm?.is_default}>
                                    </Checkbox>
                                </span>
                            </div>
                        </div>

                        <div className="col-md-12 col-lg-6 mb-3">
                            <label>Flag Image <span className="text-danger">* </span>
                                <Tooltip target=".custom-tooltip-btn">
                                    {browseNote}
                                </Tooltip>
                                <img className="custom-tooltip-btn" src={infoIcon} alt="!" />
                            </label>
                            <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                {masterForm?.country_flag?.url &&
                                    <div className="profile mb-3">
                                        <div className="profile-wrapper">
                                            {masterForm?.country_flag?.obj ?
                                                <CImage src={masterForm?.country_flag?.url} alt="File" className="profile-img canvas" />
                                                :
                                                <CImage src={masterForm?.country_flag?.url} alt="File" className="profile-img" />
                                            }
                                        </div>
                                        {masterForm?.country_flag?.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'country_flag') }} />}
                                    </div>
                                }
                                {masterForm.country_flag.url === '' &&
                                    <div className="profile mb-3">
                                        <div className="profile-wrapper" onClick={() => showDialog()}>
                                            <CIcon icon={cilCloudUpload} size="xl" className="mr-1" /> <p className="mb-0">Add Image</p>
                                        </div>
                                    </div>
                                }
                            </div>
                            <p className="error">{error['country_flag']}</p>
                        </div>

                        <fieldset className="fieldset">
                            <legend className="legend">Certification Charge &nbsp;</legend>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <InputText
                                            className="form-control"
                                            name="total_carat"
                                            value={masterForm.total_carat}
                                            onChange={(e) => onHandleChange(e)}
                                        />
                                        <label>
                                            Total Carat
                                </label>
                                    </span>
                                    <p className="error">{error["total_carat"]}</p>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <InputText
                                            className="form-control"
                                            name="percentage"
                                            value={masterForm.percentage}
                                            onChange={(e) => onHandleChange(e)}
                                        />
                                        <label>
                                            Percentage (%)
                                </label>
                                    </span>
                                    <p className="error">{error["percentage"]}</p>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <InputText
                                            className="form-control"
                                            name="below_carat_rate"
                                            value={masterForm.below_carat_rate}
                                            onChange={(e) => onHandleChange(e)}
                                        />
                                        <label>
                                            Below Carat Charge{" "}

                                        </label>
                                    </span>
                                    <p className="error">{error["below_carat_rate"]}</p>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <InputText
                                            className="form-control"
                                            name="above_carat_rate"
                                            value={masterForm.above_carat_rate}
                                            onChange={(e) => onHandleChange(e)}
                                        />
                                        <label>
                                            Above Carat Charge{" "}

                                        </label>
                                    </span>
                                    <p className="error">{error["above_carat_rate"]}</p>
                                </div>
                            </div>
                        </fieldset>

                        <div className="col-md-6 mb-3">
                            <label className='mr-2 mb-3 col-md-12'>Status</label>
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
                        <p className="error">{error['logo']}</p>

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

export default AddeditCountry;


