import {ApolloCartErrorAlert, useFormGqlMutationCart} from '@graphcommerce/magento-cart'
import { CartItemFragment } from '@graphcommerce/magento-cart-items'
import { RemoveItemFromCartDocument } from '@graphcommerce/magento-cart-items/RemoveItemFromCart/RemoveItemFromCart.gql'
import { i18n } from '@lingui/core'
import { TrashIcon } from '@components/Icons'
import { IconButton, SxProps, Theme, styled } from '@mui/material'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'
import {ConfirmDialog} from "@components/common/ConfirmDialog";
import {useState} from "react";

export type RemoveItemFromCartProps = CartItemFragment &
    Omit<JSX.IntrinsicElements['form'], 'onSubmit' | 'noValidate'> & { sx?: SxProps<Theme> }

const Form = styled('form')({})

export const RemoveItemFromCart = (props: RemoveItemFromCartProps) => {
    const {
        uid,
        ...formProps
    } = props
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const form = useFormGqlMutationCart(RemoveItemFromCartDocument, { defaultValues: { uid } })
    const { handleSubmit, formState, error, loading } = form
    const submitHandler = handleSubmit(() => {})

    return (
        <Form noValidate onSubmit={submitHandler} {...formProps}>
            <IconButton
                aria-label={i18n._(/* i18n */ 'Remove Product')}
                size='small'
                type='button'
                onClick={() => {
                    setOpenDialog(true)
                }}
                sx={{
                    height: '2.5rem',
                    width: '2.5rem',
                    boxShadow: 'none',
                    '& svg': {
                        fontSize: '1.125rem',
                        color: '#757575',
                        '& path': {
                            fill: '#757575',
                        }
                    }
                }}
                disabled={formState.isSubmitting}
            >
                <TrashIcon />
            </IconButton>
            <ApolloCartErrorAlert error={error} />
            <ConfirmDialog
                openDialog={openDialog}
                onClose={() => setOpenDialog(false)}
                title="Are you sure you would like to remove this item from the shopping cart?"
                handleSubmit={() => submitHandler()}
            />
            {loading && <FullPageOverlaySpinner />}
        </Form>
    )
}

export default RemoveItemFromCart
