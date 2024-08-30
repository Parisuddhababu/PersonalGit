import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { upperFirst } from "lodash";
import CIcon from "@coreui/icons-react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { cilCheck, cilXCircle } from "@coreui/icons";
import { MultiSelect } from "primereact/multiselect";
import { useLocation, useHistory } from "react-router-dom";

import { API } from "src/services/Api";
import * as Regex from "src/shared/regex/regex";
import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";

const AddEditHomePageConfigurations = () => {
    let history = useHistory();
    const search = useLocation().search;
    const { showError, showSuccess } = useToast();
    const id = new URLSearchParams(search).get("id");
    const primaryAccountId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;

    const [errors, setErrors] = useState({});
    const [hcpList, setHcpList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [tempSelectedProducts, setTempSelectedProducts] = useState([]);
    const [masterForm, setMasterForm] = useState({ title: '', hcp: adminRole !== "SUPER_ADMIN" ? primaryAccountId : '' });

    useEffect(() => {
        if (adminRole === "SUPER_ADMIN") getHcpList();
        if (id) getHomePageConfigById();
    }, []);

    useEffect(() => {
        if (tempSelectedProducts?.length || !id) getActiveProducts(masterForm.hcp);
    }, [masterForm.hcp, tempSelectedProducts]);

    const getActiveProducts = selectedHcpId => {
        if (selectedHcpId) {
            setIsLoading(true);
            const data = { account_id: selectedHcpId };
            API.getMasterList(handleGetActiveProductResponseObj, data, true, Constant.HOME_PAGE_ACTIVE_PRODUCTS);
        }
    }

    const handleGetActiveProductResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            const _productList = response?.data?.map(productObj => {
                return {
                    id: productObj?._id ?? '',
                    sku: productObj?.sku ?? '',
                    title: productObj?.name ?? '',
                };
            }) ?? [];

            const productIdList = [];

            tempSelectedProducts.forEach(productId => {
                const productObj = _productList.find(product => product.id === productId);
                if (productObj) productIdList.push(productId);
            });

            setSelectedProducts([...productIdList]);

            setProductList([..._productList]);
        },
        error: err => {
            console.log(err);
            setProductList([]);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const getHcpList = () => {
        API.getAccountDataByLoginId(getHcpListResponseObj, null, true);
    }

    const getHomePageConfigById = () => {
        setIsLoading(true);
        API.getMasterDataById(getHomePageConfigByIdResponseObj, null, true, id, Constant.HOME_PAGE_CONFIG_DETAILS);
    }

    const getHomePageConfigByIdResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status && response?.data) {
                let responseData = response.data;
                let data = {
                    title: responseData?.title ?? '',
                    hcp: responseData?.account?.account_id ?? '',
                };

                setTempSelectedProducts([...responseData?.product_id ?? []]);
                setMasterForm({ ...data });
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const getHcpListResponseObj = {
        cancel: () => { },
        success: response => {
            let _hcpList = [];
            if (response?.meta?.status && response?.data?.length) _hcpList = [...response.data];
            setHcpList([..._hcpList]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const handleValidation = () => {
        let _errors = {}, isFormValid = true;

        for (const [key, value] of Object.entries(masterForm)) {
            if (key === "title" && value?.length > Regex.TITLE_MAXLENGTH) {
                isFormValid = false;
                _errors[key] = "Title cannot exceed 100 characters.";
            } else if (!value) {
                isFormValid = false;
                _errors[key] = `${upperFirst(key)} is required.`;
            }
        }

        if (!selectedProducts?.length) {
            isFormValid = false;
            _errors["products"] = "Atleast one product is required.";
        }

        setErrors({ ..._errors });
        return isFormValid;
    }

    const handleInputChange = e => {
        const _errors = { ...errors };
        const data = { ...masterForm };
        const { name, value } = e?.target ?? {};

        if (name === "title" && value?.length > Regex.TITLE_MAXLENGTH) {
            _errors[name] = "Title cannot exceed 100 characters.";
            return;
        } else if (name === "hcp") {
            data["products"] = [];
        }

        data[name] = value;
        _errors[name] = '';
        setErrors({ ..._errors });
        setMasterForm({ ...data });
    }

    const handleProductSelectionChange = e => {
        setSelectedProducts([...e?.target?.value ?? []]);
    }

    const moveToListPage = e => {
        e.preventDefault();
        history.push("/home-page-configurations");
    }

    const handleSubmit = e => {
        e.preventDefault()
        const hcpId = (adminRole === "SUPER_ADMIN") ? masterForm.hcp : primaryAccountId;

        if (handleValidation()) {
            let data = { account_id: hcpId, title: masterForm.title, product_id: selectedProducts };

            setIsLoading(true);
            if (id) API.UpdateMasterData(handleSubmitResponseObj, data, true, id, Constant.HOME_PAGE_UPDATE);
            else API.addMaster(handleSubmitResponseObj, data, true, Constant.HOME_PAGE_CREATE);
        }
    }

    const handleSubmitResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                setTimeout(() => { history.push("/home-page-configurations"); }, 1000);
            }
        },
        error: err => {
            setIsLoading(false);
            if (err.errors) {
                Object.values(err.errors).map(err => { showError(err); });
            } else {
                const message = err?.meta?.message ?? "Something went wrong!";
                showError(message);
            }
        },
        complete: () => { },
    }

    const hcpListTemplate = option => {
        return <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>;
    }

    return (
        <div>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">{`${id ? "Update" : "Add"} ${CommonMaster.HOME_PAGE_CONFIG}`}</h5>
                    </div>

                    <div className="card-body">
                        <p className="col-sm-12 text-right">
                            Fields marked with <span className="text-danger">*</span> are mandatory.
                        </p>

                        <div className="row">
                            {
                                adminRole === "SUPER_ADMIN" && (
                                    <div className="col-md-4 mb-3">
                                        <span className="p-float-label custom-p-float-label">
                                            <Dropdown
                                                filter
                                                name="hcp"
                                                optionValue="_id"
                                                options={hcpList}
                                                className="form-control"
                                                optionLabel="company_name"
                                                value={masterForm.hcp}
                                                onChange={handleInputChange} // NOSONAR
                                                filterBy="company_name,code"
                                                itemTemplate={hcpListTemplate} // NOSONAR
                                                valueTemplate={hcpListTemplate} // NOSONAR
                                            />
                                            <label>HCP<span className="text-danger">*</span></label>
                                        </span>

                                        <p className="error">{errors?.hcp ?? ''}</p>
                                    </div>
                                )
                            }

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <MultiSelect
                                        filter
                                        showClear
                                        name="products"
                                        optionValue="id"
                                        filterBy="title"
                                        optionLabel="title"
                                        options={productList}
                                        className="form-control"
                                        value={selectedProducts}
                                        onChange={handleProductSelectionChange} // NOSONAR
                                    />
                                    <label>Products <span className="text-danger">*</span></label>
                                </span>
                                <p className="error">{errors?.products ?? ''}</p>
                            </div>

                            <div className="col-md-4 mb-3">
                                <span className="p-float-label custom-p-float-label display-count">
                                    <InputText
                                        required
                                        name="title"
                                        className="form-control"
                                        value={masterForm.title}
                                        onChange={handleInputChange} // NOSONAR
                                        maxLength={Regex.TITLE_MAXLENGTH}
                                    />
                                    <span className="character-count">
                                        {masterForm?.title?.length}/{Regex.TITLE_MAXLENGTH}
                                    </span>

                                    <label>Title</label>
                                </span>
                                <p className="error">{errors?.title ?? ''}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button className="btn btn-primary mb-2 mr-2" onClick={handleSubmit}>
                            <CIcon icon={cilCheck} />{id ? "Update" : "Save"}
                        </button>

                        <button className="btn btn-danger mb-2" onClick={moveToListPage}>
                            <CIcon icon={cilXCircle} className="mr-1" />Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEditHomePageConfigurations;
