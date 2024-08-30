import { OrderCardFragment } from '@graphcommerce/magento-customer/components/OrderCard/OrderCard.gql'
import { NextLink } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Link } from '@mui/material'

type OrderCardProps = Partial<OrderCardFragment>

export function ViewOrder(props: OrderCardProps) {
  const { number } = props

  return (
    <Link
      href={`/account/my-orders/view?orderId=${number}`}
      component={NextLink}
      underline="hover"
      sx={{ lineHeight: '1.125rem' }}
    >
      <Trans id='View Order' />
    </Link>
  )
}
