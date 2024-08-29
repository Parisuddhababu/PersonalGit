import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import { StaticRoutes } from "@config/staticurl.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { IAccountPageForm } from "./components/Account";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { IAddressListData } from "@templates/MyAddress/components/Address";
import BreadCrumbs from "@components/BreadCrumbs";
import AddEditAddress from "@templates/MyAddress/components/AddEditAddress";
import { IMyOrderListData, IOrderedData } from "@type/Pages/orderDetails";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";

const MyAccount = (props: IAccountPageForm) => {
  const [userAdressList, setUserAddressList] = useState<IAddressListData[]>([]);
  const [userProfileData, setUserProfileData] = useState<IAddressListData[]>([]);
  const [defaultShippedAddress, setDefaultShippedAddress] = useState<IAddressListData[]>([]);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState<IAddressListData[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [idOfAddress, setIdOfAddress] = useState("");
  const [filteredData, setFilteredData] = useState<IAddressListData>();
  const [orderList, setOrderList] = useState<IMyOrderListData>();
  const currency = useCurrencySymbol();
  const currencySymbol = currency ?? '$'
  //edit billing adress handler
  const getDefaultShippingAdress = async () => {
    pagesServices
      .getPage(APICONFIG.GET_ADRESS_BOOK_LIST, {})
      .then((resp) => {
        setUserAddressList(resp?.data?.user_address_list?.data)
      })
  };

  useEffect(() => {
    getDefaultShippingAdress();
  }, [])
  //get profile data
  const getProfileData = async () => {
    pagesServices
      .getPage(APICONFIG.GET_PROFILE_DATA, {})
      .then((resp) => {
        setUserProfileData(resp?.data?.user_account_details)
      })
  };

  useEffect(() => {
    getDefaultShippingAdress();
    getProfileData();
  }, [])

  //for default shipped address
  useEffect(() => {
    if (userAdressList) {
      const is_default_shipped_adresses = userAdressList.filter((user: { is_default_shipped: number }) => user.is_default_shipped == 1);
      setDefaultShippedAddress(is_default_shipped_adresses);
      const is_default_billing_adresses = userAdressList.filter((user: { is_default_billing: number }) => user.is_default_billing == 1);
      setDefaultBillingAddress(is_default_billing_adresses);
    }
  }, [userAdressList]);

  const toggleModal = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  const setFormEditMode = useCallback(() => {
    setEditMode(false);
  }, [editMode]);

  const editAddress = (id: string) => {
    if (id) {
      let address = userAdressList?.find((ele: { _id: string }) => ele?._id == id);
      setFilteredData(address);
      setIdOfAddress(id);
      setEditMode(true);
      toggleModal();
    }
  };

  const handleCompleteGetDefaultShippingAddress = useCallback(() => {
    getDefaultShippingAdress();
  }, [getDefaultShippingAdress]);

  //get orders for table
  const getOrdersList = async () => {
    await pagesServices
      .postPage(APICONFIG.MY_ORDER_LIST, {})
      .then((result) => {
        setOrderList(result?.data?.order_list)
      })
  }

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
  };

  useEffect(() => {
    getOrdersList();

  }, [])

  return (
    <>
      <Head>
        <title>My Account</title>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.accountTabbing)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingOrderBox)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.orderTable)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountContent)}
        />
      </Head>
      <main>
        <BreadCrumbs item={[{ slug: '/my-account', title: 'My Account' }]} />
        <section className="account-information-section">
          <div className="container">
            <MyAccountHeaderComponent />
            <div className="my-account-content-wrap">
              <div className="account-content-title">
                <h2>My Account</h2>
              </div>
              <div className="order-information-section">
                <div className="order-shipping-table-wrapper">
                  <div className="order-shipping-table-box">
                    <table>
                      <thead>
                        <tr>
                          <th className="shipping-address">
                            Contact Information
                          </th>
                        </tr>
                      </thead>
                      {userProfileData?.map((user) => {
                        return (
                          <tbody key={user._id}>
                            <tr>
                              <td>
                                <h4 className="shipping-user">{user?.first_name} {user?.last_name}</h4>
                                <p className="shipping-box-info">
                                  {user.email}
                                </p>
                                <Link href={StaticRoutes.myProfile}>
                                  <a
                                    className="shipping-box-link"
                                  >
                                    <i className="osicon-note"></i>
                                    Edit
                                  </a>
                                </Link>
                                <Link href={`${StaticRoutes.myProfile}?password=1`}>
                                  <a
                                    className="shipping-box-link left-spacing"
                                  >
                                    <i className="osicon-reset"></i>
                                    Change Password
                                  </a>
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })

                      }

                    </table>
                  </div>
                  <div className="order-shipping-table-box">
                    <table>
                      <thead>
                        <tr>
                          <th className="shipping-address">Newsletters</th>
                        </tr>
                      </thead>
                      {userProfileData?.map((user) => {
                        return (
                          <tbody key={user._id}>
                            <tr>
                              <td>
                                <p className="shipping-box-info">{user.newsletter_selection == 1 ? "You are subscribed to General Subscription " : "  You are not subscribed to our newsletter"}

                                </p>
                                <Link href={StaticRoutes.newsletterSubscription}>
                                  <a
                                    className="shipping-box-link"
                                  >
                                    <i className="osicon-note"></i>
                                    Edit
                                  </a>
                                </Link>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })}

                    </table>
                  </div>
                </div>
              </div>
              {
                defaultBillingAddress?.length > 0 &&
                <div className="order-information-section">
                  <div className="title-with-icon">
                    <h2>Address Book</h2>
                    <Link href={StaticRoutes.userAdressBook}>
                      <a className="icon-description">
                        <i className="osicon-location"></i>
                        <span>Manage Addresses</span>
                      </a>
                    </Link>
                  </div>
                  <div className="order-shipping-table-wrapper">
                    <div className="order-shipping-table-box">
                      <table>
                        <thead>
                          <tr>
                            <th className="shipping-address">
                              Default Billing Address
                            </th>
                          </tr>
                        </thead>
                        {defaultBillingAddress.map((defaultBilling: IAddressListData) => {
                          return (
                            <tbody key={defaultBilling._id}>
                              <tr>
                                <td>
                                  <h4 className="shipping-user">{defaultBilling?.first_name} {defaultBilling?.last_name}</h4>
                                  <p className="shipping-address">
                                    {defaultBilling?.address}, {defaultBilling.city?.name}, {defaultBilling.state?.name},
                                    {defaultBilling.pincode},{defaultBilling.country?.name}
                                  </p>
                                  <Link href={`tel:${defaultBilling?.country?.country_phone_code} ${defaultBilling?.mobile_number}`}>
                                    <a
                                      className="shipping-box-link"
                                    >
                                      <i className="osicon-call"></i>
                                      {defaultBilling?.mobile_number}
                                    </a>
                                  </Link>
                                  <a
                                    className="shipping-box-link top-spacing"
                                    onClick={() => editAddress(defaultBilling?._id)}
                                  >
                                    <i className="osicon-exchange-h"></i>
                                    Edit Address
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          )
                        })}
                      </table>
                    </div>
                    <div className="order-shipping-table-box">
                      <table>
                        <thead>
                          <tr>
                            <th className="shipping-address">
                              Default Shipping Address
                            </th>
                          </tr>
                        </thead>
                        {defaultShippedAddress.map((defaultShipped: IAddressListData) => {
                          return (
                            <tbody key={defaultShipped._id}>
                              <tr>
                                <td>
                                  <h4 className="shipping-user">{defaultShipped?.first_name} {defaultShipped?.last_name}</h4>
                                  <p className="shipping-address">
                                    {defaultShipped?.address}, {defaultShipped?.city?.name}, {defaultShipped?.state?.name},{defaultShipped?.pincode},
                                    {defaultShipped?.country?.name}
                                  </p>
                                  <Link href={`tel:${defaultShipped?.country?.country_phone_code} ${defaultShipped?.mobile_number}`}>
                                    <a
                                      className="shipping-box-link"
                                    >
                                      <i className="osicon-call"></i>
                                      {defaultShipped?.mobile_number}
                                    </a>
                                  </Link>
                                  <a
                                    className="shipping-box-link top-spacing"
                                    onClick={() => editAddress(defaultShipped?._id)}
                                  >
                                    <i className="osicon-exchange-h" ></i>
                                    Edit Address
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          )
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              }
              {orderList?.data?.length! > 0 ? (
                <>
                  <div className="title-with-icon">
                    <h2>Recent orders</h2>
                    <Link href="/my-orders">
                      <a className="icon-description">
                        <i className="osicon-task-view"></i>
                        <span>View All</span>
                      </a>
                    </Link>

                  </div>
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
                                  <span>{currencySymbol} {(order?.total_cost)?.toFixed(2)}</span>
                                </td>
                                <td>
                                  <span>{getStatusLabel(order?.order_status)}</span>
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
                                  </div>
                                </td>
                              </tr>

                            </tbody>
                          )
                        })}
                      </table>
                    </div>
                  </div>
                </>
              ) : <></>}

            </div>
          </div>
        </section>
      </main >

      {modal && <AddEditAddress
        isModal={modal}
        onClose={toggleModal}
        setFormEditMode={setFormEditMode}
        showOption={true}
        idOfAddress={idOfAddress}
        editMode={editMode}
        filteredData={filteredData}
        onComplete={handleCompleteGetDefaultShippingAddress}
      />}
    </>
  );
};

export default MyAccount;
