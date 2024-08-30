import { CustomerAddressFragment } from '@graphcommerce/magento-customer/components/CreateCustomerAddressForm/CustomerAddress.gql'
import { useFindCountry } from '@graphcommerce/magento-store'
import { ActionCardItemRenderProps } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {Box, Button, IconButton, Typography, Link} from '@mui/material'
import { useRouter } from 'next/router'
import {CheckoutActionCard} from "@components/checkout/CheckoutActionCard";
import {CheckedIcon} from "@components/Icons";

type CustomerAddressActionCardProps = ActionCardItemRenderProps<
    CustomerAddressFragment | null | undefined
    >

export function CheckoutCustomerAddressActionCard(props: CustomerAddressActionCardProps) {
    const {
        onReset,
        company,
        firstname,
        lastname,
        street,
        postcode,
        city,
        country_code,
        region,
        telephone,
        id,
        ...cardProps
    } = props
    const { push } = useRouter()
    const country = useFindCountry(country_code)

    if (cardProps.value === -1 && !firstname) {
        return <></>
    }

    return (
        <CheckoutActionCard
            {...cardProps}
            details={

                <Box
                    sx={{
                        '& p': {
                            marginBottom: '0rem',
                            lineHeight: '1.875rem',
                        }
                    }}
                >
                    <IconButton
                        aria-label="delete"
                        size="small"
                        className='addree-selected-icon'
                        sx={{
                            display: 'none',
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            borderRadius: '0',
                            backgroundColor: '#ff5501',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#ff5501',
                            }
                        }}
                    >
                        <CheckedIcon />
                    </IconButton>

                    <Typography variant='body1'>
                        {firstname} {lastname}
                    </Typography>

                    <Typography variant='body1'>
                        {company}
                    </Typography>

                    <Typography variant='body1'>
                        {street?.join(' ')}, {city}
                    </Typography>

                    <Typography variant='body1'>
                        {country?.full_name_locale}
                    </Typography>

                    <Typography variant='body1'>
                        {region?.region_code}{' '}, {postcode}
                    </Typography>

                    <Link underline='hover' href={`tel:${telephone}`}>
                        {telephone}
                    </Link>

                </Box>
            }
            action={
                <Button disableTouchRipple variant='contained' size='medium' tabIndex={-1}
                    sx={{
                        width: {xs: '100%', md: 'auto'},
                        marginTop: '1.25rem',
                    }}
                >
                    <Trans id='Ship Here' />
                </Button>
            }
        />
    )
}
