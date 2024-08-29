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
import ImageModal from "../../common/ImageModalPopup/image-modal";
import Loader from "../../common/loader/loader";
import { Paginator } from "primereact/paginator";
import {
  cilBook,
  cilCheckCircle,
  cilList,
  cilSync,
  cilXCircle,
  cilReload,
} from "@coreui/icons";
import { Permission } from "src/shared/enum/enum";
import { useToast } from "../../../../shared/toaster/Toaster";
import { useHistory } from "react-router-dom";
import permissionHandler from "src/shared/handler/permission-handler";
import { isEmpty } from "src/shared/handler/common-handler";
import SyncConfirm from "../sync-confirm";

const CategoryList = (props) => {
  let history = useHistory();
  const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role
    ?.code;

  const initialFilter = {
    start: 0,
    length: Constant.DT_ROW,
    sort_order: "",
    sort_field: "",
  };
  const [selectedMicrositeStatus, setSelectedMicrositeStatus] = useState("");
  const [searchVal, setSearchVal] = useState(initialFilter);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isImageShow, setIsImageShow] = useState(false);
  const [imageObj] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [totalRecords, setTotalRecords] = useState(0);

  const [templateList, setTempalateList] = useState("");
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [categoryTypeList, setCategorytypeList] = useState("");
  const [categorytypeData, setCategorytypeData] = useState([]);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const statusOption = Constant.STATUS_OPTION;

  const filterMap = {
    name: selectedTitle,
    category_type: categoryTypeList,
    template: templateList,
    is_active: selectedStatus.code,
    microsite_status: selectedMicrositeStatus.code,
  };

  useEffect(() => {
    GetCategoryType();
  }, []);

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

  const getCategoryData = (formData) => {
    setIsLoading(true);
    API.getMasterList(onFaqList, formData, true, Constant.GETCATEGORY);
  };

  const GetCategoryType = () => {
    if (permissionHandler(Permission.CATEGORY_TYPE_LIST)) {
      setIsLoading(true);
      API.getActiveDataList(
        Constant.CATEGORY_TYPE_ACTIVE,
        getCategoryTyperes,
        "",
        true
      );
    }
  };

  const getCategoryTyperes = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      let _categoryTypeData = [];
      if (response?.meta?.status) _categoryTypeData = response.data;
      setCategorytypeData([..._categoryTypeData]);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
    },
    complete: () => {},
  };

  const onFaqList = {
    cancel: (c) => {},
    success: (response) => {
      if (response.meta.status_code === 200) {
        setCategoryData(response?.data?.original?.data);
        setTotalRecords(response?.data?.original.recordsTotal);

        setIsLoading(false);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => {},
  };

  const editData = (rowData) => {
    history.push(
      `/${getRouterName()}/edit/?id=${rowData._id}&&type=${props.type}`
    );
  };

  const onStatusChange = (e) => {
    setSelectedStatus(e.value);
  };

  const onChangeTitle = (e) => {
    setSelectedTitle(e.target.value);
  };

  const changeStatus = (data) => {
    const { _id: id, microsite_status: isActive } = data;
    if (id) {
      setIsLoading(true);
      const payload = { uuid: id, microsite_status: isActive ? 0 : 1 };
      API.UpdateStatus(
        handleChangeStatusResponseObj,
        payload,
        true,
        id,
        Constant.CATEGORY_CHANGE_STATUS
      );
    }
  };

  const handleChangeStatusResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.message) showSuccess(response.meta.message);
      onFilterData();
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      if (err?.meta?.message) showError(err.meta.message);
    },
    complete: () => {},
  };

  const onMicrositeStatusChange = (e) => {
    setSelectedMicrositeStatus(e.value);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {permissionHandler(Permission.CATEGORY_UPDATE) && (
          <a title="View" className="mr-2" onClick={() => editData(rowData)}>
            <CIcon icon={cilBook} size="lg" />
          </a>
        )}

        {adminRole === "SUPER_ADMIN" && rowData?.entity_id && (
          <button
            title="Sync"
            className="btn btn-link mr-2 text-warning"
            onClick={() => {
              openCategorySyncConfirm(rowData);
            }}
          >
            <CIcon icon={cilSync} size="lg" />
          </button>
        )}
      </React.Fragment>
    );
  };

  const onDropdownChangeAddress = (e, key) => {
    if (key === "template") setTempalateList(e.target.value);
    if (key == "category_type") setCategorytypeList(e.target.value);
  };

  const header = (
    <div className="table-header">
      <div className="clearfix">
        <h5 className="p-m-0 float-start">
          <CIcon icon={cilList} className="mr-1" />
          {props.headerName}
          <CBadge color="danger" className="ms-auto">
            {totalRecords}
          </CBadge>
        </h5>
        <div className="float-end">
          <div className="common-add-btn m-3">
            {
              <CButton
                color="primary"
                disabled={selectedCategory?.length === 0}
                onClick={() => {
                  if (selectedCategory?.length) changeSelectedCategoryStatus(0);
                }}
              >
                Mark As InActive
              </CButton>
            }
          </div>
          <div className="common-add-btn m-3">
            {
              <CButton
                color="primary"
                disabled={selectedCategory?.length === 0}
                onClick={() => {
                  if (selectedCategory?.length) changeSelectedCategoryStatus(1);
                }}
              >
                 Mark As Active
              </CButton>
            }
          </div>
        </div>
      </div>
      <hr />
      <form name="filterFrm" onSubmit={(e) => setGlobalFilter(e)}>
        <div className="row">
          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                className="form-control"
                maxLength="255"
                value={selectedTitle}
                name="name"
                onChange={(e) => onChangeTitle(e)}
              />
              <label>Name </label>
            </span>
          </div>
          {props.type == "1" &&
            permissionHandler(Permission.CATEGORY_TYPE_LIST) && (
              <div className="col-md-6 col-lg-3 mb-3">
                <span className="p-float-label custom-p-float-label">
                  <Dropdown
                    value={categoryTypeList}
                    className="form-control"
                    options={categorytypeData}
                    onChange={(e) =>
                      onDropdownChangeAddress(e, "category_type")
                    }
                    optionLabel="name"
                    optionValue="_id"
                    filter
                    filterBy="name"
                  />
                  <label>Category Type</label>
                </span>
              </div>
            )}
          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <Dropdown
                optionLabel="name"
                value={selectedStatus}
                options={statusOption}
                className="form-control"
                onChange={onStatusChange}
              />
              <label>Magento Status</label>
            </span>
          </div>

          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <Dropdown
                optionLabel="name"
                name="micrositeStatus"
                options={statusOption}
                className="form-control"
                onChange={onMicrositeStatusChange} // NOSONAR
                value={selectedMicrositeStatus}
              />
              <label>Microsite Status</label>
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

  const magentoStatusBodyTemplate = (rowData) => {
    return (
      <CBadge
        className="ms-auto"
        style={{ fontSize: "15px" }}
        color={rowData.is_active === 1 ? "success" : "danger"}
      >
        {rowData.is_active === 1 ? "Active" : "Inactive"}
      </CBadge>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const styling = rowData?.microsite_status ? "text-success" : "text-danger";
    const iconStyle = rowData?.microsite_status ? cilCheckCircle : cilXCircle;

    return (
      <button
        className={`btn btn-link ${styling}`}
        title="Change Status"
        onClick={() => {
          changeStatus(rowData);
        }}
      >
        <CIcon icon={iconStyle} size="lg" />
      </button>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return <React.Fragment>{rowData.name}</React.Fragment>;
  };

  const categoryTypeBodyTemplate = (rowData) => {
    return rowData?.category_type?.name ?? Constant.NO_VALUE;
  };

  const setGlobalFilter = (event) => {
    event.preventDefault();
    onFilterData();
  };

  const getRouterName = () => {
    switch (props.type) {
      case 1:
        return "category";
      case 2:
        return "collection";
      case 3:
        return "style";
    }
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
      if (filterKey === "category_type" && value) {
        const categoryTypeObj = categorytypeData?.find(
          (categoryType) => categoryType._id === value
        );
        const parentId = categoryTypeObj?.entity_id ?? "";
        if (parentId) data["parent_id"] = parentId;
      } else if (!isEmpty(value)) {
        data[filterKey] = value;
        _filteredKeys.push(filterKey);
      }
    }

    data["child"] = 0;

    if (!filters) {
      data["start"] = 0;
      setSearchVal({ ...searchVal, start: 0 });
    }

    setFilteredKeys([..._filteredKeys]);
    getCategoryData(data);
  };

  const resetGlobalFilter = () => {
    setSelectedStatus("");
    setSelectedTitle("");
    setCategorytypeList("");
    setTempalateList("");
    setSelectedMicrositeStatus("");
    setSearchVal(initialFilter);
  };

  const onCloseImageModal = () => {
    setIsImageShow(false);
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

  function openCategorySyncConfirm(data) {
    const { name, entity_id: id } = data;
    setSelectedCategoryData({ name, id });
    setShowSyncConfirm(true);
  }

  const handleCloseSyncConfirm = () => {
    setShowSyncConfirm(false);
    setSelectedCategoryData(null);
  };

  const handleCategoryTypeSync = () => {
    setShowSyncConfirm(false);
    const { id } = selectedCategoryData;

    setIsLoading(true);
    API.getMasterList(
      handleCategorySyncResponseObj,
      null,
      true,
      `${Constant.CATEGORY_SYNC}/${id}`
    );
    setSelectedCategoryData(null);
  };

  const handleCategorySyncResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      const { status, message } = response?.meta ?? {};
      if (status && message) showSuccess(message);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      if (err?.meta?.message) showError(err.meta.message);
    },
    complete: () => {},
  };
  const onselectRow = (e) => {
    setSelectedCategory(e.value);
  };

  const accountStatusChange = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.message) {
        showSuccess(response?.meta?.message);
        setSelectedCategory([]);
        onFilterData();
      }
    },
    error: (error) => {
      setIsLoading(false);
      showError(
        error?.meta?.message ?? "something went wrong status not updated"
      );
    },
    complete: () => {},
  };
  const changeSelectedCategoryStatus = (status) => {
    setIsLoading(true);
    const categoryIdArray = selectedCategory?.map(
      (category) => category?._id ?? ""
    );
    const alreadyInDesiredStatus = selectedCategory.every(
      (category) => category?.microsite_status === status
    );
  
    if (alreadyInDesiredStatus) {
      setIsLoading(false);
      showError("Selected categories are already in the desired status");
      return;
    }
    const requestData = {
      data: categoryIdArray,
      microsite_status: status,
    };
    API.putData(
      accountStatusChange,
      requestData,
      true,
      Constant.CHANGE_MULTIPLE_CATEGORY_STATUS
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="datatable-responsive-demo custom-react-table category">
        <div className="card">
          <DataTable
            stripedRows
            showGridlines
            onSort={onSort} // NOSONAR
            header={header}
            value={categoryData}
            responsiveLayout="scroll"
            sortField={searchVal.sort_field}
            sortOrder={searchVal.sort_order}
            className="p-datatable-responsive-demo"
            footer={categoryData?.length > 0 ? footer : ""}
            onSelectionChange={(e) => onselectRow(e)}
            selectionMode="checkbox"
            selection={selectedCategory}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            {
              <Column
                field="name"
                header="Name"
                body={nameBodyTemplate}
              /> /* NOSONAR */
            }
            {props.type == "1" && (
              <Column
                field="name"
                header="Category Type"
                body={categoryTypeBodyTemplate}
              /> // NOSONAR
            )}
            {permissionHandler(Permission.CATEGORY_STATUS) && (
              <Column
                field="status"
                header="Magento Status"
                body={magentoStatusBodyTemplate}
              /> // NOSONAR
            )}
            {permissionHandler(Permission.CATEGORY_STATUS) && (
              <Column
                field="is_active"
                header="Microsite Status"
                body={statusBodyTemplate}
              /> // NOSONAR
            )}
            {permissionHandler(Permission.CATEGORY_UPDATE) && (
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              /> // NOSONAR
            )}
          </DataTable>
        </div>
      </div>

      <ImageModal
        visible={isImageShow}
        imgObj={imageObj}
        onCloseImageModal={onCloseImageModal}
      />

      {showSyncConfirm && selectedCategoryData && (
        <SyncConfirm
          name={selectedCategoryData?.name}
          syncAction={handleCategoryTypeSync} // NOSONAR
          handleClose={handleCloseSyncConfirm} // NOSONAR
        />
      )}
    </>
  );
};

export default CategoryList;
