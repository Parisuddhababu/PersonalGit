// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import CIcon from "@coreui/icons-react";
import { CBadge, CButton } from "@coreui/react";
import { API } from "../../../../services/Api";
import { Dropdown } from "primereact/dropdown";
import * as Constant from "../../../../shared/constant/constant";
import Loader from "../../common/loader/loader";
import { useToast } from "../../../../shared/toaster/Toaster";
import { Paginator } from "primereact/paginator";
import DeleteModal from '../../common/DeleteModalPopup/delete-modal'

import {
  cilBook,
  cilCheckCircle,
  cilList,
  cilPlus,
  cilXCircle,
  cilPencil,
  cilTrash
} from "@coreui/icons";
import { CommonMaster, Permission } from "src/shared/enum/enum";
import { useHistory } from "react-router-dom";
import permissionHandler from "src/shared/handler/permission-handler";
import { isEmpty } from "src/shared/handler/common-handler";
import HCPList from "./hcp-list";

const ProductGroupList = () => {
  let history = useHistory();
  const initialFilter = {
    start: 0,
    length: Constant.DT_ROW,
    sort_order: "",
    sort_field: "",
  };
  const [searchVal, setSearchVal] = useState(initialFilter);
  const [productGroupData, setProductGroupData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [associatedHcpList, setAssociatedHcpList] = useState([]);
  const [showHcpList, setShowHcpList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [deleteObj, setDeleteObj] = useState({})
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)

  const statusOption = Constant.STATUS_OPTION;

  const filterMap = {
    title: selectedTitle,
    is_active: selectedStatus.code,
  };

  useEffect(() => {
    if (searchVal) {
      const filters = {};

      if (filteredKeys.length) {
        filteredKeys.forEach((filterKey) => {
          filters[filterKey] = filterMap[filterKey];
        });
      }

      onFilterData(filters);
    }
  }, [searchVal]);

  const getProductGroupData = (formData) => {
    API.getMasterList(
      onProductGroupList,
      formData,
      true,
      Constant.PRODUCT_GROUP_LIST
    );
  };

  // onProductGroupList Response Data Method
  const onProductGroupList = {
    cancel: (c) => {},
    success: (response) => {
      if (response.meta.status_code === 200) {
        setIsLoading(false);
        setProductGroupData(response?.data?.original.data);
        setTotalRecords(response?.data?.original.recordsTotal);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => {},
  };

  const editData = (rowData) => {
    history.push(`/catalogue/edit/?id=${rowData._id}`);
  };
  const viewData = (rowData) => {
    history.push(`/catalogue/view/?id=${rowData._id}`);
  };
  const onStatusChange = (e) => {
    setSelectedStatus(e.value);
  };

  const onChangeTitle = (e) => {
    setSelectedTitle(e.target.value);
  };
  
  const confirmDeleteProduct = (data) => {
    let obj = { ...data }
    obj.urlName = CommonMaster.DELETE_CATELOGUE;
    obj._id = data._id
    setDeleteObj(obj)
    setIsDeleteModalShow(true);
}

const onCloseDeleteConfirmation = (value, isDelete, message) => {
  setIsDeleteModalShow(value)
  if (isDelete) {
      showSuccess(message)
      // Only one record on second page and delete then it should be come to previous page in all modules
      if (productGroupData.length === 1 && searchVal.start) {
          setSearchVal({ ...searchVal, start: parseInt(searchVal.start) - parseInt(searchVal.length) });
      } else {
          onFilterData()
      }
  }
}

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Action</span>
        {permissionHandler(Permission.CATALOGUE_UPDATE) && (
          <a title="View" className="mr-2" onClick={() => viewData(rowData)}>
            <CIcon icon={cilBook} size="lg" />
          </a>
        )}
        {permissionHandler(Permission.CATALOGUE_UPDATE) && (
          <a title="Edit" className="mr-2" onClick={() => editData(rowData)}>
            <CIcon icon={cilPencil} size="lg" />
          </a>
        )}
        {permissionHandler(Permission.CATALOGUE_DELETE) && (
          <button
            className="btn btn-link mr-2 text-danger"
            title="Delete"
            onClick={(e) => confirmDeleteProduct(rowData)}
          >
            <CIcon icon={cilTrash} size="lg" />
          </button>
        )}
      </React.Fragment>
    );
  };

  const onUpdateStatus = (rowData) => {
    let obj = {
      uuid: rowData._id,
      is_active:
        rowData.is_active === Constant.StatusEnum.active
          ? Constant.StatusEnum.inactive
          : Constant.StatusEnum.active,
    };

    setIsLoading(true);
    API.UpdateStatus(
      onUpdateStatusRes,
      obj,
      true,
      rowData._id,
      Constant.PRODUCT_GROUP_CHANGE_STATUS
    );
  };

  // onUpdateStatusRes Response Data Method
  const onUpdateStatusRes = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);

      if (response?.meta?.status) {
        if (response?.meta?.message) showSuccess(response.meta.message);
        const { uuid } = response?.data ?? {};

        if (uuid) {
          let _productGroupData = productGroupData;
          const productGroupIndex = _productGroupData.findIndex(
            (productGroupObj) => productGroupObj?._id === uuid
          );
          _productGroupData[productGroupIndex]["is_active"] =
            _productGroupData[productGroupIndex]["is_active"] === 1 ? 0 : 1;
          setProductGroupData([..._productGroupData]);
        } else {
          onFilterData();
        }
      }
    },
    error: (err) => {
      setIsLoading(false);
      if (err?.meta?.message) showError(err.meta.message);
    },
    complete: () => {},
  };

  const header = (
    <div className="table-header">
      <div className="clearfix">
        <h5 className="p-m-0 float-start">
          <CIcon icon={cilList} className="mr-1" /> {CommonMaster.CATALOGUE}{" "}
          <CBadge color="danger" className="ms-auto">
            {totalRecords}
          </CBadge>
        </h5>
        <div className="float-end">
          {permissionHandler(Permission.CATALOGUE_CREATE) && (
            <div className="common-add-btn">
              <CButton
                color="primary"
                onClick={() => {
                  history.push("/catalogue/add");
                }}
              >
                {" "}
                {/* NOSONAR */}
                <CIcon icon={cilPlus} className="mr-1" />
                Add Catalogue
              </CButton>
            </div>
          )}
        </div>
      </div>

      <hr />
      <form name="filterFrm" onSubmit={(e) => setGlobalFilter(e)}>
        <div className="row">
          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                className="form-control"
                value={selectedTitle}
                name="title"
                onChange={(e) => onChangeTitle(e)}
              />
              <label>Title </label>
            </span>
          </div>

          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <Dropdown
                className="form-control"
                value={selectedStatus}
                options={statusOption}
                onChange={onStatusChange}
                optionLabel="name"
              />
              <label>Status </label>
            </span>
          </div>

          <div className="col-md-12 col-lg-3 pb-3 search-reset">
            <CButton color="primary" className="mr-2" type="submit">
              Search
            </CButton>
            <CButton color="danger" onClick={(e) => resetGlobalFilter(e)}>
              Reset
            </CButton>
          </div>
        </div>
      </form>
    </div>
  );

  const catalogueStatusTemplate = (rowData) => {
    const styling = rowData?.is_active ? "text-success" : "text-danger";
    const iconStyle = rowData?.is_active ? cilCheckCircle : cilXCircle;

    return (
      <button
        title="Change Status"
        className={`btn btn-link ${styling}`}
        onClick={() => {
          onUpdateStatus(rowData);
        }}
      >
        <CIcon icon={iconStyle} size="lg" />
      </button>
    );
  };

  const titleBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Title</span>
        {rowData.title}
      </React.Fragment>
    );
  };

  const openHcpList = (e, hcpList) => {
    e.preventDefault();
    setShowHcpList(true);
    setAssociatedHcpList(hcpList);
  };

  const closeHcpList = (e) => {
    e.preventDefault();
    setShowHcpList(false);
    setAssociatedHcpList([]);
  };

  const accountBodyTemplate = (rowData) => {
    const accounts = rowData?.account ?? [];
    const accountNames = accounts
      .map((account) => account.company_name)
      .join(",");
    const slicedAccountNames = accountNames.slice(0, 40);

    return (
      <>
        <span className="p-column-title">HCP</span>
        {slicedAccountNames ?? Constant.NO_VALUE}
        {accountNames.length > slicedAccountNames.length && (
          <p
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              openHcpList(e, accountNames.split(","));
            }}
          >
            &nbsp;&nbsp;
            <span style={{ color: "blue", textDecoration: "underline" }}>
              Read more
            </span>
          </p>
        )}
      </>
    );
  };

  const setGlobalFilter = (event) => {
    event.preventDefault();
    onFilterData();
  };

  const onFilterData = (filters) => {
    const { start, length, sort_field, sort_order } = searchVal;
    const data = { start, length },
      _filteredKeys = [];

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

    setFilteredKeys([..._filteredKeys]);
    getProductGroupData(data);
  };

  const resetGlobalFilter = (e) => {
    setSelectedTitle("");
    setSelectedStatus("");
    setSearchVal(initialFilter);
  };

  const onPageChange = (e) => {
    setSearchVal({ ...searchVal, length: e.rows });
    if (searchVal.start !== e.first) {
      setSearchVal({ ...searchVal, start: e.first });
    }
  };

  const footer = (
    <div className="table-footer">
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
  );

  const onSort = (e) => {
    if (e.sortField) {
      setSearchVal({
        ...searchVal,
        sort_field: e.sortField,
        sort_order: e.sortOrder,
      });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="datatable-responsive-demo  custom-react-table">
        <div className="card">
          <DataTable
            value={productGroupData}
            stripedRows
            className="p-datatable-responsive-demo"
            header={header}
            footer={productGroupData?.length > 0 ? footer : ""}
            showGridlines
            responsiveLayout="scroll"
            sortField={searchVal.sort_field}
            sortOrder={searchVal.sort_order}
            onSort={(e) => onSort(e)}
          >
            <Column
              field="title"
              header="Title"
              body={titleBodyTemplate}
            ></Column>
            {
              <Column
                field="account"
                header="HCP"
                body={accountBodyTemplate}
              /> /* NOSONAR */
            }
            {permissionHandler(Permission.CATALOGUE_STATUS) && (
              <Column
                field="status"
                header="Status"
                body={catalogueStatusTemplate}
              ></Column>
            )}
            {(permissionHandler(Permission.CATALOGUE_UPDATE) ||
              permissionHandler(Permission.CATALOGUE_DELETE)) && (
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
                className="action-class"
              ></Column>
            )}
          </DataTable>
        </div>
      </div>
      {showHcpList && (
        <HCPList handleCloseList={closeHcpList} hcpList={associatedHcpList} />
      )}{" "}
      {/* NOSONAR */}
      <DeleteModal visible={isDeleteModalShow} onCloseDeleteModal={onCloseDeleteConfirmation} deleteObj={deleteObj} name="Our Products" />

      </>
  );
};

export default ProductGroupList;
