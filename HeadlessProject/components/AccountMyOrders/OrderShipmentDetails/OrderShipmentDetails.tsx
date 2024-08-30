/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OrderDetailsFragment } from '@graphcommerce/magento-customer/components/OrderDetails/OrderDetails.gql'
import { OrderItemsFragment } from '@graphcommerce/magento-customer/components/OrderItems/OrderItems.gql'
import { OrderStateLabelFragment } from '@graphcommerce/magento-customer/components/OrderStateLabel/OrderStateLabel.gql'
import { LayoutTitle } from '@graphcommerce/next-ui'
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
} from '@mui/material'

import { OrderInformation } from '../OrderInformation/OrderInformation'
import { PrintPreview } from '../PrintPreview/PrintPreview'

type OrderItemProps = OrderDetailsFragment & OrderItemsFragment & OrderStateLabelFragment

export function OrderShipmentDetails(props) {
  const { items, number, incrementId, ubTotal, shippingAndHandling, tax, grandTotal } = props
  const order_items = items

  return (
    <>
      <Box className='react-tabs__tab-panel-inner'>
        <PrintPreview
          {...props}
          location='shipment'
          name=' Print All shipments'
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
            <Trans id='Shipment #' />
            {number || incrementId}
          </Typography>

          <PrintPreview
            {...props}
            location='shipment'
            name=' Print shipment'
            sx={{
              color: '#1979c3',
              marginLeft: '2rem',
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans id='Product Name' />
                </TableCell>
                <TableCell>
                  <Trans id='SKU' />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Trans id='QTY shipped' />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {order_items &&
                order_items?.length > 0 &&
                order_items
                  .filter(
                    (item) =>
                      item?.__typename !== 'DownloadableOrderItem' &&
                      item?.__typename !== 'GiftCardOrderItem',
                  )
                  .map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell data-th='Product Name'>
                        {' '}
                        <Typography
                          variant='h6'
                          sx={{
                            display: { xs: 'inline-block', md: 'block' },
                            fontWeight: '400',
                            fontVariationSettings: "'wght' 400",
                            marginBottom: '0.625rem',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: (item?.product_name || item?.name) as string,
                          }}
                        />
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
                              {item?.selected_options?.map((option) => (
                                <Box key={option?.label} sx={{ marginBottom: '0.875rem' }}>
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
                                    {option?.value}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                      </TableCell>
                      <TableCell data-th='SKU'>{item?.product_sku || item?.sku}</TableCell>
                      <TableCell data-th='Qty Shipped' sx={{ textAlign: { md: 'right' } }}>
                        {(item?.quantity_shipped || item?.qty_shipped) &&
                          (item?.quantity_shipped ||
                            (item?.qty_shipped && Math.trunc(Number(item?.qty_shipped))))}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <OrderInformation {...props} />
    </>
  )
}
