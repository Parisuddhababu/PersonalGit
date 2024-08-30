import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { ICartDetails } from "@type/Pages/cart";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const CartSummary = ({ data }: {data:ICartDetails}) => {
    const [termsAndCondition, setTermsAndCondition] = useState(false)
    const currency = useCurrencySymbol();
    const currencySymbol = currency ?? '$'
    const router = useRouter()

    const proceedToCheckout = () => {
        if (!termsAndCondition) {
            toast.error('You have not agreed on terms and conditions.')
            return
        }
        localStorage.removeItem('shippingMethod')
        router.push(`/cart/checkout_list?is_buy_now=${Number(router?.query?.is_buy_now) === 1 ? 1 : 0}`)
    }
  return (
        <div className="order-box">
            <div className="order-wrapper">
                <h3 className="summary-subtitle">Summary </h3>
                <table className="summary-table">
                    <tbody>
                        <tr>
                            <td>
                                Subtotal
                            </td>
                            <td>
                                {currencySymbol}{data?.sub_total}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Tax
                            </td>
                            <td>
                                {currencySymbol}{Number(data?.tax_price)?.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                Cart Total
                            </td>
                            <td>
                                {currencySymbol}{Number(data?.sub_total + data?.tax_price).toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className="ocs-checkbox">
                    <input
                        type="checkbox"
                        id="add-check1"
                        name="add-check1"
                        checked={termsAndCondition}
                        onChange={(e) => setTermsAndCondition(e.target?.checked)}
                    />
                    <label htmlFor="add-check1">I agree with the terms of service and I adhere to them unconditionally (read)*</label>
                </div>
                <button className="btn btn-primary" onClick={proceedToCheckout}>PROCEED TO CHECKOUT</button>
            </div>

        </div>
    )
}

export default CartSummary