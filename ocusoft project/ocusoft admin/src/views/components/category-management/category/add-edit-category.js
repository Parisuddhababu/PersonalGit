import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import CIcon from "@coreui/icons-react";
import { cilXCircle, cilList, cilCheckCircle, cilBook } from "@coreui/icons";
import { CBadge } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { API } from "../../../../services/Api";
import * as Constant from "../../../../shared/constant/constant"
import { Permission } from "src/shared/enum/enum";
import permissionHandler from "src/shared/handler/permission-handler";
import Loader from "../../common/loader/loader";

const AddEditCategory = () => {
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const history = useHistory();

    const [masterForm, setMasterForm] = useState({
        name: '',
        code: '',
        tagLine: '',
        isActive: false,
        categoryType: '',
        customization: '',
        image: '',
    });

    const [categoryTypeData, setCategoryTypeData] = useState([]);
    const [filterSequence, setFilterSequence] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [entityId, setEntityId] = useState('');

    useEffect(() => {
        getCategoryTypeData();
        if (id) getCategoryDataById();
    }, []);

    useEffect(() => {
        if (entityId) getSubCateogryData();
    }, [entityId]);

    const getSubCateogryData = () => {
        if (permissionHandler(Permission.SUB_CATEGORY_LIST)) {
            let data = { parent_id: entityId, child: 1 };
            API.getMasterList(getSubCateogryResponse, data, true, Constant.GETCATEGORY);
        }
    }

    const getSubCateogryResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            let _filterSequence = [];
            let _totalRecords = 0;

            if (response?.meta?.status && response?.data?.original?.data?.length) {
                _filterSequence = response.data.original.data;
                _totalRecords = response.data.original.recordsTotal;
            }

            setTotalRecords(_totalRecords);
            setFilterSequence(_filterSequence);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const getCategoryDataById = () => {
        API.getMasterDataById(getCategoryDataByIdResponse, '', true, id, Constant.SHOWCATEGORY);
    }

    const getCategoryDataByIdResponse = {
        cancel: () => { },
        success: response => {
            if (response?.meta?.status) {
                const responseData = response.data;

                setMasterForm({
                    name: responseData?.name ?? '',
                    code: responseData?.code ?? '',
                    isActive: responseData?.is_active,
                    tagLine: responseData?.tag_line ?? '',
                    image: responseData?.category_image ?? '',
                    categoryType: responseData?.parent_id ?? '',
                    customization: responseData?.customization_id ?? '',
                });

                setEntityId(responseData?.entity_id ?? '');
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getCategoryTypeData = () => {
        const url = id ? Constant.ACTIVE_CATEGORY_TYPE_ALL : Constant.CATEGORY_TYPE_ACTIVE;
        API.getActiveDataList(url, getCategoryTypeDataResponse, '', true);
    }

    const getCategoryTypeDataResponse = {
        cancel: () => { },
        success: response => {
            let _categoryTypeData = [];
            if (response?.meta?.status && response?.data?.length) _categoryTypeData = response.data;
            setCategoryTypeData(_categoryTypeData);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    const headerTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />Sub Cateogry Details
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>
        </div>
    );

    const editData = rowData => {
        history.push(`/sub-category/edit/?id=${rowData._id}`);
    }

    const nameBodyTemplate = rowData => {
        return (
            <><span className="p-column-title">Name</span>{rowData?.name ?? ''}</>
        )
    }

    const categoryTypeBodyTemplate = rowData => {
        return (<>{rowData?.parent_name?.category_type?.name ?? ''}</>)
    }

    const statusBodyTemplate = rowData => {
        const statusIcon = rowData?.is_active === Constant.StatusEnum.active ? cilCheckCircle : cilXCircle;
        const statusClass = rowData?.is_active === Constant.StatusEnum.active ? "text-success" : "text-danger";

        return (
            <button title="Change Status" onClick={e => { e.preventDefault(); }} className={`btn btn-link ${statusClass}`}>
                <CIcon icon={statusIcon} size="lg" />
            </button>
        );
    }

    const actionBodyTemplate = rowData => {
        return (
            <>
                {
                    permissionHandler(Permission.SUB_CATEGORY_UPDATE) && (
                        <a title="View" className="mr-2" onClick={() => editData(rowData)}>
                            <CIcon icon={cilBook} size="lg" />
                        </a>
                    )
                }
            </>
        );
    }

    return (
        <>
            {isLoading && <Loader />}

            <form name="subMasterFrm" noValidate>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Update Category Management</h5>
                    </div>

                    <div className="card-body position-relative">
                        <div className="row">
                            <div className={"col-md-6 mb-3 col-lg-3"}>
                                <span className="p-float-label custom-p-float-label">
                                    <InputText
                                        className="form-control"
                                        maxLength="255"
                                        value={masterForm.name}
                                        required
                                    />
                                    <label>Name</label>
                                </span>
                            </div>

                            <div className={"col-md-6 mb-3 col-lg-3"}>
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        value={masterForm.categoryType}
                                        className="form-control"
                                        options={categoryTypeData}
                                        optionLabel="name"
                                        optionValue="entity_id"
                                    />
                                    <label>Category Type</label>
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

                    {(id && permissionHandler(Permission.SUB_CATEGORY_LIST)) &&
                        <div className="col-md-12 mb-3 d-flex align-items-center custom-checkbox">
                            <div className="datatable-responsive-demo custom-react-table table-responsive">
                                <div className="card">
                                    <DataTable
                                        showGridlines
                                        reorderableColumns
                                        value={filterSequence}
                                        rows={Constant.DT_ROW}
                                        header={headerTemplate}
                                        responsiveLayout="scroll"
                                        paginator={filterSequence.length > 0}
                                        className="p-datatable-responsive-demo"
                                        rowsPerPageOptions={Constant.DT_ROWS_LIST}
                                        currentPageReportTemplate={`Showing {first} to {last} of {totalRecords}`}
                                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                                    >
                                        <Column field="name" header="Name" body={nameBodyTemplate} />
                                        <Column field="name" header="Category Type" body={categoryTypeBodyTemplate} />

                                        {
                                            permissionHandler(Permission.SUB_CATEGORY_STATUS) && (
                                                <Column field="status" header="Status" body={statusBodyTemplate} />
                                            )
                                        }
                                        {
                                            (
                                                permissionHandler(Permission.SUB_CATEGORY_UPDATE) ||
                                                permissionHandler(Permission.SUB_CATEGORY_DELETE)
                                            ) && (
                                                <Column field="action" header="Action" body={actionBodyTemplate} />
                                            )
                                        }
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </form>
        </>
    )
}

export default AddEditCategory;
