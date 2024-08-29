import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useState } from "react";
import { cilCart, cilCheck, cilFile, cilQrCode, cilTrash } from "@coreui/icons";

import { API } from "src/services/Api";
import AssignProduct from "./assign-product";
import Loader from "../common/loader/loader";
import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import OrderPrescribedProducts from "./order-prescribed-products";
import DeleteModal from "src/views/components/common/DeleteModalPopup/delete-modal";
import { displayDateTimeFormat, requestDateFormatYY } from "src/shared/handler/common-handler";

const PrescribedProducts = ({ hcpId, userId }) => {
    const { showError, showSuccess } = useToast();
    const initialFilters = { start: 0, length: Constant.DT_ROW };
    const _scannedProductDetails = { sku: '', prescriptionType: '', expiryDate: null };
    const assignmentHeadings = ["Assign Products Manually", "Scan Product QR", "Upload Product PDF"];
    const _shippingAddress = {
        name: '',
        city: '',
        phone: '',
        state: '',
        address: '',
        pincode: '',
        country: '',
        countryId: '',
    };

    const [heading, setHeading] = useState('');
    const [deleteObj, setDeleteObj] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [assignmentMode, setAssignmentMode] = useState(0);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [prescribedProducts, setPrescribedProducts] = useState([]);
    const [availableShipMethods, setAvailableShipMethods] = useState([]);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });
    const [shippingAddress, setShippingAddress] = useState(_shippingAddress);
    const [scannedProductDetails, setScannedProductDetails] = useState(_scannedProductDetails);

    useEffect(() => {
        getShippingAddress();
        getShippingMethods();
        getPrescribedProducts();
    }, []);

    useEffect(() => {
        const { sku, prescriptionType, expiryDate } = scannedProductDetails;
        if (sku && prescriptionType && expiryDate) getProductFromScannedSku(sku);
    }, [scannedProductDetails]);

    const getPrescribedProducts = filters => {
        const appliedFilters = filters ?? searchParams;
        const data = { ...appliedFilters, user_id: userId, account_id: hcpId };

        setIsLoading(true);
        API.getMasterList(handlePrescribedProductsResponseObj, data, true, Constant.PRESCRIBED_PRODUCT_LIST);
    }

    const handlePrescribedProductsResponseObj = {
        cancel: () => { },
        success: response => {
            let products = [];
            setIsLoading(false);
            if (response?.meta?.status && response?.data?.original?.data?.length) {
                products = response.data.original.data.map(productObj => {
                    return {
                        id: productObj?._id ?? '',
                        sku: productObj?.product?.sku ?? '',
                        name: productObj?.product?.name ?? '',
                        productId: productObj?.product_id ?? '',
                        prescriptionType: productObj?.is_prescribed_for ?? '',
                        websiteProductId: productObj?.website_product_id ?? '',
                        taxClassName: productObj?.product?.tax_class_name ?? '',
                        date: displayDateTimeFormat(productObj?.expiry_date ?? null),
                        costPrice: productObj?.product?.website_product_detail?.[0]?.cost_price ?? 0,
                        sellingPrice: productObj?.product?.website_product_detail?.[0]?.selling_price ?? 0,
                    };
                });
            }

            setPrescribedProducts([...products]);
            setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            setPrescribedProducts([]);
            const message = err?.meta?.message ?? "Unable to fetch prescribed products.";
            showError(message);
        },
        complete: () => { },
    }

    const getProductDetailsFromScannedSku = (sku, prescriptionType, expiryDate) => {
        setShowAssignmentModal(false);
        if (!sku || typeof sku !== "string") showError("SKU type is invalid. SKU must be a string.");
        else if (!prescriptionType) showError("Please select a prescription type.");
        else if (!expiryDate) showError("Please select an expiry date.");
        else setScannedProductDetails({ sku, prescriptionType, expiryDate });
    }

    const getProductFromScannedSku = sku => {
        const data = { account_id: hcpId, sku }, url = Constant.GET_PRESCRIBED_PRODUCT_FROM_SCAN;
        API.getMasterList(handleGetProductFromScannedSkuResponseObj, data, true, url);
    }

    const handleGetProductFromScannedSkuResponseObj = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status && response?.data?.website_product_detail?.[0]) {
                const { _id: websiteProductId, product_id: productId } = response?.data?.website_product_detail?.[0] ?? {};
                assignScannedProduct(productId, websiteProductId);
            } else {
                showError("No product is available for scanned SKU.");
            }
        },
        error: err => {
            console.log(err);
            const message = err?.meta?.message ?? "Something went wrong!";
            showError(message);
        },
        complete: () => { },
    };

    const assignScannedProduct = (productId, websiteProductId) => {
        if (!productId || !websiteProductId) {
            showError("No product is available for the scanned SKU.");
        } else if (!scannedProductDetails.prescriptionType) {
            showError("Prescription type is required for product assignment.");
        } else if (!scannedProductDetails.expiryDate) {
            showError("Expiry date is required for product assignment.");
        } else {
            const data = {
                user_id: userId,
                account_id: hcpId,
                product_id: productId,
                website_product_id: websiteProductId,
                is_prescribed_for: scannedProductDetails.prescriptionType,
                expiry_date: requestDateFormatYY(scannedProductDetails.expiryDate),
            };

            setIsLoading(true);
            API.getMasterList(handleAssignProductResponseObj, data, true, Constant.ADD_PRESCRIBED_PRODUCT);
        }
    }

    const handleAssignProductResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(message);
            getPrescribedProducts();
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.errors) Object.values(err.errors).map(errMessage => { showError(errMessage); });
            else if (err?.meta?.message) showError(err.meta.message);
            else showError("Something went wrong!");
        },
        complete: () => { },
    }

    const getShippingMethods = () => {
        API.getDrpData(handleShippingMethodsResponseObj, null, true, Constant.GET_ORDER_SHIP_METHODS);
    }

    const handleShippingMethodsResponseObj = {
        cancel: () => { },
        success: response => {
            const _shippingMethods = response?.data?.shipping_methods?.map(shipMethod => {
                return {
                    id: shipMethod?._id ?? '',
                    code: shipMethod?.code ?? '',
                    name: shipMethod?.title ?? '',
                };
            }) ?? [];

            setAvailableShipMethods([..._shippingMethods]);
        },
        error: err => {
            console.log(err);
            setAvailableShipMethods([]);
        },
        complete: () => { }
    }

    const getShippingAddress = () => {
        if (userId) {
            setIsLoading(true);
            const url = `${Constant.GET_ORDER_SHIP_ADDRESS}/${userId}`;
            API.getDrpData(handleShipAddressResponseObj, null, true, url);
        } else {
            showError("Please select a patient.");
        }
    }

    const handleShipAddressResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const {
                address,
                pincode,
                city: cityObj,
                state: stateObj,
                last_name: lName,
                first_name: fName,
                country: countryObj,
                mobile_number: phone,
            } = response?.data ?? {};

            setShippingAddress({
                phone,
                pincode,
                address,
                city: cityObj?.name ?? '',
                state: stateObj?.name ?? '',
                country: countryObj?.name ?? '',
                countryId: countryObj?.country_id ?? '',
                name: `${fName ?? ''} ${(fName && lName) ? lName : ''}`, // NOSONAR
            });
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            setShippingAddress(_shippingAddress);
        },
        complete: () => { },
    };

    const handlePrescribedProductPageChange = e => {
        const filters = { ...searchParams, start: e.first, length: e.rows };
        setSearchParams({ ...filters });
        getPrescribedProducts(filters);
    }

    const prescribedProductFooterTemplate = (
        <div className="table-footer">
            <Paginator
                rows={searchParams.length}
                first={searchParams.start}
                totalRecords={totalRecords}
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={handlePrescribedProductPageChange} // NOSONAR
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    const nameBodyTemplate = rowData => {
        const { name, sku, prescriptionType } = rowData;
        const prescriptionLabel = (prescriptionType && typeof prescriptionType === "string")
            ? ` ${prescriptionType.toUpperCase()}`
            : '';

        return (
            <>
                {`${name ?? Constant.NO_VALUE} ${name && sku ? `(${sku})` : ''}`}
                <b>{prescriptionLabel}</b>
            </>
        );
    }

    function formatDate(dateString) {
        if (!dateString) {
            return undefined
        }
        // Split the date string into components
        const parts = dateString?.split(/[/ ]/);

        // Extract month, day, and year
        const month = parts?.[1];
        const day = parts?.[0];
        const year = parts?.[2];

        // Return the formatted date
        return `${month}/${day}/${year}`;
    }

    const dateBodyTemplate = rowData => {
        return <>{formatDate(rowData?.date) ?? Constant.NO_VALUE}</>;
    }

    const actionBodyTemplate = rowData => {
        return (
            <a title="Delete" className="mr-2 text-danger" onClick={e => { openDeleteModal(e, rowData); }}>
                <CIcon color="danger" icon={cilTrash} size="lg" />
            </a>
        );
    }

    const openDeleteModal = (e, data) => {
        e.preventDefault();
        setShowDeleteModal(true);
        setDeleteObj({ _id: data?.id ?? '', name: data?.name ?? '', urlName: CommonMaster.PRESCRIBED_PRODUCTS });
    }

    const handleCloseDeleteModal = (_, isDeleted, message) => {
        setDeleteObj(null);
        setShowDeleteModal(false);

        if (isDeleted && message) {
            const filters = { ...searchParams };
            if (prescribedProducts.length === 1 && searchParams.start > 0) {
                filters.start -= filters.length;
                setSearchParams({ ...searchParams, start: filters.start });
            }

            getPrescribedProducts(filters);
            showSuccess(message);
        }
    }

    const changeAssignmentMode = (e, i) => {
        e.preventDefault();
        setAssignmentMode(i);
        setShowAssignmentModal(true);
        setHeading(assignmentHeadings[i]);
    }

    const handleCloseAssignmentDialog = (reviseList = false) => {
        setShowAssignmentModal(false);
        if (reviseList) {
            setSearchParams({ ...initialFilters });
            getPrescribedProducts(initialFilters);
        }
    }

    const openOrderModal = e => {
        e.preventDefault();
        if (!shippingAddress["pincode"]) {
            showError("shipping address pincode is unavailable");
            return;
        }

        if (!availableShipMethods.length) {
            showError("shipping methods are unavailable");
            return;
        }

        setShowOrderModal(true);
    }

    const handleCloseOrderModal = () => {
        setShowOrderModal(false);
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <h4>Assign products via any of the below methods</h4>
                </div>

                <div className="col-md-12 d-flex justify-content-end">
                    <button className="btn btn-primary mb-2 mr-2" onClick={e => { changeAssignmentMode(e, 0); }}>
                        <CIcon icon={cilCheck} />&nbsp;Manually
                    </button>

                    <div className="prescribed-products-or-text">OR</div>

                    <button className="btn btn-info text-white mb-2 ml-2" onClick={e => { changeAssignmentMode(e, 1); }}>
                        <CIcon icon={cilQrCode} />&nbsp;QR Scan
                    </button>

                    <div className="prescribed-products-or-text">OR</div>

                    <button className="btn btn-danger text-white mb-2 ml-2" onClick={e => { changeAssignmentMode(e, 2); }}>
                        <CIcon icon={cilFile} />&nbsp;File Upload
                    </button>
                </div>

                {
                    showAssignmentModal && (
                        <AssignProduct
                            hcpId={hcpId}
                            userId={userId}
                            heading={heading}
                            assignmentMode={assignmentMode}
                            closeDialog={handleCloseAssignmentDialog}
                            setScannedSku={getProductDetailsFromScannedSku}
                        />
                    )
                }
            </div>

            {
                prescribedProducts?.length > 0 && (
                    <fieldset className="fieldset">
                        <legend className="legend">Prescribed products</legend>

                        <button
                            type="button"
                            onClick={openOrderModal}
                            style={{ float: "right" }}
                            className="btn btn-primary mb-2 mr-2"
                        >
                            <CIcon icon={cilCart} size="sm" />&nbsp;
                            Place Order
                        </button>

                        <div className="col-md-12 mt-5 mb-3 d-flex align-items-center custom-checkbox">
                            <div className="datatable-responsive-demo custom-react-table w-100">
                                <div className="card pb-4">
                                    <DataTable
                                        showGridlines
                                        responsiveLayout="scroll"
                                        value={prescribedProducts}
                                        className="p-datatable-responsive-demo"
                                        footer={prescribedProductFooterTemplate}
                                    >
                                        <Column
                                            field="name"
                                            body={nameBodyTemplate}
                                            header="NAME (SKU) (Prescription type)"
                                        />
                                        {<Column field="date" header="Expiry Date" body={dateBodyTemplate} /> /* NOSONAR */}
                                        {<Column field="id" header="Delete" body={actionBodyTemplate} /> /* NOSONAR */}
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                )
            }

            <DeleteModal
                deleteObj={deleteObj}
                visible={showDeleteModal}
                onCloseDeleteModal={handleCloseDeleteModal} // NOSONAR
            />

            {
                showOrderModal && (
                    <OrderPrescribedProducts
                        hcpId={hcpId}
                        userId={userId}
                        products={prescribedProducts}
                        shippingAddress={shippingAddress}
                        shippingMethods={availableShipMethods}
                        handleCloseDialog={handleCloseOrderModal}
                    />
                )
            }
        </>
    );
};

export default PrescribedProducts;
