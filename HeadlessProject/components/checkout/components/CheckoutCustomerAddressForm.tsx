import { useQuery } from '@graphcommerce/graphql'
import {
    ApolloCartErrorAlert,
    useCartQuery,
    useFormGqlMutationCart,
} from '@graphcommerce/magento-cart'
import { CustomerDocument } from '@graphcommerce/magento-customer'
import {ActionCard, ActionCardListForm} from '@graphcommerce/next-ui'
import {
    useFormPersist,
    useFormCompose,
    UseFormComposeOptions,
    useFormAutoSubmit,
} from '@graphcommerce/react-hook-form'
import {Box, Button, Dialog, DialogTitle, DialogContent, IconButton, SxProps, Theme, Typography} from '@mui/material'
import React, { useEffect } from 'react'
import {isSameAddress} from "@graphcommerce/magento-cart-shipping-address/utils/isSameAddress";
import {
    SetCustomerShippingBillingAddressOnCartDocument
} from "@graphcommerce/magento-cart-shipping-address/components/CustomerAddressForm/SetCustomerShippingBillingAddressOnCart.gql";
import {
    SetCustomerShippingAddressOnCartDocument
} from "@graphcommerce/magento-cart-shipping-address/components/CustomerAddressForm/SetCustomerShippingAddressOnCart.gql";
import {
    GetAddressesDocument
} from "@graphcommerce/magento-cart-shipping-address/components/ShippingAddressForm/GetAddresses.gql";
import {CheckoutCustomerAddressActionCard} from "@components/checkout/components/CheckoutCustomerAddressActionCard";
import {Trans} from "@lingui/react";
import {CheckoutShippingAddressForm} from "@components/checkout";
import { Closemenu } from '../../../components/Icons'

type CustomerAddressListProps = Pick<UseFormComposeOptions, 'step'> & {
    children?: React.ReactNode
    sx?: SxProps<Theme>
}

