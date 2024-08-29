import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { MultiSelect } from "primereact/multiselect";
import React, { useEffect, useState } from "react";
import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CIcon from "@coreui/icons-react";
import {
  cilCash,
  cilTrash,
  cilCart,
  cilXCircle,
  cilCheck,
  cilPlus,
} from "@coreui/icons";
import { InputNumber } from "primereact/inputnumber";
import { isEmpty } from "src/shared/handler/common-handler";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AddEditAddress from "./addEditAdress";
import SelectAddress from "./selectAddress";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

const AddHcpOrders = () => {
  const { showError, showSuccess, showInfo } = useToast();
  const history = useHistory();
  const _shippingAddress = {
    name: "",
    city: "",
    phone: "",
    state: "",
    address: "",
    pincode: "",
    country: "",
    countryId: "",
    id: "",
  };
  const adminRole = JSON.parse(localStorage.getItem("user_details"))?.role;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHcp, setSelectedHcp] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(_shippingAddress);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [isBillGenerated, setIsBillGenerated] = useState(false);
  const [cartSummaryDetails, setCartSummaryDetails] = useState();
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const [selectAddressModel, setSelectAddressModel] = useState(false);
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(null);
  const [hcpList, setHcpList] = useState([]);
  const [remarks, setRemarks] = useState("");

  /* to cancel slections*/
  const cancelSelections = () => {
    cancelOrder();
    setSelectedProducts([]);
    setShippingAddress(_shippingAddress);
  };
  /* to get hcp acoount list*/
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
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => { },
  };
  /* to get shipping adress*/
  const getShippingAddress = () => {
    const { _id: selectedHcpId } = selectedHcp;
    if (selectedHcp?._id) {
      const data = {
        account_id: selectedHcp._id,
      };
      setIsLoading(true);
      const url = `${Constant.HCP_ADDRESS_TRAIL}/${selectedHcpId}`;
      API.getHcpAdressData(handleShipAddressResponseObj, data, true, url);
    } else {
      showError("Please select a patient.");
    }
  };

  const handleShipAddressResponseObj = {
    cancel: () => { },
    success: (response) => {
      setIsLoading(false);
      const {
        address_line1,
        pincode,
        city: cityObj,
        state: stateObj,
        country: countryObj,
        _id,
      } = response?.data ?? {};

      setShippingAddress({
        pincode,
        address: address_line1,
        city: cityObj?.name ?? "",
        state: stateObj?.name ?? "",
        country: countryObj?.name ?? "",
        countryId: countryObj?._id ?? "",
        name: selectedHcp?.company_name ?? "",
        id: _id,
      });
    },
    error: (err) => {
      setIsLoading(false);
      setShippingAddress(_shippingAddress);
    },
    complete: () => { },
  };

  /* to get trail products*/
  const getTrailProducts = () => {
    const url = `${Constant.TRAIL_ORDER_PRODUCTS}`;
    API.getHcpAdressData(handleProductsResponseObj, null, true, url);
  };

  const handleProductsResponseObj = {
    cancel: () => { },
    success: (response) => {
      setIsLoading(false);
      const data = response?.data;
      const options = data.map((product) => ({
        name: product?.name,
        id: product?._id,
        taxClassName: product?.tax_class_name,
        price: product?.price,
        sku: product?.sku,
        label: `${product?.name ?? ""} ${product?.sku ? ` (${product?.sku})` : ""
          }`,
        low_stock_qty: product?.low_stock_qty,
        backorder: product?.backorder,
        _qty: product?.qty,
      }));
      setProductOptions(options);
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
    },
    complete: () => { },
  };

  const productsHandler = (e) => {
    const selectedIds = e.value;
    const keys = []
    // Update addedProducts based on selectedKeys
    const updatedAddedProducts = [];
    selectedIds?.forEach((id, index) => {
      const product = productOptions.find((product) => product?.id === id)
      if (index === selectedIds?.length - 1 && product?.backorder !== 0 && product?._qty < product?.low_stock_qty) {
        showInfo(
          "This Product inventory numbers are currently low. You can still order the product, but there might be a chance that the product will go on backorder"
        );
      }
      if (product?.backorder === 0 && product?._qty === 0) {
        return
      }
      keys.push(id)
      updatedAddedProducts.push(product)
    }
    );
    setSelectedProductId(keys);
    setSelectedProducts(updatedAddedProducts);
  };

  /*  for selected products table*/
  const nameBodyTemplate = (rowData) => {
    const { name, sku, prescriptionType } = rowData;
    const prescriptionLabel =
      prescriptionType && typeof prescriptionType === "string"
        ? ` (${prescriptionType.toUpperCase()})`
        : "";

    return (
      <>
        <span className="p-column-title">Name (SKU)</span>
        {`${name ?? ""} ${name && sku ? `(${sku})` : ""} `}
        <b>{prescriptionLabel}</b>
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
  /* to delete product */
  const deleteProductFromCart = (e, productIndex) => {
    cancelOrder();
    setSelectedProductId("");
    e.preventDefault();
    const _selectedProducts = [...selectedProducts];
    _selectedProducts.splice(productIndex, 1);
    setSelectedProducts([..._selectedProducts]);
  };

  const costPriceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cost Price (USD)</span>
        {Number(rowData?.price ?? 0).toFixed(2)}
      </>
    );
  };

  /*to update quantity*/
  const qtyBodyTemplate = (rowData, { rowIndex }) => {
    return (
      <InputNumber
        min={1}
        max={100}
        showButtons
        value={rowData?.qty ?? 1}
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
    const updatedProducts = [...selectedProducts];
    if (!isEmpty(updatedProducts[index])) {
      updatedProducts[index].qty = qty;
      setSelectedProducts([...updatedProducts]);
    }
  };
  /*to cancel order*/
  function cancelOrder() {
    setIsBillGenerated(false);
    setCartSummaryDetails(null);
  }
  const orderSummaryHandler = () => {
    getOrderSummary();
  };
  // to get order summary
  const getOrderSummary = () => {
    const item = selectedProducts?.map((product) => ({
      name: product?.name,
      product_id: product?.id,
      tax_class_name: product?.taxClassName,
      selling_price: product?.price,
      cost_price: product?.price,
      sku: product?.sku,
      qty: product?.qty ?? 1,
    }));
    const data = {
      email: selectedHcp?.email,
      account_id: selectedHcp?._id,
      country_id: shippingAddress?.countryId,
      items: item,
    };
    setIsLoading(true);
    API.getMasterList(
      handleOrderSummaryResponseObj,
      data,
      true,
      Constant.TRAIL_ORDER_SUMMARY
    );
  };

  const handleOrderSummaryResponseObj = {
    cancel: () => { },
    success: (response) => {
      setCartSummaryDetails(response?.data?.order_summary);
      setIsBillGenerated(true);
      setIsLoading(false);
    },
    error: (err) => {
      setIsLoading(false);
      setIsBillGenerated(false);
      const message = err?.meta?.message ?? "Something went wrong!";
      showError(message);
    },
    complete: () => { },
  };
  /*to place order*/
  const checkOrderValidity = () => {
    let isOrderValid = true;

    if (!selectedHcp?._id) {
      showError("Please select a HCP.");
      isOrderValid = true; // NOSONAR
    }

    if (!selectedProducts.length) {
      showError("Please add atleast 1 product to the cart.");
      isOrderValid = true; // NOSONAR
    }

    return isOrderValid;
  };
  const placeOrder = () => {
    const isOrderValid = checkOrderValidity();
    if (isOrderValid && isBillGenerated) {
      let addressDetails = {
        name: shippingAddress?.name,
        state: shippingAddress?.state,
        zip: shippingAddress?.pincode,
        address: shippingAddress?.address,
        country: shippingAddress?.country,
        mobile_no: shippingAddress?.phone,
        city: shippingAddress?.city,
      };

      if (useDifferentAddress) {
        addressDetails = {
          name: shippingAddress?.name,
          state: newAddress?.state?.name,
          zip: newAddress?.pincode,
          address: newAddress?.address_line1,
          country: newAddress?.country?.name,
          city: newAddress?.city?.name,
        };
      }
      const cartDetails = {
        account_id: selectedHcp?._id,
        cart_id: cartSummaryDetails?.cart_id,
        user_id: selectedHcp?._id,
        sub_total: +(cartSummaryDetails?.cart_details?.sub_total ?? 0),
        tax_price: +(cartSummaryDetails?.cart_details?.tax_price ?? 0),
        cart_count: +(cartSummaryDetails?.cart_details?.cart_count ?? 0),
        total_price: +(cartSummaryDetails?.cart_details?.total_price ?? 0),
        total_cost_price: +(
          cartSummaryDetails?.cart_details?.total_cost_price ?? 0
        ),
      };

      const item = selectedProducts?.map((product) => ({
        product_id: product?.id,
        tax_class_name: product?.taxClassName,
        selling_price: product?.price,
        cost_price: product?.price,
        qty: product?.qty ?? 1,
      }));
      const data = {
        email: selectedHcp?.email,
        account_id: selectedHcp?._id,
        country_id: shippingAddress?.countryId,
        shipping_address: { ...addressDetails },
        cart_details: { ...cartDetails },
        items: item,
        remark: remarks,
      };
      setIsLoading(true);
      API.getMasterList(
        handlePlaceOrderResponseObj,
        data,
        true,
        Constant.TRAIL_ORDER_PLACE
      );
    }
  };

  const handlePlaceOrderResponseObj = {
    cancel: () => { },
    success: (response) => {
      cancelOrder();
      setIsLoading(false);
      showSuccess(response?.meta?.message ?? "Order created successfully!");
      history.push("/trial-lenses-orders");
    },
    error: (err) => {
      setIsLoading(false);
      showError(err?.meta?.message ?? "Something went wrong!");
    },
    complete: () => { },
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
        if (resVal) {
          setSelectedHcp(resVal);
        }
      }
    },
    error: (err) => {
      console.log(err);
    },
    complete: () => { },
  };

  const handleAddressSelect = (selectedAddresses) => {
    setNewAddress(selectedAddresses);
    setShippingAddress({
      ...shippingAddress,
      state: selectedAddresses?.state?.name,
      pincode: selectedAddresses?.pincode,
      address: selectedAddresses?.address_line1,
      country: selectedAddresses?.country?.name,
      id: selectedAddresses?._id,
    });
    setAddAddressModal(false);
    setUseDifferentAddress(true);
  };
  const handleAddressCreated = (createdAddress) => {
    setNewAddress(createdAddress);
    setUseDifferentAddress(true);
    setShippingAddress({
      ...shippingAddress,
      state: createdAddress?.state?.name,
      pincode: createdAddress?.pincode,
      address: createdAddress?.address_line1,
      country: createdAddress?.country?.name,
      id: createdAddress?._id,
    });
  };

  /*to fetch data on render */
  useEffect(() => {
    if (selectedHcp?._id) {
      getShippingAddress();
      getTrailProducts();
    } else cancelSelections();
  }, [selectedHcp?._id]);
  const hcpDataTemplate = (option) => {
    if (!option) {
      return <span>Select a company</span>;
    }
    return <>{`${option?.company_name ?? ""} (${option?.code ?? ""})`}</>;
  };

  const handleHcpChange = (e) => {
    setSelectedHcp(hcpList.find((hcp) => hcp._id === e.value));
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
                <span className="p-float-label custom-p-float-label autocomplete-selection">
                  {adminRole?.code !== "SUPER_ADMIN" ? (
                    <InputText
                      disabled
                      name="company_name"
                      className="form-control"
                      value={selectedHcp?.company_name ?? selectedHcp?.code}
                    />
                  ) : (
                    <>
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
                      <label>
                        HCP (Select HCP)
                        <span className="text-danger">*</span>
                      </label>
                    </>
                  )}
                  {/* for hcp select dropdown  */}
                </span>
              </div>
            </div>
            {/* for shipping adress  */}
            {selectedHcp?._id && (
              <>
                <hr />
                <div className="font-size-16">
                  <h4>Shipping Address</h4>
                  <p>{shippingAddress?.name}</p>
                  <p>{shippingAddress?.address}</p>
                  <p>
                    {shippingAddress?.city && (
                      <span>
                        {shippingAddress?.city} {","}
                      </span>
                    )}
                    <span>
                      {shippingAddress?.state} {","}
                    </span>
                    <span>{shippingAddress?.country}</span>
                  </p>
                  <p>{shippingAddress?.pincode}</p>
                  <Checkbox
                    checked={useDifferentAddress}
                    onChange={(e) => setUseDifferentAddress(e.target.checked)}
                  />{" "}
                  <span>Use different shipping address</span>
                </div>

                {useDifferentAddress && (
                  <div className="col-md-12 d-flex justify-content-start mt-3">
                    <button
                      className="btn btn-primary mb-2 mr-2"
                      type="button"
                      onClick={() => {
                        setAddAddressModal(true);
                      }}
                    >
                      <CIcon icon={cilPlus} className="mr-1" />
                      &nbsp;Add Address
                    </button>
                    <button
                      className="btn btn-primary mb-2 mr-2"
                      type="button"
                      onClick={() => {
                        setSelectAddressModel(true);
                      }}
                    >
                      <CIcon icon={cilCheck} />
                      &nbsp;Select Address
                    </button>
                  </div>
                )}
              </>
            )}
            {/* for add products dropdown */}
            {selectedHcp?._id && (
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
                        optionValue="id"
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
          {selectedProducts?.length > 0 && (
            <>
              <div className="col-md-12 mt-2 mb-3 d-flex align-items-center custom-checkbox">
                <div className="datatable-responsive-demo custom-react-table w-100">
                  <div className="card pb-4">
                    <DataTable
                      showGridlines
                      value={selectedProducts}
                      responsiveLayout="scroll"
                      className="p-datatable-responsive-demo"
                    >
                      <Column
                        field="name"
                        body={nameBodyTemplate}
                        header="NAME (SKU) (Prescription type)"
                      />

                      <Column
                        field="costPrice"
                        header="Cost Price (USD)"
                        body={costPriceBodyTemplate}
                      />
                      <Column
                        field="qty"
                        header="Quantity"
                        body={qtyBodyTemplate}
                      />

                      <Column
                        field="name"
                        header="Action"
                        body={actionBodyTemplate}
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
                      onClick={orderSummaryHandler}
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
                    <b>{cartSummaryDetails?.cart_details?.cart_count ?? 0} </b>
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
                        {Number(
                          cartSummaryDetails?.cart_details?.sub_total ?? 0
                        ).toFixed(2)}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">Tax charge</div>
                      <div className="col-6">
                        {Number(
                          cartSummaryDetails?.cart_details?.tax_price ?? 0
                        ).toFixed(2)}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">Shipping rate</div>
                      <div className="col-6">
                        {Number(cartSummaryDetails?.shipping_rate ?? 0).toFixed(
                          2
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">Grand total</div>
                      <div className="col-6">
                        {Number(
                          cartSummaryDetails?.cart_details?.total_price ?? 0
                        ).toFixed(2)}
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
      {addAddressModal && (
        <AddEditAddress
          close={() => setAddAddressModal(false)}
          id={selectedHcp?._id}
          completed={handleAddressCreated}
        />
      )}
      {selectAddressModel && (
        <SelectAddress
          close={() => setSelectAddressModel(false)}
          onAddressSelect={handleAddressSelect}
          id={selectedHcp?._id}
          defaultSelectedAddress={shippingAddress}
        />
      )}
    </>
  );
};
export default AddHcpOrders;
