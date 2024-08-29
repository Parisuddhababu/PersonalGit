import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { cilCart, cilCash, cilTrash, cilXCircle } from "@coreui/icons";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import { isEmpty } from "src/shared/handler/common-handler";
import Loader from "src/views/components/common/loader/loader";
import ImageModal from "src/views/components/common/ImageModalPopup/image-modal";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddOrder = () => {
  const { showError, showSuccess, showInfo } = useToast();
  const _cartSummaryDetails = {
    cartId: "",
    subTotal: 0,
    taxTotal: 0,
    cartCount: 0,
    grandTotal: 0,
    totalPrice: 0,
    shippingRate: 0,
  };
  const _shippingAddress = {
    name: "",
    city: "",
    phone: "",
    state: "",
    address: "",
    pincode: "",
    country: "",
    countryId: "",
  };
  const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role;
  const history = useHistory();
  const [imageObj, setImageObj] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedHcp, setSelectedHcp] = useState(null);
  const [isBillGenerated, setIsBillGenerated] = useState(false);
  const [availableShipMethods, setAvailableShipMethods] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(_shippingAddress);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [cartSummaryDetails, setCartSummaryDetails] =
    useState(_cartSummaryDetails);
  const [hcpList, setHcpList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [remarks, setRemarks] = useState("");
  useEffect(() => {
    if (selectedPatient?._id) {
      getShippingAddress();
      getQueriedProducts();
    } else cancelSelections();
  }, [selectedPatient?._id]);

  useEffect(() => {
    getQueriedPatients();
  }, [selectedHcp]);

  const cancelSelections = () => {
    cancelOrder();
    setAddedProducts([]);
    setSelectedShippingMethod("");
    setShippingAddress(_shippingAddress);
  };

  useEffect(() => {
    if (adminRole?.code === "SUPER_ADMIN") {
      return;
    }
    getAccountDataById();
  }, []);

  useEffect(() => {
    if (adminRole?.code !== "SUPER_ADMIN") {
      return;
    }
    getQueriedHcps();
  }, []);

  const getAccountDataById = () => {
    const id = localStorage.getItem("account_id");
    if (id) {
      API.getMasterDataById(getMasterRes, "", true, id, Constant.ACCOUNT_SHOW);
    }
  };

  const getMasterRes = {
    cancel: (c) => { },
    success: (response) => {
      // NOSONAR
      if (response.meta.status_code === 200) {
        let resVal = response.data;
        setSelectedHcp(resVal);
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => { },
  };

  function getQueriedHcps(phrase) {
    const data = { company_name: phrase, is_active: 1 };
    API.getMasterList(
      handleQueriedHcpsResponseObj,
      data,
      true,
      Constant.ACCOUNT_LIST
    );
  }

  const handleQueriedHcpsResponseObj = {
    cancel: () => { },
    success: (response) => {
      let _hcpList = [];
      if (response?.data?.original?.data?.length > 0) {
        let responseData = response.data.original.data;
        _hcpList = [...responseData];
      }

      setHcpList([..._hcpList]);
    },
    error: (err) => {
      console.log(err);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => { },
  };

  function getQueriedPatients(phrase) {
    if (selectedHcp?._id) {
      const data = { account_id: selectedHcp?._id, search_keyword: phrase };
      API.getMasterList(
        handleQueriedPatientsResponseObj,
        data,
        true,
        Constant.GET_ORDER_PATIENTS
      );
    }
  }

  const handleQueriedPatientsResponseObj = {
    cancel: () => { },
    success: (response) => {
      let _suggestedPatients = [];
      if (response?.data.length > 0) {
        let responseData = response?.data;
        _suggestedPatients = [...responseData];
      }
      setPatientList([..._suggestedPatients]);
    },
    error: (err) => {
      console.log(err);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => { },
  };

  function getQueriedProducts(phrase) {
    if (!selectedHcp?._id) {
      showError("Please select the HCP.");
    } else if (!selectedPatient?._id) {
      showError("Please select the patient.");
    } else {
      const data = {
        start: 0,
        length: 10,
        search_keyword: phrase,
        account_id: selectedHcp?._id,
        user_id: selectedPatient?._id,
      };

      API.getMasterList(
        handleQueriedProductsResponseObj,
        data,
        true,
        Constant.PRESCRIBED_PRODUCT_LIST
      );
    }
  }

  const handleQueriedProductsResponseObj = {
    cancel: () => { },
    success: (response) => {
      const responseData = response?.data?.original?.data ?? [];
      const _suggestedProducts = responseData?.map((productObj) => {
        const prescriptionType = productObj?.is_prescribed_for ?? "";
        return {
          qty: 4,
          sku: productObj?.product?.sku ?? "",
          backorder: productObj?.product?.backorder ?? 0,
          low_stock_qty: productObj?.product?.low_stock_qty ?? 0,
          _qty: productObj?.product?.qty ?? 0,
          name: productObj?.product?.name ?? "",
          productId: productObj?.product_id ?? "",
          image: productObj?.product?.base_image ?? "",
          taxClassName: productObj?.product?.tax_class_name ?? "",
          prescriptionType: prescriptionType,
          costPrice:
            productObj?.product?.website_product_detail?.[0]?.cost_price ?? 0,
          websiteProductId: productObj?.website_product_detail?.[0]?._id ?? "",
          sellingPrice:
            productObj?.product?.website_product_detail?.[0]?.selling_price ??
            0,
          key: `${productObj?.product_id
            }_${productObj?.is_prescribed_for.toLowerCase()}`, // Composite key
          label: `${productObj?.product?.name ?? ""} ${productObj?.product?.sku ? ` (${productObj?.product?.sku})` : ""
            } ${productObj?.is_prescribed_for
              ? ` (${productObj?.is_prescribed_for.toUpperCase()})`
              : ""
            }`,
        };
      });
      setProductOptions([..._suggestedProducts]);
    },
    error: (err) => {
      console.log(err);
      showError(err?.meta?.message ?? "Something went wrong!");
    },
    complete: () => { },
  };

  const getShippingAddress = () => {
    if (selectedPatient?._id) {
      const { _id: selectedPatientId } = selectedPatient;

      setIsLoading(true);
      const url = `${Constant.GET_ORDER_SHIP_ADDRESS}/${selectedPatientId}`;
      API.getDrpData(handleShipAddressResponseObj, null, true, url);
    }
  };

  const handleShipAddressResponseObj = {
    cancel: () => { },
    success: (response) => {
      setIsLoading(false);
      const {
        address,
        pincode,
        city: cityObj,
        state: stateObj,
        last_name: lName,
        first_name: fName,
        country: countryObj,
        mobile_number: phone,
      } = response?.data ?? {};

      setShippingAddress({
        phone,
        pincode,
        address,
        city: cityObj?.name ?? "",
        state: stateObj?.name ?? "",
        country: countryObj?.name ?? "",
        countryId: countryObj?.country_id ?? "",
        name: `${fName ?? ""} ${fName && lName ? lName : ""}`, // NOSONAR
      });
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      setShippingAddress(_shippingAddress);
    },
    complete: () => { },
  };

  const getShippingRate = () => {
    generateBill(0);
    setIsLoading(true);
  };

  const checkOrderValidity = () => {
    let isOrderValid = true;

    if (!selectedHcp?._id) {
      showError("Please select a HCP.");
      isOrderValid = true; //NOSONAR
    }

    if (!selectedPatient?._id) {
      showError("Please select a patient.");
      isOrderValid = true; //NOSONAR
    }

    if (!addedProducts.length) {
      showError("Please add atleast 1 product to the cart.");
      isOrderValid = true; //NOSONAR
    }

    return isOrderValid;
  };

  const generateBill = (shippingRate) => {
    const isOrderValid = checkOrderValidity();

    if (shippingRate < 0) {
      showError("Something went wrong!");
      return;
    }

    if (isOrderValid && shippingRate >= 0) {
      const data = {
        account_id: selectedHcp?._id,
        user_id: selectedPatient?._id,
        shipping_rate: shippingRate,
        items: addedProducts?.map((productObj) => {
          return {
            qty: productObj?.qty ?? 1,
            cost_price: productObj?.costPrice ?? 0,
            product_id: productObj?.productId ?? "",
            selling_price: productObj?.sellingPrice ?? 0,
            tax_class_name: productObj?.taxClassName ?? "",
          };
        }),
      };

      API.getMasterList(
        handleGenerateBillResponseObj,
        data,
        true,
        Constant.GET_ORDER_SUMMARY
      );
    }
  };

  const handleGenerateBillResponseObj = {
    cancel: () => { },
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
    complete: () => { },
  };

  function cancelOrder() {
    setIsBillGenerated(false);
    setCartSummaryDetails({ ..._cartSummaryDetails });
  }

  const placeOrder = () => {
    const isOrderValid = checkOrderValidity();

    if (isOrderValid && isBillGenerated) {
      const shippingMethodName =
        availableShipMethods?.find(
          (shipMethod) => shipMethod.id === selectedShippingMethod
        )?.name ?? "";

      const addressDetails = {
        name: shippingAddress.name,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.pincode,
        address: shippingAddress.address,
        country: shippingAddress.country,
        mobile_no: shippingAddress.phone,
      };

      const data = {
        account_id: selectedHcp?._id,
        user_id: selectedPatient?._id,
        shipping_method: shippingMethodName,
        country_id: shippingAddress.countryId,
        billing_address: { ...addressDetails },
        shipping_address: { ...addressDetails },
        final_price: cartSummaryDetails.grandTotal,
        shipping_rate: +cartSummaryDetails.shippingRate,
        cart_details: {
          account_id: selectedHcp?._id,
          user_id: selectedPatient?._id,
          cart_id: cartSummaryDetails.cartId,
          sub_total: +(cartSummaryDetails.subTotal ?? 0),
          tax_price: +(cartSummaryDetails.taxTotal ?? 0),
          cart_count: +(cartSummaryDetails.cartCount ?? 0),
          total_price: +(cartSummaryDetails.totalPrice ?? 0),
          total_cost_price: +(cartSummaryDetails.grandTotal ?? 0),
        },
        items: addedProducts?.map((product) => {
          return {
            qty: product?.qty,
            product_id: product.productId,
            cost_price: +(product?.costPrice ?? 0),
            selling_price: +(product?.sellingPrice ?? 0),
            website_product_id: product?.websiteProductId,
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
    cancel: () => { },
    success: (response) => {
      cancelOrder();
      setIsLoading(false);
      showSuccess(response?.meta?.message ?? "Order created successfully!");
      history.push("/orders");
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
      showError(response?.meta?.message ?? "Something went wrong!");
    },
    complete: () => { },
  };

  const deleteProductFromCart = (e, productIndex) => {
    cancelOrder();
    e.preventDefault();
    const _addedProducts = [...addedProducts];
    _addedProducts.splice(productIndex, 1);
    setAddedProducts([..._addedProducts]);
  };

  const handleImageZoom = (e, imageUrl) => {
    e.stopPropagation();
    setShowImageModal(true);
    setImageObj({ path: imageUrl });
  };

  const addProductQuantity = (qty, index) => {
    const _products = addedProducts ?? [];
    if (!isEmpty(_products[index])) {
      _products[index].qty = qty;
      setAddedProducts([..._products]);
    }
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };
  const nameBodyTemplate = (rowData) => {
    const { name, sku, prescriptionType } = rowData;
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
        {`${name ?? ""} ${sku ? `(${sku})` : ''} ${displayPrescriptionType ? `(${displayPrescriptionType.toUpperCase()})` : ""
          }`}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    const { image } = rowData;

    return image ? (
      <img //NOSONAR
        src={image ?? ""}
        alt={"product image"}
        className="product-image"
        onClick={(e) => {
          handleImageZoom(e, image);
        }}
        onError={(e) => {
          e.target.src = Constant.PRIME_URL;
        }}
      />
    ) : (
      <>-</>
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

  const costPriceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cost Price (USD)</span>
        {Number(rowData?.costPrice ?? 0).toFixed(2)}
      </>
    );
  };

  const sellingPriceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Selling Price (USD)</span>
        {Number(rowData?.sellingPrice ?? 0).toFixed(2)}
      </>
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
  const hcpDataTemplate = (option) => {
    if (!option) {
      return <span>Select a company</span>;
    }
    return <>{`${option?.company_name ?? ""} (${option?.code ?? ""})`}</>;
  };
  const hcpValueTemplate = (option) => {
    if (!option) {
      return <span>Select a company</span>;
    }
    const { full_name = "", email = "" } = option;
    return <>{`${full_name} (${email})`}</>;
  };

  const handleHcpChange = (e) => {
    setSelectedHcp(hcpList.find((hcp) => hcp._id === e.value));
    setSelectedPatient(null);
  };
  const handlePatientChange = (e) => {
    setSelectedPatient(patientList.find((patient) => patient._id === e.value));
  };

  const productsHandler = (e) => {
    const selectedKeys = e.value;
    const keys = []
    // Update addedProducts based on selectedKeys
    
    const updatedAddedProducts = [];
    selectedKeys.forEach((key, index) => {
      const selectedProduct = productOptions.find(
        (product) => product.key === key
      );
      if (selectedProduct) {
        if (index === selectedKeys?.length - 1 && selectedProduct?.backorder !== 0 && selectedProduct?._qty < selectedProduct?.low_stock_qty) {
          showInfo(
            "This Product inventory numbers are currently low. You can still order the product, but there might be a chance that the product will go on backorder"
          );
        }

        if (selectedProduct?.backorder === 0 && selectedProduct?._qty === 0) {
          return
        }
        keys.push(key)

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
    setSelectedProductId(keys);
    setAddedProducts(updatedAddedProducts);
    cancelOrder();
  };

  const remarkHandler = (e) => {
    setRemarks(e?.target?.value);
  };

  return (
    <>
      {isLoading && <Loader />}

      <form name="subMasterFrm" noValidate>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Add Order</h5>
          </div>

          <div className="card-body">
            <p className="col-sm-12 text-right">
              Fields marked with <span className="text-danger">*</span> are
              mandatory.
            </p>

            <div className="row">
              <div className="col-md-4 mb-3">
                <span className="p-float-label custom-p-float-label">
                  {adminRole?.code !== "SUPER_ADMIN" ? (
                    <InputText
                      disabled
                      name="company_name"
                      className="form-control"
                      value={selectedHcp?.company_name ?? selectedHcp?.code}
                    />
                  ) : (
                    <Dropdown
                      filter
                      name="hcp"
                      value={selectedHcp?._id}
                      optionValue="_id"
                      options={hcpList}
                      className="form-control"
                      optionLabel="company_name"
                      onChange={handleHcpChange} // NOSONAR
                      filterBy="company_name,code"
                      itemTemplate={hcpDataTemplate} // NOSONAR
                      valueTemplate={hcpDataTemplate} // NOSONAR
                    />
                  )}
                  <label>
                    HCP (Select HCP) <span className="text-danger">*</span>
                  </label>
                </span>
              </div>

              <div className="col-md-4 mb-3">
                <span className="p-float-label custom-p-float-label autocomplete-selection">
                  <Dropdown
                    filter
                    name="hcp"
                    value={selectedPatient?._id}
                    optionValue="_id"
                    options={patientList}
                    className="form-control"
                    optionLabel="email,full_name"
                    onChange={handlePatientChange} // NOSONAR
                    filterBy="email"
                    itemTemplate={hcpValueTemplate} // NOSONAR
                    valueTemplate={hcpValueTemplate} // NOSONAR
                  />
                  <label>
                    Patient (Select Patient){" "}
                    <span className="text-danger">*</span>
                  </label>
                </span>
              </div>
            </div>

            {(shippingAddress?.name ||
              shippingAddress?.address ||
              shippingAddress?.pincode ||
              shippingAddress?.city ||
              shippingAddress?.state ||
              shippingAddress?.country) && (
                <>
                  <hr />

                  <div className="font-size-16">
                    <h4>Shipping Address</h4>
                    {shippingAddress.name && <p>{shippingAddress.name}</p>}
                    {shippingAddress.address && <p>{shippingAddress.address}</p>}
                    <p>
                      {shippingAddress.city && (
                        <span>{shippingAddress.city}</span>
                      )}
                      {shippingAddress.city && shippingAddress.state && (
                        <span>, {shippingAddress.state}</span>
                      )}
                      {shippingAddress.city &&
                        shippingAddress.state &&
                        shippingAddress.country && (
                          <span>, {shippingAddress.country}</span>
                        )}
                    </p>
                    {shippingAddress.pincode && <p>{shippingAddress.pincode}</p>}
                  </div>
                </>
              )}

            {selectedPatient?._id && (
              <>
                <hr />
                <h4>Add products to cart</h4>

                <div className="row mt-2">
                  <div className="col-md-4 mt-3 mb-3">
                    <div className="card flex justify-content-center">
                      <MultiSelect
                        value={selectedProductId}
                        onChange={productsHandler}
                        options={productOptions}
                        optionLabel="label"
                        optionValue="key"
                        filter
                        placeholder="Select Products"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {addedProducts?.length > 0 && (
            <>
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
                        field="image"
                        header="Image"
                        body={imageBodyTemplate} // NOSONAR
                      />

                      <Column
                        field="name"
                        body={nameBodyTemplate} // NOSONAR
                        header="NAME (SKU) (Prescription type)"
                      />

                      <Column
                        field="costPrice"
                        header="Cost Price (USD)"
                        body={costPriceBodyTemplate} // NOSONAR
                      />

                      <Column
                        field="sellingPrice"
                        header="Selling Price (USD)"
                        body={sellingPriceBodyTemplate} // NOSONAR
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
              {!isBillGenerated ? (
                <div className="row mt-3 mb-3">
                  <div className="col-md-2 ml-3">
                    <button
                      type="button"
                      onClick={getShippingRate}
                      style={{ float: "right" }}
                      className="btn btn-success mb-2 form-control"
                    >
                      <CIcon icon={cilCash} size="sm" />
                      &nbsp; Generate order summary
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ml-3">
                  <hr />

                  <h4>Order summary</h4>

                  <p className="font-size-16">
                    Total cart items: &nbsp;
                    <b>{cartSummaryDetails.cartCount ?? 0}</b>
                  </p>

                  <div className="mt-3 col-md-3 ml-1 font-size-16">
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
                      <div className="col-6">
                        {Number(cartSummaryDetails?.subTotal ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">Tax charge</div>
                      <div className="col-6">
                        {Number(cartSummaryDetails?.taxTotal ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">Shipping rate</div>
                      <div className="col-6">
                        {Number(cartSummaryDetails?.shippingRate ?? 0).toFixed(
                          2
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">Grand total</div>
                      <div className="col-6">
                        {Number(cartSummaryDetails?.grandTotal ?? 0).toFixed(2)}
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
                    <div className="col-md-2 ml-3">
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

                    <div className="col-md-2 ml-3">
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
            </>
          )}
        </div>
      </form>

      <ImageModal
        visible={showImageModal}
        imgObj={imageObj}
        onCloseImageModal={handleCloseImageModal}
      />
    </>
  );
};

export default AddOrder;
