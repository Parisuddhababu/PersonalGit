import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import QrReader from "react-qr-scanner";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { cilCheck, cilFile } from "@coreui/icons";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import React, { useEffect, useRef, useState } from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";

import { API } from "src/services/Api";
import Loader from "../common/loader/loader";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import useFileUploader from "src/customHooks/useFileUploader";
import { PICKER_DISPLAY_DATE_FORMAT, requestDateFormatYY } from "src/shared/handler/common-handler";

const AssignProduct = ({ heading, closeDialog, assignmentMode, hcpId, userId, setScannedSku }) => {
    const fileUploadRef = useRef(null);
    const { showError, showSuccess } = useToast();
    const { handleFileImportAction } = useFileUploader();
    const _productDetails = { productId: '', websiteProductId: '', name: '' };
    const _errors = { leftProduct: '', rightProduct: '', date: '', prescriptionType: '', sku: '' };
    const prescriptionTypeOptions = [
        { code: "Left", label: "For left eye" },
        { code: "Right", label: "For right eye" },
    ];

    const [errors, setErrors] = useState(_errors);
    const [isLoading, setIsLoading] = useState(false);
    const [expiryDate, setExpiryDate] = useState(null);
    const [capturedSku, setCapturedSku] = useState('');
    const [searchedQuery, setSearchedQuery] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [leftEyeSearchText, setLeftEyeSearchText] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');
    const [rightEyeSearchText, setRightEyeSearchText] = useState('');
    const [selectedPdfProducts, setSelectedPdfProducts] = useState([]);
    const [pdfUploadedProducts, setPdfUploadedProducts] = useState([]);
    const [leftEyeSearchedProducts, setLeftEyeSearchedProducts] = useState([]);
    const [rightEyeSearchedProducts, setRightEyeSearchedProducts] = useState([]);
    const [selectedPrescriptionType, setSelectedPrescriptionType] = useState('');
    const [selectedLeftEyeProductDetails, setSelectedLeftEyeProductDetails] = useState(_productDetails);
    const [selectedRightEyeProductDetails, setSelectedRightEyeProductDetails] = useState(_productDetails);

    useEffect(() => {
        getDefaultExpiryDate();
    }, []);

    useEffect(() => {
        if (selectedDirection) getQueriedProducts(searchedQuery);
    }, [searchedQuery, selectedDirection]);

    const handleSearchTextChanges = (e, direction) => {
        const isLeftDirection = direction === "Left";
        const setFn = isLeftDirection ? setLeftEyeSearchText : setRightEyeSearchText;
        const selectionSetFn = isLeftDirection ? setSelectedLeftEyeProductDetails : setSelectedRightEyeProductDetails;

        setFn(e.value);
        selectionSetFn(_productDetails);
    }

    const handleFilterChanges = (e, direction) => {
        setSearchedQuery(e.query);
        setSelectedDirection(direction);
    }

    const getQueriedProducts = phrase => {
        if (hcpId) {
            const data = { account_id: hcpId, search: phrase };
            API.getMasterList(handleQueriedProductsResponseObj, data, true, Constant.SEARCH_PRESCRIBED_PRODUCTS);
        } else {
            showError("HCP id is unavailable.");
        }
    }

    const handleQueriedProductsResponseObj = {
        cancel: () => { },
        success: response => {
            let products = [];
            if (response?.meta?.status && response?.data?.length) {
                products = response.data.map(productObj => {
                    const { product } = productObj ?? {};
                    const { name, sku } = product ?? {};

                    return {
                        websiteProductId: productObj?._id ?? '',
                        productId: productObj?.product_id ?? '',
                        name: `${name ?? ''} ${(name && sku) ? `(${sku})` : ''}`, // NOSONAR
                    };
                });
            }

            const setFn = selectedDirection === "Left" ? setLeftEyeSearchedProducts : setRightEyeSearchedProducts;
            setFn([...products]);
        },
        error: err => {
            console.log(err);
            const setFn = selectedDirection === "Left" ? setLeftEyeSearchedProducts : setRightEyeSearchedProducts;
            setFn([]);
        },
        complete: () => { },
    }

    const getDefaultExpiryDate = () => {
        if (hcpId) {
            const url = `${Constant.GET_DEFAULT_EXPIRY_DATE}/${hcpId}`;
            API.getDrpData(handleDefaultExpiryDateResponseObj, null, true, url);
        }
    }

    const handleDefaultExpiryDateResponseObj = {
        cancel: () => { },
        success: response => {
            const _expiryDate = response?.data?.expiry_date ?? '';
            setExpiryDate(new Date(_expiryDate));
        },
        error: err => {
            console.log(err);
            setExpiryDate(null);
        },
        complete: () => { }
    }

    const handleProductSelect = (e, direction) => {
        const { productId, websiteProductId, name } = e?.value ?? {};
        const setFn = direction === "Left" ? setSelectedLeftEyeProductDetails : setSelectedRightEyeProductDetails;
        setFn({ name, websiteProductId, productId });
        setErrors({ ...errors, leftProduct: '', rightProduct: '' });
    }

    const handleValidation = () => {
        let isFormValid = true;
        const newErrors = { ..._errors };

        if (!expiryDate) {
            isFormValid = false;
            newErrors["date"] = "Date is required.";
        }

        if (assignmentMode === 0) {
            const leftProduct = selectedLeftEyeProductDetails.productId;
            const rightProduct = selectedRightEyeProductDetails.productId;

            if (!leftProduct && !rightProduct) {
                isFormValid = false;
                newErrors["leftProduct"] = "Please select product for left eye or right eye.";
                newErrors["rightProduct"] = "Please select product for left eye or right eye.";
            } else {
                if (!leftProduct) {
                    newErrors["leftProduct"] = "";
                }
                if (!rightProduct) {
                    newErrors["rightProduct"] = "";
                }
            }
        } else if (assignmentMode === 1 && (!capturedSku || !selectedPrescriptionType)) {
            isFormValid = false;
            if (!capturedSku) newErrors["sku"] = "Please scan the QR code or enter a valid SKU.";
            if (!selectedPrescriptionType) newErrors["prescriptionType"] = "Please select a prescription type.";
        } else if (assignmentMode === 2 && !selectedPdfProducts.length) {
            isFormValid = false;
            newErrors["product"] = "Product is required.";
        }

        setErrors({ ...newErrors });
        return isFormValid;
    }

    useEffect(() => {
        getAccountDataById()
    }, [])

    const getAccountDataById = () => {
        if (hcpId) {
            API.getMasterDataById(getMasterRes, "", true, hcpId, Constant.ACCOUNT_SHOW);
        }
    }

    const getMasterRes = {
        cancel: (c) => {
        },
        success: (response) => { // NOSONAR
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setExpiryDate(resVal?.prescribe_expiry_date)
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => {
        },
    }


    function calculateFutureDate(monthsToAdd) {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + monthsToAdd);
        return currentDate;
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (handleValidation()) {
            if (assignmentMode === 1 && capturedSku && selectedPrescriptionType && expiryDate) {
                setScannedSku(capturedSku, selectedPrescriptionType, expiryDate);
            } else if (hcpId && userId) {
                const _expiryDate = calculateFutureDate(Number(expiryDate))
                const data = {
                    products: [],
                    user_id: userId,
                    account_id: hcpId,
                    expiry_date: requestDateFormatYY(_expiryDate),
                };

                if (assignmentMode === 0) {
                    if (selectedLeftEyeProductDetails?.productId) {
                        data.products.push({
                            is_prescribed_for: "Left",
                            product_id: selectedLeftEyeProductDetails.productId,
                            website_product_id: selectedLeftEyeProductDetails.websiteProductId,
                        });
                    }
                    if (selectedRightEyeProductDetails?.productId) {
                        data.products.push({
                            is_prescribed_for: "Right",
                            product_id: selectedRightEyeProductDetails.productId,
                            website_product_id: selectedRightEyeProductDetails.websiteProductId,
                        });
                    }
                } else {
                    for (const productObj of pdfUploadedProducts) {
                        const { sku: productSku, productId, websiteProductId } = productObj;
                        if (selectedPdfProducts.includes(productSku)) {
                            data.products.push({ product_id: productId, website_product_id: websiteProductId });
                        }
                    }
                }

                setIsLoading(true);
                const url = Constant.PRESCRIBE_MULTIPLE_PRODUCTS;
                API.getMasterList(handlePrescribedProductAssignResponseObj, data, true, url);
            } else {
                const text = userId ? "HCP id" : "user id";
                showError(`${text} is unavailable.`);
            }
        }
    }

    const handlePrescribedProductAssignResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const { status, message } = response?.meta ?? {};
            if (status && message) showSuccess(message);
            setLeftEyeSearchText('');
            setRightEyeSearchText('');
            closeDialog(true);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);

            if (err?.errors) Object.values(err.errors).map(errMessage => { showError(errMessage); });
            else if (err?.meta?.message) showError(err.meta.message);
            else showError("Something went wrong!");
        },
        complete: () => { }
    }

    function handleScan(data) {
        setCapturedSku(data?.text ?? '');
        if (data?.text) setErrors({ ...errors, sku: '' });
        else showError("Captured SKU is invalid.");
    }

    const rescanSku = e => {
        e.preventDefault();
        setCapturedSku('');
    }

    const handleError = err => {
        console.log(err);
        showError("Something went wrong!");
    }

    const resetFileCache = () => {
        fileUploadRef.current.value = '';
    }

    const handleFileUpload = e => {
        const formData = new FormData();
        formData.append("account_id", hcpId);

        handleFileImportAction(
            e,
            "pdf",
            resetFileCache,
            Constant.READ_PRESCRIBED_PRODUCT_PDF,
            handleFileUploadResponseObj,
            setIsLoading,
            2,
            formData
        );
    }

    const handleFileUploadResponseObj = {
        cancel: () => { },
        success: responseData => {
            setIsLoading(false);
            setIsFileUploaded(true);
            const _pdfUploadedProducts = [], _selectedPdfProducts = [];

            if (!responseData?.length) showError("Products not found.");

            for (const product of responseData) {
                const productObj = {
                    id: product?._id ?? '',
                    sku: product?.sku ?? '',
                    name: product?.name ?? '',
                    productId: product?.website_product_detail?.[0]?.product_id ?? '',
                    websiteProductId: product?.website_product_detail?.[0]?._id ?? '',
                };

                _pdfUploadedProducts.push(productObj);
                _selectedPdfProducts.push(productObj.sku);
            }

            setSelectedPdfProducts([..._selectedPdfProducts]);
            setPdfUploadedProducts([..._pdfUploadedProducts]);
        },
        error: err => {
            setIsLoading(false);
            console.log(err);

            if (err?.errors) Object.values(err.errors).map(errMessage => { showError(errMessage); });
            else if (err?.meta?.message) showError(err.meta.message);
            else showError("Something went wrong!");
        },
        complete: () => { }
    }

    const handleExpiryDate = e => {
        setExpiryDate(e.value);
        setErrors({ ...errors, date: null });
    }

    const ExpiryDateInputJSX = () => {
        return (
            <div className="col-md-12 mt-2 mb-2">
                <span className="p-float-label custom-p-float-label">

                    <Dropdown
                        filter
                        optionValue="id"
                        optionLabel="name"
                        filterBy="name,code"
                        className="form-control"
                        value={expiryDate}
                        options={[
                            { id: '6', name: '6 Months' },
                            { id: '12', name: '12 Months' },
                            { id: '18', name: '18 Months' },
                            { id: '24', name: '24 Months' },
                        ]}
                        onChange={handleExpiryDate} // NOSONAR
                    />
                    {/* <Calendar
                        showIcon
                        readOnlyInput
                        value={expiryDate}
                        dateFormat={PICKER_DISPLAY_DATE_FORMAT}
                        minDate={moment(new Date()).add(1, "days").toDate()}
                        className="form-control border-0 px-0 py-0 custom-datepicker-input"
                        onChange={e => { // NOSONAR
                            setExpiryDate(e.value);
                            setErrors({ ...errors, date: null });
                        }}
                    /> */}
                    <label>RX Expiry <span className="text-danger">*</span></label>
                </span>

                <p className="error">{errors?.date ?? ''}</p>
            </div>
        );
    }

    const handleProductSelection = e => {
        setSelectedPdfProducts(e.value);
    }

    return (
        <CModal scrollable visible size="lg">
            <CModalHeader>
                <h2>{heading}</h2>
                <CCloseButton onClick={e => { e.preventDefault(); closeDialog(); }}></CCloseButton>
            </CModalHeader>

            <CModalBody>
                {isLoading && <Loader />}
                {
                    assignmentMode === 0 ? (
                        <div className="row">
                            <div className="col-md-6 mt-3 mb-1">
                                <span className="p-float-label custom-p-float-label autocomplete-selection">
                                    <AutoComplete
                                        field="name"
                                        className="col-md-12"
                                        value={leftEyeSearchText}
                                        panelClassName="z-index-1056"
                                        inputClassName="form-control"
                                        suggestions={leftEyeSearchedProducts}
                                        onSelect={e => { handleProductSelect(e, "Left"); }} // NOSONAR
                                        onChange={e => { handleSearchTextChanges(e, "Left"); }} // NOSONAR
                                        completeMethod={e => { handleFilterChanges(e, "Left"); }} // NOSONAR
                                    />
                                    <label>
                                        Product for left eye (type to get options)
                                        <span className="text-danger">*</span>
                                    </label>
                                </span>

                                <p className="error">{errors?.leftProduct ?? ''}</p>
                            </div>

                            <div className="col-md-6 mt-3 mb-1">
                                <span className="p-float-label custom-p-float-label autocomplete-selection">
                                    <AutoComplete
                                        field="name"
                                        className="col-md-12"
                                        value={rightEyeSearchText}
                                        panelClassName="z-index-1056"
                                        inputClassName="form-control"
                                        suggestions={rightEyeSearchedProducts}
                                        onSelect={e => { handleProductSelect(e, "Right"); }} // NOSONAR
                                        onChange={e => { handleSearchTextChanges(e, "Right"); }} // NOSONAR
                                        completeMethod={e => { handleFilterChanges(e, "Right"); }} // NOSONAR
                                    />
                                    <label>
                                        Product for right eye (type to get options)
                                        <span className="text-danger">*</span>
                                    </label>
                                </span>

                                <p className="error">{errors?.rightProduct ?? ''}</p>
                            </div>

                            <ExpiryDateInputJSX />

                            <div className="col-md-12 mt-2 mb-2">
                                <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                                    <CIcon icon={cilCheck} />&nbsp;Assign
                                </button>
                            </div>
                        </div>
                    ) : assignmentMode === 1 ? ( // NOSONAR
                        <>
                            <div className="row">
                                <div className="col-md-12">
                                    <span className="p-float-label custom-p-float-label">
                                        <Dropdown
                                            optionValue="code"
                                            optionLabel="label"
                                            name="prescriptionType"
                                            className="form-control"
                                            value={selectedPrescriptionType}
                                            options={prescriptionTypeOptions}
                                            onChange={e => { // NOSONAR
                                                setSelectedPrescriptionType(e.value);
                                                setErrors({ ...errors, prescriptionType: '' });
                                            }}
                                        />
                                        <label>
                                            Prescription type
                                            <span className="text-danger">*</span>
                                        </label>
                                    </span>

                                    <p className="error">{errors?.prescriptionType ?? ''}</p>
                                </div>
                            </div>

                            {
                                capturedSku ? (
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <div className="p-inputgroup">
                                                <span className="p-float-label custom-p-float-label">
                                                    <InputText
                                                        disabled
                                                        name="sku"
                                                        value={capturedSku}
                                                        className="form-control"
                                                    />

                                                    <label>Captured SKU</label>
                                                </span>

                                                <Button
                                                    label="Rescan"
                                                    onClick={rescanSku}
                                                    className="p-button-primary"
                                                    title="Rescan to change the SKU"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-center">
                                            <QrReader
                                                delay={100}
                                                onScan={handleScan}
                                                onError={handleError}
                                                style={{ width: 320, height: 240 }}
                                            />
                                        </div>

                                        <p className="error">{errors?.sku ?? ''}</p>
                                    </>
                                )
                            }

                            <ExpiryDateInputJSX />

                            <div className="row">
                                <div className="col-md-2 mt-2 mb-2">
                                    <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                                        <CIcon icon={cilCheck} />&nbsp;Assign
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : assignmentMode === 2 ? (
                        <>
                            {
                                !isFileUploaded ? (
                                    <div className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-primary text-white mb-2 ml-2"
                                            onClick={() => { fileUploadRef.current.click(); }}
                                        >
                                            <CIcon icon={cilFile} />&nbsp;Upload PDF file
                                        </button>
                                    </div>
                                ) : (
                                    <div className="row">
                                        <div className="col-md-12 mt-2 mb-2">
                                            <span className="p-float-label custom-p-float-label">
                                                <MultiSelect
                                                    filter
                                                    filterBy={"name"}
                                                    optionValue={"sku"}
                                                    optionLabel={"name"}
                                                    value={selectedPdfProducts}
                                                    className={"form-control"}
                                                    options={pdfUploadedProducts}
                                                    panelClassName={"z-index-1056"}
                                                    placeholder={"Select products"}
                                                    onChange={handleProductSelection}
                                                />
                                            </span>
                                            <p className="error">{errors?.product ?? ''}</p>
                                        </div>

                                        <ExpiryDateInputJSX />

                                        <div className="col-md-12 mt-2 mb-2">
                                            <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                                                <CIcon icon={cilCheck} />&nbsp;Assign
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    ) : (
                        <></>
                    )
                }

                <input
                    type="file"
                    id="import_file"
                    ref={fileUploadRef}
                    onChange={handleFileUpload}
                    className="form-control d-none"
                />
            </CModalBody>
        </CModal>
    );
};

export default AssignProduct;
