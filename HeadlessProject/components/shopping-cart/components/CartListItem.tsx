import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  IconButton,
  Link,
} from '@mui/material'
import { Trans } from '@lingui/react'
import { CartItemsFragment } from '@graphcommerce/magento-cart-items'
import { Image } from '@graphcommerce/image'
import { Money } from '@graphcommerce/magento-store'
import { responsiveVal } from '@graphcommerce/next-ui'
import { ProductNameLink, RemoveItemFromCart, UpdateCartQuantity } from '.'
import {
  BundleProduct,
  ConfigurableProduct,
  DownloadableProduct,
  GiftCardProduct,
} from './ProductVariant'
import { ConfigurableCartItemFragment } from '@graphcommerce/magento-product-configurable/ConfigurableCartItem/ConfigurableCartItem.gql'
import { BundleCartItemFragment } from '@graphcommerce/magento-product-bundle/components/BundleCartItem/BundleCartItem.gql'
import { DownloadableCartItemFragment } from '@graphcommerce/magento-product-downloadable/DownloadableCartItem/DownloadableCartItem.gql'
import { image } from 'html2canvas/dist/types/css/types/image'

export type CartListItemProps = CartItemsFragment

export const CartListItem = (props: CartListItemProps): JSX.Element => {
  const { items } = props

  return (
    <TableContainer
      sx={{
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      }}
    >
      <Table
        sx={
          {
            //minWidth: 650
          }
        }
      >
        <TableHead
          sx={{
            display: { xs: 'none', md: 'table-header-group' },
          }}
        >
          <TableRow>
            <TableCell>
              <Trans id='Item' />
            </TableCell>
            <TableCell></TableCell>
            <TableCell sx={{ textAlign: 'right' }}></TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Trans id='Price' />
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Trans id='Qty' />
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Trans id='Subtotal' />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            display: { xs: 'block', md: 'table-header-group' },
          }}
        >
          {items?.map((item) => {
            return (
              <TableRow
                key={item?.product?.name}
                sx={{
                  display: { xs: 'flex', md: 'table-row' },
                  flexWrap: { xs: 'wrap', md: 'no-wrap' },
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                  verticalAlign: 'top',
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                <TableCell
                  sx={{
                    display: { xs: 'flex', md: 'table-cell' },
                    width: { xs: '5.313rem', md: '11.563rem' },
                    // flexWrap: { xs:'wrap', md:'no-wrap'},
                    // '&:last-child td, &:last-child th': {
                    //   border: 0
                    // },
                    // verticalAlign: 'top',
                    '& img': {
                      maxHeight: '10.313rem !important',
                    },
                  }}
                >
                  {item?.product?.thumbnail?.url && item?.product?.thumbnail?.label && (
                    <Link href={`/p/${item?.product?.url_key}`}>
                      <Image
                        height={165}
                        width={165}
                        quality={80}
                        layout='fill'
                        sizes={responsiveVal(70, 70)}
                        src={item.product.thumbnail.url}
                        alt={item.product.thumbnail.label}
                        sx={{ objectFit: 'contain' }}
                      />
                    </Link>
                  )}
                </TableCell>
                <TableCell></TableCell>

                <TableCell
                  sx={{
                    display: { xs: 'flex', md: 'table-cell' },
                    width: { xs: 'calc( 100% - 85px )', md: 'auto' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      '& a': {
                        alignSelf: 'flex-start !important',
                      },
                    }}
                  >
                    {item?.product && <ProductNameLink {...item.product} />}
                    {item?.product?.__typename === 'ConfigurableProduct' && (
                      <ConfigurableProduct
                        sx={{
                          '& span': {
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            marginBottom: '0.25rem',
                            '& b': {
                              fontWeight: 700,
                              fontVariationSettings: "'wght' 700",
                            },
                          },
                        }}
                        {...(item as ConfigurableCartItemFragment)}
                      />
                    )}
                    {item?.product?.__typename === 'BundleProduct' && (
                      <BundleProduct
                        sx={{
                          '& span': {
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            marginBottom: '0.25rem',
                            '& b': {
                              fontWeight: 700,
                              fontVariationSettings: "'wght' 700",
                            },
                          },
                        }}
                        {...(item as BundleCartItemFragment)}
                      />
                    )}
                    {item?.product?.__typename === 'GiftCardProduct' && (
                      <GiftCardProduct
                        {...item}
                        sx={{
                          '& span': {
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            marginBottom: '0.25rem',
                            '& b': {
                              fontWeight: 700,
                              fontVariationSettings: "'wght' 700",
                            },
                          },
                        }}
                      />
                    )}
                    {item?.product?.__typename === 'DownloadableProduct' && (
                      <DownloadableProduct
                        sx={{
                          '& span': {
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                            marginBottom: '0.25rem',
                            '& b': {
                              fontWeight: 700,
                              fontVariationSettings: "'wght' 700",
                            },
                          },
                        }}
                        {...(item as DownloadableCartItemFragment)}
                      />
                    )}
                  </Box>
                </TableCell>

                <TableCell
                  data-th='Price'
                  sx={{
                    textAlign: { md: 'right' },
                    display: { xs: 'flex', md: 'table-cell' },
                    width: { xs: '33.33%', md: 'auto' },
                    justifyContent: 'flex-start',
                    flexDirection: { xs: 'column', md: 'row' },
                    '&:before': {
                      content: `attr(data-th)`,
                      display: { xs: 'block', md: 'none' },
                      fontWeight: '600',
                      paddingBottom: '0.313rem',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.125rem !important',
                      fontWeight: '700',
                      fontVariationSettings: `'wght' 700`,
                      color: '#666666',
                    }}
                  >
                    <Money {...item?.prices?.price} />
                  </Typography>
                </TableCell>

                <TableCell
                  data-th='Qty'
                  sx={{
                    textAlign: 'right',
                    display: { xs: 'flex', md: 'table-cell' },
                    width: { xs: '33.33%', md: 'auto' },
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', md: 'row' },
                    '&:before': {
                      content: `attr(data-th)`,
                      display: { xs: 'block', md: 'none' },
                      fontWeight: '600',
                      paddingBottom: '0.313rem',
                    },
                  }}
                >
                  {item?.uid && item?.quantity > 0 && (
                    <UpdateCartQuantity uid={item.uid} quantity={item.quantity} />
                  )}
                </TableCell>

                <TableCell
                  data-th='Subtotal'
                  sx={{
                    position: 'relative',
                    textAlign: 'right',
                    display: { xs: 'flex', md: 'table-cell' },
                    width: { xs: '33.33%', md: 'auto' },
                    justifyContent: 'flex-end',
                    flexDirection: { xs: 'column', md: 'row' },
                    '&:before': {
                      content: `attr(data-th)`,
                      display: { xs: 'block', md: 'none' },
                      fontWeight: '600',
                      paddingBottom: '0.313rem',
                    },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '1.125rem !important',
                        fontWeight: '700',
                        fontVariationSettings: `'wght' 700`,
                        color: '#666666',
                      }}
                    >
                      <Money {...item?.prices?.row_total} />
                    </Typography>

                    <Box
                      sx={{
                        position: { xs: 'relative', md: 'absolute' },
                        bottom: { xs: '-0.75rem', md: '1rem' },
                        right: { xs: '0', md: '0.25rem' },
                        display: 'inline-flex',
                      }}
                    >
                      {item?.product && (
                        <IconButton
                          aria-label='Edit icon'
                          sx={{
                            height: '2.5rem',
                            width: '2.5rem',
                            '& a': {
                              marginBottom: '0',
                              display: 'flex',
                              '& svg': {
                                verticalAlign: 'middle',
                                color: '#757575',
                              },
                            },
                          }}
                        >
                          <ProductNameLink
                            {...item.product}
                            uid={item.uid}
                            cartItemId={item?.id}
                            itemId={item?.product?.id}
                            iconLink={true}
                          />
                        </IconButton>
                      )}

                      {item && (
                        <RemoveItemFromCart
                          uid={item.uid ?? ''}
                          quantity={item.quantity ?? ''}
                          prices={item?.prices}
                          product={item.product}
                        />
                      )}
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CartListItem
