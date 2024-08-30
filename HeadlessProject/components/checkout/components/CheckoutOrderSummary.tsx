import { ApolloCartErrorAlert, useCartQuery } from "@graphcommerce/magento-cart";
import { CartPageDocument } from "@graphcommerce/magento-cart-checkout";
import { IconSvg, iconChevronDown, responsiveVal } from "@graphcommerce/next-ui";
import { Trans } from "@lingui/react";
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Divider, Grid, IconButton, Link, SxProps, Theme, Typography } from "@mui/material"
import { Image } from '@graphcommerce/image'
import { Money } from "@graphcommerce/magento-store";
import { ConfigurableProduct, BundleProduct } from "@components/shopping-cart/components/ProductVariant";
import { BundleCartItemFragment } from "@graphcommerce/magento-product-bundle/components/BundleCartItem/BundleCartItem.gql";
import { ConfigurableCartItemFragment } from "@graphcommerce/magento-product-configurable/ConfigurableCartItem/ConfigurableCartItem.gql";
import { CartOrderDetailSummary } from "./CartOrderDetailSummary";
import { GetCartSummaryDocument } from "@graphcommerce/magento-cart/components/CartSummary/GetCartSummary.gql";
import { CheckoutAddrssField } from "./PaymentPage";
import { PenIcon } from "@components/Icons";
import { useRouter } from "next/router";
import { AcroFormListBox } from "jspdf";

export type CheckoutOrderSummaryProps = {
  sx?: SxProps<Theme>
}

