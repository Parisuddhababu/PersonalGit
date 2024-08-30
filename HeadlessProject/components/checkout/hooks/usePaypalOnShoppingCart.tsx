import { useMutation } from "@graphcommerce/graphql"
import { useCurrentCartId } from "@graphcommerce/magento-cart"
import { getPaypalExpressTokenOnShoppingCartDocument } from "@graphql/cart/getPaypalExpressTokenOnShoppingCart.gql"

export type usePaypalOnShoppingCartProps = {
  cartId?: string
}

export const usePaypalOnShoppingCart = (props: usePaypalOnShoppingCartProps) => {
  const { currentCartId } = useCurrentCartId()
  const [callPaypalMethod, {data, loading, error}] = useMutation(getPaypalExpressTokenOnShoppingCartDocument, {
    variables: {
      cartId: props.cartId ?? currentCartId,
      code: "paypal_express",
      expressButton: true,
      returnUrl: "paypal/action/return.html",
      cancelUrl: "paypal/action/cancel.html"
    }
  })


  return {
    callPaypalMethod,
    data,
    loading,
    error
  }
}

export default usePaypalOnShoppingCart