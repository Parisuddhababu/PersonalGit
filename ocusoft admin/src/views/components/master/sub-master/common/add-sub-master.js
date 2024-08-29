// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { CImage, CFormCheck } from '@coreui/react'
import { cilCheck, cilXCircle, cilCloudUpload } from '@coreui/icons';
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../../../services/Api';
import { InputNumber } from 'primereact/inputnumber';
import * as Constant from "../../../../../shared/constant/constant"
import { ONLY_TWO_DEGITS } from 'src/shared/regex/regex';
import { CommonMaster } from "../../../../../shared/enum/enum";
import { Dropdown } from 'primereact/dropdown';
import Loader from "../../../common/loader/loader"
import { useToast } from '../../../../../shared/toaster/Toaster';
import websiteHandler from 'src/shared/handler/website-handler';
import * as Regex from "../../../../../shared/regex/regex";
import * as Message from "../../../../../shared/constant/error-message"
import { isEmpty, isTextValid } from 'src/shared/handler/common-handler';
import { Tooltip } from 'primereact/tooltip';
import infoIcon from "src/assets/images/info-icon.png";
import ImageCropModal from "../../../../../modal/ImageCropModal";
import Closeicon from 'src/assets/images/close.svg'
import { imageDimension } from 'src/shared/constant/image-dimension';

