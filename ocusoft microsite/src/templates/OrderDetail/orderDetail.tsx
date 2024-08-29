import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import BreadCrumbs from "@components/BreadCrumbs";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMyOrderListProps, IOrderListData } from "@type/Pages/myOrders";
import { OrderItem } from "@type/Pages/orderDetails";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";

const TriggerComponent = () => (
  <button
    type="button"
    className="btn btn-primary"
    aria-label="print-order-btn"
  >
    PRINT INVOICE
  </button>
)

const MyOrderDetail = (props: IMyOrderListProps) => {
  const [orderDetails, setViewOrderDetails] = useState<IOrderListData>();
  const currency = useCurrencySymbol();
  const currencySymbol = currency ?? '$'
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    setViewOrderDetails(props?.data?.order_details)
  }, [props?.data])
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Processing';
      case 3:
        return 'Shipped';
      case 4:
        return 'Delivered';
      case 5:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.accountTabbing)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.orderTable)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.itemsOrderTable)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.commentBox)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingOrderBox)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myOrderContent)}
        />
        <title>Order Detail Page</title>
      </Head>
      <main>
        <BreadCrumbs item={[{ slug: '/my-orders', title: 'My Orders', isClickable: true }, { slug: '/', title: 'Order Detail', isClickable: false }]} />
        <section className="account-information-section my-order-section">
          <div className="container">
            <MyAccountHeaderComponent />
            <div className="my-order-content-wrap">

              <div className="account-content-title">
                <h2>My Order</h2>
              </div>
              <div className="my-order-summary-buttons">
                <ReactToPrint
                  bodyClass="print-agreement"
                  //@ts-ignore
                  content={() => ref.current}
                  trigger={TriggerComponent}
                />
              </div>
              {/* @ts-ignore */}
              <div className="print-invoice-wrapper" ref={ref}
                style={{
                  padding: 10
                }}
              >
                <div className="my-order-summary">
                  <h2>Order # {orderDetails?.order_number}</h2>
                  <div className="my-order-status-date">
                    <span>{getStatusLabel(orderDetails?.order_status as number)}</span>
                    <span>Order Date: {converDateMMDDYYYY(orderDetails?.created_at as string)}</span>
                    {orderDetails?.cancel_reason && <span>Cancel Reason:{orderDetails?.cancel_reason}</span>}
                  </div>
                </div>
                <div className="items-ordered-table-section">
                  <div className="account-content-title">
                    <h2>Items Ordered</h2>
                  </div>
                  <div className="items-order-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th className="product-info">Product</th>
                          <th className="product-sku">SKU</th>
                          <th className="product-price">Price</th>
                          <th className="product-qty">Quantity</th>
                          <th className="product-total">Total</th>
                        </tr>
                      </thead>
                      <tbody >
                        {orderDetails?.order_items?.length! > 0 ? (orderDetails?.order_items?.map((viewOrder: OrderItem) => {
                          return (
                            <tr key={viewOrder._id}>
                              <td>
                                <span>
                                  {viewOrder?.product?.name}
                                </span>
                              </td>
                              <td>
                                <span>{viewOrder?.product?.sku}</span>
                              </td>
                              <td>
                                <span>{currencySymbol}{Number(viewOrder?.item_price)?.toFixed(2)}</span>
                              </td>
                              <td>
                                <span>
                                  Ordered:<span>{viewOrder?.qty}</span>
                                </span>
                              </td>
                              <td className="product-total-value">
                                <span>{currencySymbol}{Number(viewOrder?.total_price)?.toFixed(2)}</span>
                              </td>
                            </tr>
                          )
                        })
                        ) : (
                          <tr>
                            < td >No orders available</td>
                          </tr>
                        )}
                        <tr className="product-subtotal-row">
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="product-subtotal">
                            <div>
                              <span>Subtotal</span>
                            </div>
                            <div>
                              <span>Shipping & Handling</span>
                            </div>
                            <div>
                              <span>Tax</span>
                            </div>
                          </td>
                          <td className="product-total-value">
                            <div>
                              <span>{currencySymbol}{Number(orderDetails?.cart_summary?.sub_total)?.toFixed(2) ?? 0}</span>
                            </div>
                            <div>
                              <span>{currencySymbol}{Number(orderDetails?.total_shipping_charges)?.toFixed(2) ?? 0}</span>
                            </div>
                            <div>
                              <span>{currencySymbol}{Number(orderDetails?.cart_summary?.tax_price)?.toFixed(2) ?? 0}</span>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td className="product-grand-total">
                            <span>Grand Total</span>
                          </td>
                          <td className="product-grand-total">
                            <span>{currencySymbol} {(orderDetails?.total_cost)?.toFixed(2) ?? 0}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>


                {
                  orderDetails?.tracking_number != undefined &&
                  <div className="comment-box-section">
                    <h3><strong> Tracking Number </strong>: {orderDetails?.tracking_number}</h3>
                    <button
                      type="button"
                      className="btn btn-primary"
                      aria-label="print-order-btn"
                      onClick={() => {
                        window.open(
                          `https://www.fedex.com/fedextrack/?trknbr=${orderDetails?.tracking_number}`,
                          '_blank' // <- This is what makes it open in a new window.
                        );
                      }}
                    >
                      TRACK ORDER
                    </button>
                  </div>
                }
                <div className="comment-box-section">
                  <h3>Comment Box</h3>
                  <ol className="comment-box-list" type="1">
                    {orderDetails?.order_items?.map((viewOrder: OrderItem) => {
                      return (
                        <li key={viewOrder._id}> {viewOrder?.product?.name}</li>
                      )
                    })}
                  </ol>

                </div>
                <div className="order-information-section">
                  <h2>Order Information</h2>
                  <div className="order-shipping-table-wrapper">
                    <div className="order-shipping-table-box">
                      <table>
                        <thead>
                          <tr>
                            <th className="shipping-address">Shipping Address</th>
                            <th className="shipping-method">Shipping Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <h4 className="shipping-user">{orderDetails?.shipping_address?.name}</h4>
                              <p className="shipping-address">
                                {orderDetails?.shipping_address?.address}, {orderDetails?.shipping_address?.city},
                                {orderDetails?.shipping_address?.state}, {orderDetails?.shipping_address?.zip}, {orderDetails?.shipping_address?.country}.
                              </p>
                              <Link href={`tel:${orderDetails?.shipping_address?.mobile_no}`} >
                                <a
                                  className="shipping-box-link"
                                >
                                  <i className="osicon-call"></i>
                                  {orderDetails?.shipping_address?.mobile_no}
                                </a>
                              </Link>

                            </td>
                            <td>{orderDetails?.shipping_method}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="order-shipping-table-box">
                      <table>
                        <thead>
                          <tr>
                            <th className="shipping-address">
                              Default Billing Address
                            </th>
                            <th className="shipping-method">Payment Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <h4 className="shipping-user">{orderDetails?.billing_address?.name}</h4>
                              <p className="shipping-address">
                                {orderDetails?.billing_address?.address}, {orderDetails?.billing_address?.city},
                                {orderDetails?.billing_address?.state}, {orderDetails?.billing_address?.zip}, {orderDetails?.billing_address?.country}.
                              </p>
                              <Link href={`tel:${orderDetails?.billing_address?.mobile_no}`}>
                                <a
                                  className="shipping-box-link"
                                >
                                  <i className="osicon-call"></i>
                                  {orderDetails?.billing_address?.mobile_no}
                                </a>
                              </Link>
                            </td>
                            <td>{orderDetails?.payment_method === 'STRIPE' ? 'Credit Card' : orderDetails?.payment_method}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyOrderDetail;
