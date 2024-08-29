// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import CIcon from "@coreui/icons-react";
import { CBadge, CButton } from "@coreui/react";
import DeleteModal from "../common/DeleteModalPopup/delete-modal";
import { API } from "../../../services/Api";
import { Dropdown } from "primereact/dropdown";
import * as Constant from "../../../shared/constant/constant";
import ImageModal from "../common/ImageModalPopup/image-modal";
import Loader from "../common/loader/loader";
import { Tooltip } from "primereact/tooltip";
import {
  cilCheckCircle,
  cilList,
  cilPencil,
  cilXCircle,
  cilReload,
} from "@coreui/icons";
import { Permission } from "src/shared/enum/enum";
import { useToast } from "../../../shared/toaster/Toaster";
import { Paginator } from "primereact/paginator";
import { useHistory, useLocation } from "react-router-dom";
import permissionHandler from "src/shared/handler/permission-handler";
import {
  TextTruncate,
  isEmpty,
  prescriptionStatusDirectory,
} from "src/shared/handler/common-handler";

const ProductList = () => {
  const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role
    ?.code;
  const primaryAccountId = localStorage.getItem("account_id");
  const accountRef = useRef(null);

  let history = useHistory();
  const search = useLocation().search;
  const status = new URLSearchParams(search).get("status");
  const initialFilter = {
    start: 0,
    length: Constant.DT_ROW,
    sort_order: "",
    sort_field: "",
  };

  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [searchVal, setSearchVal] = useState(initialFilter);
  const [deleteObj] = useState({});
  const [productData, setProductData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(
    status ? Constant.STATUS_OPTION[0] : ""
  ); // Get dashboard active data
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [selectedProductLabel, setSelectedProductLabel] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [deleteDataArr, setDeleteDataArr] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(
    adminRole !== "SUPER_ADMIN" ? primaryAccountId : ""
  );
  const [accountData, setAccountData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [isImageShow, setIsImageShow] = useState(false);
  const [imageObj] = useState({});
  const [cateogryValue, setCateogryList] = useState("");
  const [cateogryListData, setCategoryListData] = useState([]);

  const statusOption = Constant.STATUS_OPTION;
  const [totalRecords, setTotalRecords] = useState(0);

  const filterMap = {
    sku: selectedSku,
    name: selectedTitle,
    category_ids: cateogryValue,
    is_active: selectedStatus.code,
    is_prescribed: selectedProductLabel,
    account_id:
      adminRole === "SUPER_ADMIN" ? selectedAccount : primaryAccountId,
  };

  useEffect(() => {
    getAccountData();
    getCategoryData();
    if (adminRole !== "SUPER_ADMIN") onFilterData();
  }, []);

  const getCategoryData = () => {
    setIsLoading(true);
    const data = { type: 2 };
    API.getMasterList(onCategoryList, data, true, Constant.ACTIVE_CATEGORY);
  };

  const onCategoryList = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response.meta.status_code === 200) {
        setCategoryListData(response?.data);
      }
    },
    error: (err) => {
      setIsLoading(false);
      console.log(err);
      setCategoryListData([]);
    },
    complete: () => {},
  };

  const getProductData = (formData) => {
    setIsLoading(true);
    API.getMasterList(onProductList, formData, true, Constant.PRODUCT_LIST);
  };

  const getAccountData = () => {
    if (adminRole === "SUPER_ADMIN")
      API.getMasterList(accountRes, null, true, Constant.ACCOUNT_LIST);
  };

  const accountRes = {
    cancel: (c) => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.data?.original?.data?.length > 0) {
        let resVal = response.data.original.data;
        setAccountData(resVal);
      }
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
    },
    complete: () => {},
  };

  const onAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };

  const onProductList = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response?.meta?.status) {
        setProductData(response?.data?.original?.data ?? []);
        setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
      }
    },
    error: (error) => {
      console.log(error);
      setIsLoading(false);
      setProductData([]);
      setTotalRecords(0);
    },
    complete: () => {},
  };

  const editData = (rowData) => {
    const id = rowData?.website_product_detail?.[0]?._id ?? "";
    if (id) history.push(`/product/edit/?id=${id}`);
    else showError("product id is unavailable.");
  };

  const onStatusChange = (e) => {
    setSelectedStatus(e.value);
  };

  const onChangeTitle = (e) => {
    setSelectedTitle(e.target.value);
  };

  const onChangeSku = (e) => {
    setSelectedSku(e.target.value);
  };

  const syncAccount = (data) => {
    setIsLoading(true);
    const requestData = {
      account_id: selectedAccount,
      product_id: [data.website_product_detail?.[0]?._id],
    };
    API.addMaster(accountSync, requestData, true, Constant.PRODUCT_SINGLE_SYNC);
  };

  const accountSync = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response.meta.status_code === 201) {
        showSuccess(response.meta.message);
      }
    },
    error: (error) => {
      setIsLoading(false);
      showError(error?.meta?.message);
    },
    complete: () => {},
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Action</span>
        {permissionHandler(Permission.PRODUCT_UPDATE) && (
          <a title="Edit" className="mr-2" onClick={() => editData(rowData)}>
            <CIcon icon={cilPencil} size="lg" />
          </a>
        )}
        {permissionHandler(Permission.PRODUCT_SYNC) && (
          <button
            className="btn btn-link mr-2 text-danger"
            title="Sync"
            onClick={() => syncAccount(rowData)}
          >
            <CIcon icon={cilReload} size="lg" />
          </button>
        )}
      </React.Fragment>
    );
  };

  const onUpdateStatus = (rowData) => {
    let obj = {
      uuid: rowData?.website_product_detail?.[0]?._id ?? "",
      is_active:
        rowData?.website_product_detail?.[0]?.is_active ===
        Constant.StatusEnum.active
          ? Constant.StatusEnum.inactive
          : Constant.StatusEnum.active,
    };

    setIsLoading(true);
    API.UpdateStatus(
      onUpdateStatusRes,
      obj,
      true,
      rowData._id,
      Constant.PRODUCT_STATUS
    );
  };

  const onUpdateStatusRes = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);

      if (response?.meta?.status) {
        if (response?.meta?.message) showSuccess(response.meta.message);
        if (productData.length === 1 && searchVal.start) {
          const paginatedFilters = {
            start: parseInt(searchVal.start) - parseInt(searchVal.length),
          };
          setSearchVal({ ...searchVal, ...paginatedFilters });
          onFilterData({ ...filterMap, ...paginatedFilters });
        } else {
          onFilterData(filterMap);
        }
      }
    },
    error: (err) => {
      setIsLoading(false);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => {},
  };

  const handleCategoryChange = (e, key) => {
    if (key === "category") setCateogryList(e.target.value);
  };

  const syncSelectedProducts = () => {
    setIsLoading(true);
    const productIdArray = selectedProduct.map(
      (product) => product?.website_product_detail?.[0]?._id ?? ""
    );
    const requestData = {
      product_id: productIdArray,
      account_id: selectedAccount,
    };
    API.addMaster(accountSync, requestData, true, Constant.PRODUCT_SINGLE_SYNC);
  };

  const accountStatusChange = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      if (response.meta.status_code === 200) {
        showSuccess(response.meta.message);
        setSelectedProduct([]);
        onFilterData();
      }
    },
    error: (error) => {
      setIsLoading(false);
      console.log(error);
    },
    complete: () => {},
  };
  const selectedChangeStatusProducts = (status) => {
    setIsLoading(true);
    const productIdArray = selectedProduct?.map(
      (product) => product?.website_product_detail?.[0]?._id ?? ""
    );
    const alreadyInDesiredStatus = selectedProduct.every(
      (product) => product?.website_product_detail?.[0]?.is_active === status
    );
    if (alreadyInDesiredStatus) {
      setIsLoading(false);
      showError("Selected Products are already in the desired status");
      return;
    }
    const requestData = {
      data: productIdArray,
      account_id: selectedAccount,
      is_active: status,
    };
    API.putData(
      accountStatusChange,
      requestData,
      true,
      Constant.CHANGE_MULTIPLE_PRODUCTS_STATUS
    );
  };
  const accountDataTemplate = (option) => {
    return <>{`${option?.company_name ?? ""} (${option?.code ?? ""})`}</>;
  };

  const header = (
    <div className="table-header">
      <div className="clearfix">
        <h5 className="p-m-0 float-start">
          <CIcon icon={cilList} className="mr-1" /> Product
          <CBadge color="danger" className="ms-auto">
            {totalRecords}
          </CBadge>
        </h5>

        <div className="float-end">
          <div className="common-add-btn m-2">
            {
              <CButton
                color="warning"
                disabled={selectedProduct?.length === 0}
                onClick={() => {
                  if (selectedProduct?.length) syncSelectedProducts();
                }}
              >
                <CIcon icon={cilReload} className="mr-1" /> Sync selected
                products
              </CButton>
            }
          </div>
          <div className="common-add-btn m-2">
            {
              <CButton
                color="primary"
                disabled={selectedProduct?.length === 0}
                onClick={() => {
                  if (selectedProduct?.length) selectedChangeStatusProducts(0);
                }}
              >
                 Mark As Inactive
              </CButton>
            }
          </div>
          <div className="common-add-btn m-2">
            {
              <CButton
                color="primary"
                disabled={selectedProduct?.length === 0}
                onClick={() => {
                  if (selectedProduct?.length) selectedChangeStatusProducts(1);
                }}
              >
                  Mark As active
              </CButton>
            }
          </div>
        </div>
      </div>

      <hr />
      <form name="filterFrm" onSubmit={(e) => setGlobalFilter(e)}>
        <div className="row">
          {adminRole === "SUPER_ADMIN" && (
            <div className="col-md-12 col-lg-3 pb-3">
              <span className="p-float-label custom-p-float-label">
                <Dropdown
                  filter
                  ref={accountRef}
                  optionValue="_id"
                  options={accountData}
                  value={selectedAccount}
                  className="form-control"
                  optionLabel="company_name"
                  onChange={onAccountChange}
                  filterBy="company_name,code"
                  itemTemplate={accountDataTemplate}
                  valueTemplate={accountDataTemplate}
                />
                <label>HCP</label>
              </span>
            </div>
          )}

          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                name="title"
                value={selectedTitle}
                className="form-control"
                onChange={onChangeTitle}
              />
              <label>Title</label>
            </span>
          </div>

          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <InputText
                name="sku"
                value={selectedSku}
                onChange={onChangeSku}
                className="form-control"
              />
              <label>SKU</label>
            </span>
          </div>

          <div className="col-md-6 col-lg-3 mb-3">
            <span className="p-float-label custom-p-float-label">
              <Dropdown
                filter
                filterBy="name"
                optionLabel="name"
                value={cateogryValue}
                optionValue="entity_id"
                className="form-control"
                options={cateogryListData}
                onChange={(e) => {
                  handleCategoryChange(e, "category");
                }} // NOSONAR
              />
              <label>Category</label>
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

          <div className="col-md-6 col-lg-3 pb-3">
            <span className="p-float-label custom-p-float-label">
              <Dropdown
                className="form-control"
                name="prescriptionStatus"
                value={selectedProductLabel}
                options={prescriptionStatusDirectory}
                onChange={(e) => {
                  setSelectedProductLabel(e.target.value);
                }} // NOSONAR
              />
              <label>Product Label</label>
            </span>
          </div>

          <div className="col-md-12 col-lg-3 search-reset pb-3">
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
    if (
      rowData?.website_product_detail?.[0]?.is_active ===
      Constant.StatusEnum.active
    ) {
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

  const titleBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Title</span>
        {rowData?.name || Constant.NO_VALUE}
      </React.Fragment>
    );
  };

  const categoryTypeBodyTemplate = (rowData) => {
    const categoryTypeNames =
      rowData?.categories?.category_type
        ?.map((category) => category.name)
        ?.join(", ") ?? "";

    return (
      <React.Fragment>
        <span className="p-column-title">Category Type</span>
        <span className={`tooltip-category-type${rowData?._id}`}>
          {TextTruncate(categoryTypeNames, Constant.TEXT_TRUNCATE_SIZE)}
        </span>
        <Tooltip target={`.tooltip-category-type${rowData?._id}`}>
          {categoryTypeNames}
        </Tooltip>
      </React.Fragment>
    );
  };

  const categoryBodyTemplate = (rowData) => {
    const categoryNames =
      rowData?.categories?.category
        ?.map((category) => category.name)
        ?.join(", ") ?? "";
    return (
      <React.Fragment>
        <span className="p-column-title">Category</span>
        <span className={`tooltip-category${rowData?._id}`}>
          {TextTruncate(categoryNames, Constant.TEXT_TRUNCATE_SIZE)}
        </span>
        <Tooltip target={`.tooltip-category${rowData?._id}`}>
          {categoryNames}
        </Tooltip>
      </React.Fragment>
    );
  };

  const isPrescribedBodyTemplate = (rowData) => {
    return (
      <CBadge
        className="ms-auto"
        style={{ fontSize: "14px" }}
        color={rowData?.is_prescribed ? "success" : "danger"}
      >
        {prescriptionStatusDirectory?.[+rowData?.is_prescribed] ?? "OTC"}
      </CBadge>
    );
  };

  const skuBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">SKU</span>
        {rowData?.sku || Constant.NO_VALUE}
      </React.Fragment>
    );
  };

  const onCloseDeleteConfirmation = (value, isDelete, message) => {
    setIsDeleteModalShow(value);
    setSelectedProduct([]);
    setDeleteDataArr([]);
    if (isDelete) {
      showSuccess(message);
      // Only one record on second page and delete then it should be come to previous page in all modules
      if (productData.length === 1 && searchVal.start) {
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

  const onFilterData = (filters) => {
    setSelectedProduct([]);
    const categoryKeys = ["category_ids"];
    const { start, length, sort_field, sort_order } = searchVal;
    const data = { start, length };

    if (sort_field) data["sort_param"] = sort_field;
    if (sort_order) data["sort_type"] = sort_order === 1 ? "asc" : "desc"; //NOSONAR
    const appliedFilters = filters ?? filterMap,
      categoryIdList = [];

    for (const filterKey in appliedFilters) {
      const value = appliedFilters[filterKey];

      if (categoryKeys.includes(filterKey) && value) {
        categoryIdList.push(value);
      } else if (filterKey === "is_prescribed" && !isEmpty(value)) {
        data["is_prescribed"] = prescriptionStatusDirectory.findIndex(
          (status) => status === value
        );
      } else if (!isEmpty(value)) {
        data[filterKey] = value;
      }
    }

    if (!filters) {
      data["start"] = 0;
      setSearchVal({ ...searchVal, start: 0 });
    }

    if (categoryIdList.length) data["category_ids"] = categoryIdList;
    getProductData(data);
  };

  const resetGlobalFilter = () => {
    setSelectedStatus("");
    setSelectedTitle("");
    setSelectedSku("");
    setCateogryList("");
    setSelectedProductLabel("");
    setSelectedAccount(adminRole === "SUPER_ADMIN" ? "" : primaryAccountId);

    if (accountRef?.current?.resetFilter) accountRef.current.resetFilter();
    setSearchVal(initialFilter);
    onFilterData(initialFilter);
  };

  const onRowReorder = (e) => {
    let obj = {
      uuid: productData[e.dragIndex]._id,
      newposition: e.dropIndex + 1,
      oldposition: e.dragIndex + 1,
    };
    API.MoveData(moveStatusRes, obj, true, Constant.MOVEEVENT);
  };

  const moveStatusRes = {
    cancel: () => {},
    success: (response) => {
      if (response?.meta?.status) {
        if (response?.meta?.message) showSuccess(response.meta.message);
        onFilterData();
      }
    },
    error: (err) => {
      if (err?.meta?.message) showError(err.meta.message);
    },
    complete: () => {},
  };

  const onselectRow = (e) => {
    setSelectedProduct(e.value);
  };

  const onCloseImageModal = () => {
    setIsImageShow(false);
  };

  const onPageChange = (e) => {
    const paginatedParams = { start: e.first, length: e.rows };
    setSearchVal({ ...searchVal, ...paginatedParams });
    onFilterData({ ...filterMap, ...paginatedParams });
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
            value={productData}
            stripedRows
            className="p-datatable-responsive-demo"
            header={header}
            footer={productData?.length > 0 ? footer : ""}
            showGridlines
            scrollable
            scrollHeight="400px"
            responsiveLayout="scroll"
            reorderableColumns
            onRowReorder={onRowReorder}
            scrollDirection="both"
            sortField={searchVal.sort_field}
            sortOrder={searchVal.sort_order}
            onSort={(e) => onSort(e)}
            selection={selectedProduct}
            onSelectionChange={(e) => onselectRow(e)}
            selectionMode="checkbox"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            {
              <Column
                field="name"
                sortable
                header="Title"
                body={titleBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="sku"
                header="SKU"
                sortable
                body={skuBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="categories"
                sortable
                header="Category Type"
                body={categoryTypeBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="categories"
                sortable
                header="Category"
                body={categoryBodyTemplate}
              /> /* NOSONAR */
            }
            {
              <Column
                field="is_prescribed"
                sortable
                header="Product Label"
                body={isPrescribedBodyTemplate}
              /> /* NOSONAR */
            }
            {permissionHandler(Permission.PRODUCT_STATUS) && (
              <Column
                field="status"
                header="HCP Status"
                body={statusBodyTemplate}
              /> // NOSONAR
            )}
            {(permissionHandler(Permission.PRODUCT_UPDATE) ||
              permissionHandler(Permission.PRODUCT_DELETE)) && (
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              /> // NOSONAR
            )}
          </DataTable>
        </div>
      </div>
      <DeleteModal
        visible={isDeleteModalShow}
        onCloseDeleteModal={onCloseDeleteConfirmation}
        deleteObj={deleteObj}
        deleteDataArr={deleteDataArr}
        name="Event"
        deleteEndPoint={Constant.DELETEALLEVENT}
        dataName="event"
      />
      <ImageModal
        visible={isImageShow}
        imgObj={imageObj}
        onCloseImageModal={onCloseImageModal}
      />
    </>
  );
};

export default ProductList;
