import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { Row } from "primereact/row";
import CIcon from "@coreui/icons-react";
import { cilXCircle } from "@coreui/icons";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { ColumnGroup } from "primereact/columngroup";
import {
  useLocation,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";

import { API } from "src/services/Api";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import ImageModal from "../common/ImageModalPopup/image-modal";
import {
  uuid,
  camelCaseToLabel,
  displayDateTimeFormat,
  orderStatusDirectory,
  paymentStatusDirectory,
} from "src/shared/handler/common-handler";

const OrderDetails = () => {
  const history = useHistory();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const addressKeys = ["shippingAddress", "billingAddress"];
  const currencyKeys = ["subTotal", "taxPrice", "totalCost", "shippingCharge"];

  const details = {
    date: "",
    number: "",
    hcpName: "",
    subTotal: 0,
    taxPrice: 0,
    totalCost: 0,
    patientName: "",
    paymentStatus: "",
    shippingCharge: 0,
    status: "Pending",
    billingAddress: "",
    shippingAddress: "",
  };

  const [imageData, setImageData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({ ...details });
  const [showImageModal, setShowImageModal] = useState(false);
  const [displayedOrderDetails, setDisplayedOrderDetails] = useState({
    ...details,
  });

  useEffect(() => {
    getOrderData();
  }, []);

  const getOrderData = () => {
    setIsLoading(true);
    API.getDrpData(
      handleGetOrderDataResponseObj,
      null,
      true,
      `${Constant.ORDER_SHOW}/${id}`
    );
  };

  const handleGetOrderDataResponseObj = {
    cancel: () => {},
    success: (response) => {
      // NOSONAR
      setIsLoading(false);
      let _orderData = {};
      const responseData = response?.data ?? null;
      const paymentMethod = response?.data?.cart_id === "order_by_admin";
      if (responseData) {
        const {
          shipping_address: shipAddr,
          billing_address: billAddr,
          account,
        } = responseData;
        const { account_name: hcpName, code: hcpCode } = account ?? {};
        _orderData = {
          hcpName: `${hcpName ?? ""} ${hcpName && hcpCode && `(${hcpCode})`}`, // NOSONAR
          patientName: `${responseData?.user_info?.first_name ?? ""} ${
            responseData?.user_info?.last_name ?? ""
          }`,
          number: responseData?.order_number ?? Constant.NO_VALUE,
          totalCost: Number(responseData?.total_cost ?? 0)?.toFixed(2),
          subTotal: Number(responseData?.cart_summary?.sub_total ?? 0)?.toFixed(
            2
          ),
          taxPrice: Number(responseData?.cart_summary?.tax_price ?? 0)?.toFixed(
            2
          ),
          shippingCharge: Number(
            responseData?.total_shipping_charges ?? 0
          )?.toFixed(2),
          date:
            displayDateTimeFormat(responseData?.created_at ?? null) ??
            Constant.NO_VALUE,
          status:
            orderStatusDirectory?.[+(responseData?.order_status ?? 1)] ??
            "Not available",
          PaymentMethod: paymentMethod
            ? "In Office"
            : responseData?.payment_method,
          remark: responseData?.remark
            ? responseData?.remark
            : Constant.NO_VALUE,
          paymentStatus:
            responseData?.transactions?.payment_status_text ??
            Constant.NO_VALUE,
          shippingAddress: {
            zip: shipAddr?.zip ?? "",
            country: shipAddr?.country ?? "",
            name: shipAddr?.name ?? Constant.NO_VALUE,
            city: shipAddr?.city ?? Constant.NO_VALUE,
            state: shipAddr?.state ?? Constant.NO_VALUE,
            phone: shipAddr?.mobile_no ?? Constant.NO_VALUE,
            address: shipAddr?.address ?? Constant.NO_VALUE,
          },
          billingAddress: {
            zip: billAddr?.zip ?? "",
            country: billAddr?.country ?? "",
            name: billAddr?.name ?? Constant.NO_VALUE,
            city: billAddr?.city ?? Constant.NO_VALUE,
            state: billAddr?.state ?? Constant.NO_VALUE,
            phone: billAddr?.mobile_no ?? Constant.NO_VALUE,
            address: billAddr?.address ?? Constant.NO_VALUE,
          },
          sapId: responseData?.sap_order_id ?? Constant.NO_VALUE,
          sapOrderNo: responseData?.sap_order_number ?? Constant.NO_VALUE,
          sapFinalOrderId: responseData?.sap_final_oid ?? Constant.NO_VALUE,
          sapFinalOrderNumber:
            responseData?.sap_final_onumber ?? Constant.NO_VALUE,
          hcpPaymentStatus:
            paymentStatusDirectory?.[+responseData?.hcp_payment_status ?? 1] ??
            "Pending",
        };

        const _orderItems =
          responseData?.order_items?.map((itemData) => {
            return {
              qty: itemData?.qty ?? 0,
              sku: itemData?.product?.sku ?? Constant.NO_VALUE,
              name: itemData?.product?.name ?? Constant.NO_VALUE,
              image: itemData?.product?.base_image ?? Constant.NO_VALUE,
              itemPrice: Number(itemData?.item_price ?? 0)?.toFixed(2) ?? 0,
              costPrice: Number(itemData?.cost_price ?? 0)?.toFixed(2) ?? 0,
              totalPrice: Number(itemData?.total_price ?? 0)?.toFixed(2) ?? 0,
            };
          }) ?? [];

        setOrderData({ ..._orderData });
        setOrderItems([..._orderItems]);

        if (_orderData) {
          const {
            subTotal,
            taxPrice,
            shippingCharge,
            totalCost,
            ..._displayedOrderDetails
          } = _orderData;
          setDisplayedOrderDetails({ ..._displayedOrderDetails });
        }
      }
    },
    error: (err) => {
      console.log(err);
      setIsLoading(false);
    },
    complete: () => {},
  };

  const moveToListPage = () => {
    history.push("/orders");
  };

  const getLabel = (key) => {
    switch (key) {
      case "hcpName":
        return "HCP";
      case "sapId":
        return "SAP Order Id";
      case "sapOrderNo":
        return "SAP Order Number";
      case "sapFinalOrderId":
        return "SAP Final Order Id";
      case "sapFinalOrderNumber":
        return "SAP FInal Order Number";
      case "hcpPaymentStatus":
        return "HCP Payment Status";
      case "remark":
        return "Remark";
      default:
        return camelCaseToLabel(key);
    }
  };

  const imageBodyTemplate = (rowData) => {
    return rowData?.image ? (
      <img
        alt={"product"}
        src={rowData.image}
        title="click to see in fullscreen"
        onClick={() => {
          openImageModal(rowData.image);
        }}
        onError={(e) => {
          e.target.src = Constant.PRIME_URL;
        }}
        className="w-100 h-100 object-fit-cover cursor-pointer"
      />
    ) : (
      <>{Constant.NO_VALUE}</>
    );
  };

  const dynamicBodyTemplate = (value, defaultValue, prefix) => {
    return (
      <p style={{ fontSize: "16px" }}>
        {prefix ?? ""}
        {value ?? defaultValue ?? Constant.NO_VALUE}
      </p>
    );
  };

  const totalCostPriceBodyTemplate = (_, indexData) => {
    const { rowIndex: index } = indexData ?? {};
    const itemObj = orderItems[index];
    const costPrice = (+itemObj?.costPrice)?.toFixed(2);
    const qty = (+itemObj?.qty)?.toFixed(0);
    const totalCostPrice = (costPrice * qty).toFixed(2);
    return (
      <p style={{ fontSize: "16px" }}>${Number(totalCostPrice).toFixed(2)}</p>
    );
  };

  const openImageModal = (imgUrl) => {
    if (imgUrl) {
      setShowImageModal(true);
      setImageData({ path: imgUrl });
    }
  };

  const handleCloseImageModal = () => {
    setImageData(null);
    setShowImageModal(false);
  };

  const footerGroup = () => {
    const totalCostPrice = orderItems
      .reduce((acc, item) => acc + +item?.costPrice * +item?.qty, 0)
      ?.toFixed(2);
    const subTotal = Number(orderData?.subTotal ?? 0).toFixed(2);
    const shippingCharge = Number(orderData?.shippingCharge ?? 0).toFixed(2);
    const taxPrice = Number(orderData?.taxPrice ?? 0).toFixed(2);
    const grandTotalCostPrice = (
      +totalCostPrice +
      +shippingCharge +
      +taxPrice
    )?.toFixed(2);
    const grandTotalSellingPrice = Number(orderData?.totalCost ?? 0).toFixed(2);

    return (
      <ColumnGroup>
        <Row>
          <Column colSpan={4} footer="" />
          <Column
            colSpan={2}
            footerClassName="font-size-16 font-weight-normal"
            footer="Sub total"
          />
          <Column
            footerClassName="font-size-16 font-weight-normal"
            footer={`$${totalCostPrice}`}
          />
          <Column
            footerClassName="font-size-16 font-weight-normal"
            footer={`$${subTotal}`}
          />
        </Row>

        <Row>
          <Column colSpan={4} footer="" />
          <Column
            colSpan={2}
            footerClassName="font-size-16 font-weight-normal"
            footer="Shipping & Handling"
          />
          <Column
            footer={`$${shippingCharge}`}
            footerClassName="font-size-16 font-weight-normal"
          />
          <Column
            footer={`$${shippingCharge}`}
            footerClassName="font-size-16 font-weight-normal"
          />
        </Row>

        <Row>
          <Column colSpan={4} footer="" />
          <Column
            colSpan={2}
            footerClassName="font-size-16 font-weight-normal"
            footer="Tax"
          />
          <Column
            footer={`$${taxPrice}`}
            footerClassName="font-size-16 font-weight-normal"
          />
          <Column
            footer={`$${taxPrice}`}
            footerClassName="font-size-16 font-weight-normal"
          />
        </Row>

        <Row>
          <Column colSpan={4} footer="" />
          <Column
            colSpan={2}
            footerClassName="font-size-16 font-weight-bold"
            footer="Grand total"
          />
          <Column
            footerClassName="font-size-16 font-weight-bold"
            footer={`$${grandTotalCostPrice}`}
          />
          <Column
            footerClassName="font-size-16 font-weight-bold"
            footer={`$${grandTotalSellingPrice}`}
          />
        </Row>
      </ColumnGroup>
    );
  };

  return (
    <div className="card">
      {isLoading && <Loader />}

      <div className="card-header">
        <h5 className="card-title">Order Details</h5>
      </div>

      <div className="card-body" style={{ fontSize: "16px" }}>
        {Object.entries(displayedOrderDetails)?.map(
          ([key, value], orderIndex) => {
            const isAddressKey = addressKeys.includes(key);
            const addressObj = isAddressKey ? value : null;
            const prefix = currencyKeys.includes(key) ? "$" : "";

            return (
              <div
                className={`row ${orderIndex > 0 ? "mt-3" : ""}`}
                key={uuid()}
              >
                <div className="col-lg-4">
                  <b>{getLabel(key)}</b>
                </div>

                <div className="col-lg-6">
                  {isAddressKey && addressObj ? (
                    <>
                      {addressObj?.name ?? ""}
                      <br />
                      {addressObj?.phone ?? ""}
                      <br />
                      {addressObj?.address ?? ""}
                      <br />
                      {addressObj?.city ?? ""}
                      {addressObj?.state ? `, ${addressObj?.state}` : ""}
                      <br />
                      {addressObj?.country ?? ""}
                      {addressObj?.zip ? ` - ${addressObj?.zip}` : ""}
                    </>
                  ) : (
                    <>
                      {prefix}
                      {value ?? Constant.NO_VALUE}
                    </>
                  )}
                </div>
              </div>
            );
          }
        )}

        {orderItems?.length > 0 && (
          <fieldset className="fieldset">
            <legend className="legend">Order items</legend>

            <DataTable
              stripedRows
              showGridlines
              value={orderItems}
              responsiveLayout="scroll"
              footerColumnGroup={footerGroup()}
              className="p-datatable-responsive-demo"
            >
              <Column
                field="image"
                header="Image"
                style={{ width: "3%" }}
                body={imageBodyTemplate} // NOSONAR
              />
              <Column
                field="name"
                header="Name"
                style={{ width: "18%" }}
                body={(data) => dynamicBodyTemplate(data["name"])} // NOSONAR
              />
              <Column
                field="sku"
                header="SKU"
                style={{ width: "10%" }}
                body={(data) => dynamicBodyTemplate(data["sku"])} // NOSONAR
              />
              <Column
                field="costPrice"
                header="Cost Price"
                style={{ width: "10%" }}
                body={(data) => {
                  const costPrice = Number(data["costPrice"] ?? 0).toFixed(2);
                  return dynamicBodyTemplate(costPrice, 0, "$");
                }} // NOSONAR
              />
              <Column
                field="itemPrice"
                header="Selling Price"
                style={{ width: "7%" }}
                body={(data) => {
                  const itemPrice = Number(data["itemPrice"] ?? 0).toFixed(2);
                  return dynamicBodyTemplate(itemPrice, 0, "$");
                }} // NOSONAR
              />
              <Column
                field="qty"
                header="Quantity"
                style={{ width: "7%" }}
                body={(data) => dynamicBodyTemplate(data["qty"], 0)} // NOSONAR
              />
              <Column
                field="totalCostPrice"
                style={{ width: "6%" }}
                header="Total Cost Price"
                body={totalCostPriceBodyTemplate} // NOSONAR
              />
              <Column
                field="totalPrice"
                style={{ width: "6%" }}
                header="Total Selling Price"
                body={(data) => {
                  const totalPrice = Number(data["totalPrice"] ?? 0).toFixed(2);
                  return dynamicBodyTemplate(totalPrice, 0, "$");
                }} // NOSONAR
              />
            </DataTable>
          </fieldset>
        )}

        <ImageModal
          visible={showImageModal}
          imgObj={imageData}
          onCloseImageModal={handleCloseImageModal}
        />
      </div>

      <div className="card-footer">
        <button className="btn btn-danger mb-2" onClick={moveToListPage}>
          <CIcon icon={cilXCircle} className="mr-1" />
          Back
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
