import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import React, { useEffect, useState } from "react";
import { cilCheck, cilTrash } from "@coreui/icons";
import { API } from "src/services/Api";
import Loader from "../../common/loader/loader";
import { CommonMaster } from "src/shared/enum/enum";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import DeleteModal from "src/views/components/common/DeleteModalPopup/delete-modal";
import { displayDateTimeFormat } from "src/shared/handler/common-handler";
import AssignRecommendedProduct from "./add-recomended-product";

const RecommendedProducts = ({ hcpId, userId }) => {
  /* NOSONAR */
  const { showError, showSuccess } = useToast();
  const initialFilters = { start: 0, length: Constant.DT_ROW };
  const [heading, setHeading] = useState("");
  const [deleteObj, setDeleteObj] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [assignmentMode, setAssignmentMode] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [searchParams, setSearchParams] = useState({ ...initialFilters });

  useEffect(() => {
    getPrescribedProducts();
  }, []);

  const getPrescribedProducts = (filters) => {
    const appliedFilters = filters ?? searchParams;
    const data = { ...appliedFilters, user_id: userId, account_id: hcpId };
    setIsLoading(true);
    API.getMasterList(
      handlePrescribedProductsResponseObj,
      data,
      true,
      Constant.RECOMMENDED_PRODUCT_LIST
    );
  };

  const handlePrescribedProductsResponseObj = {
    cancel: () => {},
    success: (response) => {
      let products = [];
      setIsLoading(false);
      if (response?.meta?.status && response?.data?.original?.data?.length) {
        products = response?.data?.original?.data?.map((productObj) => {
          return {
            id: productObj?._id ?? "",
            sku: productObj?.product?.sku ?? "",
            name: productObj?.product?.name ?? "",
            productId: productObj?.product_id ?? "",
            websiteProductId: productObj?.website_product_id ?? "",
            taxClassName: productObj?.product?.tax_class_name ?? "",
            date: displayDateTimeFormat(productObj?.expiry_date ?? null),
            costPrice:
              productObj?.product?.website_product_detail?.[0]?.cost_price ?? 0,
            sellingPrice:
              productObj?.product?.website_product_detail?.[0]?.selling_price ??
              0,
          };
        });
      }
      setRecommendedProducts([...products]);
      setTotalRecords(response?.data?.original?.recordsTotal ?? 0);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      setRecommendedProducts([]);
      const message =
        err?.meta?.message ?? "Unable to fetch prescribed products.";
      showError(message);
    },
    complete: () => {},
  };

  const handlePrescribedProductPageChange = (e) => {
    const filters = { ...searchParams, start: e.first, length: e.rows };
    setSearchParams({ ...filters });
    getPrescribedProducts(filters);
  };

  const prescribedProductFooterTemplate = (
    <div className="table-footer">
      <Paginator
        rows={searchParams.length}
        first={searchParams.start}
        totalRecords={totalRecords}
        template={Constant.DT_PAGE_TEMPLATE}
        rowsPerPageOptions={Constant.DT_ROWS_LIST}
        onPageChange={handlePrescribedProductPageChange} // NOSONAR
        currentPageReportTemplate={Constant.DT_PAGE_REPORT_TEMP}
      />
    </div>
  );

  const nameBodyTemplate = (rowData) => {
    const { name, sku } = rowData;
    return (
      <>
        {
          `${name ?? Constant.NO_VALUE} ${
            name && sku ? `(${sku})` : ""
          }` /* NOSONAR */
        }
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <a /* NOSONAR */
        title="Delete"
        className="mr-2 text-danger"
        onClick={(e) => {
          openDeleteModal(e, rowData);
        }} /* NOSONAR */
      >
        <CIcon color="danger" icon={cilTrash} size="lg" />
      </a>
    );
  };

  const openDeleteModal = (e, data) => {
    e.preventDefault();
    setShowDeleteModal(true);
    setDeleteObj({
      _id: data?.id ?? "",
      name: data?.name ?? "",
      urlName: CommonMaster.DELETE_RECOMMENDED_PRODUCT,
    });
  };

  const handleCloseDeleteModal = (_, isDeleted, message) => {
    setDeleteObj(null);
    setShowDeleteModal(false);

    if (isDeleted && message) {
      const filters = { ...searchParams };
      if (recommendedProducts?.length === 1 && searchParams.start > 0) {
        filters.start -= filters.length;
        setSearchParams({ ...searchParams, start: filters.start });
      }

      getPrescribedProducts(filters);
      showSuccess(message);
    }
  };

  const assignProductHandler = (e, i) => {
    e.preventDefault();
    setAssignmentMode(i);
    setShowAssignmentModal(true);
    setHeading("Assign Products Manually");
  };

  const handleCloseAssignmentDialog = (reviseList = false) => {
    setShowAssignmentModal(false);
    if (reviseList) {
      setSearchParams({ ...initialFilters });
      getPrescribedProducts(initialFilters);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="row">
        {!recommendedProducts?.length && (
          <div className="col-md-12 d-flex justify-content-center">
            <h4>Assign Products Manually</h4>
          </div>
        )}
        <div className="col-md-12 d-flex justify-content-end">
          <button
            className="btn btn-primary mb-2 mr-2"
            onClick={(e) => {
              assignProductHandler(e, 0);
            }}
          >
            <CIcon icon={cilCheck} />
            &nbsp;Assign Product
          </button>
        </div>
        {showAssignmentModal && (
          <AssignRecommendedProduct
            hcpId={hcpId}
            userId={userId}
            heading={heading}
            assignmentMode={assignmentMode}
            closeDialog={handleCloseAssignmentDialog}
          />
        )}
      </div>
      {recommendedProducts?.length > 0 && (
        <fieldset className="fieldset">
          <legend className="legend">Recommended products</legend>
          <div className="col-md-12 mt-5 mb-3 d-flex align-items-center custom-checkbox">
            <div className="datatable-responsive-demo custom-react-table w-100">
              <div className="card pb-4">
                <DataTable
                  showGridlines
                  responsiveLayout="scroll"
                  value={recommendedProducts}
                  className="p-datatable-responsive-demo"
                  footer={prescribedProductFooterTemplate}
                >
                  <Column
                    field="name"
                    body={nameBodyTemplate}
                    header="NAME (SKU) (Prescription type)"
                  />
                  {
                    <Column
                      field="id"
                      header="Delete"
                      body={actionBodyTemplate}
                    /> /* NOSONAR */
                  }
                </DataTable>
              </div>
            </div>
          </div>
        </fieldset>
      )}
      <DeleteModal
        deleteObj={deleteObj}
        visible={showDeleteModal}
        onCloseDeleteModal={handleCloseDeleteModal} // NOSONAR
      />
    </>
  );
};

export default RecommendedProducts;
