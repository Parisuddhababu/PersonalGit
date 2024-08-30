import { Accordion, Box, AccordionSummary, Typography, AccordionDetails, Grid } from "@mui/material";
import { iconChevronDown, IconSvg } from '@graphcommerce/next-ui';
import { Trans } from "@lingui/react";
import { CartPageQuery } from "@graphcommerce/magento-cart-checkout";
import { Money } from "@graphcommerce/magento-store";
import { CartEstimateShippingTax } from ".";
import { useCartContext } from "../hooks/cartContext";
import { CartStartCheckoutButton } from "@components/checkout";
import { useState } from "react";
import { ApolloCartErrorAlert } from "@graphcommerce/magento-cart";
import { ApolloError } from "@graphcommerce/graphql";

export type CartSummaryProps = CartPageQuery;

export const CartSummary = (props: CartSummaryProps) => {
  const {cart} = props;
  const {cartSummaryDetails} = useCartContext();
  const [errorHandler, setErrorHandler] = useState<ApolloError| undefined>(undefined)

  return (
    <Grid container sx={{
      position: 'sticky',
      top: '0',
      backgroundColor: '#f5f5f5',
      padding: '0.875rem 1.25rem 1.5rem'
    }}>
        <Grid item xs={12} md={12} sx={{
          borderBottom: '1px solid #0003'
        }}>
          <Typography
            variant="h4"
            sx={{
              marginBottom: '1rem',
            }}
          >
            <Trans id='Summary' />
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Accordion sx={{
          borderBottom: '1px solid #0003',
          backgroundColor: 'transparent',
        }} defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<IconSvg src={iconChevronDown} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                padding: '0 !important',
              }}
            >
              <Typography
                sx={{
                  textTransform: 'initial !important'
                }}
              >
                <Trans id="Estimate Shipping and Tax" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{
              padding: '0'
            }}>
              <CartEstimateShippingTax sx={{
                borderTop: '1px solid #c6c6c6'
              }} cart={cart} setErrorHandler={setErrorHandler} />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={12} sx={{
          borderBottom: '1px solid #0003',
          padding: '1rem 0'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>
              <Trans id="Subtotal" />
            </span>
            <span>
              {cartSummaryDetails?.subtotal ? <Money {...cartSummaryDetails?.subtotal} /> : 0}
            </span>
          </Box>
          { cartSummaryDetails?.discountData && cartSummaryDetails?.discountData?.length > 0 &&
          cartSummaryDetails?.discountData?.map((discount) => {
              return (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.7rem',
                }} key={discount?.title}>
                  <span>
                    <Trans id="Discount" /> ({discount?.title})
                  </span>
                  <span>
                   -<Money {...discount?.amount} />
                  </span>
                </Box>
              )
            })}
          {cartSummaryDetails?.selectedShippingMethods && cartSummaryDetails?.selectedShippingMethods?.length > 0 &&
          cartSummaryDetails?.selectedShippingMethods?.map((shippingMethod) => {
              return (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.7rem',
                }} key={shippingMethod?.carrierTitle}>
                  <span>
                    <Trans id="Shipping" /> ({shippingMethod?.carrierTitle} - {shippingMethod?.methodTitle})
                  </span>
                  <span>
                    <Money {...shippingMethod?.amount} />
                  </span>
                </Box>
              )
            })}
            {cartSummaryDetails?.tax?.value && cartSummaryDetails?.tax?.value > 0 &&
                (<Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.7rem',
                }}>
                    <span>
                      <Trans id="Tax" />
                    </span>
                    <span>
                      {cartSummaryDetails?.tax && <Money {...cartSummaryDetails?.tax} />}
                    </span>
                </Box>)
            }
        </Grid>
        <Grid item xs={12} md={12} sx={{
          // borderBottom: '1px solid #0003',
          padding: '1rem 0 1.5rem'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.125rem',
            lineHeight: '1.563rem',
            fontWeight: '600',
          }}>
            <span>
              <Trans id="Order Total" />
            </span>
            <span>
              {cartSummaryDetails?.orderTotal ? <Money {...cartSummaryDetails?.orderTotal} /> : 0}
            </span>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <ApolloCartErrorAlert error={errorHandler} />
        </Grid>
        <Grid item xs={12} md={12} sx={{
          padding: '1rem 0 0',
          '& .MuiButton-contained': {
            width: '100%',
            padding: '1rem 1rem'
          },
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
            borderRadius:'0.188rem'
          }
        }}>
          <CartStartCheckoutButton {...cart} {...cartSummaryDetails} />
        </Grid>
    </Grid>
  )
}

export default CartSummary
