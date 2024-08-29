import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { cilCheck } from "@coreui/icons";
import { AutoComplete } from "primereact/autocomplete";
import React, { useEffect, useState } from "react";
import { CCloseButton, CModal, CModalBody, CModalHeader } from "@coreui/react";

import { API } from "src/services/Api";
import Loader from "../../common/loader/loader";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";

const AssignRecommendedProduct = ({
  heading, // NOSONAR
  closeDialog, // NOSONAR
  assignmentMode, // NOSONAR
  hcpId, // NOSONAR
  userId, // NOSONAR
}) => {
  const { showError, showSuccess } = useToast();
  const _productDetails = { productId: "", websiteProductId: "", name: "" };
  const _errors = {
    product: "",
    date: "",
    prescriptionType: "",
    sku: "",
  };

  const [errors, setErrors] = useState(_errors);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [leftEyeSearchText, setLeftEyeSearchText] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [leftEyeSearchedProducts, setLeftEyeSearchedProducts] = useState([]);
  const [selectedLeftEyeProductDetails, setSelectedLeftEyeProductDetails] =
    useState(_productDetails);

  useEffect(() => {
    if (selectedDirection) getQueriedProducts(searchedQuery);
  }, [searchedQuery, selectedDirection]);

  const handleSearchTextChanges = (e) => {
    setLeftEyeSearchText(e.value);
    setSelectedLeftEyeProductDetails(_productDetails);
  };

  const handleFilterChanges = (e) => {
    setSearchedQuery(e.query);
    setSelectedDirection("Product");
  };

  const getQueriedProducts = (phrase) => {
    if (!hcpId) {
      showError("HCP id is unavailable.");
      return;
    }
    const data = { account_id: hcpId, search: phrase };
    API.getMasterList(
      handleQueriedProductsResponseObj,
      data,
      true,
      Constant.SEARCH_RECOMMENDED_PRODUCTS
    );
  };

  const handleQueriedProductsResponseObj = {
    cancel: () => {},
    success: (response) => {
      if (!response?.meta?.status || !response?.data?.length) {
        setLeftEyeSearchedProducts([]);
        return;
      }
      const products = response?.data?.map((productObj) => {
        const { product } = productObj ?? {};
        const { name, sku } = product ?? {};

        return {
          websiteProductId: productObj?._id ?? "",
          productId: productObj?.product_id ?? "",
          name: `${name ?? ""} ${name && sku ? `(${sku})` : ""}`, // NOSONAR
        };
      });

      if (selectedDirection === "Product") {
        setLeftEyeSearchedProducts(products);
      }
    },
    error: (err) => {
      showError(err?.meta?.message);
      setLeftEyeSearchedProducts([]);
    },
    complete: () => {},
  };

  const handleProductSelect = (e) => {
    const { productId, websiteProductId, name } = e?.value ?? {};
    setSelectedLeftEyeProductDetails({ name, websiteProductId, productId });
    setErrors({ ...errors, product: "" });
  };

  //validation
  const handleValidation = () => {
    let isFormValid = true;
    const newErrors = { ..._errors };
    if (assignmentMode === 0) {
      const product = selectedLeftEyeProductDetails.productId;

      if (!product) {
        isFormValid = false;
        newErrors["product"] = "Please select product.";
      } else {
        if (!product) {
          //NOSONAR
          //NOSONAR
          newErrors["product"] = "";
        }
      }
    }
    setErrors({ ...newErrors });
    return isFormValid;
  };

  //create recommended product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      if (hcpId && userId) {
        const data = {
          product_id: selectedLeftEyeProductDetails.productId,
          website_product_id: selectedLeftEyeProductDetails.websiteProductId,
          user_id: userId,
          account_id: hcpId,
        };
        setIsLoading(true);
        const url = Constant.ADD_RECOMMENDED_PRODUCTS;
        API.getMasterList(
          handlePrescribedProductAssignResponseObj,
          data,
          true,
          url
        );
      } else {
        const text = userId ? "HCP id" : "user id";
        showError(`${text} is unavailable.`);
      }
    }
  };

  const handlePrescribedProductAssignResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      const { status, message } = response?.meta ?? {};
      if (status && message) showSuccess(message);
      setLeftEyeSearchText("");
      closeDialog(true);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);

      if (err?.errors)
        Object.values(err.errors).map((errMessage) => {
          showError(errMessage);
        });
      else if (err?.meta?.message) showError(err.meta.message);
      else showError("Something went wrong!");
    },
    complete: () => {},
  };

  return (
    <CModal scrollable visible size="lg">
      <CModalHeader>
        <h2>{heading}</h2>
        <CCloseButton
          onClick={(e) => {
            e.preventDefault();
            closeDialog();
          }}
        ></CCloseButton>
      </CModalHeader>

      <CModalBody>
        {isLoading && <Loader />}
        {
          assignmentMode === 0 && (
            <div className="row">
              <div className="col-md-12 mt-3 mb-1">
                <span className="p-float-label custom-p-float-label autocomplete-selection">
                  <AutoComplete
                    field="name"
                    className="col-md-12"
                    value={leftEyeSearchText}
                    panelClassName="z-index-1056"
                    inputClassName="form-control"
                    suggestions={leftEyeSearchedProducts}
                    onSelect={(e) => {
                      handleProductSelect(e);
                    }} // NOSONAR
                    onChange={(e) => {
                      handleSearchTextChanges(e);
                    }} // NOSONAR
                    completeMethod={(e) => {
                      handleFilterChanges(e);
                    }} // NOSONAR
                  />
                  <label>
                    Product for eye (type to get options)
                    <span className="text-danger">*</span>
                  </label>
                </span>

                <p className="error">{errors?.product ?? ""}</p>
              </div>
              <div className="col-md-12 mt-2 mb-2">
                <button
                  className="btn btn-primary mb-2 mr-2"
                  onClick={handleSubmit}
                >
                  <CIcon icon={cilCheck} />
                  &nbsp;Assign
                </button>
              </div>
            </div>
          ) // NOSONAR
        }
      </CModalBody>
    </CModal>
  );
};

export default AssignRecommendedProduct;
