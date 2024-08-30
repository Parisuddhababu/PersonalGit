import { IAddressListData } from "@templates/MyAddress/components/Address"
import { Fragment } from "react"

const ShippingAddress = ({
    address,
    billingAddress,
    onEdit,
    onNewAddress,
    onChangeShippingAddress,
    isBillingAddressSame = false,
    setBillingAddress
}: {
    address: IAddressListData
    billingAddress?: IAddressListData
    onEdit: (type: number) => void
    onNewAddress: () => void
    onChangeShippingAddress: (type: number) => void
    isBillingAddressSame?: boolean
    setBillingAddress: (status: boolean) => void
}) => {
    return (
        <Fragment>
            {
                !isBillingAddressSame &&
                <h5 className="subtitle">Select shipping and billing address</h5>
            }
            <br />
            <div className="ocs-checkbox">
                <input
                    type="checkbox"
                    id="same-address"
                    name="same-address"
                    checked={isBillingAddressSame}
                    onChange={(e) => setBillingAddress(e.target.checked)}
                />
                <label htmlFor="same-address">
                    My billing address same as shipping address
                </label>
            </div>
            <div className="address-box-wrap">
                <div className="address-box active">
                    <h5>{address?.first_name} {address?.last_name}</h5>
                    <address>
                        {address?.address},
                        <br /> {address?.city?.name}, {address?.pincode},
                        <br /> {address?.country?.name}
                    </address>
                    <div className="address-phone-number">
                        <span>Phone number: </span>
                        <span>{address?.mobile_number}</span>
                    </div>
                    <div className="edit-btn">
                        <a
                            role="button"
                            aria-label="edit-btn"
                            onClick={() => onEdit(2)}
                        >
                            <em className="osicon-note-fill"></em>
                            Edit
                        </a>
                    </div>
                    {
                        !isBillingAddressSame &&
                        <div className="address-box-btn">
                            <button
                                type="button"
                                className="btn btn-primary-large"
                                aria-label="ship-address-btn"
                                onClick={() => onChangeShippingAddress(2)}
                            >
                                Change Shipping Address
                            </button>
                        </div>
                    }

                    <div className="ocs-checkbox">
                        <input
                            type="checkbox"
                            id="add-check1"
                            name="add-check1"
                            checked
                        />
                        <label htmlFor="add-check1"></label>
                    </div>
                </div>
                {
                    !isBillingAddressSame && billingAddress &&
                    <div className="address-box active">
                        <h5>{billingAddress?.first_name} {billingAddress?.last_name}</h5>
                        <address>
                            {billingAddress?.address},
                            <br /> {billingAddress?.city?.name}, {billingAddress?.pincode},
                            <br /> {billingAddress?.country?.name}
                        </address>
                        <div className="address-phone-number">
                            <span>Phone number: </span>
                            <span>{billingAddress?.mobile_number}</span>
                        </div>
                        <div className="edit-btn">
                            <a
                                role="button"
                                aria-label="edit-btn"
                                onClick={() => onEdit(1)}
                            >
                                <em className="osicon-note-fill"></em>
                                Edit
                            </a>
                        </div>
                        <div className="address-box-btn">
                            <button
                                type="button"
                                className="btn btn-primary-large"
                                aria-label="ship-address-btn"
                                onClick={() => onChangeShippingAddress(1)}
                            >
                                Change Billing Address
                            </button>
                        </div>
                        <div className="ocs-checkbox">
                            <input
                                type="checkbox"
                                id="add-check1"
                                name="add-check1"
                                checked
                            />
                            <label htmlFor="add-check1"></label>
                        </div>
                    </div>
                }
            </div>
            {
                !isBillingAddressSame &&
                <button
                    type="button"
                    className="btn btn-primary-large new-address-btn"
                    aria-label="new-address-btn"
                    onClick={onNewAddress}
                >
                    ADD NEW ADDRESS
                </button>
            }

        </Fragment>
    )
}

export default ShippingAddress