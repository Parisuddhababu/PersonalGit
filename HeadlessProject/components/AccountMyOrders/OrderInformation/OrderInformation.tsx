import { OrderDetailsFragment } from '@graphcommerce/magento-customer/components/OrderDetails/OrderDetails.gql'
import { TrackingLink } from '@graphcommerce/magento-customer/components/TrackingLink/TrackingLink'
import { useFindCountry, useFindRegion } from '@graphcommerce/magento-store'
import {
  SectionContainer,
  responsiveVal,
  iconInvoice,
  IconSvg,
  extendableComponent,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {
  Container,
  Link,
  Skeleton,
  styled,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
  Box,
} from '@mui/material'

export type OrderDetailsProps = Partial<OrderDetailsFragment> & {
  loading?: boolean
  sx?: SxProps<Theme>
}

const componentName = 'OrderDetails' as const
const parts = [
  'sectionContainer',
  'orderDetailTitle',
  'orderDetailsInnerContainer',
  'totalsContainer',
  'totalsRow',
  'totalsDivider',
  'totalsVat',
  'iconContainer',
  'invoice',
] as const
const { classes } = extendableComponent(componentName, parts)

const OrderDetailTitle = styled('span', { target: classes.orderDetailTitle })(({ theme }) => ({
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: '600',
  fontVariationSettings: "'wght' 600",
  display: 'block',
  width: '100%',
  marginBottom: '0.5rem',
}))

const OrderDetailsInnerContainer = styled('span', { target: classes.orderDetailsInnerContainer })(
  ({ theme }) =>
    theme.unstable_sx({
      display: 'grid',
      gridColumnGap: theme.spacings.sm,
      gridRowGap: theme.spacings.lg,
      padding: `${theme.spacings.md} 0`,
      // borderBottom: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.up('sm')]: {
        gridColumnGap: theme.spacings.xxl,
        gridRowGap: theme.spacings.md,
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      '.MuiTableCell-root': {
        padding: 0,
        borderBottom: 0,
      },
    }),
)

const TotalsContainer = styled('span', { target: classes.totalsContainer })(({ theme }) =>
  theme.unstable_sx({
    padding: `${theme.spacings.xxs} 0`,
  }),
)

const TotalsRow = styled('span', { target: classes.totalsRow })(({ theme }) =>
  theme.unstable_sx({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
  }),
)

const TotalsDivider = styled('span', { target: classes.totalsDivider })(({ theme }) =>
  theme.unstable_sx({
    height: 1,
    width: '100%',
    background: theme.palette.divider,
    margin: `${theme.spacings.xxs} 0`,
  }),
)

const TotalsVat = styled(TotalsRow, { target: classes.totalsVat })(({ theme }) =>
  theme.unstable_sx({
    fontWeight: 'bold',
    padding: `${theme.spacings.xxs} 0`,
  }),
)
const IconContainer = styled(TotalsRow, { target: classes.iconContainer })(({ theme }) =>
  theme.unstable_sx({
    // marginLeft: '-6px',
    '& > div': {
      padding: '4px 0',
    },
  }),
)

const Invoice = styled(TotalsRow, { target: classes.invoice })(({ theme }) =>
  theme.unstable_sx({
    display: 'flex',
    alignItems: 'center',
    color: 'secondary.main',
  }),
)

export function OrderInformation(props) {
  const {
    shipping_address,
    shipping,
    billing,
    shippingMethod,
    paymentMethod,
    billing_address,
    payment_methods,
    shipments,
    shipping_method,
    total,
    invoices,
    loading,
    sx = [],
  } = props

  const billingAddressCountry = useFindCountry(billing_address?.country_code)
  const billingAddressRegion = useFindRegion(
    billing_address?.country_code,
    Number(billing_address?.region_id) ?? undefined,
  )

  const shippingAddressCountry = useFindCountry(shipping_address?.country_code)
  const shippingAddressRegion = useFindRegion(
    shipping_address?.country_code,
    Number(shipping_address?.region_id) ?? undefined,
  )

  if (loading) {
    return (
      <SectionContainer labelLeft='Order Information' sx={sx}>
        <OrderDetailsInnerContainer sx={{ paddingBottom: '1px' }}>
          <div>
            <Skeleton height={100} />
          </div>
          <div>
            <Skeleton height={100} />
          </div>
          <div>
            <Skeleton height={100} />
          </div>
          <div>
            <Skeleton height={100} />
          </div>
          <div>
            <Skeleton height={100} />
          </div>
          <div>
            <Skeleton height={100} />
          </div>
        </OrderDetailsInnerContainer>

        <TotalsContainer>
          <TotalsRow>
            <div>Products</div>
            <div>
              <Skeleton width={72} />
            </div>
          </TotalsRow>

          {total?.discounts &&
            total?.discounts?.map((discount) => (
              <TotalsRow key={`discount-${discount?.label}`}>
                <div>{discount?.label}</div>
                <div>
                  <Skeleton width={72} />
                </div>
              </TotalsRow>
            ))}

          <TotalsRow>
            <div>Shipping</div>
            <div>
              <Skeleton width={72} />
            </div>
          </TotalsRow>

          <TotalsDivider />

          <TotalsVat>
            <div>Total (incl. VAT)</div>
            <div>
              <Skeleton width={72} />
            </div>
          </TotalsVat>
        </TotalsContainer>
      </SectionContainer>
    )
  }

  return (
    <Box sx={{ paddingBottom: '1rem' }}>
      <SectionContainer
        labelLeft='Order Information'
        // borderBottom
        sx={[
          (theme) => ({
            '& .SectionHeader-root': {
              marginTop: '0',
              marginBottom: '1.5rem',
              paddingBottom: '0.65rem',
              borderBottomColor: '#c6c6c6',
              '& .MuiTypography-root': {
                color: '#333333',
                fontSize: '1.375rem',
                textTransform: 'capitalize',
                lineHeight: '1.813rem',
                fontWeight: '300',
                fontVariationSettings: "'wght' 300",
                letterSpacing: '0',
              },
            },
            '& .MuiTable-root': {
              '& .MuiTableHead-root': {
                '& .MuiTableRow-head': {
                  '& .MuiTableCell-head': {
                    padding: '0 0.25rem 0 0',
                    '& OrderDetails-orderDetailTitle': {
                      fontWeight: '600',
                      fontVariationSettings: "'wght' 600",
                    },
                  },
                },
              },
              '& .MuiTableBody-root': {
                '& .MuiTableRow-root': {
                  borderTop: '0',
                  '& .MuiTableCell-body ': {
                    padding: { xs: '0 0.25rem 0.75rem 0', md: '0 0.25rem 0 0' },
                    verticalAlign: 'top',
                    width: { md: '25%' },
                    '&:before': {
                      color: '#333',
                      paddingBottom: '0.35rem',
                    },
                  },
                },
              },
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <OrderDetailsInnerContainer
          sx={{
            display: 'block',
            position: 'relative',
            top: 0,
            paddingTop: '0',
            paddingBottom: '1rem',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <OrderDetailTitle>
                      <Trans id='Shipping address' />
                    </OrderDetailTitle>
                  </TableCell>
                  <TableCell>
                    <OrderDetailTitle>
                      <Trans id='Shipping method' />
                    </OrderDetailTitle>
                  </TableCell>
                  <TableCell>
                    <OrderDetailTitle>
                      <Trans id='Billing address' />
                    </OrderDetailTitle>
                  </TableCell>
                  <TableCell>
                    <OrderDetailTitle>
                      <Trans id='Payment method' />
                    </OrderDetailTitle>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell data-th='Shipping address'>
                    {' '}
                    <Box>
                      <Box sx={{ marginBottom: { xs: '0.25rem', md: '0' } }}>
                        {shipping_address?.firstname || shipping?.[0]?.name}{' '}
                        {shipping_address?.lastname}
                      </Box>
                      <Box sx={{ marginBottom: { xs: '0.25rem', md: '0' } }}>
                        {shipping_address?.street || shipping?.[0]?.street}
                      </Box>
                      <Box sx={{ marginBottom: { xs: '0.25rem', md: '0' } }}>
                        {shipping_address?.city || shipping?.[0]?.city}
                        {(shipping_address?.city || shipping?.[0]?.city) && ', '}
                        {shippingAddressRegion?.name || shipping?.[0]?.region}
                        {(shippingAddressRegion?.name || shipping?.[0]?.region) && ', '}
                        {shipping_address?.postcode || shipping?.[0]?.postcode}
                      </Box>
                      <Box sx={{ marginBottom: { xs: '0.25rem', md: '0' } }}>
                        {shippingAddressCountry?.full_name_locale || shipping?.[0]?.country}
                      </Box>
                      {shipping?.[0]?.telephone && (
                        <Typography component='span' variant='subtitle2'>
                          T:
                          <Link
                            href={`tel:${shipping?.[0]?.telephone}`}
                            sx={{
                              color: '#006bb4 !important',
                            }}
                            target='_self'
                            underline='hover'
                          >
                            {shipping?.[0]?.telephone}
                          </Link>
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell data-th='Shipping method'>
                    <div>{(shipping_method || shippingMethod) ?? ''}</div>

                    {shipments && shipments.length > 0 && (
                      <>
                        <div>
                          {shipments?.[0]?.tracking && shipments?.[0]?.tracking?.[0]?.title}
                        </div>
                        {shipments?.[0]?.tracking?.[0] && (
                          <IconContainer>
                            <TrackingLink {...shipments?.[0].tracking?.[0]} />
                          </IconContainer>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell data-th='Billing address'>
                    <div>
                      <div>
                        {billing_address?.firstname || billing?.[0]?.name}{' '}
                        {billing_address?.lastname}
                      </div>
                      <div>{billing_address?.street || billing?.[0]?.street}</div>
                      <div>
                        {billing_address?.city || billing?.[0]?.city}
                        {(billing_address?.city || billing?.[0]?.city) && ', '}
                        {billingAddressRegion?.name || billing?.[0]?.region}
                        {(billingAddressRegion?.name || billing?.[0]?.region) && ', '}
                        {billing_address?.postcode || billing?.[0]?.postcode}
                      </div>
                      <div>{billingAddressCountry?.full_name_locale || billing?.[0]?.country}</div>
                      {billing?.[0]?.telephone && (
                        <Typography component='span' variant='subtitle2'>
                          T:
                          <Link
                            href={`tel:${billing?.[0]?.telephone}`}
                            sx={{
                              color: '#006bb4 !important',
                            }}
                            target='_self'
                            underline='hover'
                          >
                            {billing?.[0]?.telephone}
                          </Link>
                        </Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell data-th='Payment method'>
                    <div>
                      {payment_methods && payment_methods.length < 1 && (
                        <div>
                          <i>
                            <Trans id='No payment information' />
                          </i>
                        </div>
                      )}
                      {paymentMethod && <div>{paymentMethod}</div>}
                      {payment_methods && payment_methods[0] && (
                        <>
                          <div>{payment_methods[0].name}</div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </OrderDetailsInnerContainer>
      </SectionContainer>
    </Box>
  )
}
