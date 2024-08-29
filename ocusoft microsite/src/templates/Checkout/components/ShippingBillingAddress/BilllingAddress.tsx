import { IAddressListData } from "@templates/MyAddress/components/Address"
import { Fragment } from "react"

const BilllingAddress = ({
    address,
    onEdit,
    onNewAddress,
    onChangeBillingAddress
}: {
    address: IAddressListData
    onEdit: () => void
    onNewAddress: () => void
    onChangeBillingAddress: () => void
}) => {
    return (
        <Fragment>
            <h5 className="subtitle">Select billing address</h5>
            <div className="address-box-wrap">
                <div className="address-box active">
                    <h5>{address?.user?.first_name} {address?.user?.last_name}</h5>
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
                            onClick={() => onEdit()}
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
                            onClick={onChangeBillingAddress}
                        >
                            Change billing Address
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
            </div>
            <button
                type="button"
                className="btn btn-primary-large new-address-btn"
                aria-label="new-address-btn"
                onClick={onNewAddress}
            >
                Add New Address
            </button>
        </Fragment>
    )
}

export default BilllingAddress