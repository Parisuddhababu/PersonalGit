import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { CBadge } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilList } from "@coreui/icons";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

import { API } from "src/services/Api";
import { CommonMaster } from "src/shared/enum/enum";
import * as Constant from "src/shared/constant/constant";
import { uuid } from "src/shared/handler/common-handler";
import Loader from "src/views/components/common/loader/loader";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const ShippingRates = () => {
    const { search } = useLocation();
    const code = new URLSearchParams(search).get("code");
    const isRateTheme = !String(code ?? '');

    const [isLoading, setIsLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [shippingList, setShippingList] = useState([]);
    const [searchParams, setSearchParams] = useState({ start: 0, length: Constant.DT_ROW });

    useEffect(() => {
        isRateTheme ? getRateList() : getZoneList();
    }, [searchParams]);

    const getRateList = () => {
        setIsLoading(true);
        const data = { ...searchParams };
        API.getMasterList(handleShippingListResponseObj, data, true, Constant.GET_SHIPPING_RATES);
    }

    const getZoneList = () => {
        const data = { ...searchParams, code: +code };
        API.getMasterList(handleShippingListResponseObj, data, true, Constant.SHIPPING_ZONE_LIST);
    }

    const handleShippingListResponseObj = {
        cancel: () => { },
        success: response => {
            setIsLoading(false);
            let _shippingList = [], _totalRecords;
            if (response?.meta?.status && response?.data?.original?.data?.length) {
                _shippingList = response?.data?.original?.data ?? [];
                _totalRecords = response?.data?.original?.recordsTotal ?? 0;
            }

            setShippingList([..._shippingList]);
            setTotalRecords(_totalRecords);
        },
        error: err => {
            setShippingList([]);
            console.log(err);
            setTotalRecords(0);
            setIsLoading(false);
        },
        complete: () => { },
    };

    const handleShippingPageChange = e => {
        setSearchParams({ ...searchParams, start: e.first, length: e.rows });
    }

    const shippingFooterTemplate = (
        <div className="table-footer">
            <Paginator
                first={searchParams.start}
                rows={searchParams.length}
                totalRecords={totalRecords}
                template={Constant.DT_PAGE_TEMPLATE}
                onPageChange={handleShippingPageChange} // NOSONAR
                rowsPerPageOptions={Constant.DT_ROWS_LIST}
                currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
            />
        </div>
    );

    const shippingRatesHeaderTemplate = (
        <div className="table-header">
            <div className="clearfix row">
                <span>
                    <h5 className="p-m-0 float-start">
                        <CIcon icon={cilList} className="mr-1" />
                        {isRateTheme ? CommonMaster.SHIPPING_RATES : CommonMaster.SHIPPING_ZONES}
                        <CBadge color="danger" className="ms-auto">{totalRecords}</CBadge>
                    </h5>
                </span>
            </div>
        </div>
    );

    const zoneBodyTemplate = rowData => {
        return <><span className="p-column-title">Zone</span>{rowData.zone ?? Constant.NO_VALUE}</>;
    }

    const rateBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Rate</span>
                {+(rowData?.rate ?? 0)?.toFixed(2) ?? Constant.NO_VALUE}
            </>
        );
    }

    const weightBodyTemplate = rowData => {
        return (
            <>
                <span className="p-column-title">Weight</span>
                {+(rowData?.weight ?? 0)?.toFixed(2) ?? Constant.NO_VALUE}
            </>
        );
    }

    const highZipBodyTemplate = rowData => {
        return <><span className="p-column-title">High zip</span>{rowData.high_zip ?? Constant.NO_VALUE}</>;
    }

    const lowZipBodyTemplate = rowData => {
        return <><span className="p-column-title">Low zip</span>{rowData.low_zip ?? Constant.NO_VALUE}</>;
    }

    const shipTypeBodyTemplate = rowData => {
        return <><span className="p-column-title">Ship Type</span>{rowData.ship_type ?? Constant.NO_VALUE}</>;
    }

    const statusBodyTemplate = rowData => {
        return (
            <CBadge
                className="ms-auto"
                style={{ fontSize: "14px" }}
                color={rowData?.is_active ? "success" : "danger"}
            >
                {rowData?.is_active ? "Active" : "Inactive"}
            </CBadge>
        );
    }

    const rateKeyBodyPairs = [
        { key: "zone", label: "Zone", template: zoneBodyTemplate },
        { key: "rate", label: "Rate (USD)", template: rateBodyTemplate },
        { key: "weight", label: "Weight (lbs)", template: weightBodyTemplate },
    ];

    const zoneKeyBodyPairs = [
        { key: "zone", label: "Zone", template: zoneBodyTemplate },
        { key: "high_zip", label: "High Zip", template: highZipBodyTemplate },
        { key: "low_zip", label: "Low Zip", template: lowZipBodyTemplate },
        { key: "ship_type", label: "Ship Type", template: shipTypeBodyTemplate },
        { key: "is_active", label: "Status", template: statusBodyTemplate },
    ];

    const getThemedColumns = () => {
        const keyBodyPairs = isRateTheme ? rateKeyBodyPairs : zoneKeyBodyPairs;

        return keyBodyPairs?.map(bodyPairObj => {
            const { key, label, template } = bodyPairObj;
            return <Column field={key} header={label} body={template} key={uuid()} />;
        })
    }

    return (
        <>
            {isLoading && <Loader />}

            <div className="datatable-responsive-demo custom-react-table">
                <div className="card">
                    <DataTable
                        stripedRows
                        showGridlines
                        reorderableColumns
                        value={shippingList}
                        responsiveLayout="scroll"
                        header={shippingRatesHeaderTemplate}
                        className="p-datatable-responsive-demo mb-4"
                        footer={shippingList?.length ? shippingFooterTemplate : <></>}
                    >
                        {getThemedColumns()}
                    </DataTable>
                </div>
            </div>
        </>
    );
}

export default ShippingRates;
