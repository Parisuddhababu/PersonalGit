/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { OrderInformation } from '@components/AccountMyOrders/OrderInformation/OrderInformation'
import { OrderStatusLabel } from '@components/AccountMyOrders/OrderStatusLabel/OrderStatusLabel'
import { Logo } from '@components/Layout/Logo'
import { downloadReadOnlyPdf, formatDate } from '@components/common/utils'
import { OrderDetailsFragment } from '@graphcommerce/magento-customer/components/OrderDetails/OrderDetails.gql'
import { OrderItemsFragment } from '@graphcommerce/magento-customer/components/OrderItems/OrderItems.gql'
import { OrderStateLabelFragment } from '@graphcommerce/magento-customer/components/OrderStateLabel/OrderStateLabel.gql'
import { Money } from '@graphcommerce/magento-store'
import { LayoutTitle } from '@graphcommerce/next-ui'
import { StoreCreditFragment } from '@graphql/MyOrders/StoreCreditFragment.gql'
// import PrinterSvgIcon from '@components/common/PrinterSvg/PrinterSvgIcon'
import { Trans } from '@lingui/react'
import {
  Button,
  Container,
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
  TableFooter,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

type PreviewProps = OrderDetailsFragment &
  OrderItemsFragment &
  OrderStateLabelFragment &
  StoreCreditFragment & {
    location?: string
    name?: string
    sx?: SxProps<Theme>
  }

export const PrintPreview = (props) => {
  const {
    location,
    name,
    store_credit,
    incrementId,
    sx = [],
    items,
    orderDate,
    subTotal,
    orderStatus,
    tax,
    shippingAndHandling,
    storeCredit,
    grandTotal,
  } = props
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (element) {
      element.style.display = 'none'
    }
  }, [])

  const printBtnHandler = async (elementId: HTMLElement) => {
    elementId.style.display = 'block'
    await downloadReadOnlyPdf(elementId)
    elementId.style.display = 'none'
  }
  const router = useRouter()
  const { orderId } = router.query
  const redirectedMsg = location
  const order_items = items ? items : props?.items
  const order_date = orderDate ? orderDate : props?.order_date
  const product_price = order_items && order_items?.[0]?.product_sale_price?.value
  const price_details_tax = props?.total?.total_tax?.value
  const price_details = props?.total

  const DateOfOrder = order_date && formatDate(order_date)

  return (
    <>
      <Button
        disableRipple
        onClick={() => printBtnHandler(elementRef.current as HTMLElement)}
        color='secondary'
        size='medium'
        sx={{
          padding: '0',
          minHeight: 'initial',
          height: 'auto',
          fontWeight: '400',
          fontVariationSettings: "'wght' 400",
          minWidth: 'initial',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          },
        }}
      >
        {/* <PrinterSvgIcon /> */}
        {name}
      </Button>
      <div
        ref={elementRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth='lg' sx={{ paddingTop: '1.5rem', backgroundColor: 'white' }}>
          <Logo />

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              gap: { xs: '0.75rem', md: '1.5rem', lg: '2rem' },
            }}
          >
            <Typography
              variant='h2'
              sx={{
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
              }}
            >
              <Trans id={`Order #${orderId || incrementId}`} />{' '}
            </Typography>

            <OrderStatusLabel
              sx={{
                border: '2px solid #cccccc',
                padding: '0.313rem 0.625rem',
                color: '#333333',
                fontSize: '0.875rem',
                fontWeight: '400',
                fontVariationSettings: "'wght' 400",
              }}
              status={orderStatus}
              renderer={{
                Ordered: () => <Trans id='Pending' />,
                Invoiced: () => <Trans id='Completed' />,
                Shipped: () => <Trans id='Processing' />,
                Refunded: () => <Trans id='closed' />,
                Canceled: () => <Trans id='Canceled' />,
                Returned: () => <Trans id='Returned' />,
                Partial: () => <Trans id='Pending' />,
              }}
            />
          </Box>

          {order_date && (
            <Typography variant='h6' sx={{ marginBottom: '1.35rem' }}>
              {DateOfOrder}
            </Typography>
          )}

          <Box
            sx={{
              border: '1px solid #cccccc',
              padding: { xs: '0.65rem', md: '1.563rem' },
              marginBottom: '2rem',
              '& .MuiTable-root': {
                '& .MuiTableBody-root': {
                  '& .MuiTableCell-body': {
                    verticalAlign: 'top',
                    border: '0',
                    paddingTop: { md: '1rem' },
                    paddingBottom: { md: '1.25rem' },
                    borderBottom: { xs: '0', md: '1px solid rgba(224, 224, 224, 1)' },
                  },
                  '&:last-child': {
                    '& .MuiTableCell-body': {
                      borderBottom: '0',
                    },
                  },
                },
                '& .MuiTableFooter-root': {
                  display: { xs: 'block', md: 'table-footer-group' },
                  '& .MuiTableRow-footer': {
                    display: { xs: 'flex', md: 'table-row' },
                    '& .MuiTableCell-footer': {
                      display: { xs: 'inline-block', md: 'table-cell' },
                      width: { xs: '50%', md: 'auto' },
                      verticalAlign: 'top',
                      border: '0',
                      color: '#333333',
                      '&:first-child': {
                        textAlign: { xs: 'left', md: 'right' },
                      },
                      '& .total-text': {
                        fontWeight: '700',
                        fontVariationSettings: "'wght' 700",
                      },
                    },
                    '&:last-child': {
                      '& .MuiTableCell-footer': {
                        borderBottom: '1px solid #cccccc',
                      },
                    },
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid #cccccc',
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  color: '#333333',
                }}
              >
                {redirectedMsg && redirectedMsg === 'invoice' && (
                  <>
                    <Trans id='Invoice#' />
                    {orderId || incrementId}
                  </>
                )}

                {redirectedMsg && redirectedMsg === 'shipment' && (
                  <>
                    <Trans id='Shipment#' />
                    {orderId || incrementId}
                  </>
                )}

                {redirectedMsg && redirectedMsg === 'refund' && (
                  <>
                    <Trans id='Refund#' />
                    {orderId || incrementId}
                  </>
                )}
              </Typography>
            </Box>

            <TableContainer sx={{ position: 'relative', top: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans id='Product Name' />
                    </TableCell>
                    <TableCell>
                      <Trans id='SKU' />
                    </TableCell>
                    {redirectedMsg &&
                      (redirectedMsg === 'orderItems' ||
                        redirectedMsg === 'refund' ||
                        redirectedMsg === 'invoice') && (
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Trans id='Price' />
                        </TableCell>
                      )}

                    <TableCell sx={{ textAlign: 'right' }}>
                      {redirectedMsg && redirectedMsg === 'invoice' && <Trans id='QTY Invoiced ' />}
                      {redirectedMsg &&
                        (redirectedMsg === 'refund' || redirectedMsg === 'orderItems') && (
                          <Trans id='QTY' />
                        )}
                      {redirectedMsg && redirectedMsg === 'shipment' && <Trans id='QTY Shipped ' />}{' '}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      {redirectedMsg &&
                        (redirectedMsg === 'orderItems' ||
                          redirectedMsg === 'refund' ||
                          redirectedMsg === 'invoice') && <Trans id='SubTotal' />}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      {redirectedMsg && redirectedMsg === 'refund' && (
                        <Trans id='Discount Amount' />
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      {redirectedMsg && redirectedMsg === 'refund' && <Trans id='Row Total' />}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order_items &&
                    order_items?.length > 0 &&
                    order_items?.map((item) => (
                      <TableRow key={item?.id}>
                        <TableCell data-th='Product Name'>
                          {' '}
                          <Typography
                            variant='h6'
                            sx={{
                              fontWeight: '400',
                              fontVariationSettings: "'wght' 400",
                              marginBottom: '0.625rem',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: (item?.product_name || item?.name) as string,
                            }}
                          />
                          {redirectedMsg !== 'shipment' &&
                            item.__typename === 'GiftCardOrderItem' &&
                            item.gift_card_options && (
                              <Box>
                                <Box
                                  sx={{
                                    marginBottom: '0.875rem',
                                  }}
                                >
                                  <Typography
                                    variant='body1'
                                    component='p'
                                    sx={{
                                      fontWeight: '700',
                                      fontVariationSettings: "'wght' 700",
                                    }}
                                  >
                                    <Trans id='Gift Card Sender' />
                                  </Typography>

                                  <Typography
                                    component='p'
                                    sx={{
                                      fontWeight: '400',
                                      fontVariationSettings: "'wght' 400",
                                    }}
                                  >
                                    {item?.gift_card_options?.giftcard_sender_name} {'<'}
                                    {item?.gift_card_options?.giftcard_sender_email}
                                    {'>'}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    marginBottom: '0.875rem',
                                  }}
                                >
                                  <Typography
                                    variant='body1'
                                    component='p'
                                    sx={{
                                      fontWeight: '700',
                                      fontVariationSettings: "'wght' 700",
                                    }}
                                  >
                                    <Trans id='Gift Card Reciever' />
                                  </Typography>

                                  <Typography
                                    component='p'
                                    sx={{
                                      fontWeight: '400',
                                      fontVariationSettings: "'wght' 400",
                                    }}
                                  >
                                    {item?.gift_card_options?.giftcard_recipient_name} {'<'}
                                    {item?.gift_card_options?.giftcard_recipient_email}
                                    {'>'}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    marginBottom: '0.875rem',
                                  }}
                                >
                                  <Typography
                                    variant='body1'
                                    component='p'
                                    sx={{
                                      fontWeight: '700',
                                      fontVariationSettings: "'wght' 700",
                                    }}
                                  >
                                    <Trans id='Gift Card Message' />
                                  </Typography>

                                  <Typography
                                    component='p'
                                    sx={{
                                      fontWeight: '400',
                                      fontVariationSettings: "'wght' 400",
                                    }}
                                  >
                                    {item.gift_card_options.giftcard_message}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          {(item?.selected_options || item?.optionsData) &&
                            (item?.selected_options?.length > 0 ||
                              item?.optionsData?.length > 0) && (
                              <Box>
                                <Box sx={{ marginBottom: '0.875rem' }}>
                                  <Typography
                                    variant='body1'
                                    component='p'
                                    sx={{
                                      fontWeight: '700',
                                      fontVariationSettings: "'wght' 700",
                                    }}
                                  >
                                    {item?.selected_options?.[0]?.label ||
                                      item?.optionsData?.[0]?.label}
                                  </Typography>

                                  <Typography
                                    component='p'
                                    sx={{
                                      fontWeight: '400',
                                      fontVariationSettings: "'wght' 400",
                                    }}
                                  >
                                    {item?.selected_options?.[0]?.value ||
                                      item?.optionsData?.[0]?.value}
                                  </Typography>
                                </Box>

                                <Box sx={{ marginBottom: '0.65rem' }}>
                                  <Typography
                                    variant='body1'
                                    component='p'
                                    sx={{
                                      fontWeight: '700',
                                      fontVariationSettings: "'wght' 700",
                                    }}
                                  >
                                    {item?.selected_options?.[1]?.label ||
                                      item?.optionsData?.[1]?.label}
                                  </Typography>

                                  <Typography
                                    component='p'
                                    sx={{
                                      fontWeight: '400',
                                      fontVariationSettings: "'wght' 400",
                                    }}
                                  >
                                    {item?.selected_options?.[1]?.value ||
                                      item?.optionsData?.[1]?.value}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                        </TableCell>
                        <TableCell data-th='SKU'>{item?.product_sku || item?.sku}</TableCell>
                        <TableCell data-th='Price' sx={{ textAlign: { md: 'right' } }}>
                          {redirectedMsg !== 'shipment' && (
                            <Typography
                              variant='h5'
                              sx={{
                                display: { xs: 'inline-block', md: 'block' },
                                lineHeight: '1.375rem',
                                color: '#666666',
                                fontWeight: '700',
                                fontVariationSettings: "'wght' 700",
                              }}
                            >
                              <Money {...(item?.product_sale_price || item?.price)} />
                            </Typography>
                          )}
                        </TableCell>
                        {redirectedMsg === 'shipment' && (
                          <TableCell data-th='Qty' sx={{ textAlign: { md: 'right' } }}>
                            {item?.quantity_shipped ||
                              (item?.qty_shipped && Math.trunc(Number(item?.qty_shipped)))}
                          </TableCell>
                        )}
                        {redirectedMsg === 'invoice' && (
                          <TableCell data-th='Qty' sx={{ textAlign: { md: 'right' } }}>
                            {item?.quantity_invoiced ||
                              (item?.qty_invoiced && Math.trunc(Number(item?.qty_invoiced)))}
                          </TableCell>
                        )}

                        {redirectedMsg === 'refund' && (
                          <TableCell data-th='Qty' sx={{ textAlign: { md: 'right' } }}>
                            {item?.quantity_refunded ||
                              (item?.qty_refunded && Math.trunc(Number(item?.qty_refunded)))}
                          </TableCell>
                        )}
                        {redirectedMsg === 'orderItems' && (
                          <TableCell sx={{ textAlign: { md: 'right' } }}>
                            {((item?.quantity_ordered || item?.qty_ordered) ?? 0) > 0 &&
                              `Ordered: ${
                                item?.quantity_ordered ||
                                (item?.qty_ordered && Math.trunc(Number(item?.qty_ordered)))
                              }`}
                            <br />
                            {((item?.quantity_refunded || item?.qty_refunded) ?? 0) > 0 &&
                              `Refunded: ${
                                item?.quantity_refunded ||
                                (item?.qty_refunded && Math.trunc(Number(item?.qty_refunded)))
                              }`}
                            <br />
                            {((item?.quantity_shipped || item?.qty_shipped) ?? 0) > 0 &&
                              `Shipped: ${
                                item?.quantity_shipped ||
                                (item?.qty_shipped && Math.trunc(Number(item?.qty_shipped)))
                              }`}
                            <br />
                            {((item?.quantity_canceled || item?.qty_canceled) ?? 0) > 0 &&
                              `Cancelled: ${
                                item?.quantity_canceled ||
                                (item?.qty_canceled && Math.trunc(Number(item?.qty_canceled)))
                              }`}
                            <br />
                            {((item?.quantity_returned || item?.qty_returned) ?? 0) > 0 &&
                              `Returned: ${
                                item?.quantity_returned ||
                                (item?.qty_returned && Math.trunc(Number(item?.qty_returned)))
                              }`}
                          </TableCell>
                        )}

                        <TableCell sx={{ textAlign: { md: 'right' } }}>
                          {redirectedMsg !== 'shipment' && (
                            <Typography
                              variant='h5'
                              sx={{
                                display: { xs: 'inline-block', md: 'block' },
                                lineHeight: '1.375rem',
                                color: '#666666',
                                fontWeight: '700',
                                fontVariationSettings: "'wght' 700",
                              }}
                            >
                              <Money {...(item?.product_sale_price || item?.price)} />
                            </Typography>
                          )}
                        </TableCell>
                        {redirectedMsg === 'refund' && (
                          <TableCell sx={{ textAlign: { md: 'right' } }}>
                            {(price_details?.discounts?.length === 0 || item?.discount) && (
                              <Typography
                                variant='h5'
                                sx={{
                                  display: { xs: 'inline-block', md: 'block' },
                                  lineHeight: '1.375rem',
                                  color: '#666666',
                                  fontWeight: '700',
                                  fontVariationSettings: "'wght' 700",
                                }}
                              >
                                {item?.discount ? <Money {...item?.discount} /> : '$0.00'}
                              </Typography>
                            )}
                          </TableCell>
                        )}
                        {redirectedMsg === 'refund' && (
                          <TableCell sx={{ textAlign: { md: 'right' } }}>
                            {item?.row_total ? (
                              <Money {...item?.row_total} />
                            ) : (
                              <>
                                {item?.product_sale_price?.currency === 'USD' && '$'}{' '}
                                {product_price &&
                                  price_details_tax &&
                                  product_price + price_details_tax}
                              </>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>{' '}
                {redirectedMsg !== 'shipment' && (
                  <TableFooter sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'right', paddingTop: '1.25rem' }}>
                        <Trans id='SubTotal' />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', paddingTop: '1.25rem' }}>
                        {' '}
                        <Money {...(price_details?.subtotal || subTotal)} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                        <Trans id='Shipping and Handling' />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        {' '}
                        <Money {...(price_details?.total_shipping || shippingAndHandling)} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                        <Trans id='Tax' />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Money {...(price_details?.total_tax || tax)} />
                      </TableCell>
                    </TableRow>

                    {redirectedMsg && redirectedMsg === 'refund' && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                          <Trans id='Store Credit' />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          -<Money {...(store_credit?.current_balance || storeCredit)} />
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                        <Typography variant='h5'>
                          <Trans id='Grand Total' />
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ textAlign: 'right' }}>
                        <Typography variant='h5'>
                          <Money {...(price_details?.grand_total || grandTotal)} />
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {redirectedMsg && redirectedMsg === 'refund' && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                          <Trans id='Refunded to Store Credit ' />
                        </TableCell>

                        <TableCell sx={{ textAlign: 'right' }}>
                          <Money {...(store_credit?.current_balance || storeCredit)} />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableFooter>
                )}
              </Table>
            </TableContainer>
          </Box>

          {redirectedMsg !== 'refund' && (
            // <Container
            //   maxWidth='lg'
            //   sx={{
            //     border: '2px solid black',
            //     borderTopColor: 'transparent',
            //     backgroundColor: 'white',
            //   }}
            // >
            <OrderInformation {...props} sx={{ display: 'block', paddingBottom: 0 }} />
            // </Container>
          )}
        </Container>
      </div>
    </>
  )
}
