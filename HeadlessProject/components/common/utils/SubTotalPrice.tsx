import { Money } from '@graphcommerce/magento-store'

export const SubTotalPrice = ({ currency, value, quantity }) => {
  const subTotal = {
    currency: currency,
    value: value * quantity,
  }
  return <Money {...subTotal} />
}
