import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { useLocation, useHistory } from "react-router-dom";
import { CBadge, CButton, CFormCheck } from "@coreui/react";
import { cilCheck, cilList, cilTrash, cilXCircle } from "@coreui/icons";

import { API } from "src/services/Api";
import { Column } from "primereact/column";
import Loader from "../../common/loader/loader"
import { Paginator } from "primereact/paginator";
import { CommonMaster } from "src/shared/enum/enum";
import { InputNumber } from "primereact/inputnumber";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import { isTextValid, prescriptionStatusDirectory } from "src/shared/handler/common-handler";

const AddEditProductGroup = () => { // NOSONAR
    let history = useHistory();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const view=history?.location?.pathname.includes('/view');
    const productAttributes = ["category_ids", "sub_category_ids", "account"];
    const initialSearchParams = { start: 0, length: Constant.DT_ROW, product_title: '', product_sku: '' };
    const [masterForm, setMasterForm] = useState({
        title: '',
        filter: '',
        is_active: 1,
        account: [],
        category_ids: [],
        marginPercent: 0,
        qtyThreshold: 0,
        sub_category_ids: [],
        otherDataAppended: false,
    });

    const [error, setErrors] = useState({});
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [removeProductIds, setRemoveProductIds] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const [tempCategoryIdList, setTempCategoryIdList] = useState([]);
    const [searchParams, setSearchParams] = useState({ ...initialSearchParams });

    useEffect(() => {
        getCategoryData();
        getAccountData();

        if (id) {
            getDetails();
            getProductGroupDataById();
        }
    }, []);

    useEffect(() => {
        if (id && categoryData?.length && masterForm.otherDataAppended) {
            const selectedCategoryIdList = [];
            tempCategoryIdList.forEach(categoryId => {
                const categoryObj = categoryData.find(category => category.entity_id === categoryId);
                if (categoryObj) selectedCategoryIdList.push(categoryId);
            });

            getSubCategory({ parent_id: selectedCategoryIdList });
            setMasterForm({ ...masterForm, category_ids: [...selectedCategoryIdList] });
        }
    }, [categoryData, masterForm.otherDataAppended]);

    useEffect(() => {
        if (id && subCategoryData?.length && masterForm.otherDataAppended) {
            const selectedSubCategoryIdList = [];
            tempCategoryIdList.forEach(subCategoryId => {
                const subCategoryObj = subCategoryData.find(subCategory => subCategory.entity_id === subCategoryId);
                if (subCategoryObj) selectedSubCategoryIdList.push(subCategoryId);
            });

            setMasterForm({ ...masterForm, sub_category_ids: [...selectedSubCategoryIdList] });
        }
    }, [subCategoryData, masterForm.otherDataAppended]);

    const getAccountData = () => {
        API.getMasterList(accountRes, null, true, Constant.ACTIVE_ACCOUNT_LIST);
    }

    const accountRes = {
        cancel: () => { },
        success: response => {
            let _accountData = [];
            if (response?.meta?.status) {
                _accountData = response?.data ?? [];
            }

            setAccountData([..._accountData]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const getProductGroupDataById = () => {
        setIsLoading(true)
        API.getMasterDataById(getMasterRes, null, true, id, Constant.PRODUCT_GROUP_SHOW);
    }

    const getMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                let resVal = response.data;
                setTempCategoryIdList([...resVal?.category_ids ?? []]);
                let data = {
                    category_ids: [],
                    title: resVal.title,
                    sub_category_ids: [],
                    otherDataAppended: true,
                    is_active: resVal.is_active,
                    marginPercent: resVal.margin_per ?? 0,
                    qtyThreshold: resVal?.quantity_threshold ?? 10,
                };

                const { account_id: responseAccount } = resVal;
                data["account"] = Array.isArray(responseAccount) ? responseAccount : [];
                setMasterForm({ ...data });
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false)
        },
        complete: () => { },
    }

    const clearProducts = () => {
        setAllProducts([]);
        setTotalRecords(0);
        setRemoveProductIds([]);
        setFilteredProducts([]);
        setPaginatedProducts([]);
        setTempCategoryIdList([]);
        setSearchParams({ ...initialSearchParams });
    }

    const onHandleValidation = () => {
        let _errors = {};
        let formIsValid = true;
        let validationObj = {
            title: masterForm.title,
            account: masterForm.account,
            category_ids: masterForm.category_ids,
            qty_threshold: masterForm.qtyThreshold,
            margin_percentage: masterForm.marginPercent,
            sub_category_ids: masterForm.sub_category_ids,
        };

        const arrayEnabledKeys = [
            { originalKey: "account", displayedKey: "account" },
            { originalKey: "category_ids", displayedKey: "category" },
            { originalKey: "sub_category_ids", displayedKey: "sub category" },
        ];

        for (const [key, value] of Object.entries(validationObj)) {
            const keyName = key.replace(/_/g, ' ');
            const displayedArrayKey = arrayEnabledKeys.find(keyPair => keyPair.originalKey === key)?.displayedKey ?? '';

            if (key === "title" && isTextValid(value)) {
                formIsValid = false;
                _errors[key] = `Please enter valid ${keyName}`;
            } else if (displayedArrayKey && !value.length) {
                formIsValid = false;
                _errors[key] = `Please enter atleast one ${displayedArrayKey}`;
            } else if (!value) {
                formIsValid = false;
                _errors[key] = `${keyName} is required.`;
            } else if (key === "margin_percentage" && value > 100) {
                formIsValid = false;
                _errors[key] = `${keyName} value must not exceed 100`;
            }
        }

        setErrors({ ..._errors });
        return formIsValid;
    }

    const onHandleChange = (event, radioVal) => {
        let errors = error
        errors[event.target.name] = ''

        if (productAttributes.includes(event.target.name)) clearProducts();

        setErrors({ ...errors });

        if (event?.target?.type === "checkbox") {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.checked ? 1 : 0 })
        } else if (event?.target?.type === "radio") {
            setMasterForm({ ...masterForm, [event.target.name]: radioVal ? 1 : 0 })
        } else {
            setMasterForm({ ...masterForm, [event.target.name]: event.target.value });
        }
    }

    const handleSearchParamChange = event => {
        setSearchParams({ ...searchParams, [event.target.name]: event.target.value });
    }

    const oncancleForm = e => {
        e.preventDefault();
        history.push("/catalogue");
    }

    const onSubmitProduct = e => {
        e.preventDefault();
        if (onHandleValidation()) {
            let obj = {
                title: masterForm.title,
                account_id: masterForm.account,
                is_active: masterForm.is_active,
                margin_per: masterForm.marginPercent,
                quantity_threshold: masterForm.qtyThreshold,
                removed_product_ids: !id ? removeProductIds : [],
                category_ids: [...masterForm.category_ids, ...masterForm.sub_category_ids],
            };

            if (obj["margin_per"] > 100) obj["margin_per"] = 100;
            setIsLoading(true);
            if (id) {
                API.UpdateMasterData(addEditMasterRes, obj, true, id, Constant.UPDATE_PRODUCT_GROUP)
            } else {
                API.addMaster(addEditMasterRes, obj, true, Constant.ADD_PRODUCT_GROUP);
            }
        }
    }

    const addEditMasterRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
                showSuccess(response?.meta?.message);
                history.push("/catalogue");
        },
        error: error => {
            setIsLoading(false);
            showError(error?.meta?.message ?? "Something went wrong!");
        },
        complete: () => { },
    }

    const resetSearchParams = e => {
        e.preventDefault();
        setTotalRecords(allProducts?.length ?? 0);
        setSearchParams({ ...initialSearchParams });
        const { start, length } = initialSearchParams;
        setFilteredProducts([...allProducts]);
        setPaginatedProducts([...allProducts.slice(start, start + length)]);
    }

    const applyFilters = e => {
        e.preventDefault();
        const { start: initialStart, length: initialLength } = initialSearchParams;
        let { product_sku: searchedSku, product_title: searchedTitle } = searchParams;

        if (searchedSku || searchedTitle) {
            const _filteredProducts = allProducts.filter(product => {
                let { name: productTitle, sku: productSku } = product;
                productSku = productSku?.toLowerCase() ?? '';
                searchedSku = searchedSku?.toLowerCase() ?? '';
                productTitle = productTitle?.toLowerCase() ?? '';
                searchedTitle = searchedTitle?.toLowerCase() ?? '';

                return productTitle.indexOf(searchedTitle) >= 0 && productSku.indexOf(searchedSku) >= 0;
            });

            setTotalRecords(_filteredProducts?.length ?? 0);
            const _paginatedProducts = _filteredProducts?.slice(initialStart, initialStart + initialLength) ?? [];
            setSearchParams({ ...searchParams, start: initialStart });
            setPaginatedProducts([..._paginatedProducts]);
            setFilteredProducts([..._filteredProducts]);
        }
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    Product Details
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-6 col-lg-3 pb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText
                            name="product_title"
                            className="form-control"
                            value={searchParams.product_title}
                            onChange={handleSearchParamChange} // NOSONAR
                        />
                        <label>Title</label>
                    </span>
                </div>

                <div className="col-md-6 col-lg-3 pb-3">
                    <span className="p-float-label custom-p-float-label">
                        <InputText
                            name="product_sku"
                            className="form-control"
                            value={searchParams.product_sku}
                            onChange={handleSearchParamChange} // NOSONAR
                        />
                        <label>SKU</label>
                    </span>
                </div>

                <div className="col-md-12 col-lg-3 pb-3">
                    {<CButton color="primary" className="mr-2" type="button" onClick={applyFilters}>Search</CButton> /* NOSONAR */}
                    {<CButton color="danger" type="button" onClick={resetSearchParams}>Reset</CButton> /* NOSONAR */}
                </div>
            </div>
        </div>
    );

    const deleteProduct = (e, id) => {
        e.preventDefault();
        const productIndex = allProducts.findIndex(product => product._id === id);
        const _allProducts = [...allProducts];
        _allProducts.splice(productIndex, 1);

        let _filteredProducts = [..._allProducts];
        let { start, length, product_sku: searchedSku, product_title: searchedTitle } = searchParams;

        if (searchedSku || searchedTitle) {
            _filteredProducts = _allProducts.filter(product => {
                let { name: productTitle, sku: productSku } = product;
                productSku = productSku?.toLowerCase() ?? '';
                searchedSku = searchedSku?.toLowerCase() ?? '';
                productTitle = productTitle?.toLowerCase() ?? '';
                searchedTitle = searchedTitle?.toLowerCase() ?? '';

                return productTitle.indexOf(searchedTitle) >= 0 && productSku.indexOf(searchedSku) >= 0;
            });
        }

        let _paginatedProducts = _filteredProducts.slice(start, start + length);

        if (!_paginatedProducts?.length) {
            _paginatedProducts = _filteredProducts.slice(start - length, start);
            setSearchParams({ ...searchParams, start: start - length });
        }

        const _removedProductIds = [...removeProductIds, id];

        setTotalRecords(_filteredProducts.length);
        setRemoveProductIds([..._removedProductIds]);
        setPaginatedProducts([..._paginatedProducts]);
        setFilteredProducts([..._filteredProducts]);
        setAllProducts([..._allProducts]);
    }

    const filterBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Name(Code)</span>
                {rowData.name ? `${rowData.name}-` : ''}({rowData.sku})
            </>
        );
    }

    const prescriptionBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Product Label</span>
                <CBadge
                    className="ms-auto"
                    style={{ fontSize: "14px" }}
                    color={rowData?.is_prescribed ? "success" : "danger"}
                >
                    {prescriptionStatusDirectory?.[+(rowData?.is_prescribed)] ?? "OTC"}
                </CBadge>
            </>
        );
    }

    const actionBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Action</span>
                {
                    <a title="Delete" className="mr-2 text-danger" onClick={e => { deleteProduct(e, rowData._id); }}>
                        <CIcon color="danger" icon={cilTrash} size="lg" />
                    </a>
                }
            </>
        );
    }

    const onDrpChange = (event, index, name) => { // NOSONAR
        const _masterForm = { ...masterForm };
        if (productAttributes.includes(event.target.name)) clearProducts();
        if (name) {
            if (index !== '' && index !== undefined) {
                let array = masterForm[event.target.name]
                array[index][name] = event.target.value
                _masterForm[event.target.name] = array;
            } else {
                let obj = masterForm[event.target.name]
                obj[name] = event.target.value
                _masterForm[event.target.name] = obj;
            }

        } else {
            if (index !== '' && index !== undefined) {
                let array = masterForm[event.target.name];
                array[index] = event.target.value;
                _masterForm[event.target.name] = array;
            } else {
                _masterForm[event.target.name] = event.target.value;
            }
        }

        if (event.target.name === "category_ids") {
            const categoryIdList = event.target.value;
            if (categoryIdList.length) getSubCategory({ parent_id: event.target.value });
            else setSubCategoryData([]);
            _masterForm["sub_category_ids"] = [];
        }

        setMasterForm({ ..._masterForm });
    }

    const getCategoryData = () => {
        const data = { type: 2 };
        API.getMasterList(onCategoryList, data, true, Constant.ACTIVE_CATEGORY);
    }


    const getSubCategory = (resObj) => {
        resObj = resObj ? resObj : {};
        resObj['type'] = 3;
        API.getMasterList(onSubCategoryList, resObj, true, Constant.ACTIVE_CATEGORY);

    }

    const onCategoryList = {
        cancel: (c) => {
        },
        success: (response) => {

            if (response.meta.status_code === 200) {

                setCategoryData(response?.data)
                // setIsLoading(false)
            }
        },
        error: (error) => {
            // setIsLoading(false)
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

    const getProductList = event => {
        event.preventDefault()
        if (onHandleValidation()) {
            getDetails();
            setRemoveProductIds([]);
        }
    }

    function getDetails() {
        let obj = { length: searchParams.length };

        if (searchParams.product_title) {
            obj['title'] = searchParams.product_title;
            obj.start = 0;
        }

        if (searchParams.product_sku) {
            obj['sku'] = searchParams.product_sku;
            obj.start = 0;
        }

        if (!searchParams.product_title && !searchParams.product_sku) {
            obj.start = searchParams.start;
        }

        obj["category_ids"] = [];
        !id && masterForm.category_ids && (obj['category_ids'].push(...masterForm.category_ids));
        !id && masterForm.sub_category_ids && (obj["category_ids"].push(...masterForm.sub_category_ids));

        let formData = new FormData();
        formData.append("data", JSON.stringify(obj));

        setIsLoading(true)
        if (id) API.UpdateMasterData(productListRes, formData, true, id, Constant.LOAD_PRODUCT_ID);
        else API.addMaster(productListRes, formData, true, Constant.LOAD_PRODUCT);
    }

    const productListRes = {
        cancel: () => { },
        success: (response) => {
            setIsLoading(false);
            if (response?.meta?.status) {
                let responseData = response?.data?.data;
                const { start, length } = searchParams;

                setAllProducts([...responseData]);
                setFilteredProducts([...responseData]);
                setTotalRecords(responseData?.length ?? 0);
                const _paginatedProducts = responseData?.slice(start, start + length) ?? [];
                setPaginatedProducts([..._paginatedProducts]);

                if (resData?.error?.length > 0) {
                    Object.values(resData?.error).map(err => {
                        if (err) showError(err);
                    });
                }
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false)
        },
        complete: () => { },
    }

    const handlePageChange = e => {
        const { first, rows } = e;
        const _paginatedProducts = filteredProducts.slice(first, first + rows);
        setPaginatedProducts([..._paginatedProducts]);
        setSearchParams({ ...searchParams, start: first, length: rows });
    }

    const footerTemplate = (
        <div className="table-footer">
            <Paginator
                rows={searchParams.length}
                first={searchParams.start}
                totalRecords={totalRecords}
                onPageChange={handlePageChange} // NOSONAR
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    const accountDataTemplate = option => {
        return <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>;
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>

                <div className="card">

                    <div className="card-header">
                        {!view && <h5 className="card-title float-start">
                            {`${id &&!view ? "Update" : "Add"} ${CommonMaster.CATALOGUE}`}
                        </h5>}
                        {view && <h5 className="card-title float-start">
                            {`View ${CommonMaster.CATALOGUE}`}
                        </h5>}
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <fieldset className="fieldset mb-5">
                            <legend className="legend">Basic</legend>

                            <div className='row'>
                                <div className="col-md-6 col-lg-4 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <InputText
                                            required
                                            name="title"
                                            maxLength="255"
                                            value={masterForm.title}
                                            onChange={e => { if (!id) onHandleChange(e); }} // NOSONAR
                                            className={`form-control ${id ? "pe-none" : ''}`}
                                        />
                                        <label>Title <span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error['title']}</p>
                                </div>

                                <div className="col-lg-4 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <MultiSelect
                                            filter
                                            name="account"
                                            optionValue="_id"
                                            resetFilterOnHide
                                            options={accountData}
                                            className="form-control"
                                            value={masterForm.account}
                                            optionLabel="company_name"
                                            filterBy="company_name,code"
                                            itemTemplate={accountDataTemplate}
                                            valueTemplate={accountDataTemplate}
                                            showClear={masterForm.account && !id}
                                            onChange={e => { if (!id) onDrpChange(e); }} // NOSONAR
                                        />
                                        <label>HCP<span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error["account"] ?? ''}</p>
                                </div>

                                <div className="col-lg-4 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        {
                                            view ? (
                                                <InputText
                                                    required
                                                    className="form-control pe-none"
                                                    value={masterForm.marginPercent}
                                                />
                                            ) : ( 
                                                <InputNumber
                                                    required
                                                    min={0}
                                                    max={100}
                                                    mode="decimal"
                                                    name="marginPercent"
                                                    minFractionDigits={0}
                                                    maxFractionDigits={2}
                                                    inputClassName="form-control"
                                                    value={masterForm.marginPercent}
                                                    onValueChange={e => {onHandleChange(e); }} // NOSONAR
                                                />
                                            )
                                        }
                                        <label>Margin Percentage<span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error?.margin_percentage ?? ''}</p>
                                </div>

                                <div className="col-lg-4 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        {
                                            view ? (
                                                <InputText
                                                    required
                                                    value={masterForm.qtyThreshold}
                                                    className="form-control pe-none"
                                                />
                                            ) : ( 
                                                <InputNumber
                                                    required
                                                    min={10}
                                                    max={100}
                                                    name="qtyThreshold"
                                                    inputClassName="form-control"
                                                    value={masterForm.qtyThreshold}
                                                    onValueChange={e => {onHandleChange(e); }} // NOSONAR
                                                />
                                             )
                                        }
                                        <label>Quantity Threshold<span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error">{error?.qty_threshold ?? ''}</p>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="legend">Category</legend>
                            <div className='row'>
                                <div className="col-md-6 col-lg-4 mb-3">
                                    <span className="p-float-label custom-p-float-label">
                                        <MultiSelect
                                            resetFilterOnHide
                                            optionLabel="name"
                                            name="category_ids"
                                            options={categoryData}
                                            optionValue="entity_id"
                                            className="form-control"
                                            value={masterForm.category_ids}
                                            onChange={e => { if (!id) onDrpChange(e); }} // NOSONAR
                                        />
                                        <label>Category <span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error mb-0">{error['category_ids']}</p>
                                </div>

                                <div className="col-md-6 col-lg-4 mb-3">

                                    <span className="p-float-label custom-p-float-label">
                                        <MultiSelect
                                            resetFilterOnHide
                                            optionLabel="name"
                                            optionValue="entity_id"
                                            name="sub_category_ids"
                                            className="form-control"
                                            options={subCategoryData}
                                            value={masterForm.sub_category_ids}
                                            onChange={e => { // NOSONAR
                                                if (!id && masterForm?.category_ids?.length) onDrpChange(e);
                                            }}
                                        />

                                        <label>Sub Category<span className="text-danger">*</span></label>
                                    </span>
                                    <p className="error mb-0">{error["sub_category_ids"]}</p>
                                </div>
                            </div>
                        </fieldset>

                        <div className="row">
                            <div className="col-md-12 col-lg-4 mb-3 d-flex align-items-center">
                                <div>
                                    <label className="mr-2" style={id ? { fontSize: "12px" } : {}}>Status</label>
                                    {
                                        id ? (
                                            <CBadge
                                                className="ms-auto"
                                                style={{ fontSize: "15px" }}
                                                color={masterForm.is_active === 1 ? "success" : "danger"}
                                            >
                                                {masterForm.is_active === 1 ? "Active" : "Inactive"}
                                            </CBadge>
                                        ) : (
                                            <div>
                                                <CFormCheck
                                                    inline
                                                    id="active"
                                                    type="radio"
                                                    label="Active"
                                                    name="is_active"
                                                    className="customradiobutton"
                                                    onChange={e => { onHandleChange(e, true); }} // NOSONAR
                                                    value={masterForm.is_active === 1 ? true : false}
                                                    checked={masterForm.is_active === 1 ? true : false}
                                                />
                                                <CFormCheck
                                                    inline
                                                    type="radio"
                                                    id="inactive"
                                                    name="is_active"
                                                    label="Inactive"
                                                    className="customradiobutton"
                                                    onChange={e => { onHandleChange(e, false); }} // NOSONAR
                                                    value={masterForm.is_active !== 1 ? true : false}
                                                    checked={masterForm.is_active !== 1 ? true : false}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>

                            {
                                !id && (
                                    <div className="col-md-12 col-lg-4 text-right mb-3">
                                        <button
                                            onClick={getProductList}
                                            className="btn btn-primary mt-2 mr-2"
                                        >
                                            <CIcon icon={cilCheck} className="mr-1" /> Load Products
                                        </button>
                                    </div>
                                )
                            }

                            <div className="col-md-12 mt-5 mb-3 d-flex align-items-center custom-checkbox">
                                <div className="datatable-responsive-demo custom-react-table w-100">
                                    <div className="card pb-4">
                                        <DataTable
                                            showGridlines
                                            header={header}
                                            responsiveLayout="scroll"
                                            value={paginatedProducts}
                                            className="p-datatable-responsive-demo"
                                            footer={paginatedProducts?.length > 0 ? footerTemplate : <></>}
                                        >
                                            <Column
                                                field="title"
                                                header="NAME(CODE)"
                                                body={filterBodyTemplate} // NOSONAR
                                            />
                                            <Column
                                                field="is_prescribed"
                                                header="Product Label"
                                                body={prescriptionBodyTemplate} // NOSONAR
                                            />
                                            {!id && <Column field="_id" header="Delete" body={actionBodyTemplate} />}
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                               {!view && <button className="btn btn-primary mb-2 mr-2" onClick={onSubmitProduct}>
                                    <CIcon icon={cilCheck} className="mr-1" />{id ?"Update" : "Save"}
                                </button>}
                        <button className="btn btn-danger mb-2" onClick={oncancleForm}>
                            <CIcon icon={cilXCircle} className="mr-1" />Back
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddEditProductGroup
