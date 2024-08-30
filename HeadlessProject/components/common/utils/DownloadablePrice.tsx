import { Money } from '@graphcommerce/magento-store'

export const DownloadablePrice = ({ currency, value }) => {
  return <Money currency={currency} value={value} />
}
