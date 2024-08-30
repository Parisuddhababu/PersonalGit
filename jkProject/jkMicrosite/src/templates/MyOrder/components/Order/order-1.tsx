import CustomImage from "@components/CustomImage/CustomImage";
import Loader from "@components/customLoader/Loader";
import ErrorHandler from "@components/ErrorHandler";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { IMyorderData } from "@type/Pages/myOrders";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import useLoadMoreHook from "@components/Hooks/loadMore";
import { useEffect, useState } from "react";
import { API_SECTION_NAME } from "@config/apiSectionName";
import DeletePopup from "@components/Deletepopup/DeletePopup";
import Link from "next/link";

const MyOrderSection1 = (props: IMyorderData) => {
  const { showSuccess, showError } = useToast();
  const loaderData = useSelector((state) => state);
  const [orderList, setOrderList] = useState(props?.data);
  const dispatch = useDispatch();
  const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
  const [deleteItemData, setDeleteItemData] = useState<any>();

  const cancelOrder = (id: any) => {
    // @ts-ignore
    dispatch(setLoader(true));
    pagesServices
      .postPage(`${APICONFIG.CANCEL_ORDER}`, { order_id: id })
      .then((result) => {
        loadDataFromInit(result?.meta?.message);
      })
      .catch((err) => {
        ErrorHandler(err, showError);
        // @ts-ignore
        dispatch(setLoader(false));
      });
  };

  const loadDataFromInit = (orderDataMessage: string) => {
    pagesServices
      .getPage(APICONFIG.MY_ORDER_LIST, {})
      .then((resp) => {
        // @ts-ignore
        dispatch(setLoader(false));
        setOrderList(resp?.data.order_list.data);
        showSuccess(orderDataMessage);
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false));

        ErrorHandler(err, showError);
      });
  };

  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setShowLoadMoreButton,
  } = useLoadMoreHook();

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setOrderList([...orderList, ...loadedMoreData]);
    }
    if (props?.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const getFormData = (funcLoadMoreOfHook: any) => {
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    const object = {
      start: totalDataToget,
    };
    funcLoadMoreOfHook(
      APICONFIG.MY_ORDER_LIST,
      API_SECTION_NAME.ORDER_LIST_DATA,
      object,
      APPCONFIG.API_METHOD_NAME_FOR_LOADMOREHOOK
    );
  };

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };

  const onCloseDeleteModal = () => {
    setIsDeletePopup(false);
  };

  const handleDeleteData = (isDelete: boolean) => {
    if (isDelete) {
      cancelOrder(deleteItemData);
      setDeleteItemData(null);
      onCloseDeleteModal();
    } else {
      onCloseDeleteModal();
      setDeleteItemData(null);
    }
  };

  console.log(orderList,'OPPP')

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>

      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState && <Loader />}
      {props?.data?.length === 0 ? (
        <NoDataAvailable title="No Orders found..!!">
          <Link href="/">
            <a className="btn btn-secondary btn-small">Go to Home</a>
          </Link>
        </NoDataAvailable>
      ) : (
        <section className="my_order">
          <div className="container">
            <div className="table-wrap">
              <table className="table-container">
                <thead>
                  <tr>
                    <th className=" items-col first-item">Item</th>
                    <th className="item-col col-2"> Size</th>
                    <th className="item-col col-3">Quantity</th>
                    {/* <th className="item-col col-4">Adv.Payable</th> */}
                    <th className="item-col col-4">Waybill No</th>
                    <th className="item-col col-5">Total</th>
                  </tr>
                </thead>
                <tbody className="items-body">
                  <tr>
                    <td colSpan={5}>
                      {orderList?.map((ele, eInd) => (
                        <table key={eInd}>
                          {ele?.order_items?.map((e, index) => (
                            <tr className="item-info" key={index}>
                              <td className="first-item items-details items-col">
                                <div className="items-details-contnet items-col">
                                  <div className="items-details-img">
                                    <CustomImage
                                      src={e?.products?.images?.[0]?.path}
                                      alt="Order Image"
                                      height="140px"
                                      width="140px"
                                    />
                                  </div>

                                  <div className="items-details-content-info">
                                    <div className="items-details-info">
                                      <p>
                                        Order No.: {ele?.order_number} <br />{" "}
                                        Jewellery <br /> :{e?.product?.title}
                                      </p>
                                      {index === 0 && (
                                        <div className="payment-status">
                                          <i className="jkm-wallet"></i>{" "}
                                          {
                                            ele?.transactions
                                              ?.payment_status_text
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="item-col col-2 items-size">
                                <div className="items-col">
                                  <span> {e?.size_name}</span>
                                </div>
                              </td>
                              <td className=" item-col col-3 items-qty">
                                <div className=" items-col items-qty-set ">
                                  <span> {e?.qty} </span>
                                </div>
                              </td>
                              <td className="item-col col-4 payable">
                                <div className="items-col">
                                  <span>
                                    {e?.waybill_no ?? '-'}
                                  </span>
                                </div>
                              </td>
                              <td className="item-col col-5 items-amout">
                                <div className="items-col">
                                  <span className="items-amout-amt">
                                    {ele?.currency_symbol} {Math.round(e?.total_price).toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                          <tr className="item-action">
                            <td colSpan={2} className="item-action-col">
                              <div className="action-toolbars">
                                <Link href={`/my-orders/${ele?._id}`}>
                                  <a className="order-details">Order Details</a>
                                </Link>
                                {
                                  ele?.order_items?.[0]?.waybill_no != undefined &&
                                  <a className="order-details" href="https://bluedart.com" target="_blank" rel="noreferrer">Track Order</a>
                                }
                                {ele?.order_status !== 7 &&
                                  ele?.order_status !== 1 ? (
                                  <a
                                    onClick={() => {
                                      setIsDeletePopup(true);
                                      setDeleteItemData(ele?._id);
                                    }}
                                    className="order-details"
                                  >
                                    Cancel order
                                  </a>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </td>
                          </tr>
                        </table>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
              {showLoadMoreButton && (
                <div className="flex-center load-more">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={loadMoreFunctionCall}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {isDeletePopup && (
        <DeletePopup
          onClose={onCloseDeleteModal}
          isDelete={(isDelete) => handleDeleteData(isDelete)}
          message="Are you sure you want to cancel Order?"
        />
      )}
    </>
  );
};

export default MyOrderSection1;
