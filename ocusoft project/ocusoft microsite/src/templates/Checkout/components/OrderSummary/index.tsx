import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { IAddressListData } from "@templates/MyAddress/components/Address";
import { useRouter } from "next/router";
import { useMemo } from "react";

const OrderSummary = ({ items, summary, defaultAddress, shippingMethod, step, goToPreviousStep }: {
    items: any
    summary: any
    defaultAddress: IAddressListData
    shippingMethod: any
    step: number
    goToPreviousStep: () => void
}) => {
    const router = useRouter()
    const currency = useCurrencySymbol();
    const currencySymbol = currency ?? '$'

    const totalPrice = useMemo(() => {
        if (shippingMethod?.rate != undefined) {
            return (Number(summary?.total_price) + Number(shippingMethod?.rate)).toFixed(2)
        }
        return Number(summary?.total_price)
    }, [shippingMethod?.rate])

    return (
        <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-box">
                <div className="order-wrapper">
                    <h3 className="summary-subtitle">Summary</h3>
                    <table className="summary-table">
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>{currencySymbol}{summary?.sub_total}</td>
                            </tr>
                            {
                                shippingMethod?.rate != undefined &&
                                <tr>
                                    <td>Shipping</td>
                                    <td>{currencySymbol}{shippingMethod?.rate}</td>
                                </tr>
                            }
                            <tr>
                                <td>Tax</td>
                                <td>{currencySymbol}{Number(summary?.tax_price)?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Cart Total</td>
                                <td>{currencySymbol}{totalPrice}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="order-wrapper">
                    <h3 className="summary-subtitle">Standard Shipping</h3>
                    <h5>{items?.length} items in cart</h5>
                    {
                        items?.map((i: any) => (
                            <div className="shipping-product-detail" key={i?._id}>
                                <figure>
                                    <picture>
                                        <source
                                            srcSet={i?.products?.product_detail?.base_image ?? "/assets/images/shipping-product-img1.webp"}
                                            type="image/webp"
                                        />
                                        <img
                                            src={i?.products?.product_detail?.base_image ?? "/assets/images/shipping-product-img1.jpg"}
                                            alt="shipping-product"
                                            title="shipping-product"
                                            height="85"
                                            width="85"
                                        />
                                    </picture>
                                </figure>
                                <div className="shipping-product-description">
                                    <p>
                                        {i?.products?.product_detail?.name}
                                    </p>
                                    <div className="shipping-product-qty">
                                        <span>Qty:</span>
                                        <span>{Number(router?.query?.is_buy_now) === 1 ? i?.buy_now_qty : i?.qty}</span>
                                    </div>
                                    <span className="shipping-product-price">{currencySymbol}{(i?.products?.selling_price * Number(
                                        Number(router?.query?.is_buy_now) === 1 ? i?.buy_now_qty : i?.qty
                                    )).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                step === 2 &&
                <div className="shipping-to">
                    <div className="shipping-box">
                        <h4>
                            Ship To:
                            <a onClick={() => {
                                goToPreviousStep()
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <i className="osicon-note"></i>
                            </a>
                        </h4>
                        <div className="shipping-address">
                            <span>{defaultAddress?.user?.first_name} {defaultAddress?.user?.last_name}</span>
                            <address>
                                {defaultAddress?.address}
                                <br />
                                {defaultAddress?.city?.name}, {defaultAddress?.state?.name}, {defaultAddress?.pincode}
                                <br />
                                {defaultAddress?.country?.name}
                                <br />
                                <a className="link">
                                    {defaultAddress?.mobile_number}
                                </a>
                            </address>
                        </div>
                    </div>
                    <div className="shipping-box">
                        <h4>
                            Shipping Method:
                            <a onClick={goToPreviousStep}>
                                <i className="osicon-note"></i>
                            </a>
                        </h4>
                        <div className="shipping-address">
                            <address>
                                {shippingMethod?.title}
                                <br />
                            </address>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default OrderSummary