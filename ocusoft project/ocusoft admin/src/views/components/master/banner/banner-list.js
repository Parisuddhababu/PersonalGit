// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton } from '@coreui/react'
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'
import { API } from '../../../../services/Api';
import { Dropdown } from 'primereact/dropdown';
import * as  Constant from "../../../../shared/constant/constant"
import Loader from "../../common/loader/loader"

import { cilCheckCircle, cilList, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons';
import { CommonMaster, Permission } from 'src/shared/enum/enum';
import { useToast } from '../../../../shared/toaster/Toaster';
import { Paginator } from 'primereact/paginator';
import { useHistory } from "react-router-dom";
import permissionHandler from 'src/shared/handler/permission-handler';
import ImageModal from '../../common/ImageModalPopup/image-modal'
import { isEmpty } from 'src/shared/handler/common-handler';
import CommonHcpInput from 'src/shared/common/common-hcp-input';

const BannerList = () => {
    let history = useHistory();
    const primaryHcpId = localStorage.getItem("account_id");
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter)
    const [deleteObj, setDeleteObj] = useState({})
    const [bannerData, setBannerData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedTitle, setSelectedTitle] = useState('')
    const [deleteDataArr, setDeleteDataArr] = useState([])
    const [selectedBannerType, setSelectedBannerType] = useState('')
    const [selectedAccount, setSelectedAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const { showError, showSuccess } = useToast();
    const [bannerTypeData, setBannerTypeData] = useState([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [isImageShow, setIsImageShow] = useState(false)
    const [imageObj, setImageObj] = useState({})
    const [filteredKeys, setFilteredKeys] = useState([]);

    const statusOption = Constant.STATUS_OPTION;

    const filterMap = {
        banner_title: selectedTitle,
        type: selectedBannerType,
        is_active: selectedStatus.code,
    };

    useEffect(() => {
        getBannerTypeData();
    }, []);

    useEffect(() => {
        if (searchVal) {
            const filters = {};

            if (filteredKeys.length) {
                filteredKeys.forEach(filterKey => {
                    filters[filterKey] = filterMap[filterKey];
                });
            }

            onFilterData(filters);
        }
    }, [searchVal])

    const getBannerData = (formData) => {
        setIsLoading(true)
        API.getMasterList(onBannerList, formData, true, Constant.GETBANNER);
    }

    const getBannerTypeData = () => {
        setIsLoading(true)
        API.getBannerTypeData(bannerRes, "", true)
    }

    const bannerRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setBannerTypeData(resVal)
            }
        },
        error: err => {
            setIsLoading(false);
            console.log(err);
        },
        complete: () => { },
    }

    const onAccountChange = (e) => {
        setSelectedAccount(e.target.value)
    }

    const onBannerList = {
        cancel: () => { },
        success: response => {
            setIsLoading(false)
            if (response?.meta?.status) {
                setBannerData(response?.data?.original?.data ?? []);
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { },
    }

    const editData = (rowData) => {
        history.push(`/banner/edit/?id=${rowData._id}`)
    }

    const onStatusChange = (e) => {
        setSelectedStatus(e.value);
    }

    const onTypeChange = (e) => {
        setSelectedBannerType(e.value)
    }


    const onChangeTitle = (e) => {
        setSelectedTitle(e.target.value)
    }

    const confirmDeleteProduct = (data) => {
        let obj = { ...data }
        obj.urlName = CommonMaster.BANNER
        obj.name = data.banner_title
        setDeleteObj(obj)
        setIsDeleteModalShow(true)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Action</span>
                {
                    permissionHandler(Permission.BANNER_UPDATE) &&
                    <a title="Edit" className="mr-2" onClick={() => editData(rowData)}><CIcon icon={cilPencil} size="lg" /></a>
                }
                {
                    permissionHandler(Permission.BANNER_DELETE) &&
                    <button className="btn btn-link mr-2 text-danger" title="Delete" onClick={() => confirmDeleteProduct(rowData)}><CIcon icon={cilTrash} size="lg" /></button>
                }
                {/* <button className="btn btn-link " title="Change Sequence"><CIcon icon={cilSwapVertical} size="lg" /></button> */}
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        }
        setIsLoading(true)

        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.UPDATEBANNERSTATUS);

    }

    // onUpdateStatusRes Response Data Method
    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _bannerData = bannerData;
                    const bannerIndex = _bannerData.findIndex(bannerObj => bannerObj?._id === uuid);
                    _bannerData[bannerIndex]["is_active"] = _bannerData[bannerIndex]["is_active"] === 1 ? 0 : 1;
                    setBannerData([ ..._bannerData ]);
                } else {
                    onFilterData();
                }
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    const header = (
        <div className="table-header">
            <div className="clearfix table-header-content">
                <h5 className="p-m-0 float-start"><CIcon icon={cilList} className="mr-1" /> Banner <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge></h5>
                {
                    permissionHandler(Permission.BANNER_CREATE) &&
                    <div className="float-end">
                        <div className="common-add-btn">
                            <CButton color="primary" onClick={() => { history.push(`/banner/add`) }}><CIcon icon={cilPlus} className="mr-1" />Add Banner</CButton>
                        </div>
                    </div>
                }
            </div>

            <hr />
            <form name="filterFrm" onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    <CommonHcpInput hcpValue={selectedAccount} handleHcpChange={onAccountChange} />

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="title"
                                value={selectedTitle}
                                className="form-control"
                                onChange={onChangeTitle}
                            />
                            <label>Title </label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown
                                optionValue="key"
                                optionLabel="name"
                                onChange={onTypeChange}
                                options={bannerTypeData}
                                className="form-control"
                                value={selectedBannerType}
                            />
                            <label>Banner Type</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Dropdown className="form-control" value={selectedStatus} options={statusOption} onChange={onStatusChange} optionLabel="name" />
                            <label>Status </label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 search-reset pb-3">
                        <CButton color="primary" className="mr-2" type='submit'>Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        if (rowData?.is_active === Constant.StatusEnum.active) {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-success" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilCheckCircle} size="lg" /></button>
                </React.Fragment>)
        } else {
            return (
                <React.Fragment>
                    <span className="p-column-title">Status</span>

                    <button className="btn btn-link text-danger" title="Change Status" onClick={() => onUpdateStatus(rowData)}><CIcon icon={cilXCircle} size="lg" /></button>
                </React.Fragment>)
        }
    }

    const titleBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Title</span>
                {rowData.banner_title ?? ''}
            </React.Fragment>
        );
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value);
        setDeleteDataArr([]);
        if (isDelete) {
            showSuccess(message);
            const filters = { ...searchVal };
            if (bannerData.length === 1 && searchVal.start > 0) {
                filters.start -= filters.length;
                setSearchVal({ ...searchVal, start: filters.start });
            }

            onFilterData(filters);
        }
    }

    const setGlobalFilter = (event) => {
        event.preventDefault()
        onFilterData()
    }

    const onFilterData = filters => {
        const { start, length, sort_field, sort_order } = searchVal;
        const data = { start, length }, _filteredKeys = [];

        if (sort_field) data["sort_param"] = sort_field;
        if (sort_order) data["sort_type"] = sort_order === 1 ? "asc" : "desc";
        const appliedFilters = filters ?? filterMap;

        for (const filterKey in appliedFilters) {
            const value = appliedFilters[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        if (!filters) {
            data["start"] = 0;
            setSearchVal({ ...searchVal, start: 0 });
        }

        if (selectedAccount) data["account_id"] = selectedAccount;

        setFilteredKeys([..._filteredKeys]);
        getBannerData(data);
    }

    const resetGlobalFilter = () => {
        setSelectedStatus('')
        setSelectedTitle('')
        setSelectedAccount(adminRole !== "SUPER_ADMIN" ? primaryHcpId : '');
        setSearchVal(initialFilter)
    }

    const onImageClick = (e, rowdata) => {
        e.stopPropagation();
        setImageObj(rowdata?.banner_image)
        setIsImageShow(true)
    }

    const onCloseImageModal = () => {
        setIsImageShow(false)
    }

    const imageBodyTemplate = (rowData) => {
        return rowData?.banner_image ? <img src={rowData?.banner_image?.path} onError={(e) => e.target.src = Constant.PRIME_URL} alt={rowData.banner_image?.file_name} className="product-image" onClick={(e) => onImageClick(e, rowData)} /> : "-";
    }

    const bannerTypeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Banner Type</span>
                <p>{rowData?.type}</p>
            </React.Fragment>
        )
    }

    const onPageChange = e => {
        setSearchVal({ ...searchVal, length: e.rows, start: e.first });
    }

    const footer = (
        <div className='table-footer'>
            <Paginator template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start} rows={searchVal.length} totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST} onPageChange={onPageChange}></Paginator>
        </div>
    );

    const onSort = (e) => {
        if (e.sortField) {
            setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder });
        }
    }

    return (
        <>
            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable value={bannerData} stripedRows className="p-datatable-responsive-demo" header={header} footer={bannerData?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll" reorderableColumns
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)}
                    >

                        <Column header="Banner Image" body={imageBodyTemplate} className="text-center" style={{ width: '20%' }}></Column>
                        <Column field="banner_title" sortable header="Title" body={titleBodyTemplate} style={{ width: '20%' }}></Column>
                        <Column field="banner_type" header="Banner Type" body={bannerTypeBodyTemplate} style={{ width: '20%' }}></Column>
                        {
                            permissionHandler(Permission.BANNER_STATUS) &&
                            <Column field="status" header="Status" body={statusBodyTemplate} style={{ width: '20%' }}></Column>
                        }
                        {
                            (permissionHandler(Permission.BANNER_UPDATE) || permissionHandler(Permission.BANNER_DELETE)) &&
                            <Column field="action" header="Action" body={actionBodyTemplate} style={{ width: '20%' }}></Column>
                        }

                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} deleteDataArr={deleteDataArr} name="Banner" />
            <ImageModal visible={isImageShow} imgObj={imageObj} onCloseImageModal={onCloseImageModal} />
            
        </>
    )
}

export default BannerList
