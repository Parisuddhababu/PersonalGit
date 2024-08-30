import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import BreadCrumbs from "@components/BreadCrumbs";
import CancelOrderPopup from "@components/cancelPopup/cancelPopup";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import APICONFIG from "@config/api.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import Pagination from "@templates/ProductList/components/ProductListSection/pagination";
import { IMyOrderListData, IOrderedData } from "@type/Pages/orderDetails";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import { toast } from "react-toastify";

const MyOrderSection1 = () => {
  const [orderList, setOrderList] = useState<IMyOrderListData>();
  const currency = useCurrencySymbol();
  const currencySymbol = currency ?? "$";
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filterData, setFilterData] = useState({
    page: 1,
    search: "",
    page_offset: 0,
    page_limit: 10,
  });
  const [cancelId, setCancelId] = useState<string>("");
  const [onCancelPopup, setOnCancelPopup] = useState(false);
  //for status
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Processing";
      case 3:
        return "Shipped";
      case 4:
        return "Delivered";
      case 5:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  //get orders for table
  const getOrdersList = async () => {
    dispatch(setLoader(true));
    await pagesServices
      .postPage(APICONFIG.MY_ORDER_LIST, {
        search: filterData?.search?.trim(),
        start: filterData?.page_offset,
        length: filterData?.page_limit,
        page: filterData?.page,
      })
      .then((result) => {
        dispatch(setLoader(false));
        setOrderList(result?.data?.order_list);
        setTotalRecords(result?.data?.order_list?.recordsTotal);
      })
      .catch(() => {
        dispatch(setLoader(false));
      });
  };

  useEffect(() => {
    getOrdersList();
  }, [filterData]);

  //for search
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({
      ...filterData,
      search: event?.target?.value,
      page_offset: 0,
      page: 1,
    });
  };
  //pages
  const pages = useMemo(() => {
    if (!totalRecords) {
      return 0;
    }
    return Math.ceil(totalRecords / filterData?.page_limit);
  }, [totalRecords, filterData]);

  //pagination
  const pageClickHandler = useCallback(
    (page: number) => {
      const newPageOffset =
        page > Math.ceil(totalRecords / filterData?.page_limit)
          ? Math.ceil(totalRecords / filterData?.page_limit)
          : filterData?.page_limit * (page - 1);
      setFilterData({
        ...filterData,
        page_offset: newPageOffset,
        page,
      });
    },
    [filterData, totalRecords]
  );

  const onCancelOrder = (id: string) => {
    setCancelId(id);
    setOnCancelPopup(true);
  };

  // Handle the order cancellation confirmation with reason
  const handleCancelOrder = async ({
    confirmed,
    cancel_reason,
  }: {
    confirmed: boolean;
    cancel_reason: string;
  }): Promise<void> => {
    if (confirmed && cancel_reason.trim()) {
      dispatch(setLoader(true));
      await pagesServices
        .postPage(APICONFIG.CANCEL_MY_ORDER, {
          order_id: cancelId,
          cancel_reason: cancel_reason,
        })
        .then((response) => {
          if (response?.meta?.status) {
            toast.success(response?.meta?.message);
            getOrdersList();
          } else {
            toast.error(response?.meta?.message);
          }
          dispatch(setLoader(false));
        })
        .catch((error) => {
          dispatch(setLoader(false));
          toast.error("Cancellation failed: " + error.message);
        });
    }
    setOnCancelPopup(false);
    setCancelId("");
  };

  return (
    <>
      <Head>
        <title>My Orders</title>
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
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.pagination)}
        />
      </Head>
      <main>
        <BreadCrumbs item={[{ slug: "/my-orders", title: "My Orders" }]} />
        <section className="account-information-section my-order-section">
          <div className="container">
            <MyAccountHeaderComponent />
            <div className="my-order-content-wrap">
              <div className="account-content-title">
                <h2>My Order</h2>
              </div>
              <div className="search-section">
                <div className="search-box">
                  <div className="relative">
                    <input
                      name="search"
                      aria-label="my-order-search"
                      id="my-order-search"
                      type="text"
                      placeholder="Search by SKU, Product name or Order number"
                      autoComplete="off"
                      onChange={handleInputChange}
                      value={filterData?.search}
                    />
                    <i className="osicon-search"></i>
                  </div>
                </div>
              </div>
              {orderList?.data?.length! > 0 ? (
                <>
                  <div className="my-account-table-section">
                    <div className="my-account-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th className="order-id">Order #</th>
                            <th className="order-date">Date</th>
                            <th className="order-ship-to">Ship To</th>
                            <th className="order-total">Order Total</th>
                            <th className="order-status">Status</th>
                            <th className="order-action-h">Action</th>
                          </tr>
                        </thead>
                        {orderList?.data?.map((order: IOrderedData) => {
                          return (
                            <tbody key={order._id}>
                              <tr>
                                <td>
                                  <span>{order?.order_number}</span>
                                </td>
                                <td>
                                  <span>{order?.created_at}</span>
                                </td>
                                <td>
                                  <span>{order?.shipping_address?.name}</span>
                                </td>
                                <td>
                                  <span>
                                    {currencySymbol}{" "}
                                    {order?.total_cost?.toFixed(2)}
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    {getStatusLabel(order?.order_status)}
                                  </span>
                                </td>
                                <td>
                                  <div className="order-action">
                                    <Link href={`/my-orders/${order._id}`}>
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        aria-label="order-action-btn"
                                      >
                                        View Order
                                      </button>
                                    </Link>
                                    {(order?.order_status === 1 ||
                                      order?.order_status === 2) && (
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        aria-label="order-action-btn"
                                        onClick={() =>
                                          onCancelOrder(order?._id)
                                        }
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                  {totalRecords &&
                    totalRecords > filterData?.page_limit &&
                    pages > 1 && (
                      <Pagination
                        totalPages={pages}
                        onPageChange={pageClickHandler}
                      />
                    )}
                </>
              ) : (
                <h1 className="no-product-found">No Orders Available</h1>
              )}
            </div>
          </div>
        </section>
        {onCancelPopup && (
          <CancelOrderPopup
            onClose={() => setOnCancelPopup(false)}
            onCancel={handleCancelOrder}
          />
        )}
      </main>
    </>
  );
};

export default MyOrderSection1;
