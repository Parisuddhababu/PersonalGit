import { UIContext } from '@components/common/contexts/UIContext'
import { useMutation } from '@graphcommerce/graphql'
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { ApolloCustomerErrorAlert } from '@graphcommerce/magento-customer'
import { Trans } from '@lingui/react'
import { Box, Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { ReorderItemsDocument } from '../../graphql/MyOrders/ReOrder.gql'

type propsNumber = {
  number?: string
}

export function ReOrderBtn(props: propsNumber) {
  const router = useRouter()
  const cartId = useCartIdCreate()
  const [, setState] = useContext(UIContext)
  const { number } = props
  const [reorderItems, { loading, error, data }] = useMutation(ReorderItemsDocument)
  const handleRedirect = async () => {
    await router.push('/cart')
  }

  useEffect(() => {
    if (error) {
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'error',
            message: `Something went wrong !`,
            timeout: 5000,
            targetLink: router?.pathname,
          },
        ],
      }))
    }
  }, [error])
  const reOrderHandler = async () => {
    if (number) {
      await cartId()
      await reorderItems({
        variables: { orderNumber: number },
      })
      await handleRedirect()
    }

    if (error) {
      return <ApolloCustomerErrorAlert error={error} key='error' />
    }
    return null
  }
  return (
    <>
      {loading && !data ? (
        <Box sx={{ display: 'flex', marginLeft: '1.5rem' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Button
          disableRipple
          onClick={reOrderHandler}
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
          <Trans id='Reorder' />
        </Button>
      )}
    </>
  )
}
