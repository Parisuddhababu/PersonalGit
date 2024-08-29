import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { cibGmail, cilBook, cilList, cilPlus, cilTrash } from "@coreui/icons";

import ReplyInquiry from "./reply-inquiry";
import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { CommonMaster, Permission } from "src/shared/enum/enum";
import DeleteModal from "../../common/DeleteModalPopup/delete-modal";
import permissionHandler from "src/shared/handler/permission-handler";
import { PICKER_DISPLAY_DATE_FORMAT, displayDateTimeFormat, requestDateFormatYY } from "src/shared/handler/common-handler";

const HcpInquiries = () => {
    const history = useHistory();
    const { showError, showSuccess } = useToast();
    const primaryAccountId = localStorage.getItem("account_id");
    const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
    const initialFilters = { start: 0, length: Constant.DT_ROW, name: '', email: '', date: null, account: '' };

    const [isLoading, setIsLoading] = useState(false);
    const [inquiryList, setInquiryList] = useState([]);
    const [detailsObj, setDetailsObj] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [deleteObj, setDeleteObj] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [accountData, setAccountData] = useState([]);
    const [searchParams, setSearchParams] = useState({ ...initialFilters });

    useEffect(() => {
        getAccountList();
    }, []);

    useEffect(() => {
        if (searchParams.date?.length > 1) {
            setStartDate(searchParams.date[0])
            setEndDate(searchParams.date[1])
        }
    }, [searchParams.date]);

    useEffect(() => {
        const filters = { start: searchParams.start, length: searchParams.length };
        filteredKeys.forEach(key => {
            filters[key] = searchParams[key];
        });

        applyFilters(filters);
    }, [searchParams.start, searchParams.length]);

    const getAccountList = () => {
        API.getMasterList(handleAccountListResponse, null, true, Constant.ACTIVE_ACCOUNT_LIST);
    }

    const handleAccountListResponse = {
        cancel: () => { },
        success: response => {
            let _accountData = [];
            if (response?.meta?.status && response?.data?.length > 0) {
                _accountData = response.data;
            }

            setAccountData([..._accountData]);
        },
        error: err => {
            console.log(err);
        },
        complete: () => { }
    }

    const getInquiryList = data => {
        setIsLoading(true);
        API.getMasterList(handleInquiryListResponseObj, data, true, Constant.HCP_INQUIRY_LIST);
    }

    const handleInquiryListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.status) {
                setInquiryList(response?.data?.original?.data ?? [])
                setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            setInquiryList([]);
            setTotalRecords(0);
        },
        complete: () => { },
    }

    const moveToViewPage = id => {
        if (id) history.push(`/hcp-inquiries/view/?id=${id}`);
        else showError("Inquiry id is unavailable.");
    }

    const moveToAddPage = e => {
        e.preventDefault();
        history.push("hcp-inquiries/add");
    }

    const handleSearchParamChange = e => {
        const { name: key, value } = e.target;
        setSearchParams({ ...searchParams, [key]: value });
    }

    const accountDataTemplate = option => {
        return <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>;
    }

    const headerTemplate = (
        <div className="table-header">
            <div className="clearfix">
                <h5 className="p-m-0 float-start">
                    <CIcon icon={cilList} className="mr-1" />
                    {CommonMaster.HCP_INQUIRIES}
                    <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                </h5>

                {
                    adminRole !== "SUPER_ADMIN" && permissionHandler(Permission.HCP_INQUIRY_STORE) && (
                        <div className="foat-end">
                            <div className="common-add-btn">
                                <CButton color="primary" onClick={moveToAddPage} className="btn-primary mr-2"> {/* NOSONAR */}
                                    <CIcon icon={cilPlus} className="mr-1" />Add Inquiry
                                </CButton>
                            </div>
                        </div>
                    )
                }
            </div>

            <hr />
            <form name="filterFrm" onSubmit={e => { e.preventDefault(); applyFilters(); }}>
                <div className="row">
                    {
                        adminRole === "SUPER_ADMIN" && (
                            <div className="col-md-6 col-lg-3 pb-3">
                                <span className="p-float-label custom-p-float-label">
                                    <Dropdown
                                        filter
                                        name="account"
                                        optionValue="_id"
                                        options={accountData}
                                        className="form-control"
                                        optionLabel="company_name"
                                        filterBy="company_name,code"
                                        value={searchParams.account}
                                        itemTemplate={accountDataTemplate} // NOSONAR
                                        onChange={handleSearchParamChange} // NOSONAR
                                        valueTemplate={accountDataTemplate} // NOSONAR
                                    />
                                    <label>HCP</label>
                                </span>
                            </div>
                        )
                    }

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="name"
                                className="form-control"
                                value={searchParams.name}
                                onChange={handleSearchParamChange} // NOSONAR
                            />
                            <label>Name</label>
                        </span>
                    </div>

                    <div className="col-md-6 col-lg-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <InputText
                                name="email"
                                className="form-control"
                                value={searchParams.email}
                                onChange={handleSearchParamChange} // NOSONAR
                            />
                            <label>Email</label>
                        </span>
                    </div>

                    <div className="col-md-3 pb-3">
                        <span className="p-float-label custom-p-float-label">
                            <Calendar
                                showIcon
                                id="range"
                                name="date"
                                appendTo="self"
                                selectionMode="range"
                                value={searchParams.date}
                                onChange={handleSearchParamChange} // NOSONAR
                                dateFormat={PICKER_DISPLAY_DATE_FORMAT}
                                className="form-control border-0 px-0 py-0 custom-datepicker-input"
                            />
                            <label>Date Range</label>
                        </span>
                    </div>

                    <div className="col-md-12 col-lg-3 pb-3 search-reset">
                        <CButton color="primary" className="mr-2" type="submit">Search</CButton>
                        <CButton color="danger" onClick={resetParams}>Reset</CButton>
                    </div>
                </div>
            </form>
        </div>
    );

    const countryBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Country</span>
                {rowData?.country?.name ?? Constant.NO_VALUE}
            </>
        );
    }

    const emailBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData?.email ?? Constant.NO_VALUE}
            </>
        );
    }

    const hcpBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Message</span>
                {rowData?.account?.account_name ?? Constant.NO_VALUE}
            </>
        );
    }

    const dateBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Created At</span>
                {displayDateTimeFormat(rowData.created_at) ?? Constant.NO_VALUE}
            </>
        );
    }

    const nameBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData?.name ?? Constant.NO_VALUE}
            </>
        );
    }

    const confirmDeleteProduct = data => {
        let obj = { ...data };
        obj.urlName = CommonMaster.HCP_INQUIRIES;
        obj.name = data.name;
        obj.uuid = data._id;
        setDeleteObj(obj);
        setShowDeleteModal(true);
    }

    const replyMail = inquiryData => {
        setShowDetails(true);
        setDetailsObj({
            id: inquiryData?._id ?? '',
            name: inquiryData?.name ?? '',
            email: inquiryData?.email ?? '',
            inquiry: inquiryData?.enquiry ?? '',
        });
    }

    const actionBodyTemplate = rowData => {
        return (
            <>
                {
                    adminRole === "SUPER_ADMIN" ? (
                        <a title="Send Mail" className="mr-2" onClick={() => { replyMail(rowData); }}>
                            <CIcon icon={cibGmail} size="lg" />
                        </a>
                    ) : (
                        <a title="View" className="mr-2" onClick={() => { moveToViewPage(rowData._id); }}>
                            <CIcon icon={cilBook} size="lg" />
                        </a>
                    )
                }

                {
                    permissionHandler(Permission.HCP_INQUIRY_DELETE) && (
                        <button
                            title="Delete"
                            className="btn btn-link mr-2 text-danger"
                            onClick={() => { confirmDeleteProduct(rowData); }}
                        >
                            <CIcon icon={cilTrash} size="lg" />
                        </button>
                    )
                }
            </>
        );
    }

    const applyFilters = filters => {
        const { start, length } = searchParams;
        let data = { start, length }, _filteredKeys = [];

        const appliedFilters = filters ?? searchParams;

        for (const filter in appliedFilters) {
            const value = appliedFilters[filter];
            _filteredKeys.push(filter);

            if (filter === "start" || filter === "length") {
                data[filter] = value;
            } else if (filter === "date" && value && startDate && endDate) {
                data["from_date"] = requestDateFormatYY(startDate);
                data["to_date"] = requestDateFormatYY(endDate);
            } else if (filter === "account" && value) {
                data["account_id"] = value;
            } else if (value && filter !== "date") {
                data[filter] = value;
            }
        }

        if (!filters) {
            data["start"] = 0;
            setSearchParams({ ...searchParams, start: 0 });
        }

        if (adminRole !== "SUPER_ADMIN") data["account_id"] = primaryAccountId;
        setFilteredKeys([..._filteredKeys]);
        getInquiryList(data);
    }

    function resetParams(e) {
        e.preventDefault();
        const { start, length } = searchParams;
        const { start: initialStart, length: initialLength } = initialFilters;

        setEndDate(null);
        setStartDate(null);
        setSearchParams({ ...initialFilters });

        if (start === initialStart && length === initialLength) applyFilters(initialFilters);
    }

    const handlePageChange = e => {
        setSearchParams({ ...searchParams, start: e.first, length: e.rows });
    }

    const footerTemplate = (
        <div className="table-footer">
            <Paginator
                first={searchParams.start}
                rows={searchParams.length}
                totalRecords={totalRecords}
                onPageChange={handlePageChange} // NOSONAR
                template={Constant.DT_PAGE_TEMPLATE}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    const handleCloseDeleteModal = (_, isDeleted, message) => {
        setDeleteObj(null);
        setShowDeleteModal(false);

        if (isDeleted && message) {
            const filters = { ...searchParams };
            if (inquiryList.length === 1 && searchParams.start > 0) {
                filters.start -= filters.length;
                setSearchParams({ ...searchParams, start: filters.start });
            }

            applyFilters(filters);
            showSuccess(message);
        }
    }

    const handleCloseDetails = () => {
        setDetailsObj(null);
        setShowDetails(false);
    }

    const handleSendReplyAction = (e, message) => {
        e.preventDefault();
        setShowDetails(false);
        const data = { message, uuids: detailsObj.id };
        setIsLoading(true);
        API.getMasterList(handleSendReplyResponseObj, data, true, Constant.HCP_INQUIRY_REPLY_EMAIL);
    }

    const handleSendReplyResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            if (response?.meta?.message) showSuccess(response.meta.message);
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { },
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        value={inquiryList}
                        header={headerTemplate}
                        responsiveLayout="scroll"
                        sortField={searchParams.sort_field}
                        sortOrder={searchParams.sort_order}
                        className="p-datatable-responsive-demo"
                        footer={inquiryList?.length > 0 ? footerTemplate : <></>}
                    >
                        {<Column field="name" header="Name" body={nameBodyTemplate} /> /* NOSONAR */}
                        {<Column field="email" header="Email" body={emailBodyTemplate} /> /* NOSONAR */}
                        {<Column field="country" header="Country" body={countryBodyTemplate} /> /* NOSONAR */}
                        {
                            adminRole === "SUPER_ADMIN" && (
                                <Column field="account" header="HCP" body={hcpBodyTemplate} /> // NOSONAR
                            )
                        }
                        {<Column field="created_at" header="Created at" body={dateBodyTemplate} /> /* NOSONAR */}
                        {<Column field="_id" header="Action" body={actionBodyTemplate} /> /* NOSONAR */}
                    </DataTable>
                </div>
            </div>

            <DeleteModal
                name="Contact Admin"
                deleteObj={deleteObj}
                visible={showDeleteModal}
                onCloseDeleteModal={handleCloseDeleteModal} // NOSONAR
            />

            {
                showDetails && (
                    <ReplyInquiry
                        {...detailsObj}
                        handleCloseAction={handleCloseDetails} // NOSONAR
                        handleSendReplyAction={handleSendReplyAction} // NOSONAR
                    />
                )
            }
        </>
    );
};

export default HcpInquiries;
