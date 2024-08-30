import { OrderStateLabelFragment } from '@graphcommerce/magento-customer/components/OrderStateLabel/OrderStateLabel.gql'
import { extendableComponent } from '@graphcommerce/next-ui'
import { Box, SxProps, Theme } from '@mui/material'

type OrderState =
  | 'Ordered'
  | 'Invoiced'
  | 'Shipped'
  | 'Refunded'
  | 'Canceled'
  | 'Returned'
  | 'Partial'

type OrderStateLabelPropsBase = OrderStateLabelFragment
type OrderStateRenderer = Record<
  OrderState,
  (props: OrderStateLabelPropsBase) => React.ReactElement | null
>

export type OrderStateLabelProps = {
  renderer: OrderStateRenderer
  sx?: SxProps<Theme>
} & OrderStateLabelPropsBase

type OwnerState = {
  orderState: OrderState
}
const componentName = 'OrderStateLabel' as const
const parts = ['root'] as const
const { withState } = extendableComponent<OwnerState, typeof componentName, typeof parts>(
  componentName,
  parts,
)

export function OrderStatusLabel(props) {
  const { items, renderer, status, sx = [], ...orderProps } = props

  let orderState: OrderState = 'Partial'
  if (
    Array.isArray(items) &&
    items?.every((item) => item?.quantity_ordered === item?.quantity_invoiced)
  )
    orderState = 'Invoiced'
  if (
    Array.isArray(items) &&
    items?.every((item) => item?.quantity_ordered === item?.quantity_shipped)
  )
    orderState = 'Shipped'
  if (
    Array.isArray(items) &&
    items?.every((item) => item?.quantity_ordered === item?.quantity_refunded)
  )
    orderState = 'Refunded'
  if (
    Array.isArray(items) &&
    items?.every((item) => item?.quantity_ordered === item?.quantity_canceled)
  )
    orderState = 'Canceled'
  if (
    Array.isArray(items) &&
    items?.every((item) => item?.quantity_ordered === item?.quantity_returned)
  )
    orderState = 'Returned'

  const StateLabel = renderer[orderState]

  const classes = withState({ orderState })

  return (
    <Box
      component='span'
      className={classes.root}
      sx={[
        () => ({
          fontWeight: 'normal',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {status ? status?.toUpperCase() : <StateLabel items={items} {...orderProps} />}
    </Box>
  )
}