export const CheckoutOrderSummary = (props: CheckoutOrderSummaryProps) => {
  const {sx} = props;
  const {data, loading, error} = useCartQuery(CartPageDocument, { returnPartialData: true, errorPolicy: 'all' })
  const { data: shippingData, loading: shippingLoad } = useCartQuery(GetCartSummaryDocument, { allowUrl: true })
  
  const router = useRouter()
  const productVarinatRender = (item) => {
    if (item?.product?.__typename === 'ConfigurableProduct' || item?.product?.__typename === 'BundleProduct') {
      return (
        <Accordion sx={{            
          backgroundColor: 'transparent',
          borderBottom: '0'
        }}>
            <AccordionSummary
              expandIcon={<IconSvg src={iconChevronDown} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                padding: '0 !important',
                margin: '0 !important',
                minHeight: '1.625rem !important',
                justifyContent: 'flex-start !important',
                '& .MuiAccordionSummary-content' : {
                  flexGrow: '0 !important',
                  margin: '0 !important'
                }
              }}
              >
              <Typography 
                sx={{
                  textTransform: 'initial !important',
                  fontWeight: '400',
                  fontVariationSettings: "'wght' 400",
                  marginRight: '0.12rem'
                }}>
               <Trans id="View Details" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{
              padding: '0.313rem 0 0.625rem 0 !important'
            }}>
              <Box sx={{
                '& span' : {
                  marginBottom: '0.125rem',
                  '&:last-child' : {
                    marginBottom: '0',
                  },
                  '& b' : {
                    fontWeight: '700',
                    fontVariationSettings: "'wght' 700",
                  },
                }
              }}>
                {item?.product?.__typename === 'ConfigurableProduct' && <ConfigurableProduct {...item as ConfigurableCartItemFragment}  />}
              </Box>
              <Box>
                {item?.product?.__typename === 'BundleProduct' && <BundleProduct {...item as BundleCartItemFragment} />}
              </Box>
            </AccordionDetails>
          </Accordion>
      )
    }
  }

  return(
    <>
      <Box sx={{
        ...sx,
        backgroundColor: '#f5f5f5',
        padding: {xs: '3rem 1.875rem 1.875rem', md:'1.375rem 1.875rem'},
        marginTop: {md:'3.75rem'},
      }}>
        <Box sx={{
          marginBottom: '0.5rem'
        }}>          
          <Typography 
            variant="h4"
            sx={{
              fontSize: '26px !important',
              lineHeight: '2.313rem'
            }}
          >
            <Trans id='Order Summary' />
          </Typography>
        </Box>

          {loading && !error ?
            
            <Box>
              <CircularProgress/>
            </Box> : 

            <>

              <CartOrderDetailSummary {...data} shippingData={shippingData} shippingLoad={shippingLoad}/>

              <Box>

                <Accordion sx={{            
                  backgroundColor: 'transparent',
                  paddingLeft: '0',
                  paddingRight: '0',
                }}>

                  <AccordionSummary
                    expandIcon={<IconSvg src={iconChevronDown} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      paddingLeft: '0 !important',
                      paddingRight: '0 !important',
                      borderBottom: '1px solid transparent',
                      '&.Mui-expanded': {
                        borderBottomColor: '#cccccc',
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{
                        textTransform: 'initial !important',
                        fontWeight: '300 !important',
                        fontVariationSettings: "'wght' 300",
                      }}
                    >
                      {data?.cart?.total_quantity ?? 0} <Trans id="Items in Cart" />
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails 
                    sx={{
                      paddingBottom: '0 !important',
                      maxHeight: '370px',
                      overflow: 'auto',
                    }}
                  >
                    {data?.cart?.items?.map((item) => {
                      return(
                        <Box 
                          sx={{
                            display: 'flex',
                            alignItems:"flex-start",
                            padding: '0.938rem 0',
                            borderBottom: '1px solid #cccccc',
                            '&:last-child': {
                              borderBottom: '0',
                            }
                          }} 
                          key={item?.product?.name}
                        >
                          {(item?.product?.thumbnail?.url && item?.product?.thumbnail?.label) &&
                            <Box
                              sx={{
                                height:'75px', 
                                width:'75px'
                              }}
                            >
                              <Image
                                quality={80}
                                layout='fill'
                                // sizes={responsiveVal(50, 50)}
                                src={item.product.thumbnail.url}
                                alt={item.product.thumbnail.label} 
                                height={75}  
                                width={75}  
                                sx={{ objectFit: 'contain' }}
                              />
                            </Box>
                          }

                          <Box 
                            sx={{
                              paddingLeft: '0.875rem'
                            }}
                          >
                            <Typography sx={{marginBottom: '0.6rem'}}>
                              {item?.product?.name}
                            </Typography>

                            <Typography sx={{marginBottom: '0.125rem'}}>
                              <Trans id="Qty: " /> {item?.quantity}
                            </Typography>

                            <Typography sx={{marginBottom: '0.5rem'}}>
                              <Money {...item?.prices?.price} />
                            </Typography>

                            {productVarinatRender(item)}

                          </Box>

                        </Box>
                      )
                    })}
                  </AccordionDetails>

                </Accordion>

                <Box
                  sx={{
                    paddingTop: '1rem'
                  }}
                >
                  <Link
                    href='/cart'
                    underline='hover'
                  >
                    View and Edit Cart                    
                  </Link>
                </Box>

              </Box>

            </>
          }

          <ApolloCartErrorAlert error={error} />

      </Box>
      {router.asPath === '/checkout/payment' && (
        <Box sx={{
            padding: '1.875rem',
          }}>
          <Typography variant="h4" 
            sx={(theme) => ({ 
              fontSize: '1.625rem !important',
              mb: '0.75rem', 
              paddingTop: '0.875rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #cccccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}>
              <Trans id="Ship To: " /> 
                <Link
                  href="/checkout"
                  underline='hover'
                >
                <IconButton 
                  aria-label="Edit icon"
                  size="small"
                >                
                  <IconSvg src={PenIcon}/>
                </IconButton>
              </Link>
          </Typography>
          <CheckoutAddrssField {...shippingData?.cart?.shipping_addresses[0]} sx={{
            padding: '0.5rem 0',
            '& > div': {
              paddingTop: '0.5rem 0'
            }
          }} />
          <Typography variant="h4" 
            sx={(theme) => ({ 
              fontSize: '1.625rem !important',
              mb: '0.75rem', 
              paddingTop: '0.875rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #cccccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}>
              <Trans id="Shipping Method: " /> 
              <IconButton 
                aria-label="Edit icon"
                sx={{
                  height: '2.5rem',
                  width: '2.5rem',
                  '& a': {
                    marginBottom: '0',
                    display: 'flex',
                    '& svg': {
                      verticalAlign: 'middle',
                      color: '#757575',
                    }
                  }
                }}
              >
                <Link
                  href="/checkout"
                  underline='hover'
                  sx={(theme) => ({
                    typgrapht: 'subtitle1',
                    color: theme.palette.text.primary,
                    textDecoration: 'none',
                    flexWrap: 'nowrap',
                    maxWidth: 'max-content',
                    '&:not(.withOptions)': {
                      alignSelf: 'flex-end',
                    },
                    fontSize: '1.125rem',
                    lineHeight: '1.5rem',
                    display: 'inline-block',
                    marginBottom: '1rem',
                  })}
                >
                  <IconSvg src={PenIcon} />
                </Link>
              </IconButton>
          </Typography>
          <Box sx={{
            padding: '0.5rem 0',
            '& > span': {
              paddingTop: '0.5rem 0'
            }
          }}>
            <Typography variant='body1'> 
              {shippingData?.cart?.shipping_addresses[0]?.selected_shipping_method?.carrier_title} - {shippingData?.cart?.shipping_addresses[0]?.selected_shipping_method?.method_title}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )

}

export default CheckoutOrderSummary