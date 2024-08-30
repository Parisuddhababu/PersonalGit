/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OrderDetailsFragment } from '@graphcommerce/magento-customer/components/OrderDetails/OrderDetails.gql'
import { OrderItemsFragment } from '@graphcommerce/magento-customer/components/OrderItems/OrderItems.gql'
import { OrderStateLabelFragment } from '@graphcommerce/magento-customer/components/OrderStateLabel/OrderStateLabel.gql'
import { Money } from '@graphcommerce/magento-store'
import { LayoutTitle } from '@graphcommerce/next-ui'
import { StoreCreditFragment } from '@graphql/MyOrders/StoreCreditFragment.gql'
import { Trans } from '@lingui/react'
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableFooter,
} from '@mui/material'

import { PrintPreview } from '../PrintPreview/PrintPreview'
import { SubTotalPrice } from '@components/common/utils/SubTotalPrice'

type OrderItemProps = OrderDetailsFragment &
  OrderItemsFragment &
  OrderStateLabelFragment &
  StoreCreditFragment

export function OrderRefundDetails(props) {
  const {
    total,
    items,
    number,
    store_credit,
    storeCredit,
    incrementId,
    subTotal,
    shippingAndHandling,
    tax,
    grandTotal,
  } = props

  const order_items = items
  const price_details_tax = total?.total_tax?.value
  const product_price = order_items?.[0]?.product_sale_price?.value
  const price_details = total

  return (
    <>
      <Box className='react-tabs__tab-panel-inner'>
        <PrintPreview
          {...props}
          location='refund'
          name=' Print All Refund'
          sx={{ color: '#069' }}
        />

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
            <Trans id='Refund #' />
            {number || incrementId}
          </Typography>

          <PrintPreview
            {...props}
            location='refund'
            name=' Print Refund'
            sx={{
              color: '#1979c3',
              marginLeft: '2rem',
            }}
          />
        </Box>

        <TableContainer sx={{ borderBottom: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: 'none' }}>
                <TableCell>
                  <Trans id='Product Name' />
                </TableCell>

                <TableCell>
                  <Trans id='SKU' />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Trans id='Price' />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Trans id='QTY' />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Trans id='SubTotal' />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Trans id='Discount Amount' />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Trans id='Row Total' />
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
                      {item.__typename === 'GiftCardOrderItem' && item.gift_card_options && (
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
                      {item.__typename === 'DownloadableOrderItem' && item.gift_card_options && (
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
                              <Trans id='Links' />
                            </Typography>

                            <Typography
                              component='p'
                              sx={{
                                fontWeight: '400',
                                fontVariationSettings: "'wght' 400",
                              }}
                            >
                              {item?.downloadable_options}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      {item?.bundle_options_data?.__typename === 'BundleOptionResult' &&
                        item?.bundle_options_data?.bundle_data && (
                          <Box>
                            {item?.bundle_options_data?.bundle_data.map((option) => (
                              <Box
                                key={option.option_id}
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
                                  {option?.label}
                                </Typography>

                                <Typography
                                  component='p'
                                  sx={{
                                    fontWeight: '400',
                                    fontVariationSettings: "'wght' 400",
                                  }}
                                >
                                  {option?.qty}
                                  {' x '} {option?.title}
                                  {' $'}
                                  {option?.price}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      {(item?.selected_options || item?.optionsData) &&
                        (item?.selected_options?.length > 0 || item?.optionsData?.length > 0) && (
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
                    </TableCell>

                    <TableCell data-th='Qty' sx={{ textAlign: { md: 'right' } }}>
                      {(item?.quantity_refunded || item?.qty_refunded) &&
                        (item?.quantity_refunded ||
                          (item?.qty_refunded && Math.trunc(Number(item?.qty_refunded))))}
                    </TableCell>
                    <TableCell data-th='Subtotal' sx={{ textAlign: { md: 'right' } }}>
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
                        {item?.name ? (
                          <Money {...item?.row_total} />
                        ) : (
                          <SubTotalPrice
                            currency={item.product_sale_price?.currency}
                            value={item.product_sale_price?.value}
                            quantity={item?.quantity_ordered}
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell
                      data-th='Discount Amount'
                      sx={{
                        textAlign: { md: 'right' },
                        display: { xs: 'flex !important', md: 'table-cell !important' },
                      }}
                    >
                      {item?.discount_amount ? (
                        <>
                          {'-'} <Money {...item?.discount_amount} />
                        </>
                      ) : (
                        <>
                          {'-'} <Money {...item?.discount} />
                        </>
                      )}
                    </TableCell>
                    <TableCell data-th='Row Total' sx={{ textAlign: { md: 'right' } }}>
                      {item?.row_total ? (
                        <Money {...item?.row_total} />
                      ) : (
                        <>
                          {item?.product_sale_price?.currency === 'USD' && '$'}{' '}
                          {product_price && price_details_tax && product_price + price_details_tax}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
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
              {price_details?.discounts &&
                price_details.discounts?.map((discount_item) => (
                  <TableRow key={discount_item.label}>
                    <TableCell colSpan={6} sx={{ textAlign: 'right', paddingTop: '1.25rem' }}>
                      <Trans id={`Discount (${discount_item.label})`} />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right', paddingTop: '1.25rem' }}>
                      {'-'}
                      <Money {...discount_item?.amount} />
                    </TableCell>
                  </TableRow>
                ))}

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
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                  <Trans id='Store Credit' />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  -
                  <Money {...(store_credit?.current_balance || storeCredit)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                  <Typography variant='body1' component='p' className='total-text'>
                    <Trans id='Grand Total' />
                  </Typography>
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Typography variant='body1' component='p' className='total-text'>
                    <Money {...(price_details?.grand_total || grandTotal)} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'right' }}>
                  <Trans id='Refunded to Store Credit ' />
                </TableCell>

                <TableCell sx={{ textAlign: 'right' }}>
                  <Money {...(store_credit?.current_balance || storeCredit)} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}
