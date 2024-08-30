/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { AccountDashboardOrdersDocument, useCustomerQuery } from '@graphcommerce/magento-customer'
import { Box, Button, Typography, Checkbox, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useAddToCartFromWishlist } from '../../graphql/hooks'
import { AddToCartBtn } from '../AddToCartBtn'
import { UIContext } from '../common/contexts/UIContext'

type itemType = {
  product_name: string | null | undefined
  product_sku: string | null | undefined
  product_url_key: string | null | undefined
  quantity_canceled: number | null | undefined
  quantity_invoiced: number | null | undefined
  quantity_ordered: number | null | undefined
  quantity_refunded: number | null | undefined
  quantity_returned: number | null | undefined
  quantity_shipped: number | null | undefined
  __typename: string | null | undefined
}

export const MiniRecentOrders = () => {
  const cartId = useCartIdCreate()
  const router = useRouter()
  const [, setState] = useContext(UIContext)
  const { addToCartFromWishlist, data, loading } = useAddToCartFromWishlist()
  const orders = useCustomerQuery(AccountDashboardOrdersDocument, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: 5,
      currentPage: 1,
    },
  })

  const [checked, setChecked] = useState<{ item: itemType; index: number }[]>([])

  const handleChange = (item, index: number) => {
    if (checked.some((arr) => index === arr.index)) {
      const newArr = checked.filter((arr) => index !== arr.index)
      setChecked(newArr)
      return
    }
    setChecked([...checked, { item, index }])
  }

  const { data: orderData } = orders
  const customer = orderData?.customer
  const products = customer?.orders?.items?.flatMap((arr) => arr?.items)

  useEffect(() => {
    if (data) {
      const alerts: { type: string; message: string; timeout: number; targetLink: string }[] = []
      const addedItems = data?.addProductsToCart?.cart?.items?.reverse() ?? []
      const errors = data?.addProductsToCart?.user_errors ?? []
      const filteredArray = checked.filter((value) =>
        addedItems.some((el) => el?.product?.sku === value?.item?.product_sku),
      )
      filteredArray?.map((item) =>
        alerts.push({
          type: 'success',
          message: `You added ${item?.item?.product_name} to your shopping cart.`,
          timeout: 5000,
          targetLink: router?.pathname,
        }),
      )
      if (errors?.length > 0) {
        alerts.push({
          type: 'error',
          message: `${errors?.[0]?.message}`,
          timeout: 5000,
          targetLink: router?.pathname,
        })
      }
      setState((prev) => ({
        ...prev,
        alerts,
      }))
      setChecked([])
    }
  }, [data, setState, router?.pathname])

  const handleAddToCart = () => {
    const toBeAdded = checked?.map((item) => ({
      sku: item?.item?.product_sku,
      quantity: item?.item?.quantity_ordered,
    }))
    if (!toBeAdded || toBeAdded?.length === 0) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `Please select at least one product to add to cart`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
      return
    }
    async function closerFn() {
      await addToCartFromWishlist(await cartId(), toBeAdded, '', '')
    }
    closerFn()
      .then(() => {})
      .catch(() => {})
  }

  return (
    <>
      {products && products?.length > 0 && (
        <Box
          sx={{
            marginLeft: '0',
            marginTop: { xs: '0', md: '1rem' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.125rem !important',
                fontWeight: '300 !important',
                marginRight: '0.5rem',
              }}
            >
              Recently Ordered
            </Typography>
          </Box>
          <Box
            sx={{
              marginBottom: '0.75rem',
            }}
          >
            {products &&
              products?.length > 0 &&
              products?.slice(0, 5)?.map((item, index) => (
                <Box>
                  <Checkbox
                    checked={checked.some((arr) => index === arr.index)}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleChange(item, index)
                    }}
                    sx={{
                      padding: '0.2rem',
                      marginLeft: '-0.4rem',
                      marginRight: '0.188rem',
                    }}
                  />
                  <Link
                    sx={{
                      color: '#000000',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    href={`/p/${item?.product_url_key}`}
                    dangerouslySetInnerHTML={{ __html: item?.product_name ?? '' }}
                  />
                </Box>
              ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <AddToCartBtn
              disabled={loading}
              onClick={handleAddToCart}
              title={loading ? 'Adding...' : 'Add to Cart'}
            />
            <Button
              href='/account/my-orders'
              disableRipple
              sx={{
                color: '#006bb4',
                justifyContent: 'flex-start',
                marginLeft: { xs: 'auto', md: '0.5rem' },
                marginRight: { xs: 'auto', md: '0' },
                paddingLeft: '0px',
                paddingRight: '1rem',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent',
                },
                '&:active': {
                  color: 'red',
                  textDecoration: 'underline',
                  backgroundColor: 'transparent',
                },
              }}
            >
              View All
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}
// eslint-disable-next-line import/no-default-export
export default MiniRecentOrders
