import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { CBadge } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { Remarkable } from "remarkable";
import { cilXCircle } from "@coreui/icons";
import { Html5Entities } from "html-entities";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { API } from "src/services/Api";
import pdfIcon from "src/assets/images/pdf_icon.png";
import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import ImageModal from "../common/ImageModalPopup/image-modal";
import Loader from "src/views/components/common/loader/loader";
import { prescriptionStatusDirectory, uuid } from "src/shared/handler/common-handler";

const ProductMasterDetails = () => { // NOSONAR
    const history = useHistory();
    const { showError } = useToast();
    const search = useLocation().search;
    const entities = new Html5Entities();
    const id = new URLSearchParams(search).get("id");
    const md = new Remarkable({ html: true, breaks: true, xhtmlOut: true, typographer: true });

    const [imageData, setImageData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = () => {
        setIsLoading(true);
        const url = `${Constant.SHOW_MASTER_PRODUCT_DETAILS}/${id}`;
        API.getDrpData(handleGetProductDetailsResponseObj, null, true, url);
    }

    const handleGetProductDetailsResponseObj = { // NOSONAR
        cancel: () => { },
        success: response => {  // NOSONAR
            let data = {};
            setIsLoading(false);

            if (response?.meta?.status && response?.data) {
                const responseData = response.data;
                data = {
                    id: responseData?._id ?? '',
                    sapId: responseData?.sap_id ?? '',
                    name: responseData?.name ?? "--",
                    sku: responseData?.sku ?? "--",
                    type: responseData?.product_type ?? "--",
                    description: entities.decode(responseData?.description ?? "--"),
                    shortDescription: entities.decode(responseData?.short_description ?? "--"),
                    weight: Number(responseData?.weight ?? 0)?.toFixed(2) ?? 0,
                    price: +responseData?.price ?? 0,
                    taxClassName: responseData?.tax_class_name ?? "--",
                    urlKey: responseData?.url_key ?? "--",
                    manufacturingCountry: responseData?.country_of_manufacture ?? "--",
                    qtyAvailable: responseData?.qty ?? 0,
                    qtyReturnable: responseData?.returnable ?? 0,
                    isAvailable: responseData?.is_in_stock ? "Available" : "Unavailable",
                    lowStockQty: responseData?.low_stock_qty ?? 0,
                    purchaseLimit: responseData?.product_purchase_limit ?? 0,
                    isReturnable: (responseData?.returnable ?? 0),
                    status: +(responseData?.status ?? 0),
                    prescriptionStatus: +(responseData?.is_prescribed ?? 0),
                    micrositeStatus: +(responseData?.is_active ?? 0),
                    categories: responseData?.category ?? [],
                    attachements: responseData?.attachment_file ?? [],
                    gallery: responseData?.media_gallery ?? [],
                    icons: responseData?.product_icons?.map(iconObj => {
                        return { url: iconObj.icon_image, label: iconObj.icon_label };
                    }) ?? [],
                    meta: {
                        title: responseData?.meta_title ?? "--",
                        keyword: responseData?.meta_keyword ?? "--",
                        description: entities.decode(responseData?.meta_description ?? "--"),
                    },
                    image: {
                        base: responseData?.base_image ?? '',
                        small: responseData?.small_image ?? '',
                        swatch: responseData?.swatch_image ?? '',
                        thumbnail: responseData?.thumbnail_image ?? '',
                    },
                    categoryTypeNames: responseData
                        ?.categories
                        ?.category_type
                        ?.map(categoryType => categoryType.name)
                        ?.join(', ') ?? "--",
                    categoryNames: responseData
                        ?.categories
                        ?.category
                        ?.map(categoryType => categoryType.name)
                        ?.join(', ') ?? "--",
                };
            }

            setProductDetails({ ...data });
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const downloadAttachement = link => {
        if (link) {
            fetch(link)
                .then(async t => {
                    return t.blob().then(b => {
                        let a = document.createElement('a');
                        a.href = URL.createObjectURL(b);
                        a.setAttribute("download", "attachment");
                        a.click();
                        a.remove();
                    });
                })
                .catch(err => {
                    console.error(err);
                    showError("Error downloading the file.");
                });
        }
    }

    const moveToListPage = () => {
        history.push("/master-products");
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
        <>
            {isLoading && <Loader />}

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title" style={{ fontSize: "16px" }}>Product Master Details</h5>
                </div>

                <div className="card-body" style={{ fontSize: "16px" }}>
                    <div className="d-flex">
                        {
                            productDetails?.name && (
                                <h4 className="align-self-center mb-0 ml-2" style={{ fontWeight: "bolder" }}>
                                    {`${productDetails.name} ${productDetails?.sku && `(${productDetails.sku})`}` /* NOSONAR */}
                                </h4>
                            )
                        }
                    </div>

                    <fieldset className="fieldset">
                        <legend className="legend">Basic</legend>

                        <div className="row">
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-6 fw-bold">SKU</div>
                                    <div className="col-lg-6">
                                        {(productDetails?.sku) ? productDetails?.sku : "--"}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Weight</div>
                                    <div className="col-lg-6">
                                        {productDetails?.weight ?? 0}
                                        {` lb${+productDetails?.weight > 1 ? 's' : ''}`}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Category types</div>
                                    <div className="col-lg-6">
                                        {
                                            (productDetails?.categoryTypeNames)
                                                ? productDetails?.categoryTypeNames
                                                : "--"
                                        }
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Low stock qty</div>
                                    <div className="col-lg-6">{productDetails?.lowStockQty ?? 0}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Type</div>
                                    <div className="col-lg-6">
                                        {(productDetails?.type) ? productDetails.type : "--"}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Is in stock</div>
                                    <div className="col-lg-6">{productDetails?.isAvailable ?? "Unavailable"}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Tax class</div>
                                    <div className="col-lg-6">
                                        {(productDetails?.taxClassName) ? productDetails.taxClassName : "--"}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Magento Status</div>
                                    <div className="col-lg-6" style={{ fontSize: "18px" }}>
                                        <CBadge className="ms-auto" color={productDetails?.status ? "success" : "danger"}>
                                            {productDetails?.status ? "Active" : "Inactive"}
                                        </CBadge>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Product Label</div>
                                    <div className="col-lg-6" style={{ fontSize: "18px" }}>
                                        <CBadge
                                            className="ms-auto"
                                            color={productDetails?.prescriptionStatus ? "success" : "danger"}
                                        >
                                            {prescriptionStatusDirectory?.[+(productDetails?.prescriptionStatus)] ?? "OTC"}
                                        </CBadge>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-lg-6 fw-bold">Master price</div>
                                    <div className="col-lg-6">${productDetails?.price ?? 0}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Available qty</div>
                                    <div className="col-lg-6">{productDetails?.qtyAvailable ?? 0}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Categories</div>
                                    <div className="col-lg-6">
                                        {(productDetails?.categoryNames) ? productDetails.categoryNames : "--"}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Returnable qty</div>
                                    <div className="col-lg-6">{productDetails?.qtyReturnable ?? 0}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Purchase limit</div>
                                    <div className="col-lg-6">{productDetails?.purchaseLimit ?? 0}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Is returnable</div>
                                    <div className="col-lg-6">{productDetails?.isReturnable ? "YES" : "NO"}</div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Country of origin</div>
                                    <div className="col-lg-6">
                                        {(productDetails?.manufacturingCountry) ? productDetails.taxClassName : "--"}
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-lg-6 fw-bold">Microsite Status</div>
                                    <div className="col-lg-6" style={{ fontSize: "18px" }}>
                                        <CBadge
                                            className="ms-auto"
                                            color={productDetails?.micrositeStatus ? "success" : "danger"}
                                        >
                                            {productDetails?.micrositeStatus ? "Active" : "Inactive"}
                                        </CBadge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {
                        (productDetails?.description || productDetails?.shortDescription) && (
                            <fieldset className="fieldset">
                                <legend className="legend">Description</legend>

                                {
                                    productDetails?.shortDescription && (
                                        <div>
                                            <b>Short: </b>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: md.render(productDetails.shortDescription)
                                                }}
                                            />
                                        </div>
                                    )
                                }
                                {
                                    productDetails?.description && (
                                        <div>
                                            <b>Full: </b>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: md.render(productDetails.description)
                                                }}
                                            />
                                        </div>
                                    )
                                }
                            </fieldset>
                        )
                    }

                    {
                        (
                            productDetails?.meta?.title ||
                            productDetails?.meta?.keyword ||
                            productDetails?.meta?.description
                        ) && (
                            <fieldset className="fieldset">
                                <legend className="legend">SEO</legend>

                                {
                                    productDetails?.meta?.title && (
                                        <p><b>Title: </b>{` ${productDetails.meta.title}`}</p>
                                    )
                                }
                                {
                                    productDetails?.meta?.keyword && (
                                        <p><b>Keyword: </b>{` ${productDetails.meta.keyword}`}</p>
                                    )
                                }
                                {
                                    productDetails?.meta?.description && (
                                        <div>
                                            <b>Description: </b>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: md.render(productDetails.meta.description)
                                                }}
                                            />
                                        </div>
                                    )
                                }
                            </fieldset>
                        )
                    }

                    {
                        (
                            productDetails?.attachements?.length > 0 ||
                            productDetails?.icons?.length > 0 ||
                            productDetails?.gallery?.length > 0 ||
                            productDetails?.image?.base ||
                            productDetails?.image?.small ||
                            productDetails?.image?.swatch ||
                            productDetails?.image?.thumbnail
                        ) && (
                            <fieldset className="fieldset">
                                <legend className="legend">Attachements & Gallery</legend>

                                {
                                    productDetails?.attachements?.length > 0 && (
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <p><b>Attachements (click to download)</b></p>

                                                {
                                                    productDetails?.attachements?.map(attachementObj => {
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
                                    productDetails?.icons?.length > 0 && (
                                        <div className="row mt-2">
                                            <div className="col-lg-12">
                                                <p><b>Icons</b></p>

                                                <div className="row">
                                                    {
                                                        productDetails?.icons?.map(iconObj => {
                                                            const { url, label } = iconObj;
                                                            return url ? (
                                                                <div
                                                                    key={`icon-${uuid()}`}
                                                                    className="col-lg-3 mb-3 d-flex flex-column"
                                                                >
                                                                    <img src={url} width={50} height={50} />
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
                                    productDetails?.gallery?.length > 0 && (
                                        <div className="row mt-3">
                                            <div className="col-lg-12">
                                                <p><b>Media Gallery</b></p>

                                                <div className="row">
                                                    {
                                                        productDetails?.gallery?.map(imageUrl => {
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
                                        productDetails?.image?.base ||
                                        productDetails?.image?.small ||
                                        productDetails?.image?.swatch ||
                                        productDetails?.image?.thumbnail
                                    ) && (
                                        <div className="row mt-3">
                                            <p><b>Product Gallery</b></p>

                                            <div className="row">
                                                {
                                                    productDetails?.image?.base && (
                                                        <div className="col-lg-3">
                                                            <p><b>Base</b></p>
                                                            <img
                                                                width={150}
                                                                height={150}
                                                                style={{ cursor: "pointer" }}
                                                                src={productDetails.image.base}
                                                                title="click to see in fullscreen"
                                                                onClick={() => {
                                                                    openImageModal(productDetails.image.base);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                {
                                                    productDetails?.image?.small && (
                                                        <div className="col-lg-3">
                                                            <p><b>Small</b></p>
                                                            <img
                                                                width={150}
                                                                height={150}
                                                                style={{ cursor: "pointer" }}
                                                                src={productDetails?.image?.small}
                                                                title="click to see in fullscreen"
                                                                onClick={() => {
                                                                    openImageModal(productDetails.image.small);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                {
                                                    productDetails?.image?.swatch && (
                                                        <div className="col-lg-3">
                                                            <p><b>Swatch</b></p>
                                                            <img
                                                                width={150}
                                                                height={150}
                                                                style={{ cursor: "pointer" }}
                                                                src={productDetails?.image?.swatch}
                                                                title="click to see in fullscreen"
                                                                onClick={() => {
                                                                    openImageModal(productDetails.image.swatch);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }

                                                {
                                                    productDetails?.image?.thumbnail && (
                                                        <div className="col-lg-3">
                                                            <p><b>Thumbail</b></p>
                                                            <img
                                                                width={150}
                                                                height={150}
                                                                style={{ cursor: "pointer" }}
                                                                src={productDetails?.image?.thumbnail}
                                                                title="click to see in fullscreen"
                                                                onClick={() => {
                                                                    openImageModal(productDetails.image.thumbnail);
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </fieldset>
                        )
                    }
                </div>

                <ImageModal visible={showImageModal} imgObj={imageData} onCloseImageModal={handleCloseImageModal} />

                <div className="card-footer">
                    <button className="btn btn-danger mb-2" onClick={moveToListPage}>
                        <CIcon icon={cilXCircle} className="mr-1" />Back
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductMasterDetails;
