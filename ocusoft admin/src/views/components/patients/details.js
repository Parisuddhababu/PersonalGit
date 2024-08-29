import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/saga-blue/theme.css";

import CIcon from "@coreui/icons-react";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { cilBook, cilCheck, cilCheckCircle, cilPencil, cilTrash, cilXCircle } from "@coreui/icons";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { API } from "src/services/Api";
import { Column } from "primereact/column";
import AddressDetail from "./address-details";
import { useToast } from "src/shared/toaster/Toaster";
import PrescribedProducts from "./prescribed-products";
import * as Constant from "src/shared/constant/constant";
import Loader from "src/views/components/common/loader/loader";
import { isEmpty, orderStatusDirectory, displayDateTimeFormat } from "src/shared/handler/common-handler";
import AddAddress from "./add-address";
import UpdateAddress from "./update-address";
import DeleteAddress from "./DeleteAddress";
import RecommendedProducts from "./recommended-products/recommended-products";

const PatientDetails = () => {
    const history = useHistory();
    const { showError, showSuccess } = useToast();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const textDecoratedStyles = { color: "blue", cursor: "pointer", textDecoration: "underline" };

    const [isLoading, setIsLoading] = useState(false);
    const [patientDetails, setPatientDetails] = useState(null);
    const [addressDetails, setAddressDetails] = useState(null);
    const [orderHistoryList, setOrderHistoryList] = useState([]);
    const [viewAddressDetails, setViewAddressDetails] = useState(false);
    const [addAddressModal, setAddAddressModal] = useState(false)
    const [updateAddressModal, setUpdateAddressModal] = useState(false)
    const [_editAddress, setEditAddress] = useState()
    const [deleteAddressModal, setDeleteAddressModal] = useState(false)
    const [deleteId, setDeleteId] = useState('')

    useEffect(() => {
        getPatientDetails();
    }, []);

    const getPatientDetails = () => {
        setIsLoading(true);
        API.getDrpData(handleGetPatientDetailsResponseObj, null, true, `${Constant.PATIENT_DETAILS}/${id}`);
    }

    const handleGetPatientDetailsResponseObj = {
        cancel: () => { },
        success: response => { // NOSONAR
            setIsLoading(false);
            if (response?.meta?.status && response?.data) {
                const responseData = response.data;
                setPatientDetails({
                    id: responseData?._id ?? '',
                    email: responseData?.email ?? '',
                    phone: responseData?.mobile ?? '',
                    name: responseData?.username ?? '',
                    hcpId: responseData?.account?._id ?? '',
                    hcpCode: responseData?.account?.code ?? '',
                    addressList: responseData?.user_address ?? [],
                    orderCount: responseData?.total_order_count ?? 0,
                    hcpName: responseData?.account?.company_name ?? '',
                    lastOrderDate: responseData?.latestOrderDate ?? null,
                    phoneCode: responseData?.country?.country_phone_code ?? '',
                    totalCost: +(responseData?.total_spend_money ?? 0)?.toFixed(2) ?? 0,
                });

                let _orderHistoryList = [];
                const responseOrders = responseData?.orders ?? [];
                if (responseOrders?.length) {
                    _orderHistoryList = responseOrders?.map(orderData => {
                        const { shipping_address: shipAddr, billing_address: billAddr } = orderData;

                        return {
                            id: orderData?._id ?? '',
                            number: orderData?.order_number ?? '',
                            date: displayDateTimeFormat(orderData?.created_at ?? null),
                            cost: orderData?.cart_summary?.total_price ?? 0,
                            status: orderStatusDirectory?.[+(orderData?.order_status) ?? 1] ?? "Not available",
                            paymentStatus: orderData?.transactions?.payment_status_text ?? "Payment pending",
                            shippingAddress: {
                                name: shipAddr?.name ?? '',
                                phone: shipAddr?.mobile_no ?? '',
                                address: shipAddr?.address ?? '',
                                city: shipAddr?.city ?? '',
                                state: shipAddr?.state ?? '',
                                country: shipAddr?.country ?? '',
                                zip: shipAddr?.zip ?? '',
                            },
                            shortShippingAddress: shipAddr?.address ?? '',
                            billingAddress: {
                                name: billAddr?.name ?? '',
                                phone: billAddr?.mobile_no ?? '',
                                address: billAddr?.address ?? '',
                                city: billAddr?.city ?? '',
                                state: billAddr?.state ?? '',
                                country: billAddr?.country ?? '',
                                zip: billAddr?.zip ?? '',
                            },
                            shortBillingAddress: billAddr?.address ?? '',
                        }
                    });
                }

                setOrderHistoryList([..._orderHistoryList]);
            }
        },
        error: err => {
            console.log(err);
            setIsLoading(false);
            const message = err?.meta?.message ?? "Something went wrong!";
            showError(message);
        },
        complete: () => { }
    }

    const moveToListPage = () => {
        history.push("/patients");
    }

    const openAddressDetails = addressDetails => {
        setViewAddressDetails(true);
        setAddressDetails(addressDetails);
    }

    const closeAddressDetails = () => {
        setAddressDetails(null);
        setViewAddressDetails(false);
    }

    const moveToDetailsPage = id => {
        if (id) history.push(`/orders/view/?id=${id}`);
        else showError("order id is unavailable.");
    }

    const nameBodyTemplate = rowData => {
        const { first_name: fName, last_name: lName } = rowData;
        return <>{(fName || lName) ? `${fName ?? ''} ${lName ?? ''}` : Constant.NO_VALUE}</>;
    }

    const dynamicBodyTemplate = (rowData, ...keys) => {
        let value = rowData;

        for (const key of keys) {
            value = value?.[key] ?? '';
            if (!value) break;
        }

        return <>{!isEmpty(value) ? value : Constant.NO_VALUE}</>;
    }

    const addressLineBodyTemplate = rowData => {
        return <>{rowData?.address ?? Constant.NO_VALUE}</>;
    }

    const pincodeBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "pincode");
    }

    const orderNumberBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "number");
    }

    const orderDateBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "date");
    }

    const costBodyTemplate = rowData => {
        return <>{!isEmpty(rowData?.cost) ? `${(Number(rowData.cost)).toFixed(2)}` : Constant.NO_VALUE}</>;
    }

    const orderStatusBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "status");
    }

    const paymentStatusBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "paymentStatus");
    }

    const shippingAddressBodyTemplate = rowData => {
        return (
            <span
                title="click to view full address details"
                onMouseOut={e => { e.target.style = {}; }}
                onClick={() => { openAddressDetails(rowData.shippingAddress); }}
                onMouseOver={e => {
                    for (const key in textDecoratedStyles) e.target.style[key] = textDecoratedStyles[key];
                }}
            >
                {rowData?.shortShippingAddress ?? Constant.NO_VALUE}
            </span>
        );
    }

    const billingAddressBodyTemplate = rowData => {
        return (
            <span
                title="click to view full address details"
                onMouseOut={e => { e.target.style = {}; }}
                onClick={() => { openAddressDetails(rowData.billingAddress); }}
                onMouseOver={e => {
                    for (const key in textDecoratedStyles) e.target.style[key] = textDecoratedStyles[key];
                }}
            >
                {rowData?.shortBillingAddress ?? Constant.NO_VALUE}
            </span>
        );
    }

    const cityBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "city", "name");
    }

    const stateBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "state", "name");
    }

    const countryBodyTemplate = rowData => {
        return dynamicBodyTemplate(rowData, "country", "name");
    }

    const onChangeDefaultAddress = (type = 0, _id) => {
        let body = { is_default_shipped: 1, user_id: id }
        if (type === 1) {
            body = { is_default_billing: 1, user_id: id }
        }

        setIsLoading(true)
        API.changeDefaultAddress(changeDefaultAddress, body, true, _id);
    }

    const changeDefaultAddress = {
        cancel: () => {
            setIsLoading(false)
        },
        success: (response) => { // NOSONAR
            setIsLoading(false)
            console.log(response, 'RESPONSE')
            if (response.meta.status_code === 200) {
                showSuccess(response.meta?.message)
                getPatientDetails()
                return
            }
            showError(response.meta?.message)
        },
        error: err => {
            console.log(err);
            setIsLoading(false)
            showError('Failed to create an address, try again.')
        },
        complete: () => {
        },
    }

    const defaultShippingBodyTemplate = rowData => {
        return <button
            onClick={() => {
                if (rowData?.is_default_shipped) {
                    return
                }
                onChangeDefaultAddress(0, rowData?._id)
            }}
            className={`btn btn-link text-${+(rowData?.is_default_shipped) ? 'success' : 'danger'}`} title="Default shipping address">
            <CIcon icon={cilCheckCircle} size="lg" />
        </button>
    }

    const defaultBillingBodyTemplate = rowData => {
        return <button
            onClick={() => {
                if (rowData?.is_default_billing) {
                    return
                }
                onChangeDefaultAddress(1, rowData?._id)
            }}
            className={`btn btn-link text-${+(rowData?.is_default_billing) ? 'success' : 'danger'}`} title="Default shipping address">
            <CIcon icon={cilCheckCircle} size="lg" />
        </button>
    }
    const editAddress = rowData => {
        return <button className="btn btn-link" title="Default billing address" onClick={() => {
            setEditAddress(rowData)
            setUpdateAddressModal(true)
        }}>
            <CIcon icon={cilPencil} size="lg" />
        </button>
    }
    const deleteAddress = rowData => {
        return <button className="btn btn-link" title="Default billing address" onClick={() => {
            setDeleteId(rowData?._id)
            setDeleteAddressModal(true)
        }
        }>
            <CIcon icon={cilTrash} size="lg" />
        </button>
    }

    const viewBodyTemplate = rowData => {
        return (
            <a title="View" className="mr-2 cursor-pointer" onClick={() => { moveToDetailsPage(rowData.id); }}>
                <CIcon icon={cilBook} size="lg" />
            </a>
        );
    }

    return (
        <div className="card">
            {isLoading && <Loader />}
            <div className="card-header">
                <h5 className="card-title">Patient Details</h5>
            </div>

            <div className="card-body" style={{ fontSize: "15px" }}>

                <TabView className="shadow" activeIndex={0}>
                    <TabPanel header="General">
                        <div className="row">
                            <div className="col-lg-4 fw-bold">HCP</div>
                            <div className="col-lg-4">
                                {`${patientDetails?.hcpName ? patientDetails.hcpName : "--"} ${patientDetails?.hcpCode ? `(${patientDetails.hcpCode})` : ''}` /* NOSONAR */}
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-4 fw-bold">Name</div>
                            <div className="col-lg-4">
                                {patientDetails?.name ? patientDetails.name : "--"}
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-4 fw-bold">Email</div>
                            <div className="col-lg-4">
                                {patientDetails?.email ? patientDetails.email : "--"}
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-4 fw-bold">Mobile number</div>
                            <div className="col-lg-4">
                                {`${patientDetails?.phoneCode ?? ''} ${patientDetails?.phone ?? "--"}`}
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-4 fw-bold">No. of orders</div>
                            <div className="col-lg-4">{patientDetails?.orderCount ?? 0}</div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-4 fw-bold">Total purchase amount</div>
                            <div className="col-lg-4">{`$${patientDetails?.totalCost ?? 0}`}</div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg-4 fw-bold">Last order date</div>
                            <div className="col-lg-4">
                                {
                                    patientDetails?.lastOrderDate
                                        ? displayDateTimeFormat(patientDetails.lastOrderDate)
                                        : <>--</>
                                }
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Addresses">
                        <div className="row">

                            <div className="col-md-12 d-flex justify-content-end">
                                <button className="btn btn-primary mb-2 mr-2"
                                    onClick={() => { setAddAddressModal(true) }}>
                                    <CIcon icon={cilCheck} />&nbsp;Add Address
                                </button>
                            </div>
                            {
                                addAddressModal &&
                                <AddAddress close={() => setAddAddressModal(false)}
                                    id={id}
                                    completed={() => getPatientDetails()}
                                />
                            }
                            {
                                updateAddressModal &&
                                <UpdateAddress
                                    close={() => setUpdateAddressModal(false)}
                                    id={id}
                                    completed={() => getPatientDetails()}
                                    address={_editAddress}
                                />
                            }
                            {
                                deleteAddressModal &&
                                <DeleteAddress
                                    close={() => setDeleteAddressModal(false)}
                                    completed={() => getPatientDetails()}
                                    address={deleteId}
                                />
                            }
                        </div>
                        {
                            patientDetails?.addressList?.length > 0 ? (
                                <DataTable
                                    stripedRows
                                    showGridlines
                                    responsiveLayout="scroll"
                                    value={patientDetails.addressList}
                                    className="p-datatable-responsive-demo"
                                >
                                    {<Column field="name" header="Name" body={nameBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="address" header="Address line" body={addressLineBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="pincode" header="Pincode" body={pincodeBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="city.name" header="City" body={cityBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="state.name" header="State" body={stateBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="country.name" header="Country" body={countryBodyTemplate} /> /* NOSONAR */}
                                    {
                                        <Column
                                            field="address"
                                            header="Is default shipping"
                                            body={defaultShippingBodyTemplate} // NOSONAR
                                        />
                                    }
                                    {
                                        <Column
                                            field="address"
                                            header="Is default billing"
                                            body={defaultBillingBodyTemplate} // NOSONAR
                                        />
                                    }
                                    {
                                        <Column
                                            field="address"
                                            header="Edit"
                                            body={editAddress} // NOSONAR
                                        />
                                    }
                                    {
                                        <Column
                                            field="address"
                                            header="Delete"
                                            body={deleteAddress} // NOSONAR
                                        />
                                    }
                                </DataTable>
                            ) : (
                                <div className="d-flex justify-content-center fst-italic">
                                    No addresses have been registered by the patient.
                                </div>
                            )
                        }
                    </TabPanel>

                    <TabPanel header="Order History">
                        {
                            orderHistoryList?.length > 0 ? (
                                <DataTable
                                    stripedRows
                                    showGridlines
                                    value={orderHistoryList}
                                    responsiveLayout="scroll"
                                    className="p-datatable-responsive-demo"
                                >
                                    {<Column field="number" header="Number" body={orderNumberBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="date" header="Date" body={orderDateBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="cost" header="Cost (USD)" body={costBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="status" header="Order status" body={orderStatusBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="paymentStatus" header="Payment status" body={paymentStatusBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="shippingAddress" header="Shipping address" body={shippingAddressBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="billingAddress" header="Billing address" body={billingAddressBodyTemplate} /> /* NOSONAR */}
                                    {<Column field="_id" header="View details" body={viewBodyTemplate} /> /* NOSONAR */}
                                </DataTable>
                            ) : (
                                <div className="d-flex justify-content-center fst-italic">
                                    No orders have been placed by the patient.
                                </div>
                            )
                        }
                    </TabPanel>

                    <TabPanel header="Prescribed Products">
                        <PrescribedProducts hcpId={patientDetails?.hcpId} userId={patientDetails?.id} />
                    </TabPanel>
                    <TabPanel header="Recommended Products">
                        <RecommendedProducts hcpId={patientDetails?.hcpId} userId={patientDetails?.id} />
                    </TabPanel>
                </TabView>

                {
                    viewAddressDetails && (
                        <AddressDetail closeDetailsDialog={closeAddressDetails} addressDetails={addressDetails} />
                    )
                }
            </div>

            <div className="card-footer">
                <button className="btn btn-danger mb-2" onClick={moveToListPage}>
                    <CIcon icon={cilXCircle} className="mr-1" />Back
                </button>
            </div>
        </div>
    );
};

export default PatientDetails;
