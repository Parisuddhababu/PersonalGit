// import { iconChevronDown } from "@graphcommerce/next-ui"
import { CartPageQuery } from "@graphcommerce/magento-cart-checkout";
import { Trans } from "@lingui/react";
import { Accordion, Box, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import { iconChevronDown, IconSvg } from '@graphcommerce/next-ui';
import { ApplyCouponForm, RemoveCouponForm } from "@graphcommerce/magento-cart-coupon";
export type CartDiscountCouponProps = CartPageQuery;

export const CartDiscountCoupon = (props: CartDiscountCouponProps): JSX.Element => {
  const {cart} = props;
  const coupon = cart?.applied_coupons?.[0]?.code
  return (
    <Box>
       <Accordion defaultExpanded={cart?.applied_coupons?.[0]?.code ? true : false}
        sx={{
          borderBottom: '0px solid #0003'
        }}
       >
        <AccordionSummary
          expandIcon={<IconSvg src={iconChevronDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            <Trans id="Apply Discount Code" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!  coupon ? 
            <ApplyCouponForm sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              '& > div':{
                '&:nth-child(2)':{
                  paddingTop: '0.625rem',
                },
                '&:nth-child(3)':{
                  paddingTop: '0.625rem',
                  
                  '& .MuiSvgIcon-root':{
                    alignItems: 'center',
                  },
                  '& .MuiAlert-action':{
                    alignItems: 'center',
                  },
                },
              }
            }} /> :
            <RemoveCouponForm {...cart} /> 
          }
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default CartDiscountCoupon