const MasterAddEdit = () => { // NOSONAR
    let history = useHistory();
    const accountVal = localStorage.getItem('is_main_account');
    const primaryAccountId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    let logoWidth = imageDimension.PRODUCT_CERTIFICATE.width;
    let logoHeight = imageDimension.PRODUCT_CERTIFICATE.height;
    const browseNote = `We recommend to you to please upload the image of : ${logoWidth} / ${logoHeight} for exact results`;
    const [Isaccount, setIsaccount] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [masterForm, setMasterForm] = useState({
        name: '',
        code: '',
        description: '',
        max: null,
        min: null,
        is_default: 0,
        is_active: 1,
        percentage: '',
        account: adminRole !== "SUPER_ADMIN" ? primaryAccountId : '',
        type: '',
        price: null,
        image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        country: '',
        metal_price_type: '',
        labour_charge_type: ''
    })
    const search = useLocation().search;
    const name = new URLSearchParams(search).get('name');
    const id = new URLSearchParams(search).get('id');
    const [accountData, setAccountData] = useState([])
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [metalType, setMetalType] = useState([]);
    const [boxLength, setBoxLength] = useState('col-lg-4');
    const [metalPriceTypeData, setMetalPriceTypeData] = useState([]);
    const [labourChargeTypeData, setLabourChargeTypeData] = useState([]);

    if (name === CommonMaster.PRODUCT_CERTIFICATES) {
        logoWidth = imageDimension.BANNER.width;
        logoHeight = imageDimension.BANNER.height;
    }

    const showDialog = () => {
        setDisplayDialog(true);
    }

    useEffect(() => {
        if (adminRole === "SUPER_ADMIN") getAccountData();

        if (name === CommonMaster.METAL_PURITY || name === CommonMaster.METAL_TYPE) {
            getMetalType()
        }

        if (name === CommonMaster.LABOUR_CHARGE) {
            getMetalPriceType();
            getLabourChargeTypeData();
        }

        if (name === CommonMaster.LABOUR_CHARGE) {
            getCountryList();
        }

        switch (name) {
            case CommonMaster.METAL_PURITY:
                setBoxLength('col-lg-3');
                break;
            case CommonMaster.METAL_WEIGHT:
                setBoxLength('col-lg-6');
                break;
            case CommonMaster.PRODUCT_CERTIFICATES:
                setBoxLength('col-lg-6');
                break;
            case CommonMaster.CAREER_LOCATION:
                setBoxLength('col-lg-6');
                break;
            case CommonMaster.CAREER_DESIGNATION:
                setBoxLength('col-lg-6');
                break;
            case CommonMaster.CAREER_REFERENCE:
                setBoxLength('col-lg-6');
                break;
            case CommonMaster.LABOUR_CHARGE:
                setBoxLength('col-lg-3');
                break;
            default:
                break;
        }

        if (id) {
            getMasterDataById()
        }
    }, [])

    useEffect(() => {
        const isAccount = websiteHandler(name);
        setIsaccount(isAccount)
    }, [name])


    useEffect(() => {
        if (masterForm.account && name === CommonMaster.PRODUCT_CERTIFICATES) {
            getCountryList();
        }
    }, [masterForm.account])

    useEffect(() => {
        if (accountVal === '0') {
            setMasterForm({ ...masterForm, ['account']: localStorage.getItem('account_id') })

        }
    }, [accountData])

    const getCountryList = () => {
        if (name === "Labour Charge") {
            API.getDrpData(onGetCountryListResponse, null, true, Constant.GET_ACTIVE_COUNTRY);
        } else if (name === CommonMaster.PRODUCT_CERTIFICATES) {
            const data = { account_id: adminRole === "SUPER_ADMIN" ? masterForm.account : primaryAccountId };
            API.getMasterList(onGetCountryListResponse, data, true, Constant.ACTIVE_ACCOUNT_COUNTRY);
        } else {
            API.getDrpData(onGetCountryListResponse, "", true, Constant.COUNTRY_LIST_ACTIVE);
        }
    }

    const onGetCountryListResponse = {
        cancel: () => { },
        success: response => {
            let _countryData = [];
            if (response?.data?.length > 0) _countryData = response.data.filter(country => country);
            setCountryData([..._countryData]);
        },
        error: err => {
            console.log(err);
            setCountryData([]);
        },
        complete: () => { }
    }

    const getMetalPriceType = () => {
        setIsLoading(true);
        const url = id ? Constant.GET_ALL_METAL_PRICE_TYPE : Constant.GET_ACTIVE_METAL_PRICE_TYPE;
        API.getDrpData(onGetMetalPriceTypeResponse, "", true, url);
    }

    const onGetMetalPriceTypeResponse = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)

            if (response.meta.status_code === 200) {
                setMetalPriceTypeData(response.data);
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const getLabourChargeTypeData = () => {
        API.getDrpData(onGetLabourChargeTypeResponse, "", true, Constant.GETACTIVELABOURCHARGETYPE);
    }

    const onGetLabourChargeTypeResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false)

            if (response.meta.status_code === 200) {
                setLabourChargeTypeData(response.data);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const getMetalType = () => {
        setIsLoading(true);
        const url = id ? Constant.GET_ALL_METAL_PRICE_TYPE : Constant.GET_ACTIVE_METAL_PRICE_TYPE;
        API.getDrpData(getType, "", true, url);
    }

    // getType Response Data Method
    const getType = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)

            if (response.meta.status_code === 200) {
                setMetalType(response.data);
            }
        },
        error: (error) => {
            setIsLoading(false)

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


    const getMasterDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, getUrl().show);
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                let resVal = response.data;
                let obj = resVal;

                if (resVal?.image != null) {
                    obj['image'] = { 'url': resVal?.image?.path, 'noPicture': resVal?.image?.path ? true : false, 'obj': '', uuid: resVal?.image?._id }
                } else {
                    obj['image'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }

                if (name === CommonMaster.LABOUR_CHARGE) {
                    obj = {
                        ...obj,
                        country: obj.country_id,
                        metal_price_type: obj.metal_type,
                        labour_charge_type: obj.labour_charge_id,
                    };
                } else if (name === CommonMaster.PRODUCT_CERTIFICATES) {
                    obj = {
                        ...obj,
                        country: obj?.country?.country_id ?? '',
                        account: obj?.account?.account_id ?? '',
                    }
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

    const onRemoveImage = (e, name, index) => {
        setMasterForm({ ...masterForm, [name]: { url: '', noPicture: false, obj: {} } })
    }

    const onHandleChange = (event, radioVal) => { // NOSONAR
        // event.preventDefault()
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });

        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            if (event.target.name === 'percentage') {
                if (event.target.value !== '') {
                    if (ONLY_TWO_DEGITS.test(event.target.value)) {
                        setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
                    }
                } else {
                    setMasterForm({ ...masterForm, [event.target.name]: '' })

                }

            }
            else {
                if (event.target.name === 'code') {
                    setMasterForm({ ...masterForm, [event.target.name]: event.target.value.toUpperCase() })
                }
                else setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
            }
        }
    }
    const onAccountChange = (e) => {
        if (name === CommonMaster.PRODUCT_CERTIFICATES) {
            setMasterForm({ ...masterForm, account: e.target.value, country: '' });
        } else {
            setMasterForm({ ...masterForm, account: e.target.value });
        }

        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
    }

    const onCountryChange = e => {
        setMasterForm({ ...masterForm, country: e.target.value });
        let _errors = error;
        _errors['country'] = '';
        setErrors({ ..._errors });
    }

    const oncancleForm = (e) => {
        e.preventDefault()
        history.push(getPath(name))
    }

    const onHandleValidation = () => { // NOSONAR
        let errors = {}
        let formIsValid = true;
        let urlName = new URLSearchParams(search).get('name')
        let validationObj = {}
        if (urlName === CommonMaster.PRICE) {
            validationObj = {
                name: masterForm.name.trim(),
                min: masterForm.min,
                max: masterForm.max,
                // account: masterForm.account
            }

        } else if (urlName === CommonMaster.METAL_PURITY) {
            validationObj = {
                name: masterForm.name.trim(),
                code: masterForm.code.trim(),
                percentage: masterForm.percentage,
                type: masterForm.type

                // account: masterForm.account
            }
        } else if (urlName === CommonMaster.METAL_TYPE) {
            validationObj = {
                name: masterForm.name.trim(),
                code: masterForm.code.trim(),
                type: masterForm.type
                // account: masterForm.account
            }
        } else if (urlName === CommonMaster.LABOUR_CHARGE) {
            validationObj = {
                price: masterForm.price,
                country: masterForm.country,
                metal_price_type: masterForm.metal_price_type,
                labour_charge_type: masterForm.labour_charge_type,
            }
        } else if (urlName === CommonMaster.PRODUCT_CERTIFICATES) {
            validationObj = {
                account: masterForm.account,
                country: masterForm.country,
                name: masterForm.name.trim(),
                code: masterForm.code.trim(),
                file: masterForm?.image?.url,
            }
        } else {
            validationObj = {
                name: masterForm.name.trim(),
                code: masterForm.code.trim(),
            }
        }

        for (const [key, value] of Object.entries(validationObj)) {
            if (isEmpty(value)) {
                formIsValid = false;
                const updatedKey = key.replaceAll('_', ' ');
                errors[key] = `${updatedKey} is required`;
            }
            if (key === 'min') {
                if (masterForm.max && value > masterForm.max) {
                    formIsValid = false;
                    errors[key] = Message.MINERR;
                }
            }
            if (key === 'max') {
                if (masterForm.min && value < masterForm.min) {
                    formIsValid = false;
                    errors[key] = Message.MAXERR;
                }
            }
            if ((key == 'name') && isTextValid(masterForm.name)) {
                formIsValid = false;
                errors[key] = Message.VALID_DATA;
            }
            setErrors({ ...errors });

        }
        return formIsValid;

    }

    const onSubmit = (e) => { // NOSONAR
        e.preventDefault()
        if (onHandleValidation()) {
            let resObj = {
                'name': masterForm.name,
                'is_active': masterForm.is_active,
                'is_default': masterForm.is_default,
                'description': masterForm.description
            }
            if (Isaccount) {
                resObj['account_id'] = masterForm.account
            }
            if (name === CommonMaster.PRICE) {
                resObj['min'] = masterForm.min
                resObj['max'] = masterForm.max
            } else if (name === CommonMaster.METAL_PURITY) {
                resObj['percentage'] = masterForm.percentage
                resObj['code'] = masterForm.code;
                resObj['type'] = masterForm.type;

            } else if (name === CommonMaster.METAL_TYPE) {
                resObj['type'] = masterForm.type;
                resObj['code'] = masterForm.code

            } else if (name === CommonMaster.LABOUR_CHARGE) {
                resObj['country_id'] = masterForm.country
                resObj['price'] = masterForm.price
                resObj['metal_type'] = masterForm.metal_price_type;
                resObj['labour_charge_id'] = masterForm.labour_charge_type;

                const labourChargeTypeObj = labourChargeTypeData.find(labourChargeType => {
                    return labourChargeType._id == masterForm.labour_charge_type
                });

                resObj['name'] = labourChargeTypeObj?.name;
                resObj['code'] = labourChargeTypeObj?.code;
            } else if (name === CommonMaster.METAL_PRICE_TYPE || name === CommonMaster.LABOUR_CHARGE_TYPE) {
                resObj['code'] = masterForm.code;
                delete resObj['description'];
            } else if (name === CommonMaster.PRODUCT_CERTIFICATES) {
                resObj["country_id"] = masterForm.country;
                resObj['code'] = masterForm.code;
            } else {
                resObj['code'] = masterForm.code
            }

            let formData;
            if (name === CommonMaster.PRODUCT_CERTIFICATES) {
                formData = new FormData();
                formData.append('data', JSON.stringify(resObj))
                masterForm?.image?.obj && formData.append('image', masterForm?.image?.obj, masterForm?.image?.obj?.name);
            }
            else formData = resObj;
            setIsLoading(true)
            if (id) {
                API.UpdateMasterData(addEditMasterRes, formData, true, id, getUrl().update)
            } else {
                API.addMaster(addEditMasterRes, formData, true, getUrl().add);
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
                    history.push(getPath(name))
                }, 1000);
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

    const getPath = (path) => {
        switch (path) { // NOSONAR
            case CommonMaster.PRICE:
                return "/price"
            case CommonMaster.METAL_WEIGHT:
                return "/metal-weight"
            case CommonMaster.COLOR_STONE:
                return "/color-stone"
            case CommonMaster.METAL_PRICE_TYPE:
                return '/metal-price-type'
            case CommonMaster.LABOUR_CHARGE:
                return "/labour-charge"
            case CommonMaster.CAREER_DESIGNATION:
                return "/career-designation"
            case CommonMaster.CAREER_LOCATION:
                return "/career-location"
            case CommonMaster.DIAMOND_QUALITY:
                return "/diamond-quality"
            case CommonMaster.CAREER_REFERENCE:
                return "/career-reference"
            case CommonMaster.DIAMOND_CLARITIES:
                return "/diamond-clarities"
            case CommonMaster.DIAMOND_COLOR:
                return "/diamond-color"
            case CommonMaster.DIAMOND_SHAPES:
                return "/diamond-shapes"
            case CommonMaster.DIAMOND_SIEVES:
                return "/diamond-sieves"
            case CommonMaster.LENGTH:
                return "/length"
            case CommonMaster.GAUGE:
                return "/gauge"
            case CommonMaster.SHOP_MODULES:
                return "/shop-for-modules"
            case CommonMaster.PRODUCT_CERTIFICATES:
                return "/product-certificates"
            case CommonMaster.RETURN_REASONS:
                return "/return-reasons"
            case CommonMaster.SOLITAIR_COLOR:
                return "/solitaire-color"
            case CommonMaster.SOLITAIR_CUT:
                return "/solitaire-cut"
            case CommonMaster.SOLITAIR_CLARITY:
                return "/solitaire-clarity"
            case CommonMaster.SOLITAIR_SHAPE:
                return "/solitaire-shape"
            case CommonMaster.SOLITAIR_POLISH:
                return "/solitaire-polish"
            case CommonMaster.SOLITAIR_SYMMETRY:
                return "/solitaire-symmetry"
            case CommonMaster.SOLITAIR_LABS:
                return "/solitaire-labs"
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                return "/solitaire-eye-cleans"
            case CommonMaster.OCCASION:
                return "/occasion"
            case CommonMaster.BANGLE_BRACELATE:
                return "/bangle-bracelets"
            case CommonMaster.BANGLE_SIZE:
                return "/bangle-size"
            case CommonMaster.PRODUCT_WEAR_TAG:
                return "/product-wear"
            case CommonMaster.METAL_TYPE:
                return "/metal-type"
            case CommonMaster.METAL_PURITY:
                return "/metal-purity"
            case CommonMaster.GENDER:
                return "/gender"
            case CommonMaster.PRODUCT_LOOKS_TAG:
                return "/product-looks-tag"
        }
    }

    const getUrl = () => { // NOSONAR
        switch (name) { // NOSONAR
            case CommonMaster.PRICE:
                return { 'add': Constant.ADDPRICE, 'show': Constant.SHOWPRICE, 'update': Constant.UPDATEPRICE }
            case CommonMaster.METAL_WEIGHT:
                return { 'add': Constant.ADDMETAL, 'show': Constant.SHOWMETAL, 'update': Constant.UPDATEMETAL }
            case CommonMaster.COLOR_STONE:
                return { 'add': Constant.ADDCOLORSTONE, 'show': Constant.SHOWCOLORSTONE, 'update': Constant.UPDATECOLORSTONE }
            case CommonMaster.METAL_PRICE_TYPE:
                return {
                    add: Constant.ADDMETALPRICETYPE,
                    show: Constant.SHOWMETALPRICETYPE,
                    update: Constant.UPDATEMETALPRICETYPE
                }
            case CommonMaster.LABOUR_CHARGE_TYPE:
                return {
                    add: Constant.ADDLABOURCHARGETYPE,
                    show: Constant.SHOWLABOURCHARGETYPE,
                    update: Constant.UPDATELABOURCHARGETYPE
                }
            case CommonMaster.LABOUR_CHARGE:
                return { 'add': Constant.ADDLABOURCHARGED, 'show': Constant.SHOWLABOURCHARGED, 'update': Constant.UPDATELABOURCHARGED }
            case CommonMaster.CAREER_DESIGNATION:
                return { 'add': Constant.ADDCAREERDESIGNATION, 'show': Constant.SHOWCAREERDESIGNATION, 'update': Constant.UPDATECAREERDESIGNATION }
            case CommonMaster.CAREER_LOCATION:
                return { 'add': Constant.ADDCAREERLOCATION, 'show': Constant.SHOWCAREERLOCATION, 'update': Constant.UPDATECAREERLOCATION }
            case CommonMaster.DIAMOND_QUALITY:
                return { 'add': Constant.ADDDIAMONDQUALITY, 'show': Constant.SHOWDIAMONDQUALITY, 'update': Constant.UPDATEDIAMONDQUALITY }
            case CommonMaster.CAREER_REFERENCE:
                return { 'add': Constant.ADDCAREERREFERENCE, 'show': Constant.SHOWCAREERREFERENCE, 'update': Constant.UPDATECAREERREFERENCE }
            case CommonMaster.DIAMOND_CLARITIES:
                return { 'add': Constant.ADDDIAMONDCLARITIES, 'show': Constant.SHOWDIAMONDCLARITIES, 'update': Constant.UPDATEDIAMONDCLARITIES }
            case CommonMaster.DIAMOND_COLOR:
                return { 'add': Constant.ADDDIAMONDCOLOR, 'show': Constant.SHOWDIAMONDCOLOR, 'update': Constant.UPDATEDIAMONDCOLOR }
            case CommonMaster.DIAMOND_SHAPES:
                return { 'add': Constant.ADDDIAMONDSHAPES, 'show': Constant.SHOWDIAMONDSHAPES, 'update': Constant.UPDATEDIAMONDSHAPES }
            case CommonMaster.DIAMOND_SIEVES:
                return { 'add': Constant.ADDDIAMONDSIEVES, 'show': Constant.SHOWDIAMONDSIEVES, 'update': Constant.UPDATEDIAMONDSIEVES }
            case CommonMaster.LENGTH:
                return { 'add': Constant.ADDLENGTH, 'show': Constant.SHOWLENGTH, 'update': Constant.UPDATELENGTH }
            case CommonMaster.GAUGE:
                return { 'add': Constant.ADDGAUGE, 'show': Constant.SHOWGAUGE, 'update': Constant.UPDATEGAUGE }
            case CommonMaster.SHOP_MODULES:
                return { 'add': Constant.ADDSHOPFORMODULE, 'show': Constant.SHOWSHOPFORMODULE, 'update': Constant.UPDATESHOPFORMODULE }
            case CommonMaster.PRODUCT_CERTIFICATES:
                return { 'add': Constant.ADDPRODUCTCERTIFICATE, 'show': Constant.SHOWPRODUCTCERTIFICATE, 'update': Constant.UPDATEPRODUCTCERTIFICATE }
            case CommonMaster.RETURN_REASONS:
                return { 'add': Constant.ADDRETURNREASONS, 'show': Constant.SHOWRETURNREASONS, 'update': Constant.UPDATERETURNREASONS }
            case CommonMaster.SOLITAIR_COLOR:
                return { 'add': Constant.ADDSOLITAIRECOLOR, 'show': Constant.SHOWSOLITAIRECOLOR, 'update': Constant.UPDATESOLITAIRECOLOR }
            case CommonMaster.SOLITAIR_CUT:
                return { 'add': Constant.ADDSOLITAIRECUT, 'show': Constant.SHOWSOLITAIRECUT, 'update': Constant.UPDATESOLITAIRECUT }
            case CommonMaster.SOLITAIR_CLARITY:
                return { 'add': Constant.ADDSOLITAIRECLARITY, 'show': Constant.SHOWSOLITAIRECLARITY, 'update': Constant.UPDATESOLITAIRECLARITY }
            case CommonMaster.SOLITAIR_SHAPE:
                return { 'add': Constant.ADDSOLITAIRESHAPE, 'show': Constant.SHOWSOLITAIRESHAPE, 'update': Constant.UPDATESOLITAIRESHAPE }
            case CommonMaster.SOLITAIR_POLISH:
                return { 'add': Constant.ADDSOLITAIREPOLISH, 'show': Constant.SHOWSOLITAIREPOLISH, 'update': Constant.UPDATESOLITAIREPOLISH }
            case CommonMaster.SOLITAIR_SYMMETRY:
                return { 'add': Constant.ADDSOLITAIRESYMMETRY, 'show': Constant.SHOWSOLITAIRESYMMETRY, 'update': Constant.UPDATESOLITAIRESYMMETRY }
            case CommonMaster.SOLITAIR_LABS:
                return { 'add': Constant.ADDSOLITAIRELABS, 'show': Constant.SHOWSOLITAIRELABS, 'update': Constant.UPDATESOLITAIRELABS }
            case CommonMaster.SOLITAIR_EYE_CLEAN:
                return { 'add': Constant.ADDSOLITAIREEYECLEAN, 'show': Constant.SHOWSOLITAIREEYECLEAN, 'update': Constant.UPDATESOLITAIREEYECLEAN }
            case CommonMaster.OCCASION:
                return { 'add': Constant.ADDOCCASION, 'show': Constant.SHOWOCCASION, 'update': Constant.UPDATEOCCASION }
            case CommonMaster.BANGLE_SIZE:
                return { 'add': Constant.ADDBANGLESIZE, 'show': Constant.SHOWBANGLESIZE, 'update': Constant.UPDATEBANGLESIZE }
            case CommonMaster.BANGLE_BRACELATE:
                return { 'add': Constant.ADDBANGLEBRACELATESIZE, 'show': Constant.SHOWBANGLEBRACELATESIZE, 'update': Constant.UPDATEBANGLEBRACELATESIZE }
            case CommonMaster.PRODUCT_WEAR_TAG:
                return { 'add': Constant.ADDPRODUCTWEARTAG, 'show': Constant.SHOWPRODUCTWEARTAG, 'update': Constant.UPDATEPRODUCTWEARTAG }
            case CommonMaster.METAL_PURITY:
                return { 'add': Constant.ADDMETALPURITY, 'show': Constant.SHOWMETALPURITY, 'update': Constant.UPDATEMETALPURITY }
            case CommonMaster.GENDER:
                return { 'add': Constant.ADDGENDER, 'show': Constant.SHOWGENDER, 'update': Constant.UPDATEGENDER }
            case CommonMaster.PRODUCT_LOOKS_TAG:
                return { 'add': Constant.ADDPRODUCTLOOKSTAG, 'show': Constant.SHOWPRODUCTLOOKSTAG, 'update': Constant.UPDATEPRODUCTLOOKSTAG }
            case CommonMaster.METAL_TYPE:
                return { 'add': Constant.ADDMETALTYPE, 'show': Constant.SHOWMETALTYPE, 'update': Constant.UPDATEMETALTYPE }
        }
    }

    const setFormImageData = (imgData) => {
        setDisplayDialog(false)
        setMasterForm({ ...masterForm, ['image']: { url: imgData.url, noPicture: imgData.noPicture, obj: imgData.obj } })
        let errors = error
        errors['logo'] = ''
        setErrors({ ...errors });
    }

    const includeDescriptionField = () => {
        const modules = [
            CommonMaster.METAL_PRICE_TYPE,
            CommonMaster.LABOUR_CHARGE_TYPE,
        ];

        return !modules.includes(name);
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
                        <h5 className="card-title">{id ? 'Update' : 'Add'} {name}</h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">
                            {
                                Isaccount && adminRole === "SUPER_ADMIN" && (
                                    <div className={`mb-3 ${boxLength}`}>
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
                                                filterBy="name"
                                                disabled={accountVal === '0'}
                                            />
                                            <label>Account <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['account']}</p>
                                    </div>
                                )
                            }

                            {
                                (name === CommonMaster.LABOUR_CHARGE || name === CommonMaster.PRODUCT_CERTIFICATES) && (
                                    <div className={`mb-3 ${boxLength}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                value={masterForm.country}
                                                className="form-control"
                                                options={countryData}
                                                onChange={onCountryChange}
                                                optionLabel="name"
                                                optionValue="_id"
                                                filter
                                                filterBy='name'
                                            />
                                            <label>Country <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['country']}</p>
                                    </div>
                                )
                            }

                            {
                                name !== CommonMaster.LABOUR_CHARGE && (
                                    <div className={`col-md-12 mb-3 ${boxLength}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText className="form-control" maxLength={Regex.NAMECODE_MAXLENGTH} name="name" value={masterForm.name} onChange={(e) => onHandleChange(e)} required />
                                            <label>Name <span className="text-danger">*</span></label>

                                        </span>
                                        <p className="error">{error['name']}</p>
                                    </div>
                                )
                            }

                            {
                                name === CommonMaster.LABOUR_CHARGE && (
                                    <div className={`col-md-12 mb-3 ${boxLength}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                className='form-control'
                                                name='labour_charge_type'
                                                options={labourChargeTypeData}
                                                value={masterForm.labour_charge_type}
                                                onChange={e => onHandleChange(e)}
                                                optionValue='_id'
                                                optionLabel='name'
                                                required
                                            />
                                            <label>Labour Charge Type <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['labour_charge_type']}</p>
                                    </div>
                                )
                            }

                            {name === CommonMaster.PRICE ? <>
                                <div className={`col-md-6 col-lg-4 mb-3`}>
                                    <span className="p-float-label custom-p-float-label">
                                        <InputNumber inputId="integeronly" inputClassName="form-control" min={0} name="min" value={masterForm.min} onValueChange={(e) => onHandleChange(e)} required />
                                        <label>Min <span className="text-danger">*</span></label>

                                    </span>
                                    <p className="error">{error['min']}</p>

                                </div>
                                <div className={`col-md-6 col-lg-4 mb-3`}>
                                    <span className="p-float-label custom-p-float-label">
                                        <InputNumber inputClassName="form-control" min={0} name="max" value={masterForm.max} onValueChange={(e) => onHandleChange(e)} required />
                                        <label>Max <span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error['max']}</p>
                                </div>
                            </> :
                                name !== CommonMaster.LABOUR_CHARGE && (
                                    <div className={`col-md-12 mb-3 ${boxLength}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText
                                                className="form-control"
                                                name="code"
                                                rows={5}
                                                cols={30}
                                                value={masterForm.code}
                                                onChange={(e) => onHandleChange(e)}
                                                maxLength={Regex.NAMECODE_MAXLENGTH}
                                                disabled={id}
                                            />
                                            <label>Code <span className="text-danger">*</span></label>

                                        </span>
                                        <p className="error">{error['code']}</p>
                                    </div>
                                )
                            }
                            {(name === CommonMaster.METAL_TYPE || name === CommonMaster.METAL_PURITY) &&
                                <div className={`mb-3 ${boxLength}`}>
                                    <span className="p-float-label custom-p-float-label">
                                        <Dropdown
                                            value={masterForm.type}
                                            className="form-control"
                                            name="type"
                                            options={metalType}
                                            onChange={e => onHandleChange(e)}
                                            optionLabel='code'
                                            optionValue='code'
                                        />
                                        <label>Type <span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error['type']}</p>

                                </div>
                            }

                            {name === CommonMaster.LABOUR_CHARGE &&
                                <div className={`col-md-6 mb-3 ${boxLength}`}>
                                    <span className="p-float-label custom-p-float-label">
                                        <InputNumber inputClassName="form-control" name="price" min={0} value={masterForm.price} onValueChange={(e) => onHandleChange(e)} required />
                                        <label>Price <span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error['price']}</p>
                                </div>
                            }

                            {
                                name === CommonMaster.LABOUR_CHARGE && (
                                    <div className={`col-md-6 mb-3 ${boxLength}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                value={masterForm.metal_price_type}
                                                className="form-control"
                                                name="metal_price_type"
                                                options={metalPriceTypeData}
                                                onChange={e => onHandleChange(e)}
                                                optionLabel="code"
                                                optionValue="code"
                                            />
                                            <label>Metal Price Type <span className="text-danger">*</span></label>
                                        </span>

                                        <p className="error">{error['metal_price_type']}</p>
                                    </div>
                                )
                            }

                            {name === CommonMaster.METAL_PURITY ?
                                <div className={`col-md-12 mb-3 ${boxLength}`}>
                                    <span className="p-float-label custom-p-float-label">
                                        <InputText className="form-control" name="percentage" value={masterForm.percentage} onChange={(e) => onHandleChange(e)} required />
                                        <label>Percentage <span className="text-danger">*</span></label>

                                    </span>
                                    <p className="error">{error['percentage']}</p>

                                </div> : ''
                            }

                            {
                                includeDescriptionField() && (
                                    <div className="col-md-12 col-lg-12 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputTextarea
                                                className="form-control"
                                                maxLength="50"
                                                name="description"
                                                rows={5}
                                                cols={30}
                                                value={masterForm.description}
                                                onChange={(e) => onHandleChange(e)}
                                            />
                                            <label>Description</label>
                                        </span>
                                    </div>
                                )
                            }

                            {
                                name === CommonMaster.PRODUCT_CERTIFICATES ?
                                    <div className="col-md-12 col-lg-4 mb-3">
                                        <label>Certificate Image <span className="text-danger">* </span>
                                            <Tooltip target=".custom-tooltip-btn">
                                                {browseNote}
                                            </Tooltip>
                                            <img className="custom-tooltip-btn" src={infoIcon} alt="!" />
                                        </label>
                                        <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                            {masterForm?.image?.url &&
                                                <div className="profile mb-3">
                                                    <div className="profile-wrapper">
                                                        {masterForm?.image?.obj ?
                                                            <CImage src={masterForm?.image?.url} alt="File" className="profile-img canvas" />
                                                            :
                                                            <CImage src={masterForm?.image?.url} alt="File" className="profile-img" />
                                                        }
                                                    </div>
                                                    {masterForm.image.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'image') }} />}
                                                </div>
                                            }
                                            {masterForm.image.url === '' &&
                                                <div className="profile mb-3">
                                                    <div className="profile-wrapper" onClick={() => showDialog()}>
                                                        <CIcon icon={cilCloudUpload} size="xl" className="mr-1" /> <p className="mb-0">Add Image</p>
                                                    </div>
                                                </div>
                                            }
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
                                        <p className="error">{error['file']}</p>

                                    </div>
                                    : ''
                            }
                        </div>

                        <div>
                            <div className="col-md-6 col-lg-4 mb-3 d-flex align-items-center custom-checkbox">
                                <label className="mr-2 mb-0">Default</label>
                                <Checkbox checked={masterForm.is_default === 1 ? true : false} name="is_default" onChange={(e) => onHandleChange(e)}></Checkbox>
                            </div>
                            <div className="col-md-12 col-lg-6 mb-3 d-flex align-items-center">
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
                        <button type="button" className="btn btn-primary mb-2 mr-2" onClick={(e) => { onSubmit(e) }}><CIcon icon={cilCheck} className="mr-1" />{id ? 'Update' : 'Save'}</button>
                        <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MasterAddEdit;
