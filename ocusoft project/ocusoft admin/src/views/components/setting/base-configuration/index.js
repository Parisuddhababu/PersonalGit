import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { useHistory } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { cilCheckCircle, cilXCircle, cilPencil } from "@coreui/icons";

import { API } from "src/services/Api";
import { Paginator } from "primereact/paginator";
import { useToast } from "src/shared/toaster/Toaster";
import * as  Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { displayDateTimeFormat } from "src/shared/handler/common-handler";

const BaseConfig = () => {
    const history = useHistory();
    const { showError, showSuccess } = useToast();
    const initialFilter = { start: 0, length: Constant.DT_ROW, sort_order: '', sort_field: '' };

    const [pageData, setPageData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchVal, setSearchVal] = useState(initialFilter);

    useEffect(() => {
        getConfigList();
    }, [searchVal]);

    const getConfigList = () => {
        const data = { start: searchVal.start, length: searchVal.length };

        setIsLoading(true);
        API.getMasterList(onGetConfigListResponse, data, true, Constant.PAGE_LIST);
    }

    const onGetConfigListResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.data?.original?.data) {
                const responseData = response.data.original.data;
                const _pageData = responseData.map(page => {
                    return {
                        id: page?._id,
                        name: page?.['page_title'],
                        date: page?.['created_at'],
                        isCompulsory: page?.['is_compulsory'],
                    }
                });

                setPageData([..._pageData]);
                setTotalRecords(response.data.original.recordsTotal);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
        },
        complete: () => { }
    }

    const changeCompulsoryStatus = (pageId, updatedStatus) => {
        setIsLoading(true);
        const data = { uuid: pageId, is_compulsory: updatedStatus };
        API.UpdateStatus(onChangeCompulsoryStatusResponse, data, true, null, Constant.CHANGE_COMPULSORY_PAGE_STATUS);
    }

    const onChangeCompulsoryStatusResponse = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);

            if (response?.meta?.status) {
                if (response?.meta?.message) showSuccess(response.meta.message);
                const { uuid } = response?.data ?? {};

                if (uuid) {
                    let _pageData = pageData;
                    const pageIndex = _pageData.findIndex(pageObj => pageObj?.id === uuid);
                    _pageData[pageIndex]["isCompulsory"] = _pageData[pageIndex]["isCompulsory"] === 1 ? 0 : 1;
                    setPageData([..._pageData]);
                } else {
                    getConfigList();
                }
            }
        },
        error: err => {
            setIsLoading(false);
            if (err?.meta?.message) showError(err.meta.message);
        },
        complete: () => { }
    }

    const header = (
        <div className="table-header">
            <div className="clearfix row">
                <span><h5 className="p-m-0 float-start"> Base Configuration </h5></span>
            </div>

            <hr />
        </div>
    );

    const templateBody = rowData => {
        return (<span>{rowData.name}</span>);
    }

    const statusBody = rowData => {
        return (
            <div>
                {
                    rowData?.isCompulsory === Constant.StatusEnum.active ? (
                        <button
                            title="page is compulsory"
                            className="btn btn-link text-success"
                            onClick={() => { changeCompulsoryStatus(rowData.id, 0); }}
                        >
                            <CIcon icon={cilCheckCircle} size="lg" />
                        </button>
                    ) : (
                        <button
                            className="btn btn-link text-danger"
                            title="page is not compulsory"
                            onClick={() => { changeCompulsoryStatus(rowData.id, 1); }}
                        >
                            <CIcon icon={cilXCircle} size="lg" />
                        </button>
                    )
                }
            </div>
        );
    }

    const dateBody = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                {displayDateTimeFormat(rowData.date)}
            </React.Fragment>
        );
    }

    const actionBody = (_, indexData) => {
        const index = indexData.rowIndex;
        return (
            <>
                <span className="p-column-title">Action</span>
                <a title="Edit" className="mr-2" onClick={() => { moveToAddEditPage("edit", index); }}>
                    <CIcon icon={cilPencil} size="lg" />
                </a>
            </>
        );
    }

    const moveToAddEditPage = (action, index) => {
        let url = '/base-configuration';
        if (action === 'edit' && index !== null) {
            url = `${url}/${action}/?id=${pageData?.[index]?.['id']}`;
        } else {
            url = `${url}/${action}`;
        }
        history.push(url);
    }
    
    const onPageChange = e => {
        setSearchVal({ ...searchVal, length: e.rows, start: e.first });
    }

    const footer = (
        <div className='table-footer'>
            <Paginator
                template={Constant.DT_PAGE_TEMPLATE}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
                first={searchVal.start}
                rows={searchVal.length}
                totalRecords={totalRecords}
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                onPageChange={onPageChange}
            ></Paginator>
        </div>
    )

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        value={pageData}
                        stripedRows
                        className="p-datatable-responsive-demo"
                        header={header}
                        showGridlines
                        responsiveLayout="scroll"
                        footer={pageData?.length > 0 ? footer : (<></>)}
                    >
                        <Column field='name' header="Page" sortable body={templateBody}></Column>
                        <Column field="date" header="Page Creation Date" body={dateBody}></Column>
                        <Column field="isCompulsory" header="Compulsory Page" body={statusBody}></Column>
                        <Column header="Action" body={actionBody}></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )
}

export default BaseConfig;
