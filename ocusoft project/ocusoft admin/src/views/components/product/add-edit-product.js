import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Remarkable } from "remarkable";
import { Html5Entities } from "html-entities";
import { CBadge, CFormCheck } from "@coreui/react";
import React, { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { cilCheck, cilXCircle } from "@coreui/icons";
import { useLocation, useHistory } from "react-router-dom";

import { API } from "src/services/Api";
import pdfIcon from "src/assets/images/pdf_icon.png";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import ImageModal from "../common/ImageModalPopup/image-modal";
import Loader from "src/views/components/common/loader/loader";
import { isEmpty, prescriptionStatusDirectory, uuid } from "src/shared/handler/common-handler";

const AddEditProduct = () => { // NOSONAR
    let history = useHistory();
    const search = useLocation().search;
    const entities = new Html5Entities();
    const { showError, showSuccess } = useToast();
    const id = new URLSearchParams(search).get("id");
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const md = new Remarkable({ html: true, breaks: true, xhtmlOut: true, typographer: true });

    const [error, setErrors] = useState({});
    const [imageData, setImageData] = useState(null);
    const [masterForm, setMasterForm] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        if (id) getProductDataById();
    }, [])

    const getProductDataById = () => {
        setIsLoading(true);
        API.getMasterDataById(handleGetProductDataByIdResponse, '', true, id, Constant.PRODUCT_SHOW);
    }

    const handleGetProductDataByIdResponse = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);
            if (response?.meta?.status) {
                let resVal = response.data;

                let obj = {
                    title: resVal?.product?.name ?? '',
                    account_id: resVal?.account_id ?? '',
                    sku: resVal?.product?.sku?.replaceAll(/[^A-Za-z0-9\-]/ig, '') ?? '', // NOSONAR
                    gross_weight: resVal?.product?.weight ?? 0,
                    type: resVal?.product?.product_type ?? '',
                    category_type_names: resVal?.product?.categories?.category_type?.map(category => category.name)?.join(', ') ?? '',
                    category_type_ids: resVal.product.category_type_ids,
                    category_names: resVal?.product?.categories?.category?.map(category => category.name)?.join(', ') ?? '',
                    short_desc: entities.decode(resVal?.product?.short_description ?? ''),
                    long_desc: entities.decode(resVal?.product?.description ?? ''),
                    seo_title: resVal?.product?.meta_title ?? '',
                    seo_keywords: resVal?.product?.meta_keyword ?? '',
                    seo_desc: entities.decode(resVal?.product?.meta_description ?? ''),
                    sap_price: resVal?.product?.price ?? 0,
                    selling_price: resVal?.selling_price ?? 0,
                    cost_price: resVal?.cost_price ?? 0,
                    is_active: resVal.is_active,
                    is_in_stock: resVal?.product?.is_in_stock ?? 0,
                    productStatus: (resVal?.product?.status ?? 0),
                    micrositeStatus: (resVal?.product?.is_active ?? 0),
                    prescriptionStatus: (resVal?.product?.is_prescribed ?? 0),
                    is_returnable: resVal?.product?.returnable ?? 0,
                    tax_class_name: resVal?.product?.tax_class_name ?? '',
                    manufacturing_country: resVal?.product?.country_of_manufacture ?? '',
                    qty_available: resVal?.product?.qty ?? 0,
                    qty_returnable: resVal?.product?.returnable ?? 0,
                    is_available: resVal?.product?.is_in_stock ? "Available" : "Unavailable",
                    low_stock_qty: resVal?.product?.low_stock_qty ?? 0,
                    purchase_limit: resVal?.product?.product_purchase_limit ?? 0,
                    attachments: resVal?.product?.attachment_file ?? [],
                    gallery: resVal?.product?.media_gallery ?? [],
                    icons: resVal?.product?.product_icons?.map(iconObj => {
                        return { url: iconObj.icon_image, label: iconObj.icon_label };
                    }) ?? [],
                    image: {
                        base: resVal?.product?.base_image ?? '',
                        small: resVal?.product?.small_image ?? '',
                        swatch: resVal?.product?.swatch_image ?? '',
                        thumbnail: resVal?.product?.thumbnail_image ?? '',
                    },
                }

                setMasterForm(obj);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const onHandleValidation = () => {
        let isFormValid = true, _errors = error;
        const { cost_price, selling_price } = masterForm;

        if (cost_price > selling_price) {
            isFormValid = false;
            showError("Selling price should never be less than the cost price.");
        }

        setErrors({ ..._errors });
        return isFormValid;
    }

    const onHandleChange = (event, radioVal, index, name) => {
        let errors = error
        errors[event.target.name] = ''
        setErrors({ ...errors });
        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else if (name) {
            if (index !== '') {
                let array = masterForm[event.target.name]
                array[index][name] = event.target.value
                setMasterForm({ ...masterForm, [event.target.name]: [...array] })
            } else {
                let obj = masterForm[event.target.name]
                obj[name] = event.target.value
                setMasterForm({ ...masterForm, [event.target.name]: { ...obj } })
            }
        } else if (index !== '' && index !== undefined) {
            let array = masterForm[event.target.name]
            array[index] = event.target.value
            setMasterForm({ ...masterForm, [event.target.name]: array })
        } else {
            const inputValue = event.target.value, pattern = /[^A-Z0-9\-]/ig;
            let value = event.target.name === "sku" ? inputValue.replaceAll(pattern, '') : inputValue;
            setMasterForm({ ...masterForm, [event.target.name]: value });
        }
    }

    const handleCancelUpdate = e => {
        e.preventDefault();
        history.push("/product");
    }

    const handleSubmit = e => {
        e.preventDefault();
        const isFormValid = onHandleValidation();

        if (isFormValid) {
            let resObj = {
                "account_id": masterForm.account_id,
                "title": masterForm.title,
                "sku": masterForm.sku,
                "type": masterForm.type,
                "cost_price": masterForm.cost_price,
                "selling_price": masterForm.selling_price,
                "gross_weight": masterForm.gross_weight,
                "category_type_ids": masterForm.category_type_ids,
                "category_ids": masterForm.category_ids,
                "sub_category_ids": masterForm.sub_category_ids,
                "product_tag_ids": masterForm.product_tag_ids ? [masterForm.product_tag_ids] : [],
                "is_active": masterForm.is_active,
                "min_order_qty": masterForm.min_order_qty,
                "max_order_qty": masterForm.max_order_qty,
                "is_available_for_order": masterForm.is_available_for_order,
                "product_available_in_days": masterForm.product_available_in_days,
                'short_desc': masterForm.short_desc || '',
                'long_desc': masterForm.long_desc || '',
                "seo": { "seo_title": masterForm.seo_title, "seo_keywords": masterForm.seo_keywords, "seo_desc": masterForm.seo_desc },
                "images": [],
                "is_sync": 1,
            };

            let formData = new FormData();
            formData.append("data", JSON.stringify(resObj));
            setIsLoading(true);

            const args = id
                ? [addEditMasterRes, formData, true, id, Constant.PRODUCT_UPDATE]
                : [addEditMasterRes, formData, true, Constant.PRODUCT_CREATE];
            const fn = id ? "UpdateMasterData" : "addMaster";

            API[fn](...args);
        }
    }

    const addEditMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);

                setTimeout(() => { history.push("/product"); }, 1000);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.errors) {
                Object.values(error.errors).map(err => {
                    showError(err)
                })
            } else if (err?.meta?.message) {
                showError(err.meta.message);
            }
        },
        complete: () => { },
    }

    const openImageModal = imgUrl => {
        if (imgUrl) {
            setShowImageModal(true);
            setImageData({ path: imgUrl });
        }
    }

    const handleCloseImageModal = () => {
        setImageData(null);
        setShowImageModal(false);
    }

    return (
        <div>
            {isLoading && <Loader />}
            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Update Product</h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right mb-0">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="d-flex">
                            {
                                masterForm?.title && (
                                    <h4 className="align-self-center mb-0 ml-2" style={{ fontWeight: "bolder" }}>
                                        {`${masterForm.title} ${masterForm?.sku && `(${masterForm.sku})`}` /* NOSONAR */}
                                    </h4>
                                )
                            }
                        </div>

                        <div style={{ fontSize: "16px" }}>
                            <fieldset className="fieldset">
                                <legend className="legend">Basic Details</legend>

                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="row">
                                            <div className="col-lg-6 fw-bolder">SKU</div>
                                            <div className="col-lg-6">
                                                {masterForm?.sku ? masterForm.sku : "--"}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Gross weight</div>
                                            <div className="col-lg-6">
                                                {Number(masterForm.gross_weight)}
                                                {` lb${Number(masterForm.gross_weight) > 1 ? 's' : ''}`}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Category types</div>
                                            <div className="col-lg-6">
                                                {masterForm?.category_type_names ? masterForm.category_type_names : "--"}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Low stock qty</div>
                                            <div className="col-lg-6">{masterForm?.low_stock_qty ?? 0}</div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bolder">Type</div>
                                            <div className="col-lg-6">
                                                {masterForm?.type ? masterForm.type : "--"}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bolder">Is in stock</div>
                                            <div className="col-lg-6">
                                                {masterForm?.is_in_stock ? "YES" : "NO"}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bolder">Country of origin</div>
                                            <div className="col-lg-6">
                                                {masterForm?.manufacturing_country ? masterForm.manufacturing_country : "--"}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Status</div>
                                            <div className="col-lg-6" style={{ fontSize: "18px" }}>
                                                <CBadge
                                                    className="ms-auto"
                                                    color={masterForm?.productStatus ? "success" : "danger"}
                                                >
                                                    {masterForm?.productStatus ? "Active" : "Inactive"}
                                                </CBadge>
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Product Label</div>
                                            <div className="col-lg-6" style={{ fontSize: "18px" }}>
                                                <CBadge
                                                    className="ms-auto"
                                                    color={masterForm?.prescriptionStatus ? "success" : "danger"}
                                                >
                                                    {prescriptionStatusDirectory?.[+(masterForm?.prescriptionStatus)] ?? "OTC"}
                                                </CBadge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="row">
                                            <div className="col-lg-6 fw-bolder">Available qty</div>
                                            <div className="col-lg-6">{masterForm?.qty_available ?? 0}</div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Categories</div>
                                            <div className="col-lg-6">
                                                {masterForm?.category_names ? masterForm.category_names : ''}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bolder">Returnable qty</div>
                                            <div className="col-lg-6">{masterForm?.qty_returnable ?? 0}</div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Purchase limit</div>
                                            <div className="col-lg-6">{masterForm?.purchase_limit ?? 0}</div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Is returnable</div>
                                            <div className="col-lg-6">{masterForm?.is_returnable ? "YES" : "NO"}</div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Tax class</div>
                                            <div className="col-lg-6">
                                                {masterForm?.tax_class_name ? masterForm.tax_class_name : "--"}
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Availability status</div>
                                            <div className="col-lg-6">{masterForm?.is_available ?? "Unavailable"}</div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-lg-6 fw-bold">Microsite Status</div>
                                            <div className="col-lg-6" style={{ fontSize: "18px" }}>
                                                <CBadge
                                                    className="ms-auto"
                                                    color={masterForm?.micrositeStatus ? "success" : "danger"}
                                                >
                                                    {masterForm?.micrositeStatus ? "Active" : "Inactive"}
                                                </CBadge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            {
                                (
                                    masterForm?.seo_title ||
                                    masterForm?.seo_keywords ||
                                    masterForm?.seo_desc
                                ) && (
                                    <fieldset className="fieldset">
                                        <legend className="legend">SEO</legend>

                                        {
                                            masterForm?.seo_title && (
                                                <p><b>Title: </b>{` ${masterForm.seo_title}`}</p>
                                            )
                                        }
                                        {
                                            masterForm?.seo_keywords && (
                                                <p><b>Keyword: </b>{` ${masterForm.seo_keywords}`}</p>
                                            )
                                        }
                                        {
                                            masterForm?.seo_desc && (
                                                <div>
                                                    <b>Description: </b>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: md.render(masterForm.seo_desc)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }
                                    </fieldset>
                                )
                            }

                            <div>
                                {
                                    (masterForm.short_desc || masterForm.long_desc) && (
                                        <fieldset className="fieldset">
                                            <legend className="legend">Description & Attributes</legend>

                                            <div className="row">
                                                {
                                                    masterForm.short_desc && (
                                                        <div>
                                                            <b>Short: </b>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: md.render(masterForm.short_desc)
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    masterForm.long_desc && (
                                                        <div>
                                                            <b>Long: </b>
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: md.render(masterForm.long_desc)
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </fieldset>
                                    )
                                }

                                {
                                    (
                                        masterForm?.attachements?.length > 0 ||
                                        masterForm?.icons?.length > 0 ||
                                        masterForm?.gallery?.length > 0 ||
                                        masterForm?.image?.base ||
                                        masterForm?.image?.small ||
                                        masterForm?.image?.swatch ||
                                        masterForm?.image?.thumbnail
                                    ) && (
                                        <fieldset className="fieldset">
                                            <legend className="legend">Attachements & Gallery</legend>

                                            {
                                                masterForm?.attachements?.length > 0 && (
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <p><b>Attachements (click to download)</b></p>

                                                            {
                                                                masterForm?.attachements?.map(attachementObj => {
                                                                    const { link, label } = attachementObj;
                                                                    return (
                                                                        <React.Fragment key={`attachement-${uuid()}`}>
                                                                            <img
                                                                                width={150}
                                                                                height={150}
                                                                                src={String(pdfIcon)}
                                                                                title={`Download ${label}`}
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => { downloadAttachement(link); }}
                                                                            />
                                                                            <p>{label}</p>
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {
                                                masterForm?.icons?.length > 0 && (
                                                    <div className="row mt-2">
                                                        <div className="col-lg-12">
                                                            <p><b>Icons</b></p>

                                                            <div className="row">
                                                                {
                                                                    masterForm?.icons?.map(iconObj => {
                                                                        const { url, label } = iconObj;
                                                                        return url ? (
                                                                            <div
                                                                                key={`icon-${uuid()}`}
                                                                                className="col-lg-3 mb-3 d-flex flex-column"
                                                                            >
                                                                                <img width={50} height={50} src={url} />
                                                                                <label>{label}</label>
                                                                            </div>
                                                                        ) : (
                                                                            <></>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {
                                                masterForm?.gallery?.length > 0 && (
                                                    <div className="row mt-3">
                                                        <div className="col-lg-12">
                                                            <p><b>Media Gallery</b></p>

                                                            <div className="row">
                                                                {
                                                                    masterForm?.gallery?.map(imageUrl => {
                                                                        return imageUrl ? (
                                                                            <div className="col-lg-3 mb-3" key={`gallery-${uuid()}`}>
                                                                                <img
                                                                                    width={150}
                                                                                    height={150}
                                                                                    src={imageUrl}
                                                                                    style={{ cursor: "pointer" }}
                                                                                    title="click to see in fullscreen"
                                                                                    onClick={() => { openImageModal(imageUrl); }}
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <></>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {
                                                (
                                                    masterForm?.image?.base ||
                                                    masterForm?.image?.small ||
                                                    masterForm?.image?.swatch ||
                                                    masterForm?.image?.thumbnail
                                                ) && (
                                                    <div className="row mt-3">
                                                        <div className="col-lg-12">
                                                            <p><b>Product Gallery</b></p>

                                                            <div className="row">
                                                                {
                                                                    masterForm?.image?.base && (
                                                                        <div className="col-lg-3">
                                                                            <p><b>Base</b></p>
                                                                            <img
                                                                                width={150}
                                                                                height={150}
                                                                                style={{ cursor: "pointer" }}
                                                                                src={masterForm?.image?.base}
                                                                                title="click to see in fullscreen"
                                                                                onClick={() => {
                                                                                    openImageModal(masterForm.image.base);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }

                                                                {
                                                                    masterForm?.image?.small && (
                                                                        <div className="col-lg-3">
                                                                            <p><b>Small</b></p>
                                                                            <img
                                                                                width={150}
                                                                                height={150}
                                                                                style={{ cursor: "pointer" }}
                                                                                src={masterForm?.image?.small}
                                                                                title="click to see in fullscreen"
                                                                                onClick={() => {
                                                                                    openImageModal(masterForm.image.base);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }

                                                                {
                                                                    masterForm?.image?.swatch && (
                                                                        <div className="col-lg-3">
                                                                            <p><b>Swatch</b></p>
                                                                            <img
                                                                                width={150}
                                                                                height={150}
                                                                                style={{ cursor: "pointer" }}
                                                                                src={masterForm?.image?.swatch}
                                                                                title="click to see in fullscreen"
                                                                                onClick={() => {
                                                                                    openImageModal(masterForm.image.base);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }

                                                                {
                                                                    masterForm?.image?.thumbnail && (
                                                                        <div className="col-lg-3">
                                                                            <p><b>Thumbail</b></p>
                                                                            <img
                                                                                width={150}
                                                                                height={150}
                                                                                style={{ cursor: "pointer" }}
                                                                                src={masterForm?.image?.thumbnail}
                                                                                title="click to see in fullscreen"
                                                                                onClick={() => {
                                                                                    openImageModal(masterForm.image.base);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </fieldset>
                                    )
                                }
                            </div>

                            <fieldset className="fieldset">
                                <legend className="legend">Product price</legend>

                                <div className="row">
                                    {
                                        adminRole === "SUPER_ADMIN" && masterForm.sap_price >= 0 && (
                                            <div className="col-md-4">
                                                <span>
                                                    <b>Magento price: </b>
                                                    {`$${masterForm.sap_price}`}&nbsp;&nbsp;
                                                </span>
                                            </div>
                                        )
                                    }

                                    <div className="col-lg-4">
                                        {
                                            adminRole === "SUPER_ADMIN" ? (
                                                <span className="p-float-label custom-p-float-label">
                                                    <InputNumber
                                                        mode="decimal"
                                                        name="cost_price"
                                                        minFractionDigits={0}
                                                        maxFractionDigits={2}
                                                        inputClassName="form-control"
                                                        onValueChange={onHandleChange} // NOSONAR
                                                        value={masterForm.cost_price}
                                                    />
                                                    <label className="mr-2">Cost Price (USD)</label>
                                                </span>
                                            ) : (
                                                <>
                                                    {
                                                        !isEmpty(masterForm?.cost_price) && (
                                                            <b style={{ fontSize: "16px" }}>
                                                                {`Cost Price: $${masterForm.cost_price}`}
                                                            </b>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </div>

                                    <div className="col-md-4">
                                        <span className="p-float-label custom-p-float-label">
                                            <InputNumber
                                                mode="decimal"
                                                name="selling_price"
                                                minFractionDigits={0}
                                                maxFractionDigits={2}
                                                inputClassName="form-control"
                                                onValueChange={onHandleChange} // NOSONAR
                                                value={masterForm.selling_price}
                                            />
                                            <label className="mr-2">Selling Price (USD)</label>
                                        </span>
                                        <p className="error">{error?.selling_price ?? ''}</p>
                                    </div>
                                </div>
                            </fieldset>

                            <div className="col-md-12 col-lg-6 mb-3 d-flex align-items-center">
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
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                            <CIcon icon={cilCheck} className="mr-1" />Update
                        </button>

                        <button className="btn btn-danger mb-2" onClick={handleCancelUpdate}>
                            <CIcon icon={cilXCircle} className="mr-1" />Cancel
                        </button>
                    </div>

                    <ImageModal visible={showImageModal} imgObj={imageData} onCloseImageModal={handleCloseImageModal} />
                </div>
            </form>
        </div>
    )
}

export default AddEditProduct
