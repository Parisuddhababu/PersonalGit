import { Trans } from '@lingui/react'
import { Button } from '@mui/material'
import {
  useAddProductsToCartAction,
  useFormAddProductsToCart,
} from '@graphcommerce/magento-product'
import { useCartIdCreate } from '@graphcommerce/magento-cart'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { UIContext } from '@components/common/contexts/UIContext'
import { SimpleCartUpdateDocument } from '@graphql/update-cart/SimpleCartUpdate.gql'
import { useMutation } from '@graphcommerce/graphql'
import { GiftCardCartUpdateDocument } from '@graphql/update-cart/GiftCardCartUpdate.gql'
import { UpdateItemQuantityDocument } from '@graphcommerce/magento-cart-items/UpdateItemQuantity/UpdateItemQuantity.gql'
import { ConfigurableCartUpdateDocument } from '@graphql/update-cart/ConfigurableCartUpdate.gql'
import { CartPageDocument } from '@graphcommerce/magento-cart-checkout'
import { useFormState } from '@graphcommerce/react-hook-form'

export const UpdateCartButton = (props) => {
  const { editDetails, sx, product, getGiftCard, quantities, ids } = props
  const router = useRouter()
  const cartId = useCartIdCreate()
  const [, setState] = useContext(UIContext)
  const action = useAddProductsToCartAction(props)
  const { control, getValues } = useFormAddProductsToCart()
  const formState = useFormState({ control })
  const configError = formState.errors.cartItems?.[0]?.sku?.message
  const selectedOptions = getValues('cartItems')?.[0]?.selected_options
  const selectedQuantities = Object.values(quantities ?? {})
  const selectedColor = product?.configurable_options?.[0]?.values?.filter(
    (el) => el?.uid === getValues('cartItems')?.[0]?.selected_options?.[1],
  )?.[0]?.store_label
  const selectedSize = product?.configurable_options?.[1]?.values?.filter(
    (el) => el?.uid === getValues('cartItems')?.[0]?.selected_options?.[0],
  )?.[0]?.store_label
  const [simpleUpdate, { loading }] = useMutation(SimpleCartUpdateDocument)
  const [giftCardUpate, { loading: giftCardLoading }] = useMutation(GiftCardCartUpdateDocument)
  const [configurableUpdate, { loading: configurableLoading }] = useMutation(
    ConfigurableCartUpdateDocument,
  )

  const [updateQuantity, { loading: updateLoading }] = useMutation(UpdateItemQuantityDocument)

  const handleToast = (type: String) => {
    if (type === 'success') {
      router?.push('/cart')
      setState((prev) => ({
        ...prev,
        alerts: [
          {
            type: 'success',
            message: `${product?.name} was updated in your shopping cart.`,
            timeout: 5000,
            targetLink: '/cart',
          },
        ],
      }))
      return
    }
    if (type === 'error') {
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
  }

  const updateCart = async () => {
    if (product?.__typename === 'SimpleProduct') {
      await simpleUpdate({
        variables: {
          cart: (await cartId()) ?? '',
          item_id: editDetails?.cartItemId ?? '',
          sku: product?.sku ?? '',
          qty: String(getValues('cartItems')?.[0].quantity),
        },
        onError: (error) => {
          handleToast('error')
        },
        onCompleted: () => {
          handleToast('success')
        },
      })
      return
    }
    if (product?.__typename === 'GiftCardProduct') {
      await giftCardUpate({
        variables: {
          cart: (await cartId()) ?? '',
          item_id: editDetails?.cartItemId ?? '',
          sku: product?.sku ?? '',
          amount: String(getGiftCard?.amount),
          qty: getGiftCard?.qty,
          message: getGiftCard?.message,
          recipientName: getGiftCard?.recipientName,
          senderName: getGiftCard?.senderName,
          ...(getGiftCard?.recipientEmail && { recipientEmail: getGiftCard?.recipientEmail }),
          ...(getGiftCard?.senderEmail && { senderEmail: getGiftCard?.senderEmail }),
        },
        onError: () => {
          handleToast('error')
        },
        onCompleted: () => {
          router.push('/cart')
          handleToast('success')
        },
      })
      return
    }
    if (product?.__typename === 'ConfigurableProduct') {
      await configurableUpdate({
        variables: {
          cart: (await cartId()) ?? '',
          item_id: editDetails?.cartItemId ?? '',
          sku: product?.sku ?? '',
          qty: String(getValues('cartItems')?.[0].quantity),
          color_option: selectedColor,
          size_option: selectedSize,
        },
        refetchQueries: [CartPageDocument],
        onError: () => {
          handleToast('error')
        },
        onCompleted: () => {
          router.push('/cart')
          handleToast('success')
        },
      })
      return
    }
    // if (product?.__typename === 'BundleProduct') {
    //   await bundleUpdate({
    //     variables: {
    //       cart: (await cartId()) ?? '',
    //       item_id: editDetails?.cartItemId ?? '',
    //       sku: product?.sku ?? '',
    //       qty: String(getValues('cartItems')?.[0].quantity),
    //       qty1: selectedQuantities?.[0] ? Number(selectedQuantities[0]) : 1,
    //       qty2: selectedQuantities?.[1] ? Number(selectedQuantities[1]) : 1,
    //       qty3: selectedQuantities?.[2] ? Number(selectedQuantities[2]) : 1,
    //       qty4: selectedQuantities?.[3] ? Number(selectedQuantities[3]) : 1,
    //       value1: String(ids?.[0]),
    //       value2: String(ids?.[1]),
    //       value3: String(ids?.[2]),
    //       value4: String(ids?.[3]),
    //     },
    //     refetchQueries: [CartPageDocument],
    //     onError: () => {
    //       handleToast('error')
    //     },
    //     onCompleted: () => {
    //       router.push('/cart')
    //       handleToast('success')
    //     },
    //   })
    //   return
    // }
    await updateQuantity({
      variables: {
        cartId: (await cartId()) ?? '',
        quantity: Number(getGiftCard?.qty) || getValues('cartItems')?.[0].quantity,
        uid: editDetails?.uid,
      },
      onError: () => {
        handleToast('error')
      },
      onCompleted: () => {
        router.push('/cart')
        handleToast('success')
      },
    })
  }

  const config =
    product?.__typename === 'ConfigurableProduct' && !selectedOptions?.every((el) => el)
      ? false
      : true

  return (
    <>
      {config ? (
        <Button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            updateCart()
          }}
          type='submit'
          sx={{
            ...sx,
            ...((loading ||
              giftCardLoading ||
              updateLoading ||
              configurableLoading ||
              !!configError) && {
              '&:disabled': { color: 'white', opacity: '0.5' },
            }),
          }}
          disabled={
            loading ||
            giftCardLoading ||
            updateLoading ||
            configurableLoading ||
            !!configError
          }
          variant='pill'
          size='large'
        >
          <Trans id='Update Cart' />
        </Button>
      ) : (
        <Button type='submit' sx={sx} variant='pill' size='large' {...props} {...action}>
          <Trans id='Update Cart' />
        </Button>
      )}
    </>
  )
}
