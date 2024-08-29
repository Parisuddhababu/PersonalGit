import { IShipping } from "@type/Pages/cart";

const ShippingMethod = ({ items, onSelectShippingMethod, shippingMethod, onHandleNext }: {
    items: IShipping[]
    onSelectShippingMethod: (method: IShipping) => void
    shippingMethod: IShipping
    onHandleNext: () => void
}) => {
    const onChange = (method: IShipping) => {
        onSelectShippingMethod(method);
    }

    return (
        <div className="shipping-method-section">
            <div className="shipping-methods-wrap">
                <h2 className="shipping-title">SHIPPING METHODS</h2>
                <h3 className="shipping-warning-message">
                    Orders placed after 3pm Central time may not ship until the
                    following business day. Orders do not ship and are not
                    delivered on weekends.
                </h3>
                <ul className="shipping-method-list">
                    {
                        items?.map((i: IShipping) => (
                            <li key={i?._id}>
                                <div className="ocs-radio">
                                    <input type="radio" id={i?._id} name="shipping-method"
                                        checked={shippingMethod?._id === i._id}
                                        onChange={() => onChange(i)}
                                    />
                                    <label htmlFor={i?._id}>{i?.title}</label>
                                </div>
                                {/* <span className="shipping-cost">{currencySymbol}{i?.rate}</span> */}
                            </li>
                        ))
                    }

                </ul>
                {
                    shippingMethod?.rate !== undefined &&
                    <button
                        type="button"
                        className="btn btn-primary next-btn"
                        aria-label="next-btn"
                        onClick={onHandleNext}
                    >
                        NEXT
                    </button>
                }

            </div>
        </div>
    )
}

export default ShippingMethod;