export function CheckoutCustomerAddressForm(props: CustomerAddressListProps) {
    const { step, children, sx } = props
    const [open, setOpen] = React.useState(false);
    const [addressList, setAddressList] = React.useState<any>([]);
    const customerAddresses = useQuery(CustomerDocument)
    const addresses = customerAddresses.data?.customer?.addresses

    const { data: cartQuery } = useCartQuery(GetAddressesDocument)

    const shippingAddress = cartQuery?.cart?.shipping_addresses?.[0]
    const billingAddress = cartQuery?.cart?.billing_address

    const found = customerAddresses.data?.customer?.addresses?.find(
        (customerAddr) =>
            [
                customerAddr?.firstname === shippingAddress?.firstname,
                customerAddr?.lastname === shippingAddress?.lastname,
                customerAddr?.city === shippingAddress?.city,
                customerAddr?.postcode === shippingAddress?.postcode,
                customerAddr?.street?.[0] === shippingAddress?.street[0],
                customerAddr?.street?.[1] === shippingAddress?.street[1],
                customerAddr?.street?.[2] === shippingAddress?.street[2],
                customerAddr?.country_code === shippingAddress?.country.code,
                customerAddr?.region?.region_code === shippingAddress?.region?.code,
            ].filter((v) => !v).length === 0,
    )

    const Mutation = isSameAddress(shippingAddress, billingAddress)
        ? SetCustomerShippingBillingAddressOnCartDocument
        : SetCustomerShippingAddressOnCartDocument

    // if (cartQuery?.cart?.is_virtual) {
    //   Mutation = SetCustomerBillingAddressOnCartDocument
    // }

    const form = useFormGqlMutationCart(Mutation, {
        defaultValues: {
            customerAddressId: found?.id ?? undefined,
        },
        onBeforeSubmit: (vars) => {
            if (vars.customerAddressId === -1) return false
            return vars
        },
    })

    const { handleSubmit, error, control, watch, setValue } = form

    // If customer selects 'new address' then we do not have to submit anything so we provide an empty submit function.
    const customerAddressId = watch('customerAddressId')

    const submit = handleSubmit(() => {})

    // We want to persist the form because we can't send the 'new address' state to the server, but we do want to keep this selection.
    useFormPersist({ form, name: 'CustomerAddressForm' })
    useFormCompose({ form, step, submit, key: 'CustomerAddressForm' })

    // We want to autosubmit the CustomerAddressFrom because the shipping methods depend on it.
    useFormAutoSubmit({ form, submit })

    // When there is no address set on the cart set before
    const defaultAddr =
        (!shippingAddress && addresses?.find((a) => a?.default_shipping)?.id) || undefined

    useEffect(() => {
        if (defaultAddr) setValue('customerAddressId', defaultAddr)
    }, [defaultAddr, setValue])

    useEffect(() => {
        if (!addresses) return
        console.log('address', addresses)
        setAddressList([
            ...(addresses ?? []).filter(Boolean).map((address) => ({
                ...address,
                value: Number(address?.id),
            })),
            {
                value: -1
            }
        ])
    }, [addresses]);

    const setNewShippingAddress = (newAddress) => {
        setOpen(false);
        if (!newAddress) {
            return
        }
        const address = {
            country_code: newAddress?.country?.code,
            ...newAddress,
            region: {
                region: newAddress?.region?.label,
                region_code: newAddress?.region?.code,
            },
        }
        setAddressList([
            ...(addresses ?? []).filter(Boolean).map((address) => ({
                ...address,
                value: Number(address?.id),
            })),
            {
                ...address,
                value: -1
            }
        ])

        setValue('customerAddressId', -1)
    }

    if (customerAddresses.loading || !addresses || addresses.length === 0) return <>{children}</>

    return (
        <>
            <Box component='form' onSubmit={submit} noValidate sx={{...sx, marginBottom: {xs:'1.75rem', md:'2.75rem'}}}>
                <ActionCardListForm
                    control={control}
                    name='customerAddressId'
                    errorMessage='Please select a shipping address'
                    collapse
                    size='large'
                    color='secondary'
                    items={addressList}
                    render={CheckoutCustomerAddressActionCard}
                    checkoutForm={true}
                    sx={{
                        gridTemplateColumns: {xs:'1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                        gridRowGap: {md:'1.25rem'},
                        marginBottom: {xs:'0.45rem', md: '0'},
                        '& .ActionCard-root': {
                            borderRadius: '0 !important',
                            boxShadow: 'none !important',
                            border: '0px solid transparent',
                            borderBottom: {xs:'1px solid #cccccc !important', md: '0 !important'},
                            padding: {xs: '15px 30px 15px 15px !important', md:'20px 35px 20px 20px !important'},
                            '&:nth-child(3n - 1)': {
                                '&:before, &:after': {
                                    content:`''`,
                                    position: 'absolute',
                                    background: '#cccccc',
                                    height: 'calc( 100% - 25px )',
                                    top: '0',
                                    width: '1px',
                                    bottom: '0',
                                },
                                '&:before': {
                                    left: '-2px',
                                },
                                '&:after': {
                                    right: '0px',
                                    display: {xs: 'none', md:'block'}
                                }
                            },
                            '& > .MuiBox-root': {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            },
                            '&:last-child': {
                                '&:after': {
                                    content: 'none',
                                }
                            },
                            '&.selected': {
                                '&:before': {
                                    content:`''`,
                                    position: 'absolute',
                                    inset: '0 0 !important',
                                    backgroundColor: 'transparent',
                                    border: '2px solid #ff5501',
                                    width: '100%',
                                    height: '100%',
                                    zIndex: '-1',
                                },
                                '&:after': {
                                    content: 'none',
                                },
                                '& .addree-selected-icon': {
                                    display: 'flex',
                                }
                            }
                        }
                    }}
                />
                {watch('customerAddressId') !== -1 && (<Button
                    type="button"
                    sx={{
                        mt: '1rem'
                    }}
                    variant="contained"
                    size="medium"
                    onClick={() => setOpen(true)} tabIndex={-1}
                >
                    <Trans id='+ New Address'/>
                </Button>)}
                <ApolloCartErrorAlert error={error} />
            </Box>

            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDialog-paper': {
                        maxWidth: '50rem',
                        borderRadius: '0'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        padding: "1.875rem 1.875rem 0",
                    }}
                >
                    <Typography
                        variant='h4'
                        gutterBottom
                        sx={(theme) => ({
                            fontSize: '1.625rem !important',
                            marginBottom: '0',
                            paddingTop: '0',
                            paddingBottom: '0.5rem',
                            borderBottom: '1px solid #cccccc',
                        })}
                    >
                        <Trans id='Shipping Address' />
                    </Typography>

                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Closemenu />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{
                    padding: "1.875rem !important",
                    '& .address-form-inner' :{
                        maxWidth:"31.25rem",
                    }
                }}>
                    <CheckoutShippingAddressForm ignoreCache addNewAddress={true} addNewSubmit={(value) => setNewShippingAddress(value)} />
                </DialogContent>
            </Dialog>
        </>
    )
}
