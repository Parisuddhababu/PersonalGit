import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import _ from "lodash";
import { API } from "src/services/Api";
import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { CBadge, CButton } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
  cilBook,
  cilCloudDownload,
  cilList,
  cilSync,
  cilCart,
  cilXCircle,
} from "@coreui/icons";

import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import CommonHcpInput from "src/shared/common/common-hcp-input";
import {
  isEmpty,
  displayDateTimeFormat,
  downloadFile,
  orderStatusDirectory,
} from "src/shared/handler/common-handler";
import CancelModal from "../common/cancelOrderPopUp/cancel-order";

const Orders = () => {
  const history = useHistory();
  const defaultFilters = ["start", "length"];
  const { showError, showSuccess } = useToast();
  const primaryHcpId = localStorage.getItem("account_id");
  const adminRole =
    JSON.parse(localStorage.getItem("user_details"))?.role?.code ?? "";
  const initialFilters = {
    start: 0,
    sapId: "",
    status: "",
    number: "",
    lastName: "",
    firstName: "",
    sapFinalOid:'',
    length: Constant.DT_ROW,
    hcp: adminRole !== "SUPER_ADMIN" ? primaryHcpId : "",
  };

  const [hcpList, setHcpList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [searchParams, setSearchParams] = useState({ ...initialFilters });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const filterMap = {
    order_number: searchParams.number,
    account_id: searchParams.hcp,
    last_name: searchParams.lastName,
    first_name: searchParams.firstName,
    sap_order_id: (function () {
      // NOSONAR
      const sapId = +searchParams.sapId;
      return sapId > 0 ? sapId : "";
    })(),
    order_status: (function () {
      // NOSONAR
      const orderIndex = orderStatusDirectory.findIndex(
        (status) => status === searchParams.status
      );
      return orderIndex >= 0 ? orderIndex : "";
    })(),
  };

  useEffect(() => {
    getHcpList();
    applyFilters();
  }, []);

  const getHcpList = () => {
    API.getMasterList(
      hcpListResponseObj,
      null,
      true,
      Constant.ACTIVE_ACCOUNT_LIST
    );
  };

  const hcpListResponseObj = {
    cancel: () => {},
    success: (response) => {
      let _hcpList = [];
      if (response?.meta?.status && response?.data?.length)
        _hcpList = response.data;
      setHcpList([..._hcpList]);
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => {},
  };

  const getOrderList = (data) => {
    setIsLoading(true);
    API.getMasterList(
      handleOrderListResponseObj,
      data,
      true,
      Constant.ORDER_LIST
    );
  };

  const handleOrderListResponseObj = {
    cancel: () => {},
    success: (response) => {
      // NOSONAR
      setIsLoading(false);
      if (response?.meta?.status) {
        const responseData = Array.isArray(response?.data?.original?.data)
          ? response.data.original.data
          : [];
        const _orders = responseData.map((orderObj) => {
          const paymentStatusText = orderObj?.transactions.map((text) => {
            return text?.payment_status_text;
          });
          return {
            id: orderObj?._id ?? "",
            sapId: orderObj?.sap_order_id ?? Constant.NO_VALUE,
            sapFinalOid:orderObj?.sap_final_oid ?? Constant.NO_VALUE,
            code: orderObj?.account?.code ?? Constant.NO_VALUE,
            number: orderObj?.order_number ?? Constant.NO_VALUE,
            hcpName: orderObj?.account?.account_name ?? Constant.NO_VALUE,
            date:
              displayDateTimeFormat(orderObj?.created_at) ?? Constant.NO_VALUE,
            totalCost:
              Number(orderObj?.cart_summary?.total_price)?.toFixed(2) ?? 0,
            status:
              orderStatusDirectory?.[+orderObj?.order_status ?? 1] ??
              "In process",
            paymentStatus: paymentStatusText?.length>0
              ? paymentStatusText[paymentStatusText?.length - 1]
              : Constant.NO_VALUE,
            patientName: `${orderObj?.user_info?.first_name ?? ""} ${
              orderObj?.user_info?.last_name ?? ""
            }`,
            refundId: orderObj?.refund_id,
          };
        });

        setOrderList([..._orders]);
        setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
      }
    },
    error: (err) => {
      console.log(err);
      setOrderList([]);
      setTotalRecords(0);
      setIsLoading(false);
    },
    complete: () => {},
  };

  const syncOrder = (id) => {
    if (id) {
      setIsLoading(true);
      const data = { order_id: id };
      API.getMasterList(
        handleSyncOrderResponseObj,
        data,
        true,
        Constant.ORDER_SYNC
      );
    } else {
      showError("order id is unavailable.");
    }
  };

  const openCancelModal = (cancelId) => {
    setSelectedCancelId(cancelId);
    setShowCancelModal(true);
  };
  const closeCancelModal = (isCancelled) => {
    setShowCancelModal(false);
    if (isCancelled) {
      getOrderList();
    }
  };

  const handleSyncOrderResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.message) showSuccess(response.meta.message);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => {},
  };

  const handleOrderSearchParamChange = (e) => {
    const { name, value } = e?.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const moveToDetailsPage = (id) => {
    if (id) history.push(`/orders/view/?id=${id}`);
    else showError("order id is unavailable.");
  };

  const handleDownload = (e) => {
    e.preventDefault();
    const { hcp } = searchParams;
    const data = hcp ? { account_id: hcp } : null;

    setIsLoading(true);
    API.getMasterList(
      handleGetOrderListInCSVResponseObj,
      data,
      true,
      Constant.ORDER_LIST_CSV
    );
  };

  const moveToOrderAddPage = (e) => {
    e.preventDefault();
    history.push("/orders/add");
  };

  const handleGetOrderListInCSVResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      const fileUrl = response?.data?.file ?? "";
      if (fileUrl) downloadFile(fileUrl, "orders.xlsx");
      else showError("Excel file is unavailable.");
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => {},
  };

  const ordersHeaderTemplate = (
    <div className="table-header">
      <div className="clearfix">
        <h5 className="p-m-0 float-start">
          <CIcon icon={cilList} className="mr-1" />
          {CommonMaster.ORDERS}
          <CBadge color="danger" className="ms-auto">
            {totalRecords}
          </CBadge>
        </h5>

        <button
          type="button"
          onClick={handleDownload}
          style={{ float: "right" }}
          className="btn btn-primary mb-2 mr-2"
        >
          <CIcon icon={cilCloudDownload} className="mr-1" />
          Download CSV
        </button>

        <button
          type="button"
          style={{ float: "right" }}
          onClick={moveToOrderAddPage}
          className="btn btn-success mb-2 mr-2"
        >
          <CIcon icon={cilCart} size="sm" />
          &nbsp; Add Order
        </button>
      </div>

      <hr />
      <form
        name="filterFrm"
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
      >
        <div className="row">
          <CommonHcpInput
            hcpList={hcpList}
            hcpValue={searchParams.hcp}
            handleHcpChange={handleOrderSearchParamChange}
          />

          <div className="col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                name="number"
                className="form-control"
                value={searchParams.number}
                onChange={handleOrderSearchParamChange} // NOSONAR
              />
              <label>Order Number</label>
            </span>
          </div>

          <div className="col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                name="firstName"
                className="form-control"
                value={searchParams.firstName}
                onChange={handleOrderSearchParamChange} // NOSONAR
              />
              <label>First Name</label>
            </span>
          </div>

          <div className="col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                name="lastName"
                className="form-control"
                value={searchParams.lastName}
                onChange={handleOrderSearchParamChange} // NOSONAR
              />
              <label>Last Name</label>
            </span>
          </div>

          <div className="col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                name="sapId"
                className="form-control"
                value={searchParams.sapId}
                onChange={handleOrderSearchParamChange} // NOSONAR
              />
              <label>SAP Order Id</label>
            </span>
          </div>

          <div className="col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <Dropdown
                name="status"
                className="form-control"
                value={searchParams.status}
                options={orderStatusDirectory}
                onChange={handleOrderSearchParamChange}
              />
              <label>Status</label>
            </span>
          </div>

          <div className="col-md-12 col-lg-3 pb-3 search-reset">
            <CButton color="primary" className="mr-2" type="submit">
              Search
            </CButton>
            <CButton color="danger" onClick={resetParams}>
              Reset
            </CButton>
          </div>
        </div>
      </form>
    </div>
  );

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData?.patientName ?? Constant.NO_VALUE}
      </>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Date</span>
        {rowData?.date ?? Constant.NO_VALUE}
      </>
    );
  };

  const sapIdBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">SAP Order Id</span>
        {rowData?.sapId ?? Constant.NO_VALUE}
      </>
    );
  };

  const sapFinalOrderIdBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">SAP Order Id</span>
        {rowData?.sapFinalOid ?? Constant.NO_VALUE}
      </>
    );
  };

  const numberBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Order no.</span>
        {rowData?.number ?? Constant.NO_VALUE}
      </>
    );
  };

  const hcpNameBodyTemplate = (rowData) => {
    return <>{`${rowData?.hcpName ?? ""} (${rowData?.code ?? ""})`}</>;
  };

  const totalCostBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Total Cost (USD)</span>
        {Number(rowData?.totalCost ?? 0).toFixed(2)}
      </>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        {rowData?.status ?? Constant.NO_VALUE}
      </>
    );
  };

  const paymentStatusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Payment Status</span>
        {rowData?.paymentStatus ?? Constant.NO_VALUE}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Action</span>
        <a
          title="View"
          className="mr-2"
          onClick={() => {
            moveToDetailsPage(rowData.id);
          }}
        >
          <CIcon icon={cilBook} size="lg" />
        </a>
        &nbsp;
        <a
          title="Sync"
          className="mr-2 text-success"
          onClick={() => {
            syncOrder(rowData.id);
          }}
        >
          <CIcon icon={cilSync} size="lg" />
        </a>
        &nbsp;
        {(rowData?.status === "In Process" ||
          rowData?.status === "Pending") && (
          <a
            title="Cancel Order"
            className="mr-2 text-danger"
            onClick={() => openCancelModal(rowData.id)}
          >
            <CIcon icon={cilXCircle} size="lg" />
          </a>
        )}
      </>
    );
  };

  const applyFilters = (filters) => {
    const _filteredKeys = [];
    const data = {
      start: filters?.start ?? searchParams?.start ?? 0,
      length: filters?.length ?? searchParams?.length ?? Constant.DT_ROW,
    };

    const appliedFilters = !_.isEmpty(filters) ? filters : filterMap;

    for (const filterKey in appliedFilters) {
      const value = appliedFilters[filterKey];
      if (!isEmpty(value) && !defaultFilters.includes(filterKey)) {
        data[filterKey] = value;
        _filteredKeys.push(filterKey);
      }
    }

    if (_.isEmpty(filters)) {
      data["start"] = 0;
      setSearchParams({ ...searchParams, start: 0 });
    }

    setFilteredKeys([..._filteredKeys]);
    getOrderList(data);
  };

  function resetParams() {
    setSearchParams({ ...initialFilters });
    applyFilters(initialFilters);
  }

  const handlePageChange = (e) => {
    const paginatedParams = { start: e.first, length: e.rows };
    const filters = { ...paginatedParams };

    if (filteredKeys.length) {
      filteredKeys.forEach((filterKey) => {
        filters[filterKey] = filterMap[filterKey];
      });
    }

    setSearchParams({ ...searchParams, ...paginatedParams });
    applyFilters({ ...filters, ...paginatedParams });
  };

  const ordersFooterTemplate = (
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

  return (
    <>
      {isLoading && <Loader />}

      <div className="datatable-responsive-demo custom-react-table">
        <div className="card">
          <DataTable
            stripedRows
            showGridlines
            value={orderList}
            responsiveLayout="scroll"
            header={ordersHeaderTemplate}
            sortField={searchParams.sort_field}
            sortOrder={searchParams.sort_order}
            className="p-datatable-responsive-demo"
            footer={orderList?.length > 0 ? ordersFooterTemplate : <></>}
          >
            {adminRole === "SUPER_ADMIN" && (
              <Column header="HCP" field="hcpName" body={hcpNameBodyTemplate} /> // NOSONAR
            )}
            {
              <Column
                field="number"
                header="Number"
                body={numberBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="patientName"
                header="Patient"
                body={nameBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="sapId"
                header="SAP Order Id"
                body={sapIdBodyTemplate}
              /> /* NOSONAR */
            }
             {
              <Column
                field="sapFinalOid"
                header="SAP Final Order Id"
                body={sapFinalOrderIdBodyTemplate}
              />
            }
            {
              <Column
                field="totalCost"
                header="Cost (USD)"
                body={totalCostBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="date"
                header="Date"
                body={dateBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="status"
                header="Status"
                body={statusBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="paymentStatus"
                header="Payment status"
                body={paymentStatusBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="id"
                header="Action"
                body={actionBodyTemplate}
              /> /* NOSONAR */
            }
          </DataTable>
        </div>
      </div>
      {showCancelModal && (
        <CancelModal
          isVisible={showCancelModal}
          cancelId={selectedCancelId}
          onCloseCancelModal={closeCancelModal}
          apiType="orders"
        />
      )}
    </>
  );
};

export default Orders;
