import { useMutation } from "@graphcommerce/graphql"
import { PaymentMethodOptionsNoopDocument } from "@graphcommerce/magento-cart-payment-method"


export function useSetPaymentMethodForm() {
  const [setPaymentMethodOnCart, {data, loading, error}] = useMutation(PaymentMethodOptionsNoopDocument)
 
  return {
    setPaymentMethodOnCart,
    data,
    loading,
    error
  }
}