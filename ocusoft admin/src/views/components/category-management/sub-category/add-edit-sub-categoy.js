// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { useLocation } from "react-router-dom";
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { Dropdown } from 'primereact/dropdown';

import Loader from "../../common/loader/loader"
import { imageDimension } from "src/shared/constant/image-dimension";
import ImageCropModal from "../../../../modal/ImageCropModal";

const SubCategoryAddEdit = () => {
    const [displayDialog, setDisplayDialog] = useState(false);
    const [uploadingImgType] = useState('');
    const logoWidth = imageDimension.BANNER.width;
    const logoHeight = imageDimension.BANNER.height;

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const cat = new URLSearchParams(search).get('cat');
    const cat_type = new URLSearchParams(search).get('cat_type');

    const [masterForm, setMasterForm] = useState({
        customization: '',
        category: cat || '',
        category_type: cat_type || '',
        name: '',
        template: '',
        filter: '',
        is_active: 1,
        is_display_front: 0,
        tag_line: '',
        code: '',
    })
    const [subCategoryImages, setSubCategoryImages] = useState({
        desktop: { url: '', noPicture: false, obj: null, uuid: '', serverName: "desktop_image" },
        mobile: { url: '', noPicture: false, obj: null, uuid: '', serverName: "mobile_image" },
        logo: { url: '', noPicture: false, obj: null, uuid: '', serverName: "menu_logo" },
        home: { url: '', noPicture: false, obj: null, uuid: '', serverName: "home_category_image" },
    });

    const [categoryData, setCategoryData] = useState([])
    const [categorytypeData, setCategorytypeData] = useState([])
    const [error, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        GetCategoryType();

        if (id) {
            getCategoryDataById();
        } else if (cat) {
            getCategoryData();
        }
    }, [])

    useEffect(() => {
        if (masterForm.category_type) {
            getCategoryData()
        }
    }, [masterForm.category_type])

    const GetCategoryType = () => {
        setIsLoading(true);
        const url = id ? Constant.ACTIVE_CATEGORY_TYPE_ALL : Constant.CATEGORY_TYPE_ACTIVE;
        API.getActiveDataList(url, getCategoryTyperes, "", true);
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
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    const getCategoryDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, "", true, id, Constant.SHOWCATEGORY);
    }

    const getCategoryData = () => {
        let { category_type } = masterForm;
        let resObj = { category_type: category_type, type: 1 };

        setIsLoading(true);
        const url = id ? Constant.ACTIVE_CATEGORY_ALL : Constant.ACTIVE_CATEGORY;
        API.getMasterList(onCategoryList, resObj, true, url);
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

    const getMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                let resVal = response.data
                let obj = {
                    name: resVal.name ?? '',
                    is_active: resVal.is_active ?? 0,
                    category: resVal.entity_id ?? '',
                    customization: resVal.customization_id ?? '',
                    category_type: resVal?.parent_name?.category_type?.entity_id ?? '',
                    tag_line: resVal.tag_line ?? '',
                    code: resVal.code ?? '',
                    image: resVal?.category_image ?? '',
                };

                setMasterForm({ ...obj });
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { },
    }

    const onHandleChange = (event, radioVal) => {
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        // event.preventDefault()
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        }
        else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value })
        }
    }

    const setFormImageData = imgData => {
        setDisplayDialog(false);
        setErrors({ ...error, [uploadingImgType]: '' });
        setSubCategoryImages({
            ...subCategoryImages,
            [uploadingImgType]: {
                ...subCategoryImages[uploadingImgType],
                url: imgData.url,
                noPicture: imgData.noPicture,
                obj: imgData.obj
            }
        });
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">View Sub Category Management</h5>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm.category_type}
                                        className="form-control"
                                        name="category_type"
                                        options={categorytypeData}
                                        optionLabel="name"
                                        optionValue="entity_id"
                                    />
                                    <label>Category Type</label>
                                </span>
                            </div>

                            <div className="col-md-4 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm.category}
                                        className="form-control"
                                        name="category"
                                        options={categoryData}
                                        optionLabel="name"
                                        optionValue="entity_id"
                                    />
                                    <label>Category</label>
                                </span>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        maxLength="255"
                                        name="name"
                                        value={masterForm.name}
                                        required
                                    />
                                    <label>Name</label>
                                </span>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        maxLength="255"
                                        name="code"
                                        value={masterForm.code}
                                        onChange={e => { if (!id) onHandleChange(e); }} // NOSONAR
                                        required
                                    />

                                    <label>Code</label>
                                </span>
                            </div>

                            {
                                masterForm.image && (
                                    <div className="col-md-12 mt-2 mb-3">
                                        <h4>Image</h4>
                                        <img src={masterForm.image} width={100} height={100} />
                                    </div>
                                )
                            }
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
            </form>
        </div>
    )
}

export default SubCategoryAddEdit