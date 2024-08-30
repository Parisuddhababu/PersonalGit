import { CartStartCheckoutButton } from '@components/checkout'
import { Image } from '@graphcommerce/image'
import { BundleCartItemFragment } from '@graphcommerce/magento-product-bundle/components/BundleCartItem/BundleCartItem.gql'
import { ConfigurableCartItemFragment } from '@graphcommerce/magento-product-configurable/ConfigurableCartItem/ConfigurableCartItem.gql'
import { DownloadableCartItemFragment } from '@graphcommerce/magento-product-downloadable/DownloadableCartItem/DownloadableCartItem.gql'
import { Money } from '@graphcommerce/magento-store'
import { IconSvg, iconChevronDown } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Typography, AccordionSummary, Accordion, AccordionDetails, Link } from '@mui/material'
import { ProductNameLink, RemoveItemFromCart, UpdateCartQuantity } from '..'
import {
  BundleProduct,
  ConfigurableProduct,
  DownloadableProduct,
  GiftCardProduct,
} from '../ProductVariant'

export const MiniCartItemList = (props: any): JSX.Element => {
  const { cart, subtotal, setAnchorEl } = props

  const productVariantRender = (item) => {
    if (
      item?.product?.__typename === 'ConfigurableProduct' ||
      item?.product?.__typename === 'BundleProduct' ||
      item?.product?.__typename === 'DownloadableProduct' ||
      item?.product?.__typename === 'GiftCardProduct'
    ) {
      return (
        <Accordion
          sx={{
            borderBottom: '0',
          }}
        >
          <AccordionSummary
            expandIcon={<IconSvg src={iconChevronDown} sx={{ marginRight: '8rem' }} />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            sx={{
              padding: '0 !important',
              minHeight: 'inherit !important',
              justifyContent: 'flex-start !important',
              '& .MuiAccordionSummary-content': {
                margin: '0 !important',
                flexGrow: '0 !important',
                '& p': {
                  fontWeight: '400 !important',
                  fontVariationSettings: "'wght' 400",
                  textTransform: 'capitalize !important',
                  paddingRight: '0.125rem',
                },
              },
              '& .MuiAccordionSummary-expandIconWrapper': {
                '& svg': {
                  marginRight: '0 !important',
                },
              },
            }}
          >
            <Typography>
              <Trans id='See Details' />
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: '0.375rem 0 0.625rem !important',
              '& span': {
                marginBottom: '0.35rem',
                '&:last-child': {
                  marginBottom: '0',
                },
                '& b': {
                  fontWeight: 700,
                  fontVariationSettings: "'wght' 700",
                },
              },
            }}
          >
            {item?.product?.__typename === 'ConfigurableProduct' && (
              <ConfigurableProduct {...(item as ConfigurableCartItemFragment)} />
            )}
            {item?.product?.__typename === 'BundleProduct' && (
              <BundleProduct {...(item as BundleCartItemFragment)} />
            )}
            {item?.product?.__typename === 'DownloadableProduct' && (
              <DownloadableProduct {...(item as DownloadableCartItemFragment)} />
            )}
            {item?.product?.__typename === 'GiftCardProduct' && <GiftCardProduct {...item} />}
          </AccordionDetails>
        </Accordion>
      )
    }
  }

  return (
    <>
      <Box
        sx={{
          padding: { xs: '1.25rem 0.938rem 0.875rem', md: '1.563rem 1.875rem 0.875rem' },
          borderBottom: '1px solid #cccccc',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box>
            {cart?.items?.length > 0 && (
              <>
                <Typography
                  component='span'
                  fontWeight='bold'
                >{`${cart?.total_quantity}`}</Typography>
                <Trans id=' items in the cart' />
              </>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Typography>
              <Trans id='Cart SubTotal :' />
            </Typography>
            <Typography
              variant='h6'
              sx={{
                fontSize: '1.125rem',
                lineHeight: '1.563rem',
                fontWeight: 700,
                fontVariationSettings: "'wght' 700",
              }}
            >
              {' '}
              {subtotal ? <Money {...subtotal} /> : 0}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
            flexDirection: 'column',
            '& .proceed-checkout-btn': {
              padding: '0.5rem 1rem',
              fontSize: '1.125rem',
              lineHeight: '1.375rem',
              minHeight: '3.25rem',
              fontWeight: 600,
              fontVariationSettings: "'wght' 600",
              justifyContent: 'center',
              backgroundColor: '#1979c3',
              color: '#ffffff',
              borderRadius: '0.188rem',
            },
          }}
        >
          <CartStartCheckoutButton {...cart} orderTotal={subtotal} />
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            padding: '0.938rem',
            maxHeight: { xs: 'initial', md: 'calc( 100vh - 430px )' },
            overflow: { xs: 'visible', md: 'auto' },
          }}
        >
          {cart.items?.map((item) => (
            <Box
              key={item?.uid}
              sx={{
                display: 'grid',
                gridTemplateColumns: '75px 1fr',
                columnGap: '0.75rem',
                alignItems: 'flex-start',
                paddingBottom: '0.938rem',
                marginBottom: '0.938rem',
                borderBottom: '1px solid #cccccc',
                '&:last-child': {
                  paddingBottom: '0',
                  marginBottom: '0',
                  borderBottom: '0',
                },
              }}
            >
              <Box>
                {item?.product?.thumbnail?.url && item?.product?.thumbnail?.label && (
                  <Link href={`/p/${item.product.url_key}`} onClick={() => setAnchorEl(null)}>
                    <Image
                      quality={80}
                      layout='fill'
                      height={75}
                      width={75}
                      // sizes={responsiveVal(70, 70)}
                      src={item.product.thumbnail.url}
                      alt={item.product.thumbnail.label}
                      sx={{
                        height: '75px',
                        width: '75px',
                        objectFit: 'contain',
                        verticalAlign: 'middle',
                      }}
                    />
                  </Link>
                )}
              </Box>

              <Box>
                <Box
                  sx={{
                    '& .MuiLink-root': {
                      marginTop: '0 !important',
                      marginBottom: '0.4rem !important',
                      fontSize: '0.875rem',
                      lineHeight: '1.25rem',
                      color: '#006bb4',
                    },
                  }}
                >
                  {item?.product && <ProductNameLink {...item.product} />}
                  {productVariantRender(item)}
                </Box>

                <Box
                  sx={{
                    paddingTop: '0.75rem',
                    paddingBottom: '0.5rem',
                  }}
                >
                  <Typography
                    component={'span'}
                    sx={{
                      fontSize: '0.875rem',
                      lineHeight: '1.125rem',
                      fontWeight: 700,
                      fontVariationSettings: "'wght' 700",
                    }}
                  >
                    <Money {...item?.prices?.price} />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    {item?.uid && item?.quantity > 0 && (
                      <UpdateCartQuantity uid={item.uid} quantity={item.quantity} />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      '& .MuiLink-root': {
                        margin: '0 !important',
                        height: '2rem',
                        minWidth: '2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '100%',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.12)',
                        },
                        '& svg': {
                          verticalAlign: 'middle',
                          fontSize: '1.25rem',
                        },
                      },
                      '& .MuiIconButton-root': {
                        height: '2rem !important',
                        width: '2rem !important',
                        '& svg': {
                          verticalAlign: 'middle',
                          fontSize: '1.06rem !important',
                        },
                      },
                    }}
                  >
                    {item?.product && (
                      <ProductNameLink
                        {...item.product}
                        uid={item?.uid}
                        cartItemId={item?.id}
                        itemId={item?.product?.id}
                        iconLink
                      />
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
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid #cccccc',
            padding: { xs: '0.75rem 0rem', sm: '0.75rem 0 1.57rem', lg: '0.91rem 0 2.57rem' },
          }}
        >
          <Link
            href='/cart'
            underline='hover'
            sx={{
              color: '#069',
              cursor: 'pointer',
            }}
          >
            View and Edit Cart
          </Link>
        </Box>
      </Box>
    </>
  )
}

export default MiniCartItemList
