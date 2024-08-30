import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React, { useState } from "react";
import { IAddressListData } from "../Address";

type AddressSelectionPopupProps = {
    address: IAddressListData[]
    defaultAddress: string
    onClose: () => void
    type: number
    onChange: (address?: SeletedAddress) => void
}
export type SeletedAddress = {
    id: string
    type: number
}

const AddressSelectionPopup = ({
    address,
    onClose,
    type,
    onChange,
    defaultAddress
}: AddressSelectionPopupProps) => {
    const [selectedAddress, setSelectedAddress] = useState<SeletedAddress>({
        id: defaultAddress,
        type
    })

    const onSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        e.stopPropagation()
        e.preventDefault()
        setSelectedAddress({
            id: address?.[index]?._id,
            type
        })
    }

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.modalPopup)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addressSelectionPopup)}
                />
            </Head>
            <section className="modal modal-active address-selection-popup">
                <div className="modal-container">
                    <h3 className="modal-header">
                        {`Select Default ${type === 1 ? 'Billing' : 'Shipping'} Address`}
                        <em
                            onClick={onClose}
                            className="osicon-close close-btn"
                            role="button"
                            aria-label="close-btn"
                        ></em>
                    </h3>
                    <div className="modal-content">
                        <ul className="address-list">
                            {
                                address?.map((i: IAddressListData, index: number) => (
                                    <li key={i?._id}>
                                        <div className="ocs-checkbox" onClick={(e) => onSelect(e, index)}>
                                            <input type="checkbox"
                                                key={i?._id}
                                                id={`address${index + 1}`}
                                                name={`address${index + 1}`}
                                                checked={selectedAddress.id === i?._id}
                                            />
                                            <label htmlFor="address1">
                                                {i?.address}, {i?.city?.name}, {i?.state?.name}, {i?.pincode} {i?.country?.name}
                                            </label>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <div className="address-submit-btn">
                            <button className="btn btn-primary" aria-label="submit-btn"
                                onClick={() => onChange(selectedAddress)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddressSelectionPopup;
