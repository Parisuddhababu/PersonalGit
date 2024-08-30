import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CIcon from '@coreui/icons-react';
import { cilCheck } from '@coreui/icons';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

import { API } from "src/services/Api";
import * as Constant from "src/shared/constant/constant"
import Loader from '../../common/loader/loader';
import { useToast } from 'src/shared/toaster/Toaster';

const CategorySequence = () => {
    const { showSuccess, showError } = useToast();
    const primaryAccountId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role?.code;

    const [selectedAccount, setSelectedAccount] = useState(primaryAccountId);
    const [accountData, setAccountData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [appliedCategories, setAppliedCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAccountList();
    }, []);

    useEffect(() => {
        if (selectedAccount) {
            getAppliedCategories();
            getCategories();
        }
    }, [selectedAccount]);

    const getAppliedCategories = () => {
        const data = { account_id: selectedAccount };
        API.getMasterList(onGetAppliedCategoriesResponse, data, true, Constant.GET_APPLIED_CATEGORIES);
    }

    const onGetAppliedCategoriesResponse = {
        cancel: () => { },
        success: response => {
            let _appliedCategories = [];
            let _selectedCategories = [];

            if (response?.meta?.status && response?.data?.length > 0) {
                _appliedCategories = response.data;

                _selectedCategories = response
                    .data
                    ?.filter(category => category.category_id)
                    ?.map(category => category.category_id)
                ;
            }

            setAppliedCategories([..._appliedCategories]);
            setSelectedCategories([..._selectedCategories]);
        },
        error: err => {
            console.log(err);
            setAppliedCategories([]);
            setSelectedCategories([]);
        },
        complete: () => { }
    }

    const getAccountList = () => {
        if (adminRole === "SUPER_ADMIN") {
            API.getMasterList(accountListResponse, null, true, Constant.ACCOUNT_LIST);
        }
    }

    const accountListResponse = {
        cancel: () => { },
        success: response => {
            if (response?.data?.original?.data?.length > 0) {
                let _accountData = response.data.original.data;
                setAccountData([..._accountData]);
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getCategories = () => {
        const data = { account_id: selectedAccount };
        API.getMasterList(onGetCategoriesResponse, data, true, Constant.GET_ACCOUNT_CATEGORIES);
    }

    const onGetCategoriesResponse = {
        cancel: () => { },
        success: response => {
            let _categoryData = [];

            if (response?.meta?.status && response?.data?.length) {
                _categoryData = response.data;
            }

            setCategoryData([..._categoryData]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const onRowReorder = e => {
        let obj = {
            uuid: appliedCategories[e.dragIndex]._id,
            newposition: e.dropIndex + 1,
            oldposition: e.dragIndex + 1
        };

        setIsLoading(true);
        API.MoveData(moveCategoryResponse, obj, true, Constant.MOVE_CATEGORIES);
    }

    const moveCategoryResponse = {
        cancel: () => {
            setIsLoading(false);
        },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                getAppliedCategories();
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const handleCategoryChange = categoryIdList => {
        setSelectedCategories(categoryIdList);
    }

    const nameBodyTemplate = rowData => {
        return (
            <>{rowData?.category?.name ?? ''}</>
        )
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (selectedCategories?.length > 0) {
            const data = { account_id: selectedAccount, category_id: [...selectedCategories] };
            API.addMaster(addAppliedCategoriesResponse, data, true, Constant.CREATE_ACCOUNT_CATEGORY);
        }
    }

    const addAppliedCategoriesResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                getAppliedCategories();
            }
        },
        error: err => {
            console.log(err);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { }
    }

    const accountDataTemplate = option => {
        return (
            <>{`${option?.name ?? ''} (${option?.code ?? ''})`}</>
        )
    }

    return (
        <>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Category Management</h5>
                    </div>

                    <div className="card-body">
                        <div className="container">
                            <div className="row d-flex justify-content-center">
                                {
                                    adminRole === "SUPER_ADMIN" && (
                                        <div className="col-md-4 pb-3">
                                            <span className="p-float-label custom-p-float-label">
                                                <Dropdown
                                                    value={selectedAccount}
                                                    className="form-control"
                                                    name="category"
                                                    options={accountData}
                                                    onChange={e => setSelectedAccount(e.target.value)}
                                                    itemTemplate={accountDataTemplate}
                                                    valueTemplate={accountDataTemplate}
                                                    optionLabel="name"
                                                    optionValue="_id"
                                                    filter
                                                    filterBy="name,code"
                                                />
                                                <label>Account <span className="text-danger">*</span></label>
                                            </span>
                                        </div>
                                    )
                                }

                                <div className="col-md-4">
                                    <span className="p-float-label custom-p-float-label">
                                        <MultiSelect
                                            value={selectedCategories}
                                            options={categoryData}
                                            onChange={e => handleCategoryChange(e.value)}
                                            optionLabel={"name"}
                                            optionValue={"_id"}
                                            className={"form-control"}
                                            filter
                                            filterBy={"name"}
                                        />
                                        <label>Categories <span className="text-danger">*</span></label>
                                    </span>
                                </div>

                                <div className="col-md-2">
                                    <button
                                        className="btn btn-primary mb-2 mr-2"
                                        onClick={e => handleSubmit(e)}
                                        disabled={categoryData.length === 0 || selectedCategories.length === 0}
                                    >
                                        <CIcon icon={cilCheck} /> Save
                                    </button>
                                </div>
                            </div>

                            <div className="row mt-4 d-flex justify-content-center">
                                <DataTable
                                    value={appliedCategories}
                                    stripedRows
                                    className="p-datatable-responsive-demo w-50"
                                    showGridlines
                                    responsiveLayout="scroll"
                                    reorderableColumns
                                    onRowReorder={onRowReorder}
                                >
                                    <Column rowReorder style={{ width: "3em", cursor: "move" }} />
                                    <Column field="name" header="Category Order" body={nameBodyTemplate} />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default CategorySequence;
