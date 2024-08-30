// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CIcon from "@coreui/icons-react";
import { CBadge, CButton } from "@coreui/react";
import DeleteModal from "../../common/DeleteModalPopup/delete-modal";
import { API } from "../../../../services/Api";
import { Dropdown } from "primereact/dropdown";
import * as Constant from "../../../../shared/constant/constant";
import ImageModal from "../../common/ImageModalPopup/image-modal";
import { useHistory } from "react-router-dom";

import {
  cilCheckCircle,
  cilList,
  cilPencil,
  cilXCircle,
  cilPlus,
  cilTrash,
} from "@coreui/icons";
import Loader from "../../common/loader/loader";
import { useToast } from "../../../../shared/toaster/Toaster";
import { Paginator } from "primereact/paginator";
import { CommonMaster, Permission } from "src/shared/enum/enum";
import permissionHandler from "src/shared/handler/permission-handler";
import { isEmpty } from "src/shared/handler/common-handler";

const OwnerMessages = () => {
  const adminRole = JSON.parse(localStorage.getItem('user_details'))?.role?.code;
  let history = useHistory();

  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const initialFilter = {
    start: 0,
    length: Constant.DT_ROW,
    sort_order: "",
    sort_field: "",
    status: "",
  };

  const [searchVal, setSearchVal] = useState(initialFilter);
  const [deleteObj, setDeleteObj] = useState({});
  const [ownerMessageData, setOwnerMessageData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isImageShow, setIsImageShow] = useState(false);
  const [imageObj, setImageObj] = useState({});
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredKeys, setFilteredKeys] = useState([]);

  const statusOption = Constant.STATUS_OPTION;

  const filterMap = { is_active: selectedStatus.code };

  useEffect(() => {
    getAccountData();
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
  }, [searchVal]);

  const getAccountData = () => {
    if (adminRole === "SUPER_ADMIN") {
      setIsLoading(true);
      API.getMasterList(accountRes, null, true, Constant.ACCOUNT_LIST);
    }
  };

  // accountRes Response Data Method
  const accountRes = {
    cancel: (c) => { },
    success: (response) => {
      if (response?.data?.original?.data?.length > 0) {
        let resVal = response.data.original.data;
        setAccountData(resVal);
        setIsLoading(false);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => { },
  };

  const onAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  const getOwnerMessageData = (formData) => {
    setIsLoading(true);
    API.getMasterList(onFaqList, formData, true, Constant.OWNER_MESSAGES_LIST);
  };

  // onFaqList Response Data Method
  const onFaqList = {
    cancel: (c) => { },
    success: (response) => {
      if (response.meta.status_code === 200) {
        setOwnerMessageData(response?.data?.original?.data);
        setTotalRecords(response?.data?.original.recordsTotal);

        setIsLoading(false);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => { },
  };

  const editData = (rowData) => {
    history.push(`/owner-messages/edit/?id=${rowData._id}`);
  };

  const onStatusChange = (e) => {
    setSelectedStatus(e.value);
  };

  const confirmDeleteOwnerMessage = (data) => {
    let obj = { ...data };
    obj.name = data.owner_name;
    obj.urlName = CommonMaster.OWNER_MESSAGES;
    setDeleteObj(obj);
    setIsDeleteModalShow(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Action</span>
        {permissionHandler(Permission.OWNER_MESSAGE_UPDATE) && (
          <a title="Edit" className="mr-2" onClick={() => editData(rowData)}>
            <CIcon icon={cilPencil} size="lg" />
          </a>
        )}
        {permissionHandler(Permission.OWNER_MESSAGE_DELETE) && (
          <button
            className="btn btn-link mr-2 text-danger"
            title="Delete"
            onClick={() => confirmDeleteOwnerMessage(rowData)}
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
    API.UpdateStatus(
      onUpdateStatusRes,
      obj,
      true,
      rowData._id,
      Constant.OWNER_MESSAFE_CHANGE_STATUS
    );
  };

  const onUpdateStatusRes = {
    cancel: () => { },
    success: response => {
      setIsLoading(false);

      if (response?.meta?.status) {
        if (response?.meta?.message) showSuccess(response.meta.message);
        const { uuid } = response?.data ?? {};

        if (uuid) {
          let _ownerMessageData = ownerMessageData;
          const ownerIndex = _ownerMessageData.findIndex(ownerData => ownerData?._id === uuid);
          _ownerMessageData[ownerIndex]["is_active"] = _ownerMessageData[ownerIndex]["is_active"] === 1 ? 0 : 1;
          setOwnerMessageData([..._ownerMessageData]);
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
  };

  const accountDataTemplate = option => {
    return (
      <>{`${option?.company_name ?? ''} (${option?.code ?? ''})`}</>
    )
  }

  const header = (
    <div className="table-header">
      <div className="clearfix">
        <h5 className="p-m-0 float-start">
          <CIcon icon={cilList} className="mr-1" />
          {CommonMaster.OWNER_MESSAGES}{" "}
          <CBadge color="danger" className="ms-auto">
            {totalRecords}
          </CBadge>
        </h5>
        {permissionHandler(Permission.OWNER_MESSAGE_CREATE) && (
          <div className="float-end">
            <div className="common-add-btn">
              <CButton
                color="primary"
                onClick={() => {
                  history.push(`owner-messages/add`);
                }}
              >
                <CIcon icon={cilPlus} className="mr-1" />
                Add Owner Messages
              </CButton>
            </div>
          </div>
        )}
      </div>

      <hr />
      <form name="filterFrm" onSubmit={(e) => setGlobalFilter(e)}>
        <div className="row">
          {adminRole === 'SUPER_ADMIN' && (
            <div className="col-md-6 col-lg-3 pb-3">
              <span className="p-float-label custom-p-float-label">
                <Dropdown
                  value={selectedAccount}
                  className="form-control"
                  options={accountData}
                  onChange={onAccountChange}
                  itemTemplate={accountDataTemplate}
                  valueTemplate={accountDataTemplate}
                  optionLabel="company_name"
                  optionValue="_id"
                  filter
                  filterBy="company_name,code"
                />
                <label>HCP</label>
              </span>
            </div>
          )}
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
            <CButton color="danger" onClick={() => resetGlobalFilter()}>
              Reset
            </CButton>
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

          <button
            className="btn btn-link text-success"
            title="Change Status"
            onClick={() => onUpdateStatus(rowData)}
          >
            <CIcon icon={cilCheckCircle} size="lg" />
          </button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <span className="p-column-title">Status</span>

          <button
            className="btn btn-link text-danger"
            title="Change Status"
            onClick={() => onUpdateStatus(rowData)}
          >
            <CIcon icon={cilXCircle} size="lg" />
          </button>
        </React.Fragment>
      );
    }
  };

  const accountBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Account</span>
        {rowData.account?.account_name || Constant.NO_VALUE}
      </React.Fragment>
    );
  };

  const designationBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Designation</span>
        {rowData?.owner_designation || Constant.NO_VALUE}
      </React.Fragment>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Name</span>
        {rowData.owner_name}
      </React.Fragment>
    );
  };

  const onCloseDeleteConfirmation = (value, isDelete, message) => {
    setIsDeleteModalShow(value);
    if (isDelete) {
      showSuccess(message);
      if (ownerMessageData.length === 1 && searchVal.start) {
        setSearchVal({
          ...searchVal,
          start: parseInt(searchVal.start) - parseInt(searchVal.length),
        });
      } else {
        onFilterData();
      }
    }
  };

  const setGlobalFilter = (event) => {
    event.preventDefault();
    onFilterData();
  };

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

    if (selectedAccount) data["account_id"] = selectedAccount;

    setFilteredKeys([..._filteredKeys]);
    getOwnerMessageData(data);
  };

  const resetGlobalFilter = () => {
    setSelectedStatus("");
    setSelectedAccount(localStorage.getItem("account_id"));
    setSearchVal(initialFilter);
  };

  const onImageClick = (e, rowdata) => {
    setImageObj(rowdata?.owner_image);
    setIsImageShow(true);
  };

  const onCloseImageModal = () => {
    setIsImageShow(false);
  };

  const imageBodyTemplate = (rowData) => {
    return rowData?.owner_image ? (
      <img
        src={rowData?.owner_image?.path}
        onError={(e) => (e.target.src = Constant.PRIME_URL)}
        alt={rowData.owner_image}
        className="product-image"
        onClick={(e) => onImageClick(e, rowData)}
      />
    ) : (
      ""
    );
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

      <div className="datatable-responsive-demo custom-react-table">
        <div className="card">
          <DataTable
            value={ownerMessageData}
            stripedRows
            className="p-datatable-responsive-demo"
            header={header}
            footer={ownerMessageData?.length > 0 ? footer : ""}
            showGridlines
            responsiveLayout="scroll"
            sortField={searchVal.sort_field}
            sortOrder={searchVal.sort_order}
            onSort={(e) => onSort(e)}
          >
            <Column
              field="image"
              header="Image"
              body={imageBodyTemplate}
              className="text-center"
            ></Column>
            <Column
              field="account"
              header="Account"
              body={accountBodyTemplate}
            ></Column>
            <Column
              field="owner_name"
              sortable
              header="Name"
              body={nameBodyTemplate}
            ></Column>
            <Column
              field="owner_designation"
              sortable
              header="Designation"
              body={designationBodyTemplate}
            ></Column>
            {permissionHandler(Permission.OWNER_MESSAGE_STATUS) && (
              <Column
                field="status"
                header="Status"
                body={statusBodyTemplate}
              ></Column>
            )}
            {(permissionHandler(Permission.OWNER_MESSAGE_UPDATE) ||
              permissionHandler(Permission.OWNER_MESSAGE_DELETE)) && (
                <Column
                  field="action"
                  header="Action"
                  body={actionBodyTemplate}
                ></Column>
              )}
          </DataTable>
        </div>
      </div>
      <DeleteModal
        visible={isDeleteModalShow}
        onCloseDeleteModal={onCloseDeleteConfirmation}
        deleteObj={deleteObj}
        name={CommonMaster.OWNER_MESSAGES}
      />
      <ImageModal
        visible={isImageShow}
        imgObj={imageObj}
        onCloseImageModal={onCloseImageModal}
      />
    </>
  );
};

export default OwnerMessages;
