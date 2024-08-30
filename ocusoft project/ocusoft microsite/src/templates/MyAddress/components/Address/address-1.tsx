import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import AddEditAddress from "../AddEditAddress";
import { IAddressListData, IAddressListPropsData } from ".";
import { useDispatch, useSelector } from "react-redux";
import { ISignInReducerData } from "@type/Common/Base";
import { useRouter } from "next/router";
import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import pagesServices from "@services/pages.services";
import { toast } from "react-toastify";
import ErrorHandler from "@components/ErrorHandler";
import DeletePopup from "@components/Deletepopup/DeletePopup";
import BreadCrumbs from "@components/BreadCrumbs";
import AddressSelectionPopup, { SeletedAddress } from "../AddressSelectionPopup";
import APICONFIG from "@config/api.config";
import { setLoader } from "src/redux/loader/loaderAction";
import Link from "next/link";

const MyAddressSection1 = ({
  useraddressDetails,
  showOption,
}: IAddressListPropsData) => {
  const [editMode, setEditMode] = useState(false);
  const [idOfAddress, setIdOfAddress] = useState("");
  const router = useRouter();
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const [filteredData, setFilteredData] = useState<IAddressListData>();
  const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
  const [deleteItemData, setDeleteItemData] = useState<string | null>("");
  const [modal, setModal] = useState<boolean>(false);
  const [defaultShippedAddress, setDefaultShippedAddress] = useState<IAddressListData[]>([]);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState<IAddressListData[]>([]);
  const [addressSelection, setAddressSelection] = useState({
    isOpen: false,
    type: 0
  })
  const [userAddress, setUserAddress] = useState<IAddressListData[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (reduxData?.guestUserRootReducer?.guestUserFlag) {
      router.push("/sign-in");
    }
    setUserAddress(useraddressDetails)
  }, []);
  const setFormEditMode = useCallback(() => {
    setEditMode(false);
  }, [editMode]);

  const getAllAddresses = () => {
    dispatch(setLoader(true))
    pagesServices
      .getPage(APICONFIG.GET_ADRESS_BOOK_LIST, {})
      .then((result) => {
        dispatch(setLoader(false))
        if (result?.data?.user_address_list?.data?.length) {
          setUserAddress(result?.data?.user_address_list?.data)
        }
      })
      .catch(() => {
        dispatch(setLoader(false))
      });
  }

  //edit adress
  const editAddress = (id: string) => {
    if (id) {
      let address = userAddress?.find((ele: { _id: string }) => ele?._id == id);
      setFilteredData(address);
      setIdOfAddress(id);
      setEditMode(true);
      toggleModal();
    }
  };

  ///delete address
  const deleteAddress = (id: string) => {
    if (defaultShippedAddress?.[0]._id === id && defaultBillingAddress?.[0]?._id === id) {
      toast.error('Cannot delete default billing and  shipping address');
      return;
    }
    if (defaultBillingAddress?.[0]?._id === id) {
      toast.error('Cannot delete default biling address');
      return;
    };
    if (defaultShippedAddress?.[0]._id === id) {
      toast.error('Cannot delete default shipping address');
      return;
    };
    dispatch(setLoader(true));
    pagesServices
      .DeletePage(id)
      .then((result) => {
        dispatch(setLoader(false))
        if (result.meta.status) {
          if (showOption) {
            router.push("/cart/checkout_list/");
          } else {
            router.push("/user-address-book");
          }
          toast.success(result?.meta?.message);
        }
      })
      .catch((error) => {
        dispatch(setLoader(false))
        ErrorHandler(error, toast.error);
      });
  };

  const onCloseDeleteModal = useCallback(() => {
    setIsDeletePopup(false);
  }, [isDeletePopup]);

  const handleDeleteData = useCallback((isDelete: boolean) => {
    if (isDelete) {
      if (deleteItemData) {
        deleteAddress(deleteItemData);
      }
      setDeleteItemData(null);
      getAllAddresses()
      onCloseDeleteModal();
    } else {
      onCloseDeleteModal();
      setDeleteItemData(null);
    }
  }, [deleteItemData, deleteAddress, onCloseDeleteModal]);

  const toggleModal = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  //for default shipped address
  useEffect(() => {
    if (userAddress) {
      const is_default_shipped_adresses = userAddress.filter((user) => user.is_default_shipped == 1);
      setDefaultShippedAddress(is_default_shipped_adresses);
      const is_default_billing_adresses = userAddress.filter((user) => user.is_default_billing == 1);
      setDefaultBillingAddress(is_default_billing_adresses);
    }
  }, [userAddress]);


  const onDefaultAddressChange = useCallback((address?: SeletedAddress) => {
    let obj: { is_default_billing?: number; is_default_shipped?: number } = {
      is_default_billing: 1
    }
    if (address?.type === 2) {
      obj = {
        is_default_shipped: 1
      }
    }
    if (!address?.id) {
      return
    }
    setAddressSelection({
      type: 0,
      isOpen: false
    })
    dispatch(setLoader(true))
    pagesServices
      .postPage(`${APICONFIG.CHANGE_DEFAULT_ADDRESS}${address?.id}`, obj)
      .then((result) => {
        dispatch(setLoader(false))
        if (result?.meta?.status_code === 200) {
          toast.success(result?.meta?.message)
          getAllAddresses()
          return
        }
        toast.error(result?.meta?.message)
      })
      .catch((error) => {
        dispatch(setLoader(false))
        ErrorHandler(error, toast.error);
      });
  }, [getAllAddresses, addressSelection])

  const handleComplete = useCallback(() => {
    getAllAddresses(); // Call getAllAddresses function directly
  }, [getAllAddresses]);

  const handleCloseAddressSelection = useCallback(() => {
    setAddressSelection({
      isOpen: false,
      type: 0
    });
  }, [addressSelection]);
  return (
    <>
      <Head>
        <title>Address Book</title>
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
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addressEntryTable)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addressBookContent)}
        />
      </Head>
      <main>
        <BreadCrumbs item={[{ slug: '/user-address-book', title: 'Address Book' }]} />
        <section className="account-information-section">
          <div className="container">
            <MyAccountHeaderComponent />
            <div className="account-right-content-wrap address-book-content-wrap">
              <div className="account-content-title">
                <h2>Address Book</h2>
              </div>
              {
                (defaultBillingAddress?.length > 0 || defaultShippedAddress?.length > 0) &&
                <div className="order-information-section">
                  <div className="order-shipping-table-wrapper">
                    {
                      defaultBillingAddress?.length > 0 &&
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
                                      href="javascript:void(0)"
                                      className="shipping-box-link top-spacing"
                                      onClick={() => setAddressSelection({
                                        isOpen: true,
                                        type: 1
                                      })}
                                    >
                                      <i className="osicon-exchange-h"></i>
                                      Change Billing Address
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            )
                          })}
                        </table>
                      </div>
                    }
                    {
                      defaultShippedAddress?.length > 0 &&
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
                                      href="javascript:void(0)"
                                      className="shipping-box-link top-spacing"
                                      onClick={() => setAddressSelection({
                                        isOpen: true,
                                        type: 2
                                      })}
                                    >
                                      <i className="osicon-exchange-h" ></i>
                                      Change shipping Address
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            )
                          })}
                        </table>
                      </div>
                    }
                  </div>
                </div>
              }

              <div className="address-entries-section">
                <h2>Additional Address Entries</h2>
                <div className="address-entries-table-wrap">
                  <div className="address-entries-table-box">
                    <table>
                      <thead>
                        <tr>
                          <th className="first-name">First Name</th>
                          <th className="last-name">Last Name</th>
                          <th className="street-address">Street Address</th>
                          <th className="city-name">City</th>
                          <th className="country-name">Country</th>
                          <th className="state-name">State</th>
                          <th className="postal-code">Zip Code</th>
                          <th className="phone-number">Phone</th>
                          <th className="address-first-name">Action</th>
                        </tr>
                      </thead>
                      {userAddress?.map((ele: IAddressListData) => {
                        return (
                          <tbody key={ele._id}>
                            <tr>
                              <td>{ele?.first_name}</td>
                              <td>{ele?.last_name}</td>
                              <td>{ele?.address}</td>
                              <td>{ele?.city?.name}</td>
                              <td>{ele?.country?.name}</td>
                              <td>{ele?.state?.name}</td>
                              <td>{ele?.pincode}</td>
                              <td>{ele.mobile_number}</td>
                              <td className="action-buttons">
                                <i className="osicon-note" onClick={() => editAddress(ele?._id)}></i>

                                <i className="osicon-trash" onClick={() => {
                                  setIsDeletePopup(true);
                                  setDeleteItemData(ele?._id);
                                }}></i>
                              </td>
                            </tr>
                          </tbody>
                        )
                      })}

                    </table>
                  </div>
                </div>
                <div className="new-address-and-filter">
                  <button
                    className="btn btn-primary"
                    aria-label="add-new-address-btn"
                    type="button"
                    onClick={toggleModal}
                  >
                    ADD NEW ADDRESS
                  </button>
                </div>
              </div>
              <div>
                {
                  addressSelection.isOpen &&
                  <AddressSelectionPopup
                    address={useraddressDetails}
                    onClose={handleCloseAddressSelection}
                    type={addressSelection?.type}
                    onChange={onDefaultAddressChange}
                    defaultAddress={addressSelection?.type === 1 ? defaultBillingAddress?.[0]?._id : defaultShippedAddress?.[0]?._id}
                  />
                }

                {modal && <AddEditAddress
                  isModal={modal}
                  onClose={toggleModal}
                  setFormEditMode={setFormEditMode}
                  showOption={showOption}
                  idOfAddress={idOfAddress}
                  editMode={editMode}
                  filteredData={filteredData}
                  onComplete={handleComplete}
                />}
              </div>
              {isDeletePopup && (
                <DeletePopup
                  onClose={onCloseDeleteModal}
                  isDelete={handleDeleteData}
                  message="Are you sure you want to delete address?"
                />
              )}
            </div>
          </div>
        </section >
      </main >
    </>
  );
};

export default MyAddressSection1;




