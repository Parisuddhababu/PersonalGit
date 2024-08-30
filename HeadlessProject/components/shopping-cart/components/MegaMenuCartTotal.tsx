import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
import { CartPageDocument } from "@graphcommerce/magento-cart-checkout";
import { useCartQuery } from "@graphcommerce/magento-cart";
import {CurrentCartIdDocument} from "@graphcommerce/magento-cart/hooks/CurrentCartId.gql";
import {useEffect, useState} from "react";

export type MegaMenuCartTotalProps = {
  sx?: SxProps<Theme>
}

export const MegaMenuCartTotal = (props: MegaMenuCartTotalProps) => {
  const {sx} = props
  const cart = useCartQuery(CartPageDocument)
  const [state, setState] = useState(false);
  const { data, loading, client, refetch } = cart

  const currentCartId  = client.readQuery({
    query: CurrentCartIdDocument
  })

  useEffect(() => {
    if(!currentCartId?.currentCartId?.id) {
      refetch({
        cartId: ''
      }).then((resp) => {
        const {data} = resp
        client.writeQuery({
          query: CartPageDocument,
          data: data,
          broadcast: true
        })
        setState(!state)
      }).catch()
    }
  }, [currentCartId]);

  return (
    <>
      {
        data?.cart && data?.cart?.total_quantity > 0 &&
        <Box sx={{
          padding: '0 0.313rem',
          backgroundColor: '#ff5501',
          textShadow: '0 0 0.438rem #000000',
          color: '#ffffff',
          minWidth: '24px',
          textAlign: 'center',
          borderRadius: '0.125rem',
          height: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& span': {
            width: '1.25rem !important',
            height: '1.25rem !important',
            margin: '0.2rem 0',
            display: 'flex',
            color: '#ffffff'
          }
        , ...sx}}>
          {loading ? <CircularProgress/> : data?.cart?.total_quantity}
        </Box>
      }
    </>
  )

}

export default MegaMenuCartTotal;
