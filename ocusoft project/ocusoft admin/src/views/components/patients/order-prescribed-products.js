import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { isEmpty } from "src/shared/handler/common-handler";

import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilCart, cilDescription, cilXCircle, cilTrash } from "@coreui/icons";
import {
  CCloseButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { InputText } from "primereact/inputtext";

const OrderPrescribedProducts = ({
  handleCloseDialog, //NOSONAR
  shippingMethods, //NOSONAR
  shippingAddress, //NOSONAR
  userId, //NOSONAR
  hcpId, //NOSONAR
}) => {
  const { showError, showSuccess, showInfo } = useToast();
  const _errors = { products: "", shippingMethod: "" };
  const _cartSummaryDetails = {
    cartId: "",
    subTotal: 0,
    taxTotal: 0,
    cartCount: 0,
    grandTotal: 0,
    totalPrice: 0,
    shippingRate: 0,
  };

  const [errors, setErrors] = useState(_errors);
  const [isLoading, setIsLoading] = useState(false);
  const [isBillGenerated, setIsBillGenerated] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(""); //NOSONAR
  const [cartSummaryDetails, setCartSummaryDetails] =
    useState(_cartSummaryDetails);
  const [productsOptions, setProductsOptions] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [lowStockProductKeys, setLowStockProductKeys] = useState([]);

  const cancelOrder = () => {
    setIsBillGenerated(false);
    setCartSummaryDetails({ ..._cartSummaryDetails });
  };
  const getQueriedProducts = (phrase) => {
    if (hcpId) {
      const data = {
        start: 0,
        length: 10,
        user_id: userId,
        account_id: hcpId,
        search_keyqord: phrase,
      };

      API.getMasterList(
        handleQueriedProductsResponseObj,
        data,
        true,
        Constant.PRESCRIBED_PRODUCT_LIST
      );
    } else {
      showError("HCP id is unavailable.");
    }
  };

  const handleQueriedProductsResponseObj = {
    cancel: () => {},
    success: (response) => {
      let products = [];
      if (response?.meta?.status && response?.data?.original?.data?.length) {
        products = response.data.original.data.map((productObj) => {
          const { product } = productObj ?? {};
          const { name, sku, backorder, low_stock_qty, qty } = product ?? {};
          const prescriptionType = productObj?.is_prescribed_for ?? "";
          return {
            prescriptionType,
            productId: productObj?.product_id ?? "",
            taxClassName: product?.tax_class_name ?? "",
            websiteProductId: productObj?.website_product_id ?? "",
            costPrice: product?.website_product_detail?.[0]?.cost_price ?? 0,
            sellingPrice:
              product?.website_product_detail?.[0]?.selling_price ?? 0,
            name: `${name ?? ""} ${name && sku ? `(${sku})` : ""}`, // NOSONAR
            key: `${productObj?.product_id}_${prescriptionType.toLowerCase()}`, // Composite key
            label: `${name ?? ""} ${
              productObj?.product?.sku ? ` (${productObj?.product?.sku})` : ""
            } ${
              prescriptionType ? ` (${prescriptionType.toUpperCase()})` : ""
            }`,
            backorder: backorder,
            lowStockQty: low_stock_qty,
            quantity: qty,
          };
        });
      }

      setProductsOptions([...products]);
    },
    error: (err) => {
      console.log(err);
      setProductsOptions([]);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => {},
  };

  const handleOrderValidation = () => {
    let isFormValid = true;
    const _errors = { ...errors };

    if (!addedProducts.length) {
      isFormValid = false;
      _errors["products"] = "Please select atleast one product.";
    }
    setErrors({ ..._errors });
    return isFormValid;
  };

  const getShippingRate = (e) => {
    e.preventDefault();

    if (handleOrderValidation()) {
      setIsLoading(true);
      generateBill(0);
    }
  };

  const generateBill = (shippingRate) => {
    const items = [];
    addedProducts.forEach((productObj) => {
      if (productObj) {
        items.push({
          qty: productObj?.qty ?? 4,
          cost_price: productObj?.costPrice ?? 0,
          product_id: productObj?.productId ?? "",
          selling_price: productObj?.sellingPrice ?? 0,
          tax_class_name: productObj?.taxClassName ?? "",
        });
      }
    });

    const data = {
      items,
      user_id: userId,
      account_id: hcpId,
      shipping_rate: shippingRate,
    };
    API.getMasterList(
      handleGenerateBillResponseObj,
      data,
      true,
      Constant.GET_ORDER_SUMMARY
    );
  };

  const handleGenerateBillResponseObj = {
    cancel: () => {},
    success: (response) => {
      setIsLoading(false);
      const responseData = response?.data?.order_summary ?? null;
      if (responseData) {
        setCartSummaryDetails({
          cartId: responseData?.cart_details?.cart_id ?? "",
          grandTotal: responseData?.final_price?.toFixed(2) ?? 0,
          cartCount: responseData?.cart_details?.cart_count ?? 0,
          shippingRate: responseData?.shipping_rate?.toFixed(2) ?? 0,
          subTotal: responseData?.cart_details?.sub_total?.toFixed(2) ?? 0,
          taxTotal: responseData?.cart_details?.tax_price?.toFixed(2) ?? 0,
          totalPrice: responseData?.cart_details?.total_price?.toFixed(2) ?? 0,
        });

        setIsBillGenerated(true);
      }
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      setIsBillGenerated(false);
      setCartSummaryDetails(_cartSummaryDetails);
    },
    complete: () => {},
  };

  const placeOrder = () => {
    if (hcpId && userId && addedProducts.length && isBillGenerated) {
      const shippingMethodName =
        shippingMethods?.find(
          // NOSONAR
          (shipMethod) => shipMethod.id === selectedShippingMethod
        )?.name ?? "";

      const addressDetails = {
        name: shippingAddress.name, // NOSONAR
        city: shippingAddress.city, // NOSONAR
        state: shippingAddress.state, // NOSONAR
        zip: shippingAddress.pincode, // NOSONAR
        address: shippingAddress.address, // NOSONAR
        country: shippingAddress.country, // NOSONAR
        mobile_no: shippingAddress.phone, // NOSONAR
      };

      const data = {
        user_id: userId,
        account_id: hcpId,
        shipping_method: shippingMethodName,
        country_id: shippingAddress.countryId, // NOSONAR
        billing_address: { ...addressDetails },
        shipping_address: { ...addressDetails },
        final_price: cartSummaryDetails.grandTotal,
        shipping_rate: +cartSummaryDetails.shippingRate,
        cart_details: {
          user_id: userId,
          account_id: hcpId,
          cart_id: cartSummaryDetails.cartId,
          sub_total: +(cartSummaryDetails.subTotal ?? 0),
          tax_price: +(cartSummaryDetails.taxTotal ?? 0),
          cart_count: +(cartSummaryDetails.cartCount ?? 0),
          total_price: +(cartSummaryDetails.totalPrice ?? 0),
          total_cost_price: +(cartSummaryDetails.grandTotal ?? 0),
        },
        items: addedProducts.map((product) => {
          return {
            qty: product?.qty,
            product_id: product.productId,
            cost_price: +(product?.costPrice ?? 0),
            selling_price: +(product?.sellingPrice ?? 0),
            website_product_id: product.websiteProductId,
          };
        }),
        remark: remarks,
      };

      setIsLoading(true);
      API.getMasterList(
        handlePlaceOrderResponseObj,
        data,
        true,
        Constant.PLACE_PATIENT_ORDER
      );
    }
  };

  const handlePlaceOrderResponseObj = {
    cancel: () => {},
    success: (response) => {
      cancelOrder();
      setIsLoading(false);
      handleCloseDialog();
      showSuccess(response?.meta?.message ?? "Order created successfully!");
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      showError(response?.meta?.message ?? "Something went wrong!");
    },
    complete: () => {},
  };
  const nameBodyTemplate = (rowData) => {
    const { name, prescriptionType } = rowData;
    let displayPrescriptionType = prescriptionType;
    // Check if the prescriptionType contains both LEFT and RIGHT
    if (prescriptionType && prescriptionType.includes("&")) {
      const types = prescriptionType.split("&");
      if (types.includes("Left") && types.includes("Right")) {
        displayPrescriptionType = "LEFT & RIGHT";
      }
    }
    return (
      <>
        <span className="p-column-title">Name (SKU)</span>
        {`${name ?? ""} ${
          displayPrescriptionType
            ? `(${displayPrescriptionType.toUpperCase()})`
            : ""
        }`}
      </>
    );
  };

  const actionBodyTemplate = (_, { rowIndex }) => {
    return (
      <button
        title="Delete"
        className="btn btn-link mr-2 text-danger"
        onClick={(e) => {
          deleteProductFromCart(e, rowIndex);
        }}
      >
        <CIcon icon={cilTrash} size="lg" />
      </button>
    );
  };
  const qtyBodyTemplate = (rowData, { rowIndex }) => {
    return (
      <InputNumber
        min={1}
        max={100}
        showButtons
        value={rowData?.qty ?? 4}
        inputClassName="form-control"
        placeholder="Select Quantity"
        onValueChange={(e) => {
          cancelOrder();
          addProductQuantity(e.value, rowIndex);
        }}
      />
    );
  };
  const addProductQuantity = (qty, index) => {
    const _products = addedProducts ?? [];
    if (!isEmpty(_products[index])) {
      _products[index].qty = qty;
      setAddedProducts([..._products]);
    }
  };
  const deleteProductFromCart = (e, productIndex) => {
    cancelOrder();
    e.preventDefault();
    const _addedProducts = [...addedProducts];
    const deletedProduct = _addedProducts[productIndex];
    _addedProducts.splice(productIndex, 1);
    setAddedProducts([..._addedProducts]);
    const _selectedProductId = selectedProductId.filter(
      (id) => id !== deletedProduct.key
    );
    setSelectedProductId(_selectedProductId);
  };
  useEffect(() => {
    getQueriedProducts();
  }, []);

  const productsHandler = (e) => {
    const selectedKeys = e.value;
    setSelectedProductId(selectedKeys);
    // Clear the validation error if a product is selected
    if (selectedKeys) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        products: "",
      }));
    }

    // Update addedProducts based on selectedKeys
    const updatedAddedProducts = [];
    const newLowStockProductKeys = [...lowStockProductKeys];
    selectedKeys?.forEach((key) => {
      const selectedProduct = productsOptions?.find(
        (product) => product?.key === key
      );
      if (selectedProduct) {
        if (Array.isArray(selectedProduct)) {
          selectedProduct?.forEach((product) => {
            if (
              product.quantity < product?.lowStockQty &&
              product?.backorder != 0 &&
              !lowStockProductKeys?.includes(selectedProduct?.key)
            ) {
              if (!newLowStockProductKeys?.includes(selectedProduct?.key)) {
                showInfo(
                  "This Product inventory numbers are currently low. You can still order the product, but there might be a chance that the product will go on backorder"
                );
              }
            }
          });
        }
        if (
          selectedProduct?.quantity < selectedProduct?.lowStockQty &&
          selectedProduct?.backorder != 0 &&
          !lowStockProductKeys.includes(selectedProduct?.key)
        ) {
          if (!newLowStockProductKeys?.includes(selectedProduct?.key)) {
            showInfo(
              "This Product inventory numbers are currently low. You can still order the product, but there might be a chance that the product will go on backorder"
            );
          }

          newLowStockProductKeys?.push(selectedProduct?.key);
        }

        const existingProductIndex = updatedAddedProducts.findIndex(
          (product) => product.productId === selectedProduct.productId
        );
        if (existingProductIndex !== -1) {
          // Merge prescriptionType if the same productId is found
          const existingProduct = updatedAddedProducts[existingProductIndex];
          const currentPrescriptionTypes =
            existingProduct.prescriptionType.split("&");

          // Add the new prescriptionType if it's not already in the list
          if (
            !currentPrescriptionTypes.includes(selectedProduct.prescriptionType)
          ) {
            existingProduct.prescriptionType = [
              ...currentPrescriptionTypes,
              selectedProduct.prescriptionType,
            ].join("&");
          }
        } else {
          // Add new product with a default quantity
          updatedAddedProducts.push({ ...selectedProduct, qty: 4 });
        }
      }
    });
    const cleanedLowStockProductKeys = newLowStockProductKeys?.filter((key) =>
      selectedKeys?.includes(key)
    );
    setLowStockProductKeys(cleanedLowStockProductKeys);
    setAddedProducts(updatedAddedProducts);
    cancelOrder();
  };

  const remarkHandler = (e) => {
    setRemarks(e?.target?.value);
  };

  return (
    <CModal visible className="modal-popup">
      <CModalHeader className="bg-primary">
        <CModalTitle>Create Order</CModalTitle>
        <CCloseButton onClick={handleCloseDialog}></CCloseButton>
      </CModalHeader>

      <CModalBody>
        {isLoading && <Loader />}
        <div className="row">
          <div className="col-md-12 mt-2 mb-4">
            <span className="p-float-label custom-p-float-label">
              <MultiSelect
                value={selectedProductId}
                onChange={productsHandler}
                options={productsOptions}
                optionLabel="label"
                optionValue="key"
                filter
                placeholder="Select Products"
                className="w-full"
                appendTo="self"
              />
              <p className="error">{errors?.products ?? ""}</p>
            </span>
          </div>
          {addedProducts?.length > 0 && (
            <div className="col-md-12 mt-2 mb-3 d-flex align-items-center custom-checkbox">
              <div className="datatable-responsive-demo custom-react-table w-100">
                <div className="card pb-4">
                  <DataTable
                    showGridlines
                    value={addedProducts}
                    responsiveLayout="scroll"
                    className="p-datatable-responsive-demo"
                  >
                    <Column
                      field="name"
                      body={nameBodyTemplate} // NOSONAR
                      header="NAME (SKU) (Prescription type)"
                    />
                    <Column
                      field="qty"
                      header="Quantity"
                      body={qtyBodyTemplate} // NOSONAR
                    />

                    <Column
                      field="name"
                      header="Action"
                      body={actionBodyTemplate} // NOSONAR
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6">
            <button
              type="button"
              onClick={getShippingRate}
              className="btn btn-success m-0"
            >
              <CIcon icon={cilDescription} size="sm" />
              &nbsp; Get order summary
            </button>
          </div>
        </div>

        {isBillGenerated && (
          <div>
            <hr />

            <h4>Order summary</h4>

            <p className="font-size-16">
              Total cart items: &nbsp;
              <b>{cartSummaryDetails.cartCount ?? 0}</b>
            </p>

            <div className="mt-3 col-md-12 ml-1 font-size-16">
              <div className="row">
                <div className="col-6">
                  <b>Component</b>
                </div>
                <div className="col-6">
                  <b>Total (USD)</b>
                </div>
              </div>

              <div className="row">
                <div className="col-6">Subtotal</div>
                <div className="col-6">{cartSummaryDetails?.subTotal ?? 0}</div>
              </div>

              <div className="row">
                <div className="col-6">Tax charge</div>
                <div className="col-6">{cartSummaryDetails?.taxTotal ?? 0}</div>
              </div>

              <div className="row">
                <div className="col-6">Shipping rate</div>
                <div className="col-6">
                  {cartSummaryDetails?.shippingRate ?? 0}
                </div>
              </div>

              <div className="row">
                <div className="col-6">Grand total</div>
                <div className="col-6">
                  {cartSummaryDetails?.grandTotal ?? 0}
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <span className="p-float-label custom-p-float-label">
                  <InputText
                    className="form-control"
                    name="remark"
                    onChange={remarkHandler}
                  />
                  <label>
                    Remarks<span className="text-danger"></span>
                  </label>
                </span>
              </div>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-md-4">
                <button
                  type="button"
                  onClick={placeOrder}
                  style={{ float: "right" }}
                  className="btn btn-primary mb-2 form-control"
                >
                  <CIcon icon={cilCart} size="sm" />
                  &nbsp; Place order
                </button>
              </div>

              <div className="col-md-4">
                <button
                  type="button"
                  onClick={cancelOrder}
                  style={{ float: "right" }}
                  className="btn btn-warning mb-2 form-control"
                >
                  <CIcon icon={cilXCircle} size="sm" />
                  &nbsp; Cancel order
                </button>
              </div>
            </div>
          </div>
        )}
      </CModalBody>
    </CModal>
  );
};

export default OrderPrescribedProducts;
