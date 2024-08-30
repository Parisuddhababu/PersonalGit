import { useFormGqlMutationCart } from '@graphcommerce/magento-cart'
import {
  UpdateItemQuantityMutation,
  UpdateItemQuantityMutationVariables,
  UpdateItemQuantityDocument,
} from '@graphcommerce/magento-cart-items/UpdateItemQuantity/UpdateItemQuantity.gql'
import { TextInputNumber } from '@graphcommerce/next-ui'
import { useFormAutoSubmit, UseFormGraphQlOptions } from '@graphcommerce/react-hook-form'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'
import { SxProps, Theme } from '@mui/material'
import { ConfirmDialog } from '@components/common/ConfirmDialog'
import { useEffect, useState } from 'react'

type UpdateItemQuantityFormReturn = UseFormGraphQlOptions<
  UpdateItemQuantityMutation,
  UpdateItemQuantityMutationVariables
>

export type UpdateItemQuantityProps = Omit<UpdateItemQuantityMutationVariables, 'cartId'> & {
  sx?: SxProps<Theme>
} & Omit<UpdateItemQuantityFormReturn, 'mode' | 'defaultValues'>

export const UpdateCartQuantity = (props: UpdateItemQuantityProps) => {
  const { uid, quantity, sx, ...formProps } = props
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const form = useFormGqlMutationCart(UpdateItemQuantityDocument, {
    defaultValues: { uid, quantity: quantity },
    mode: 'onChange',
    ...formProps,
  })
  const { muiRegister, required, handleSubmit, formState, error, reset, loading } = form

  const submit = handleSubmit(() => {})
  useFormAutoSubmit({ form, submit })

  useEffect(() => {
    const messageArr = error?.graphQLErrors?.[0]?.message?.split(':')?.[1]?.split('.')
    const newMessage = messageArr?.join('</br>')
    if (error) {
      setOpenDialog(true)
      setErrorMessage(newMessage ?? '')
    }
  }, [error])

  return (
    <form noValidate onSubmit={submit}>
      <TextInputNumber
        size='small'
        variant='outlined'
        inputProps={{ min: 1 }}
        error={!!formState.errors.quantity}
        {...muiRegister('quantity', { required: required.quantity })}
        helperText={formState.errors.quantity?.message}
        sx={sx}
        defaultValue={quantity}
      />
      <ConfirmDialog
        openDialog={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
        title={errorMessage}
        cancelButtonText={'Ok'}
        okButtonText={null}
        cancelButtonColor={'secondary'}
        headerTitle={'Attention'}
      />
      {loading && <FullPageOverlaySpinner />}
    </form>
  )
}

export default UpdateCartQuantity
