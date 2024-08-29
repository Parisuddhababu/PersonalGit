// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect, useRef } from 'react';
import CIcon from '@coreui/icons-react';
import { InputText } from 'primereact/inputtext';
import { CImage, CButton, CFormCheck, CBadge } from '@coreui/react'
import { useLocation, useHistory } from "react-router-dom";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';

import Closeicon from '../../../../assets/images/close.svg'
import { MultiSelect } from 'primereact/multiselect';
import infoIcon from "../../../../assets/images/info-icon.png";
import { DataTable } from 'primereact/datatable';
import FilterPopup from '.././filter-popup'
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'
import { CommonMaster, Permission } from 'src/shared/enum/enum';

import { cilCheck, cilCheckCircle, cilList, cilCloudUpload, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import Loader from "../../common/loader/loader"
import { useToast } from '../../../../shared/toaster/Toaster';
import { isTextValid } from 'src/shared/handler/common-handler';
import permissionHandler from 'src/shared/handler/permission-handler';
import { imageDimension } from "src/shared/constant/image-dimension";
import ImageCropModal from "src/modal/ImageCropModal";
import { Tooltip } from "primereact/tooltip";
import { AutoComplete } from 'primereact/autocomplete';

const CategoryAddEdit = (props) => { // NOSONAR
    let history = useHistory();
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)

    const fileUploadRef = useRef(null);
    const fileUploadMobileRef = useRef(null);
    const fileUploadMenueRef = useRef(null);
    const fileUploadNewRef = useRef(null);
    const fileUploadRecentRef = useRef(null);
    const fileUploadHomeRef = useRef(null);
    const fileUploadHomeRectangleRef = useRef(null);
    const fileUploadHomeWideRef = useRef(null);

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const type = new URLSearchParams(search).get('type');
    const data = new URLSearchParams(search).get('data');

    const [masterForm, setMasterForm] = useState({
        customization: '',
        category: 0,
        category_type: data || '',
        category_type_ids: [],
        category_ids: [],
        sub_category_ids: [],
        jewellery: null,
        name: '',
        template: '',
        description: '',
        cover_image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        cover_image_mobile: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        banner_image: { url: '', noPicture: '', obj: '', uuid: '' },
        filter: '',
        is_active: 1,
        is_display_front: 0,
        menu_logo: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        new_arrival_image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        recently_viewed_image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        home_category_image: { 'url': '', 'noPicture': '', 'obj': '', uuid: '' },
        home_category_image_rectangle: { url: '', noPicture: '', obj: '', uuid: '' },
        home_category_image_wide: { url: '', noPicture: '', obj: '', uuid: '' },
        account: '',
        tag_line: '',
        code: '',
    });

    const [accountData, setAccountData] = useState([])
    const [isFilter, setIsFilter] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [categorytypeData, setCategorytypeData] = useState([])
    const [subCategoryData, setSubCategoryData] = useState([])
    const [customizationData, setCustomizationData] = useState([])
    const [filterSequence, setFilterSequence] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [deleteObj, setDeleteObj] = useState({})
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [jewelleryData, setJewelleryData] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayDialog1, setDisplayDialog1] = useState(false);
    const [displayDialog2, setDisplayDialog2] = useState(false);
    const [displayDialog3, setDisplayDialog3] = useState(false);
    const [displayDialog4, setDisplayDialog4] = useState(false);
    const [displayDialog5, setDisplayDialog5] = useState(false);
    const [displayDialog6, setDisplayDialog6] = useState(false);
    const [displayDialog7, setDisplayDialog7] = useState(false);
    const [displayDialog8, setDisplayDialog8] = useState(false);

    const bannerLogoWidth = imageDimension.BANNER.width;
    const bannerLogoHeight = imageDimension.BANNER.height;
    const bannerBrowseNote = `We recommend to you to please upload the image of : ${bannerLogoWidth} / ${bannerLogoHeight} for exact results & Max file size is 5 MB`;

    const logoWidthLogo = imageDimension.COLLECTION_DESKTOP_LOGO.width;
    const logoHeightLogo = imageDimension.COLLECTION_DESKTOP_LOGO.height;
    const browseNoteLogo = `We recommend to you to please upload the image of : ${logoWidthLogo} / ${logoHeightLogo} for exact results & Max file size is 5 MB`;

    const homeCategorySquareWidth = imageDimension.HOME_CATEGORY_SQUARE_IMAGE.width;
    const homeCategorySquareHeight = imageDimension.HOME_CATEGORY_SQUARE_IMAGE.height;
    const browseNoteHomeCategorySquare = `We recommend to you to please upload the image of : ${homeCategorySquareWidth} / ${homeCategorySquareHeight} for exact results & Max file size is 5 MB`;

    const logoWidthArrival = imageDimension.SHOP_ONLINE_IMAGE.width;
    const logoHeightArrival = imageDimension.SHOP_ONLINE_IMAGE.height;
    const browseNoteArrival = `We recommend to you to please upload the image of : ${logoWidthArrival} / ${logoHeightArrival} for exact results & Max file size is 5 MB`;

    const homeCategoryRectangleWidth = imageDimension.HOME_CATEGORY_RECTANGLE_IMAGE.width;
    const homeCategoryRectangleHeight = imageDimension.HOME_CATEGORY_RECTANGLE_IMAGE.height;
    const browseNoteHomeCategoryRectangle = `We recommend to you to please upload the image of : ${homeCategoryRectangleWidth} / ${homeCategoryRectangleHeight} for exact results & Max file size is 5 MB`;

    const homeCategoryWideWidth = imageDimension.HOME_CATEGORY_WIDE_IMAGE.width;
    const homeCategoryWideHeight = imageDimension.HOME_CATEGORY_WIDE_IMAGE.height;
    const browseNoteHomeCategoryWide = `We recommend to you to please upload the image of : ${homeCategoryWideWidth} / ${homeCategoryWideHeight} for exact results & Max file size is 5 MB`;

    useEffect(() => {
        getAccountData()
        getCustomizationData()
        if (id) {
            getCategoryData()
            getCategoryDataById()
            getSubCateogryData()
        }
    }, [])

    useEffect(() => {
        setMasterForm({ ...masterForm, account: localStorage.getItem('account_id') });
    }, [accountData]);

    useEffect(() => {
        if (masterForm.account) GetCategoryType();
        if (!id) {
            setMasterForm({
                ...masterForm,
                sub_category_ids: [],
                category_ids: [],
                category_type_ids: [],
                category_type: []
            });
        }
    }, [masterForm.account]);

    const GetCategoryType = () => {
        const data = { account_id: masterForm.account };
        API.getMasterList(getCategoryTyperes, data, true, Constant.ACCOUNTWISE_CATEGORY_TYPE_LIST);
    }

    const getCategoryTyperes = {
        cancel: (c) => {
        },
        success: (response) => {
            setIsLoading(false)
            if (response.meta.status_code === 200) {
                setCategorytypeData(response.data)
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => {
        },
    }

    const onSubCategoryList = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {

                setSubCategoryData(response?.data)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    const onProductSelect = e => {
        setMasterForm({ ...masterForm, jewellery: e.value });
    }

    const getCategoryDataById = () => {
        setIsLoading(true)
        if (type === '2') {
            API.getMasterDataById(getMasterRes, "", true, id, Constant.GET_COLLECTION_BY_ID);
        } else if (type === '3') {
            API.getMasterDataById(getMasterRes, "", true, id, Constant.GET_STYLE_BY_ID);
        } else {
            API.getMasterDataById(getMasterRes, "", true, id, Constant.SHOWCATEGORY);
        }
    }

    const getSubCategory = data => {
        API.getMasterList(onSubCategoryList, data, true, Constant.ACCOUNTWISE_CATEGORY_LIST);
    }

    const getCustomizationData = () => {
        setIsLoading(true)
        API.getCustomizationList(getCustomizationRes, "", true);
    }

    const getCustomizationRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setCustomizationData(response?.data)
                setIsLoading(false)
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

    const getCategoryData = data => {
        API.getMasterList(onCategoryList, data, true, Constant.ACCOUNTWISE_CATEGORY_LIST);
    }

    const onCategoryList = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setCategoryData(response?.data)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)
        },
        complete: () => {
        },
    }

    const onAccountChange = (e) => {
        if (id) {
            setMasterForm({
                ...masterForm,
                account: e.target.value,
                sub_category_ids: [],
                category_ids: [],
                category_type_ids: [],
                category_type: [],
            });
        } else {
            setMasterForm({ ...masterForm, ['account']: e.target.value })
        }
        let errors = error
        errors['account'] = ''
        setErrors({ ...errors });
    }

    const getSubCateogryData = () => {
        if (permissionHandler(Permission.SUB_CATEGORY_LIST)) {
            let resObj = { parent_id: id, type: 1 };
            setIsLoading(true);
            API.getMasterList(getSubCateogryRes, resObj, true, Constant.GETCATEGORY);
        }
    }

    const getSubCateogryRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                const resValOriginal = response.data.original
                setFilterSequence(resValOriginal?.data)
                setTotalRecords(resValOriginal?.recordsTotal)
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    // getMasterRes Response Data Method
    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            if (response.meta.status_code === 200) {
                let resVal = response.data
                let obj = {
                    name: resVal.name,
                    is_active: resVal.is_active,
                    customization: resVal.customization_id,
                };

                if (type === '2' || type === '3') {
                    obj["category_type_ids"] = resVal.category_type_id || [];
                    obj["category_ids"] = resVal.category_id || [];
                    obj["sub_category_ids"] = resVal.sub_category_id || [];
                    obj["jewellery"] = resVal?.product_id || [];
                    obj["account"] = resVal.account?.account_id || '';
                    obj["name"] = resVal.title || '';
                }

                if (resVal?.category_type_id?.length > 0) {
                    if (resVal?.account?.account_id) {
                        getCategoryData({ account_id: resVal.account?.account_id, category_type: resVal.category_type_id })
                    }
                }

                if (resVal?.category_type_id?.length > 0 && resVal?.category_id?.length > 0) {
                    if (resVal?.account?.account_id) {
                        getSubCategory({
                            account_id: resVal.account?.account_id,
                            parent_id: resVal?.category_id,
                            category_type: resVal?.category_type_id
                        });
                    }
                }

                if (resVal?.category_type_id?.length > 0 && resVal?.category_id?.length > 0 && resVal?.sub_category_id?.length > 0 && (!(type === '2' || type === '3'))) {
                    getProductList({ category_id: resVal?.category_id, catagory_type_id: resVal?.category_type_id, sub_category_id: resVal?.sub_category_id })
                }

                if (type === '1') {
                    obj['category_type'] = resVal.category_type?.category_type_id;
                    obj['tag_line'] = resVal.tag_line;
                }

                if (type === '3' || type === '1' || type === '2') {
                    obj['code'] = resVal?.code;
                }

                if (resVal.desktop_image) {
                    obj['cover_image'] = { 'url': resVal?.desktop_image?.path, 'noPicture': resVal?.desktop_image?.path ? true : false, 'obj': '', uuid: resVal?.desktop_image?._id }
                } else {
                    obj['cover_image'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }

                if (resVal.new_arrival_image) {
                    obj['new_arrival_image'] = { 'url': resVal?.new_arrival_image?.path, 'noPicture': resVal?.new_arrival_image?.path ? true : false, 'obj': '', uuid: resVal?.new_arrival_image?._id }
                } else {
                    obj['new_arrival_image'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }

                if (resVal.recently_viewed_image) {
                    obj['recently_viewed_image'] = { 'url': resVal?.recently_viewed_image?.path, 'noPicture': resVal?.recently_viewed_image?.path ? true : false, 'obj': '', uuid: resVal?.recently_viewed_image?._id }
                } else {
                    obj['recently_viewed_image'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }

                obj["home_category_image"] = {
                    url: resVal?.home_category_square_image?.path ?? '',
                    noPicture: resVal?.home_category_square_image?.path ? true : false,
                    obj: '',
                    uuid: resVal?.home_category_square_image?._id ?? '',
                }

                obj["menu_logo"] = {
                    url: resVal?.menu_logo?.path ?? '',
                    noPicture: resVal?.menu_logo?.path ? true : false,
                    obj: '',
                    uuid: resVal?.menu_logo?._id ?? '',
                }

                if (resVal.mobile_image) {
                    obj['cover_image_mobile'] = { 'url': resVal?.mobile_image?.path, 'noPicture': resVal?.mobile_image?.path ? true : false, 'obj': '', uuid: resVal?.mobile_image?._id }
                } else {
                    obj['cover_image_mobile'] = { 'url': '', 'noPicture': '', 'obj': '', uuid: '' }
                }

                obj['banner_image'] = {
                    url: resVal?.banner_image?.path ?? '',
                    noPicture: resVal?.banner_image?.path ? true : false,
                    obj: '',
                    uuid: resVal?.banner_image?._id ?? '',
                }

                obj['home_category_image_rectangle'] = {
                    url: resVal?.home_category_rectangle_image?.path ?? '',
                    noPicture: resVal?.home_category_rectangle_image?.path ? true : false,
                    obj: '',
                    uuid: resVal?.home_category_rectangle_image?._id ?? '',
                }

                obj['home_category_image_wide'] = {
                    url: resVal?.home_category_wide_image?.path ?? '',
                    noPicture: resVal?.home_category_wide_image?.path ? true : false,
                    obj: '',
                    uuid: resVal?.home_category_wide_image?._id ?? '',
                }

                setMasterForm({ ...obj })
                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)


        },
        complete: () => {
        },
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

    const onHandleValidation = () => { // NOSONAR
        let errors = {}
        let formIsValid = true;
        let validationObj = {
            cover_image: masterForm?.cover_image?.url,
            cover_image_mobile: masterForm?.cover_image_mobile?.url,
            menu_logo: masterForm?.menu_logo?.url,
            new_arrival_image: masterForm?.new_arrival_image?.url,
            recently_viewed_image: masterForm?.recently_viewed_image?.url,
            home_category_image: masterForm?.home_category_image?.url,
            customization: masterForm?.customization,
            category_type: masterForm?.category_type,
            tag_line: masterForm.tag_line,
            code: masterForm.code,
            home_category_image_rectangle: masterForm?.home_category_image_rectangle?.url,
        }

        if (type !== '1') {
            delete validationObj['category_type'];
            delete validationObj['new_arrival_image'];
            delete validationObj['recently_viewed_image'];
            delete validationObj['home_category_image'];
            delete validationObj['customization'];
            delete validationObj['tag_line'];
            delete validationObj["home_category_image_rectangle"];
        }

        if (type === '2' || type === '3') {
            validationObj['account'] = masterForm.account;
            validationObj['category_type'] = masterForm.category_type_ids;
            validationObj['category'] = masterForm.category_ids;
            validationObj['sub_category'] = masterForm.sub_category_ids;
            validationObj['banner_image'] = masterForm?.banner_image?.url;
        }

        if (!id) {
            validationObj['name'] = masterForm.name
        }

        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');
            if (!value) {
                formIsValid = false;
                errors[key] = `${keyName} is required`;
            } else if ((key == 'name') && isTextValid(value)) {
                formIsValid = false;
                errors[key] = `Please enter valid ${keyName}`;
            }

            if (type === '2' || type === '3') {
                if (key === 'category' || key === 'category_type' || key === 'sub_category') {
                    if (value.length === 0) {
                        formIsValid = false;
                        errors[key] = key === 'jewellery' ? 'product is required' : `${keyName} is required`;
                    }
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
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const onDrpChange = (event, errName) => {
        let errors = error
        errors[errName] = ''
        setErrors({ ...errors });
        setMasterForm({ ...masterForm, [event.target.name]: event.target.value })

        if (type === '2' || type === '3') {
            switch (event.target.name) {
                case "category_type_ids":
                    setMasterForm({
                        ...masterForm,
                        category_type_ids: event.target.value,
                        category_ids: [],
                        sub_category_ids: [],
                        jewellery: [],
                    });

                    getCategoryData({ account_id: masterForm.account, category_type: event.target.value });
                    break;
                case "category_ids":
                    setMasterForm({
                        ...masterForm,
                        category_ids: event.target.value,
                        sub_category_ids: [],
                        jewellery: [],
                    });

                    getSubCategory({
                        account_id: masterForm.account,
                        parent_id: event.target.value,
                        category_type: masterForm.category_type_ids
                    });
                    break;
                case "sub_category_ids":
                    setMasterForm({ ...masterForm, sub_category_ids: event.target.value, jewellery: [] });
                    break;
                default:
                    setMasterForm({ ...masterForm, [event.target.name]: event.target.value });
                    break;
            }
        }
    }

    const onProductFilterChanges = e => {
        if (typeof (e.query) === 'string' && e.query.length >= 2) {
            const data = {
                account_id: masterForm.account,
                category_id: masterForm.category_ids,
                catagory_type_id: masterForm.category_type_ids,
                sub_category_id: masterForm.sub_category_ids,
                search_keyword: e.query,
            }
            getProductList(data);
        }
    }

    const getProductList = resObj => {
        resObj.account_id = masterForm.account ? masterForm.account : localStorage.getItem('account_id');
        API.getMasterList(onProductList, resObj, true, Constant.CATALOGUE_PRODUCT);
    }

    const onProductList = {
        cancel: () => { },
        success: response => {
            if (response.meta.status_code === 200) {
                let _jewelleryData = response.data.filter(product => {
                    return product?.website_product_detail?.length === 1;
                })
                setJewelleryData([..._jewelleryData]);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false)
        },
        complete: () => { },
    }

    const removeImageFromServer = uuid => {
        const data = { uuids: [uuid] };
        API.getMasterList(removeImageFromServerResponse, data, true, Constant.DELETE_MULTIPLE_TEMPLATES);
    }

    const removeImageFromServerResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                showSuccess(response?.meta?.message);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const oncancleForm = (e) => {
        e.preventDefault();

        switch (type) {
            case '1':
                history.push('/category');
                break;
            case '2':
                history.push('/collection');
                break;
            case '3':
                history.push('/style');
                break;
            default:
                break;
        }
    }

    const onSubmit = (e) => { // NOSONAR
        e.preventDefault()
        const _accountId = (adminRole === 'SUPER_ADMIN') ? masterForm.account : localStorage.getItem('account_id');
        if (onHandleValidation()) {
            let resObj = {
                'parent_id': 0,
                'type': parseInt(type),
                'name': masterForm.name,
                'is_active': masterForm.is_active,
                'customization_id': masterForm.customization,
                'category_type_id': masterForm.category_type,
                'tag_line': masterForm.tag_line,
                code: masterForm.code,
            }

            if (type !== '1') {
                delete resObj.parent_id
                delete resObj.customization_id
                delete resObj.category_type_id
                delete resObj.tag_line
                delete resObj.code
            }

            let formData = new FormData();

            if (type === '2' || type === '3') {
                delete resObj.parent_id;
                delete resObj.type;
                delete resObj.name;
                delete resObj.customization_id;
                delete resObj.category_type_id;
                resObj['title'] = masterForm.name;
                resObj['account_id'] = _accountId;
                resObj['category_id'] = masterForm.category_ids;
                resObj['category_type_id'] = masterForm.category_type_ids;
                resObj['sub_category_id'] = masterForm.sub_category_ids;
                resObj['product_id'] = masterForm.jewellery.map(product => {
                    return product?.website_product_detail?.[0]?._id ? product.website_product_detail[0]._id : product?._id;
                });
                resObj['code'] = masterForm.code;
            }

            formData.append('data', JSON.stringify(resObj))
            if (type === '2' || type === '3') {
                if (masterForm?.cover_image?.obj) {
                    const cvFile = new File([masterForm?.cover_image?.obj], `cover_img_${new Date().getTime()}`, { lastModified: new Date().getTime() });
                    formData.append('desktop_image', cvFile, masterForm?.cover_image?.obj?.name);
                }
                if (masterForm?.cover_image_mobile?.obj) {
                    const mIFile = new File([masterForm?.cover_image_mobile?.obj], `mobile_img_${new Date().getTime()}`, { lastModified: new Date().getTime() });
                    formData.append('mobile_image', mIFile, masterForm?.cover_image_mobile?.obj?.name);
                }
                if (masterForm?.menu_logo?.obj) {
                    const mlFile = new File([masterForm?.menu_logo?.obj], `menu_img_${new Date().getTime()}`, { lastModified: new Date().getTime() });
                    formData.append('menu_logo', mlFile, masterForm?.menu_logo?.obj?.name);
                }
                if (masterForm?.banner_image?.obj) {
                    const bannerFile = new File(
                        [masterForm?.banner_image?.obj],
                        `banner_img_${new Date().getTime()}`,
                        { lastModified: new Date().getTime() }
                    );
                    formData.append("banner_image", bannerFile, masterForm?.banner_image?.obj?.name);
                }
            } else {
                masterForm?.cover_image?.obj && formData.append('desktop_image', masterForm?.cover_image?.obj, masterForm?.cover_image?.obj?.name);
                masterForm?.cover_image_mobile?.obj && formData.append('mobile_image', masterForm?.cover_image_mobile?.obj, masterForm?.cover_image_mobile?.obj?.name);
                masterForm?.menu_logo?.obj && formData.append('menu_logo', masterForm?.menu_logo?.obj, masterForm?.menu_logo?.obj?.name);
            }

            if (type === '1') {
                masterForm?.new_arrival_image?.obj && formData.append(
                    'new_arrival_image',
                    masterForm?.new_arrival_image?.obj,
                    masterForm?.new_arrival_image?.obj?.name
                );

                masterForm?.recently_viewed_image?.obj && formData.append(
                    'recently_viewed_image',
                    masterForm?.recently_viewed_image?.obj,
                    masterForm?.recently_viewed_image?.obj?.name
                );

                masterForm?.home_category_image?.obj && formData.append(
                    'home_category_square_image',
                    masterForm?.home_category_image?.obj,
                    masterForm?.home_category_image?.obj?.name
                );

                masterForm?.home_category_image_rectangle?.obj && formData.append(
                    'home_category_rectangle_image',
                    masterForm?.home_category_image_rectangle?.obj,
                    masterForm?.home_category_image_rectangle?.obj?.name
                );

                masterForm?.home_category_image_wide?.obj && formData.append(
                    'home_category_wide_image',
                    masterForm?.home_category_image_wide?.obj,
                    masterForm?.home_category_image_wide?.obj?.name
                );
            }

            setIsLoading(true)
            if (id) {
                if (type === '2') {
                    API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.UPDATE_COLLECTION)
                } else if (type === '3') {
                    API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.UPDATE_STYLE)
                } else {
                    API.UpdateMasterData(addEditMasterRes, formData, true, id, Constant.UPDATECATEGORY)
                }
            } else if (type === '2') {
                API.addMaster(addEditMasterRes, formData, true, Constant.CREATE_COLLECTION);
            } else if (type === '3') {
                API.addMaster(addEditMasterRes, formData, true, Constant.CREATE_STYLE);
            } else {
                API.addMaster(addEditMasterRes, formData, true, Constant.ADDCATEGORY);
            }
        }

    }

    // addEditMasterRes Response Data Method
    const addEditMasterRes = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            if (response.meta.status_code === 200 || response.meta.status_code === 201) {

                showSuccess(response.meta.message)
                props.getCategoryId(response.data._id)
                setIsLoading(false)
                setTimeout(() => {
                    if (data) {
                        history.push(`/category-type/edit/?id=${data}`)
                    }
                    else {
                        if (type === '1') {
                            history.push('/category')
                        }
                        if (type === '2') {
                            if (!id) {
                                history.push(`/collection/edit/?id=${response.data._id}&&type=2`)
                            } else {
                                history.push('/collection')
                            }
                        }
                        if (type === '3') {
                            if (!id) {
                                history.push(`/style/edit/?id=${response.data._id}&&type=3`)
                            } else {
                                history.push('/style')
                            }
                        }
                    }

                }, 1000);

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

    const onRemoveImage = (e, name, uuid) => {
        setMasterForm({ ...masterForm, [name]: { url: '', noPicture: false, obj: '', uuid: '' } });
        if (name === "home_category_image_wide" && uuid) {
            removeImageFromServer(uuid);
        }
    }

    const onHandleFileChange = (event, name, fieldName) => {
        event.preventDefault()
        const targetImg = event.target.files[0];
        if (targetImg !== undefined) {
            const imgSize = 5;
            const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (fileTypes.includes(targetImg.type) === false) {
                showError("Allow only png, jpg and jpeg");
            } else if (targetImg.size / 1024 < imgSize) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setMasterForm({ ...masterForm, [name]: { url: e.target.result, noPicture: true, obj: targetImg } })
                    let errors = error
                    errors[fieldName] = ''
                    setErrors({ ...errors });
                };
                reader.readAsDataURL(targetImg);
            } else {
                showError("Max upload size", imgSize);
            }
        }
    }
    const resetFileCache = (fileName) => {
        if (fileName === 'cover_image') {
            fileUploadRef.current.value = '';
        } else if (fileName === 'cover_image_mobile') {
            fileUploadMobileRef.current.value = '';
        }
        else {
            fileUploadMenueRef.current.value = '';
        }
    }

    const onHandleUpload = (event, fileName, fieldName) => {
        const targetImg = event.target.files[0];
        if (targetImg) {
            const imgSize = Constant.IMAGE_SIZE;
            const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (fileTypes.includes(targetImg.type) === false) {
                showError(Constant.IMAGE_ERR)
                resetFileCache(fileName);
            } else if ((targetImg.size / 1000) / 1024 < imgSize) {
                const reader = new FileReader();
                reader.onload = e => {
                    setMasterForm({ ...masterForm, [fileName]: { url: e.target.result, noPicture: true, obj: targetImg } })
                    let errors = error
                    errors[fieldName] = ''
                    setErrors({ ...errors });
                };
                reader.readAsDataURL(targetImg);
            } else {
                showError(Constant.IMAGE_MAX_SIZE)
                resetFileCache(fileName);
            }
        }
    }

    const tempLateHeader = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" />Sub Cateogry Details <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                {
                    permissionHandler(Permission.SUB_CATEGORY_CREATE) && (<div className="float-end">
                        <div className="common-add-btn">
                            <CButton color="primary" onClick={(e) => { history.push(`/sub-category/add/?cat=${id}&cat_type=${masterForm.category_type}`) }}><CIcon icon={cilPlus} className="mr-1" />Add New Sub Category</CButton>
                        </div>
                    </div>
                    )}
            </div>
        </div>
    );

    const editData = (rowData) => {
        history.push(`/sub-category/edit/?id=${rowData._id}`)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {permissionHandler(Permission.SUB_CATEGORY_UPDATE) && (
                    <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                )}
                {permissionHandler(Permission.SUB_CATEGORY_DELETE) && (
                    <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={(e) => confirmDeleteProduct(e, rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                )}
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const slugBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.slug}
            </React.Fragment>
        )
    }
    const onUpdateStatus = (e, rowData) => {
        e.preventDefault();
        let obj = {
            "uuid": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)

        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.UPDATECATEGORYSTATUS);

    }

    // onUpdateStatusRes Response Data Method
    const onUpdateStatusRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                showSuccess(response.meta.message)
                getSubCateogryData()
            }
        },
        error: (error) => {
            showError(error.meta.message)
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const statusBodyTemplate = (rowData) => {
        if (rowData?.is_active === Constant.StatusEnum.active) {
            return (
                <React.Fragment>

                    <button className="btn btn-link text-success" title="Change Status" onClick={(e) => onUpdateStatus(e, rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>

                    <button className="btn btn-link text-danger" title="Change Status" onClick={(e) => onUpdateStatus(e, rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const parentBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.parent_name?.name}
            </React.Fragment>
        )
    }


    const categoryTypeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.category_type.name}
            </React.Fragment>
        )
    }

    const onCloseImageModal = (value, isSave) => {
        setIsFilter(value)
        if (isSave) {
            getSubCateogryData()
        }
    }

    const confirmDeleteProduct = (e, data) => {
        e.preventDefault();
        let obj = { ...data }
        obj.urlName = CommonMaster.CATEGORY_MANAGEMENT
        obj.name = data.name
        obj.uuid = data.id
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        if (isDelete) {
            showSuccess(message)
            getSubCateogryData()
        }
    }

    const getName = () => {
        switch (type) {
            case '1':
                return 'Category Management'
            case '2':
                return 'Collection Management'
            case '3':
                return 'Style Management'
        }
    }


    const showDialog = val => {
        switch (val) {
            case '1':
                setDisplayDialog(true);
                break;
            case '2':
                setDisplayDialog1(true);
                break;
            case '3':
                setDisplayDialog2(true);
                break;
            case '4':
                setDisplayDialog3(true);
                break;
            case '5':
                setDisplayDialog4(true);
                break;
            case '6':
                setDisplayDialog5(true);
                break;
            case '7':
                setDisplayDialog6(true);
                break;
            case '8':
                setDisplayDialog7(true);
                break;
            case '9':
                setDisplayDialog8(true);
                break;
            default:
                break;
        }
    };


    const setFormImageData = (imgData, name) => {
        setDisplayDialog(false);
        setDisplayDialog1(false);
        setDisplayDialog2(false);
        setDisplayDialog3(false);
        setDisplayDialog4(false);
        setDisplayDialog5(false);
        setDisplayDialog6(false);
        setDisplayDialog7(false);
        setDisplayDialog8(false);
        setMasterForm({
            ...masterForm,
            [name]: {
                url: imgData.url,
                noPicture: imgData.noPicture,
                obj: imgData.obj,
            },
        });
        let errors = error;
        errors[name] = "";
        setErrors({ ...errors });
    };

    const accountDataTemplate = option => {
        return (
            <>{`${option?.name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (

        <div>
            <FilterPopup visible={isFilter} id={id} onCloseImageModal={onCloseImageModal} />
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} name="Filter Sequence" />

            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{id ? 'Update' + ' ' + getName() : 'Add' + ' ' + getName()} </h5>
                    </div>
                    <div className="card-body">
                        <p className="col-sm-12 text-right">Fields marked with <span className="text-danger">*</span> are mandatory.</p>
                        <div className="row">
                            {
                                (type === '2' || type === '3') && (adminRole === 'SUPER_ADMIN') && (
                                    <div className="col-md-6 col-lg-4 mb-3">
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
                                                filterBy="name,code"
                                            />
                                            <label>Account <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['account']}</p>
                                    </div>
                                )
                            }

                            <div className={`col-md-6 mb-3 ${type === '2' || type === '3' ? "col-lg-4" : "col-lg-3"}`}>
                                <span className="p-float-label custom-p-float-label">
                                    <InputText className="form-control" maxLength="255" name="name" value={masterForm.name} onChange={(e) => onHandleChange(e)} required />
                                    <label>Name <span className="text-danger">*</span></label>

                                </span>
                                <p className="error">{error['name']}</p>
                            </div>
                            {
                                (type === "2" || type === "3") ?
                                    <div className="col-md-6 col-lg-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <MultiSelect value={masterForm.category_type_ids} className="form-control" name="category_type_ids" options={categorytypeData} optionLabel="category_type_name" optionValue="category_type_id" onChange={(e) => onDrpChange(e, 'category_type')} />
                                            <label>Category Type <span className="text-danger">*</span></label>

                                        </span>
                                        <p className="error">{error['category_type']}</p>

                                    </div>
                                    :
                                    <div className={`col-md-6 mb-3 ${type === '1' ? "col-lg-3 " : "col-lg-4"}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown value={masterForm.category_type} className="form-control" name="category_type" options={categorytypeData} optionLabel="category_type_name" optionValue="category_type_id" onChange={(e) => onDrpChange(e, 'category_type')} />
                                            <label>Category Type <span className="text-danger">*</span></label>

                                        </span>
                                        <p className="error">{error['category_type']}</p>

                                    </div>
                            }
                            {
                                (type === '2' || type === '3') && (
                                    <>
                                        <div className="col-md-6 col-lg-4 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <MultiSelect
                                                    value={masterForm.category_ids}
                                                    showSelectAll={false}
                                                    name='category_ids'
                                                    className="form-control"
                                                    options={categoryData}
                                                    optionLabel="name"
                                                    optionValue="_id"
                                                    disabled={masterForm.category_type_ids.length === 0}
                                                    onChange={(e) => onDrpChange(e, 'category')}
                                                />
                                                <label>Category <span className="text-danger">*</span></label>
                                            </span>
                                            <p className="error">{error['category']}</p>
                                        </div>

                                        <div className="col-md-6 col-lg-4 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <MultiSelect
                                                    value={masterForm.sub_category_ids}
                                                    showSelectAll={false}
                                                    name='sub_category_ids'
                                                    className="form-control"
                                                    options={subCategoryData}
                                                    optionLabel="name"
                                                    optionValue="_id"
                                                    disabled={masterForm.category_ids.length === 0}
                                                    onChange={(e) => onDrpChange(e, 'sub_category')}
                                                />
                                                <label>Sub Category <span className="text-danger">*</span></label>
                                            </span>
                                            <p className="error">{error['sub_category']}</p>
                                        </div>

                                        <div className="col-md-6 col-lg-4 mb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <AutoComplete
                                                    value={masterForm.jewellery}
                                                    className="product-autocomplete autocomplete-selection"
                                                    suggestions={jewelleryData}
                                                    field="title"
                                                    multiple
                                                    onChange={e => onProductSelect(e)}
                                                    completeMethod={onProductFilterChanges}
                                                    disabled={!(
                                                        masterForm.account &&
                                                        masterForm.category_ids?.length > 0 &&
                                                        masterForm.category_type_ids?.length > 0 &&
                                                        masterForm.sub_category_ids?.length > 0
                                                    )}
                                                />

                                                <label>Select Products</label>
                                            </span>
                                            <p className="error">{error['jewellery']}</p>
                                        </div>
                                    </>
                                )
                            }

                            {type === '1' &&
                                <div className="col-md-3 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <Dropdown value={masterForm.customization} className="form-control" name="customization" options={customizationData} onChange={(e) => onHandleChange(e)} optionLabel="name" optionValue="_id" />
                                        <label>Customization <span className="text-danger">*</span> </label>

                                    </span>
                                    <p className="error">{error['customization']}</p>
                                </div>
                            }

                            {
                                type === '1' && (
                                    <div className="col-md-3 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText className="form-control" maxLength="255" name="tag_line" value={masterForm.tag_line} onChange={(e) => onHandleChange(e)} required />
                                            <label>Tag Line <span className="text-danger">*</span></label>

                                        </span>
                                        <p className="error">{error['tag_line']}</p>
                                    </div>
                                )
                            }

                            {
                                (type === '1' || type === '2' || type === '3') && (
                                    <div className={`mb-3 ${type === '1' ? 'col-md-3' : 'col-md-4'}`}>
                                        <span className="p-float-label custom-p-float-label">
                                            <InputText
                                                className="form-control"
                                                maxLength="255"
                                                name="code"
                                                disabled={id}
                                                value={masterForm.code}
                                                onChange={e => {
                                                    if (!id) {
                                                        onHandleChange(e);
                                                    }
                                                }}
                                                required
                                            />
                                            <label>Code <span className="text-danger">*</span></label>
                                        </span>
                                        <p className="error">{error['code']}</p>
                                    </div>
                                )
                            }
                        </div>

                        <div className='row'>
                            <div className={`col-md-2 mb-3 ${type === '2' || type === '3' ? "col-lg-3" : "col-lg-2"}`}>
                                <label>Header Image - Web <span className="text-danger">* </span>
                                    <Tooltip target=".custom-tooltip-btn">{bannerBrowseNote}</Tooltip>
                                    <img className="custom-tooltip-btn" src={infoIcon} alt="!" />
                                </label>
                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {masterForm?.cover_image?.url &&
                                        <div className="profile mb-3">
                                            <div className="profile-wrapper">
                                                <CImage src={masterForm.cover_image.url} alt="File" className="profile-img" />
                                            </div>
                                            {masterForm?.cover_image?.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'cover_image') }} />}
                                            <input type="file" className="form-control" id="profile_picture" onChange={(e) => onHandleFileChange(e, 'cover_image', 'cover_image')} />
                                        </div>
                                    }
                                    {masterForm?.cover_image?.url === '' &&
                                        <div className='p-fileupload'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                ref={fileUploadRef}
                                                onChange={e => onHandleUpload(e, 'cover_image', 'cover_image')}
                                            />
                                            <button type='button' className='p-button p-fileupload-choose' onClick={() => showDialog('1')}>
                                                <span className='p-button-label p-clickable'>
                                                    <CIcon size="xl" icon={cilCloudUpload} /> <p className="mb-0">Add Images</p>
                                                </span>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <p className="error">{error['cover_image']}</p>
                            </div>

                            {
                                (type === '2' || type === '3') && (
                                    <div
                                        className={`col-md-2 mb-3 ${type === '2' || type === '3' ? "col-lg-3" : "col-lg-2"}`}
                                    >
                                        <label>Banner Image - Web <span className="text-danger">* </span>
                                            <Tooltip target=".custom-tooltip-btn">{bannerBrowseNote}</Tooltip>
                                            <img className="custom-tooltip-btn" src={infoIcon} alt="!" />
                                        </label>

                                        <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                            {masterForm?.banner_image?.url ? (
                                                <div className="profile mb-3">
                                                    <div className="profile-wrapper">
                                                        <CImage
                                                            src={masterForm.banner_image.url}
                                                            alt="File"
                                                            className="profile-img"
                                                        />
                                                    </div>

                                                    {masterForm.banner_image.noPicture && (
                                                        <img
                                                            src={Closeicon}
                                                            className="remove-profile"
                                                            onClick={e => onRemoveImage(e, "banner_image")}
                                                        />
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="profile_picture"
                                                        onChange={e => onHandleFileChange(e, "banner_image", "banner_image")}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="p-fileupload">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileUploadRef}
                                                        style={{ display: "none" }}
                                                        onChange={e => onHandleUpload(e, "banner_image", "banner_image")}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="p-button p-fileupload-choose"
                                                        onClick={() => fileUploadRef.current.click()}
                                                    >
                                                        <span className="p-button-label p-clickable">
                                                            <CIcon size="xl" icon={cilCloudUpload} />
                                                            <p className="mb-0">Add Image</p>
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="error">{error['banner_image']}</p>
                                    </div>
                                )
                            }

                            <div className={`col-md-2 mb-3 ${type === '2' || type === '3' ? "col-lg-3" : "col-lg-2"}`}>
                                <label>Header Image - Mobile <span className="text-danger">* </span>
                                    <Tooltip target="#custom-tooltip-btn-1">{bannerBrowseNote}</Tooltip>
                                    <img id="custom-tooltip-btn-1" className="custom-tooltip-btn" src={infoIcon} alt="!" /></label>
                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {masterForm.cover_image_mobile.url &&
                                        <div className="profile mb-3">
                                            <div className="profile-wrapper">
                                                <CImage src={masterForm.cover_image_mobile.url} alt="File" className="profile-img" />
                                            </div>
                                            {masterForm.cover_image_mobile.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'cover_image_mobile') }} />}
                                            <input type="file" className="form-control" id="profile_picture" onChange={(e) => onHandleFileChange(e, 'cover_image_mobile', 'cover_image_mobile')} />
                                        </div>
                                    }
                                    {masterForm.cover_image_mobile.url === '' &&
                                        <div className='p-fileupload'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                ref={fileUploadMobileRef}
                                                onChange={(e) => onHandleUpload(e, 'cover_image_mobile', 'cover_image_mobile')}
                                            />
                                            <button type='button' className='p-button p-fileupload-choose' onClick={() => showDialog('2')}>
                                                <span className='p-button-label p-clickable'>
                                                    <CIcon size="xl" icon={cilCloudUpload} /> <p className="mb-0">Add Images</p>
                                                </span>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <p className="error">{error['cover_image_mobile']}</p>
                            </div>

                            {displayDialog && (
                                <ImageCropModal
                                    visible={displayDialog}
                                    logoWidth={bannerLogoWidth}
                                    logoHeight={bannerLogoHeight}
                                    onCloseModal={() => setDisplayDialog(false)}
                                    name="header-img"
                                    cropImageData={(imageData) => setFormImageData(imageData, 'cover_image')}
                                />
                            )}
                            {displayDialog1 && (
                                <ImageCropModal
                                    visible={displayDialog1}
                                    logoWidth={bannerLogoWidth}
                                    logoHeight={bannerLogoHeight}
                                    onCloseModal={() => setDisplayDialog1(false)}
                                    cropImageData={(imageData) => setFormImageData(imageData, 'cover_image_mobile')}
                                />
                            )}
                            {displayDialog2 && (
                                <ImageCropModal
                                    visible={displayDialog2}
                                    logoWidth={logoWidthLogo}
                                    logoHeight={logoHeightLogo}
                                    onCloseModal={() => setDisplayDialog2(false)}
                                    cropImageData={(imageData) => setFormImageData(imageData, 'menu_logo')}
                                />
                            )}
                            {displayDialog3 && (
                                <ImageCropModal
                                    visible={displayDialog3}
                                    logoWidth={logoWidthArrival}
                                    logoHeight={logoHeightArrival}
                                    onCloseModal={() => setDisplayDialog3(false)}
                                    cropImageData={(imageData) => setFormImageData(imageData, 'new_arrival_image')}
                                />
                            )}
                            {displayDialog4 && (
                                <ImageCropModal
                                    visible={displayDialog4}
                                    logoWidth={logoWidthArrival}
                                    logoHeight={logoHeightArrival}
                                    onCloseModal={() => setDisplayDialog4(false)}
                                    cropImageData={(imageData) => setFormImageData(imageData, 'recently_viewed_image')}
                                />
                            )}
                            {displayDialog5 && (
                                <ImageCropModal
                                    visible={displayDialog5}
                                    logoWidth={homeCategorySquareWidth}
                                    logoHeight={homeCategorySquareHeight}
                                    onCloseModal={() => setDisplayDialog5(false)}
                                    cropImageData={(imageData) => setFormImageData(imageData, 'home_category_image')}
                                />
                            )}
                            {displayDialog6 && (
                                <ImageCropModal
                                    visible={displayDialog6}
                                    logoWidth={bannerLogoWidth}
                                    logoHeight={bannerLogoHeight}
                                    onCloseModal={() => setDisplayDialog6(false)}
                                    cropImageData={(imageData) => setFormImageData(imageData, 'banner_image')}
                                />
                            )}
                            {displayDialog7 && (
                                <ImageCropModal
                                    visible={displayDialog7}
                                    logoWidth={homeCategoryRectangleWidth}
                                    logoHeight={homeCategoryRectangleHeight}
                                    onCloseModal={() => setDisplayDialog7(false)}
                                    cropImageData={imageData => {
                                        setFormImageData(imageData, 'home_category_image_rectangle')
                                    }}
                                />
                            )}
                            {displayDialog8 && (
                                <ImageCropModal
                                    visible={displayDialog8}
                                    logoWidth={homeCategoryWideWidth}
                                    logoHeight={homeCategoryWideHeight}
                                    onCloseModal={() => setDisplayDialog8(false)}
                                    cropImageData={imageData => {
                                        setFormImageData(imageData, 'home_category_image_wide')
                                    }}
                                />
                            )}

                            <div className={`col-md-2 mb-3 ${type === '2' || type === '3' ? "col-lg-3" : "col-lg-2"}`}>
                                <label>Menu Logo <span className="text-danger">* </span>
                                    <Tooltip target="#customTooltipBtnTwo">{browseNoteLogo}</Tooltip>
                                    <img id="customTooltipBtnTwo" className="custom-tooltip-btn" src={infoIcon} alt="!" />
                                </label>

                                <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                    {masterForm.menu_logo.url &&
                                        <div className="profile mb-3">
                                            <div className="profile-wrapper">
                                                <CImage src={masterForm.menu_logo.url} alt="File" className="profile-img" />
                                            </div>
                                            {masterForm.menu_logo.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'menu_logo') }} />}
                                            <input type="file" className="form-control" id="profile_picture" onChange={(e) => onHandleFileChange(e, 'menu_logo', 'menu_logo')} />
                                        </div>
                                    }
                                    {masterForm.menu_logo.url === '' &&
                                        <div className='p-fileupload'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                ref={fileUploadMenueRef}
                                                onChange={(e) => onHandleUpload(e, 'menu_logo', 'menu_logo')}
                                            />
                                            <button type='button' className='p-button p-fileupload-choose' onClick={() => showDialog('3')}>
                                                <span className='p-button-label p-clickable'>
                                                    <CIcon size="xl" icon={cilCloudUpload} /> <p className="mb-0">Add Images</p>
                                                </span>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <p className="error">{error['menu_logo']}</p>

                            </div>
                            {type === '1' &&

                                <div className="col-md-2 mb-3">
                                    <label>New Arival <span className="text-danger">* </span>
                                        <Tooltip target=".custom-tooltip-btn-three">{browseNoteArrival}</Tooltip>
                                        <img className="custom-tooltip-btn custom-tooltip-btn-three" src={infoIcon} alt="!" /></label>
                                    <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                        {masterForm.new_arrival_image.url &&
                                            <div className="profile mb-3">
                                                <div className="profile-wrapper">
                                                    <CImage src={masterForm.new_arrival_image.url} alt="File" className="profile-img" />
                                                </div>
                                                {masterForm.new_arrival_image.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'new_arrival_image') }} />}
                                                <input type="file" className="form-control" id="profile_picture" onChange={(e) => onHandleFileChange(e, 'new_arrival_image', 'new_arrival_image')} />
                                            </div>
                                        }
                                        {masterForm.new_arrival_image.url === '' &&
                                            <div className='p-fileupload'>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    ref={fileUploadNewRef}
                                                    onChange={(e) => onHandleUpload(e, 'new_arrival_image', 'new_arrival_image')}
                                                />
                                                <button type='button' className='p-button p-fileupload-choose' onClick={() => showDialog('4')}>
                                                    <span className='p-button-label p-clickable'>
                                                        <CIcon size="xl" icon={cilCloudUpload} /> <p className="mb-0">Add Images</p>
                                                    </span>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <p className="error">{error['new_arrival_image']}</p>
                                </div>}

                            {type === '1' &&
                                <div className="col-md-2 mb-3">
                                    <label>Recently viewed Image <span className="text-danger">* </span>
                                        <Tooltip target=".custom-tooltip-btn-four">{browseNoteArrival}</Tooltip>
                                        <img className="custom-tooltip-btn custom-tooltip-btn-four" src={infoIcon} alt="!" />
                                    </label>
                                    <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                        {masterForm.recently_viewed_image.url &&
                                            <div className="profile mb-3">
                                                <div className="profile-wrapper">
                                                    <CImage src={masterForm.recently_viewed_image.url} alt="File" className="profile-img" />
                                                </div>
                                                {masterForm.recently_viewed_image.noPicture && <img src={Closeicon} className="remove-profile" onClick={(e) => { onRemoveImage(e, 'recently_viewed_image') }} />}
                                                <input type="file" className="form-control" id="profile_picture" onChange={(e) => onHandleFileChange(e, 'recently_viewed_image', 'recently_viewed_image')} />
                                            </div>
                                        }
                                        {masterForm.recently_viewed_image.url === '' &&
                                            <div className='p-fileupload'>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    ref={fileUploadRecentRef}
                                                    onChange={(e) => onHandleUpload(e, 'recently_viewed_image', 'recently_viewed_image')}
                                                />
                                                <button type='button' className='p-button p-fileupload-choose' onClick={() => showDialog('5')}>
                                                    <span className='p-button-label p-clickable'>
                                                        <CIcon size="xl" icon={cilCloudUpload} /> <p className="mb-0">Add Images</p>
                                                    </span>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <p className="error">{error['recently_viewed_image']}</p>
                                </div>
                            }

                            {
                                type === '1' && (
                                    <div className="col-md-2 mb-3">
                                        <label>Home Category (Square) <span className="text-danger">* </span>
                                            <Tooltip target=".custom-tooltip-btn-five">{browseNoteHomeCategorySquare}</Tooltip>
                                            <img
                                                className="custom-tooltip-btn custom-tooltip-btn-five"
                                                src={infoIcon}
                                                alt="!"
                                            />
                                        </label>

                                        <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                            {masterForm.home_category_image.url ? (
                                                <div className="profile mb-3">
                                                    <div className="profile-wrapper">
                                                        <CImage src={masterForm.home_category_image.url} alt="File" className="profile-img" />
                                                    </div>
                                                    {
                                                        masterForm.home_category_image.noPicture && (
                                                            <img
                                                                src={Closeicon}
                                                                className="remove-profile"
                                                                onClick={(e) => { onRemoveImage(e, 'home_category_image') }}
                                                            />
                                                        )
                                                    }
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="profile_picture"
                                                        onChange={e => {
                                                            onHandleFileChange(e, 'home_category_image', 'home_category_image')
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className='p-fileupload'>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        ref={fileUploadHomeRef}
                                                        onChange={e => {
                                                            onHandleUpload(e, 'home_category_image', 'home_category_image')
                                                        }}
                                                    />
                                                    <button
                                                        type='button'
                                                        className='p-button p-fileupload-choose'
                                                        onClick={() => showDialog('6')}
                                                    >
                                                        <span className='p-button-label p-clickable'>
                                                            <CIcon size="xl" icon={cilCloudUpload} />
                                                            <p className="mb-0">Add Images</p>
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="error">{error['home_category_image']}</p>
                                    </div>
                                )
                            }

                            {
                                type === '1' && (
                                    <div className="col-md-2 mb-3">
                                        <label>Home Category (Rectangle) <span className="text-danger">* </span>
                                            <Tooltip target=".custom-tooltip-btn-six">
                                                {browseNoteHomeCategoryRectangle}
                                            </Tooltip>
                                            <img
                                                className="custom-tooltip-btn custom-tooltip-btn-six"
                                                src={infoIcon}
                                                alt="!"
                                            />
                                        </label>

                                        <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                            {masterForm?.home_category_image_rectangle?.url ? (
                                                <div className="profile mb-3">
                                                    <div className="profile-wrapper">
                                                        <CImage
                                                            src={masterForm.home_category_image_rectangle.url}
                                                            alt="File"
                                                            className="profile-img"
                                                        />
                                                    </div>

                                                    {
                                                        masterForm.home_category_image_rectangle.noPicture && (
                                                            <img
                                                                src={Closeicon}
                                                                className="remove-profile"
                                                                onClick={(e) => {
                                                                    onRemoveImage(e, 'home_category_image_rectangle')
                                                                }}
                                                            />
                                                        )
                                                    }

                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="profile_picture"
                                                        onChange={e => {
                                                            onHandleFileChange(
                                                                e,
                                                                'home_category_image_rectangle',
                                                                'home_category_image_rectangle'
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className='p-fileupload'>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        ref={fileUploadHomeRectangleRef}
                                                        onChange={e => onHandleUpload(
                                                            e,
                                                            'home_category_image_rectangle',
                                                            'home_category_image_rectangle'
                                                        )}
                                                    />
                                                    <button
                                                        type='button'
                                                        className='p-button p-fileupload-choose'
                                                        onClick={() => showDialog('8')}
                                                    >
                                                        <span className='p-button-label p-clickable'>
                                                            <CIcon size="xl" icon={cilCloudUpload} />
                                                            <p className="mb-0">Add Image</p>
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="error">{error["home_category_image_rectangle"]}</p>
                                    </div>
                                )
                            }

                            {
                                type === '1' && (
                                    <div className="col-md-2 mb-3">
                                        <label>
                                            Home Category (Wide)
                                            <Tooltip target=".custom-tooltip-btn-seven">{browseNoteHomeCategoryWide}</Tooltip>
                                            <img
                                                className="custom-tooltip-btn custom-tooltip-btn-seven"
                                                src={infoIcon}
                                                alt="!"
                                            />
                                        </label>

                                        <div className="form-control upload-image-wrap multi-upload-image-wrap">
                                            {masterForm?.home_category_image_wide?.url ? (
                                                <div className="profile mb-3">
                                                    <div className="profile-wrapper">
                                                        <CImage
                                                            src={masterForm.home_category_image_wide.url}
                                                            alt="File"
                                                            className="profile-img"
                                                        />
                                                    </div>

                                                    {
                                                        masterForm.home_category_image_wide.noPicture && (
                                                            <img
                                                                src={Closeicon}
                                                                className="remove-profile"
                                                                onClick={e => {
                                                                    onRemoveImage(
                                                                        e,
                                                                        'home_category_image_wide',
                                                                        masterForm?.home_category_image_wide?.uuid
                                                                    )
                                                                }}
                                                            />
                                                        )
                                                    }

                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="profile_picture"
                                                        onChange={e => {
                                                            onHandleFileChange(
                                                                e,
                                                                'home_category_image_wide',
                                                                'home_category_image_wide'
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className='p-fileupload'>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        ref={fileUploadHomeWideRef}
                                                        onChange={e => onHandleUpload(
                                                            e,
                                                            'home_category_image_wide',
                                                            'home_category_image_wide'
                                                        )}
                                                    />
                                                    <button
                                                        type='button'
                                                        className='p-button p-fileupload-choose'
                                                        onClick={() => showDialog('9')}
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
                                )
                            }

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
                            <div className="card-footer">
                                <button className="btn btn-primary mb-2 mr-2" onClick={(e) => { onSubmit(e) }}><CIcon icon={cilCheck} className="mr-1" />{id ? 'Update' : 'Save'}</button>
                                <button className="btn btn-danger mb-2" onClick={(e) => oncancleForm(e)}><CIcon icon={cilXCircle} className="mr-1" />Cancel</button>
                            </div>

                            {(id && type === '1' && permissionHandler(Permission.SUB_CATEGORY_LIST)) &&
                                <div className="col-md-12 mb-3 d-flex align-items-center custom-checkbox">
                                    <div className="datatable-responsive-demo custom-react-table table-responsive">
                                        <div className="card">

                                            <DataTable value={filterSequence} className="p-datatable-responsive-demo" header={tempLateHeader} showGridlines responsiveLayout="scroll" paginator={filterSequence.length > 0} reorderableColumns
                                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                                                currentPageReportTemplate={`Showing {first} to {last} of {totalRecords}`} rows={Constant.DT_ROW} rowsPerPageOptions={Constant.DT_ROWS_LIST}
                                            >
                                                <Column field="name" header="Name" body={nameBodyTemplate}></Column>
                                                <Column field="parent_name" header="Parent Name" body={parentBodyTemplate}></Column>
                                                <Column field="name" header="Category Type" body={categoryTypeBodyTemplate}></Column>
                                                {/* <Column field="template" header="Template" body={templateBodyTemplate}></Column> */}
                                                <Column field="slug" header="Slug" body={slugBodyTemplate}></Column>
                                                {permissionHandler(Permission.SUB_CATEGORY_STATUS) &&
                                                    <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                                                }
                                                {(permissionHandler(Permission.SUB_CATEGORY_UPDATE) || permissionHandler(Permission.SUB_CATEGORY_DELETE)) &&
                                                    <Column field="action" header="Action" body={actionBodyTemplate} ></Column>
                                                }
                                            </DataTable>
                                        </div>
                                    </div>
                                </div>
                            }


                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default CategoryAddEdit