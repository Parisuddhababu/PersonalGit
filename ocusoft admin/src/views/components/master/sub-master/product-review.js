// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { API } from '../../../../services/Api';
import * as Constant from "../../../../shared/constant/constant"
import { Permission } from 'src/shared/enum/enum';
import Loader from "../../common/loader/loader"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import SendMail from '../../common/SendMailPopup/send-mail'
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'
import CIcon from '@coreui/icons-react';
import { CBadge, CButton } from '@coreui/react'
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { cilCheckCircle, cilList, cilXCircle } from '@coreui/icons';
import { displayDateTimeFormat, requestDateFormatYY, PICKER_DISPLAY_DATE_FORMAT, isEmpty } from 'src/shared/handler/common-handler';
import { useToast } from '../../../../shared/toaster/Toaster';
import Rating from '@mui/material/Rating';
import { Paginator } from 'primereact/paginator';
import permissionHandler from 'src/shared/handler/permission-handler';

const ProductReview = () => {
    const initialFilter = {
        start: 0,
        length: Constant.DT_ROW,
        sort_order: '',
        sort_field: '',
    }

    const [searchVal, setSearchVal] = useState(initialFilter);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
    const [productReview, setproductReview] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectProductReview] = useState([]);
    const [selectedName, setSelectedName] = useState('')
    const [endDate, setEndDate] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [date, setDate] = useState(null);
    const [, setSelectedAccount] = useState(localStorage.getItem('account_id'))
    const [contactUsData] = useState([])
    const [deleteObj] = useState({});
    const [deleteDataArr, setDeleteDataArr] = useState([])
    const [isMailModalShow, setIsMailModalShow] = useState(false)
    const [mailObj] = useState({})
    const [mailDataArr, setMailDataArr] = useState([])
    const [, setSelectedContactUsMaster] = useState([]);
    const { showError, showSuccess } = useToast();
    const [filteredKeys, setFilteredKeys] = useState([]);

    const filterMap = {
        name: selectedName,
        from_date: startDate ? requestDateFormatYY(startDate) : '',
        to_date: endDate ? requestDateFormatYY(endDate) : '',
    };
    
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


    const getProductReviewData = (formData) => {
        setIsLoading(true)
        API.getMasterList(onMasterList, formData, true, Constant.GET_PRODUCT_REVIEW_LIST);
    }

    // onMasterList Response Data Method
    const onMasterList = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                setproductReview(response?.data?.original?.data)
                setTotalRecords(response?.data?.original.recordsTotal)

                setIsLoading(false)
            }
        },
        error: (error) => {
            setIsLoading(false)

        },
        complete: () => {
        },
    }

    useEffect(() => {
        if (date) {
            setStartDate(date[0])
            setEndDate(date[1])
        }

    }, [date])

    const onChangeName = (e) => {
        setSelectedName(e.target.value)
    }

    const onDateChange = (event) => {
        setDate(event.value)
    }

    const header = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" /> Product Review
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>
            </div>

            <hr />

            <form name='filterFrm' onSubmit={(e) => setGlobalFilter(e)}>
                <div className="row">
                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText className="form-control" maxLength="255" value={selectedName} name="name" onChange={(e) => onChangeName(e)} />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Calendar id="range" className="form-control border-0 px-0 py-0 custom-datepicker-input" dateFormat={PICKER_DISPLAY_DATE_FORMAT} showIcon appendTo="self" value={date} onChange={(e) => onDateChange(e)} selectionMode="range" readOnlyInput />
                            <label>Date Range </label>

                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" className="mr-2" type='submit'>Search</CButton>
                        <CButton color="danger" onClick={() => resetGlobalFilter()} >Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const ratingBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Rating</span>
                <Rating name="half-rating-read" defaultValue={rowData.rating} precision={0.5} readOnly />
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                {displayDateTimeFormat(rowData.created_at)}
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const productlBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Product</span>
                {rowData?.product?.title || Constant.NO_VALUE}
            </React.Fragment>
        );
    }

    const reviewBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Review</span>
                {rowData.review_title}
            </React.Fragment>
        );
    }

    const onUpdateStatus = (rowData) => {
        let obj = {
            "uuid": rowData._id,
            "is_active": rowData.is_active === Constant.StatusEnum.active ? Constant.StatusEnum.inactive : Constant.StatusEnum.active
        };

        setIsLoading(true);
        API.UpdateStatus(onUpdateStatusRes, obj, true, rowData._id, Constant.CHANGE_PRODUCT_REVIEW_STATUS);
    }

    const onUpdateStatusRes = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _productReviewData = productReview;
                    const productReviewIndex = _productReviewData.findIndex(review => review?._id === uuid);
                    _productReviewData[productReviewIndex]["is_active"] = _productReviewData[productReviewIndex]["is_active"] === 1 ? 0 : 1;
                    setproductReview([ ..._productReviewData ]);
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

    const onPageChange = (e) => {
        setSearchVal({ ...searchVal, length: e.rows })
        if (searchVal.start !== e.first) {
            setSearchVal({ ...searchVal, start: e.first })
        }

    }

    const footer = (
        <div className='table-footer'>
            <Paginator template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start} rows={searchVal.length} totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST} onPageChange={onPageChange}></Paginator>
        </div>
    );
    
    const onCloseMail = (value, isDelete, message) => {
        setIsMailModalShow(value)
        setSelectedContactUsMaster([])
        setDeleteDataArr([])
        setMailDataArr([])
        if (isDelete) {
            showSuccess(message)
            onFilterData()
        }
    }

    const onCloseDeleteConfirmation = (value, isDelete, message) => {
        setIsDeleteModalShow(value)
        setSelectedContactUsMaster([])
        setDeleteDataArr([])
        setMailDataArr([])
        if (isDelete) {
            showSuccess(message)
            // Only one record on second page and delete then it should be come to previous page in all modules
            if (contactUsData.length === 1 && searchVal.start) {
                setSearchVal({ ...searchVal, start: parseInt(searchVal.start) - parseInt(searchVal.length) });
            } else {
                onFilterData()
            }
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
        const appiledFilters = filters ?? filterMap;

        for (const filterKey in appiledFilters) {
            const value = filterMap[filterKey];
            if (!isEmpty(value)) {
                data[filterKey] = value;
                _filteredKeys.push(filterKey);
            }
        }

        setFilteredKeys([..._filteredKeys]);
        getProductReviewData(data);
    }


    const resetGlobalFilter = () => {
        setSelectedName('')
        // setSelectedEmail('')
        setSelectedAccount(localStorage.getItem('account_id'))
        setDate(null)
        setStartDate(null)
        setEndDate(null)
        setSearchVal(initialFilter)
        // setGlobalFilter('', '', localStorage.getItem('account_id'), null, null)

    }

    const onselectRow = (e) => {
        setSelectedContactUsMaster(e.value)
    }

    const onSort = (e) => {
        // sortField: "email"
        // sortOrder: 1 / -1


        if (e.sortField) {
            setSearchVal({ ...searchVal, sort_field: e.sortField, sort_order: e.sortOrder })
        }
    }


    return (
        <>
            {/* <Toast ref={toast} /> */}
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">

                    <DataTable value={productReview} stripedRows className="p-datatable-responsive-demo" header={header} footer={productReview?.length > 0 ? footer : ''} showGridlines responsiveLayout="scroll"
                        sortField={searchVal.sort_field} sortOrder={searchVal.sort_order} onSort={(e) => onSort(e)} selection={selectProductReview} onSelectionChange={e => onselectRow(e)} selectionMode='checkbox'
                    >
                        <Column header="Name" sortable field='name' body={nameBodyTemplate}></Column>
                        <Column field="product" header="Product"  body={productlBodyTemplate}></Column>
                        <Column field="rating" header="Rating" body={ratingBodyTemplate}></Column>
                        <Column field="review_title" header="Review" body={reviewBodyTemplate}></Column>
                        <Column field="date" header="Date" body={dateBodyTemplate}></Column>
                        {
                            permissionHandler(Permission.PRODUCT_REVIEW_STATUS) &&
                        <Column field="status" header="status" body={statusBodyTemplate} ></Column>
                        }
                    </DataTable>
                </div>
            </div>
            <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} deleteDataArr={deleteDataArr} name="Contact Us" deleteEndPoint={Constant.DELETEALLCONTACTUS} dataName="contactUs" />
            <SendMail visible={isMailModalShow} onCloseMailModal={onCloseMail} mailObj={mailObj} mailUrl={Constant.REPLYCONTACTUSEMAIL} mailDataArr={mailDataArr} name="Contact Us" sendMailEndPoint={Constant.REPLYCONTACTUSEMAIL} dataName="uuid" />

        </>
    )
}

export default ProductReview;
