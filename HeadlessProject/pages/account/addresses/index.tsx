/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { CountryCodeEnum } from '@graphcommerce/graphql-mesh'
import {
  useCustomerQuery,
  WaitForCustomer,
  AccountDashboardAddressesDocument,
} from '@graphcommerce/magento-customer'
import { CountryRegionsDocument, PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Button, Container, Link, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { LayoutOverlayProps } from '../../../components'
import { AddressCard } from '../../../components/AddressCard'
import { AddressTable } from '../../../components/AddressTable'
import { AlertToast } from '../../../components/AlertToast'
import { AccountLayoutNav } from '../../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../../components/Layout/Layout.gql'
import { UIContext } from '../../../components/common/contexts/UIContext'
import { graphqlSsrClient, graphqlSharedClient } from '../../../lib/graphql/graphqlSsrClient'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutOverlayProps, Props>

function AccountAddressesPage() {
  const addresses = useCustomerQuery(AccountDashboardAddressesDocument, {
    fetchPolicy: 'network-only',
  })
  const router = useRouter()
  const { data } = addresses
  const customer = data?.customer
  const [state] = useContext(UIContext)

  useEffect(() => {
    if (customer?.addresses && customer.addresses.length <= 0) {
      router.push('/account/addresses/add')
    }
  }, [customer])
  const defaultBilling = customer?.addresses?.filter((a) => a?.default_billing)
  const defaultShipping = customer?.addresses?.filter((a) => a?.default_shipping)
  const additionalAddresses = customer?.addresses?.filter(
    (a) => !a?.default_billing && !a?.default_shipping,
  )

  const buttonStyle = {
    color: '#006bb4',
    justifyContent: 'flex-start',
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
  }

  return (
    <WaitForCustomer waitFor={addresses}>
      <Box
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '0px 0px !important',
          flexBasis: 0,
          flexGrow: 1,
          maxWidth: {xs:'100%', md:'calc( 100% - 17.25rem )'},
        }}
      >
        {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}
        <PageMeta title={i18n._(/* i18n */ 'Addresses')} metaRobots={['noindex']} />
          <Box sx={{ width: '100%', paddingLeft: {xs:'0', md:'1rem', lg:'1.563rem' } }}>

            <Typography
              variant='h2'
              sx={{ 
                fontWeight: '300', 
                fontVariationSettings: `'wght' 300`,
                paddingBottom: {xs:'1rem', md:'2rem'}, 
                marginTop: {xs:'0', md:'-0.25rem'}
              }}
            >
              Address Book
            </Typography>

            <Typography
              variant='h4'
              sx={{
                color: '#333',
                fontSize: {xs:'1rem', md:'1.375rem'},
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #c6c6c6',
                marginBottom: {xs:'0.875rem', md:'1.5rem'},
              }}
            >
              Default Address
            </Typography>

            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: {xs:'column', md:'row'}, 
                paddingBottom: {xs:'1rem', md:'2rem' , lg:'3rem'}
              }}
            >
              <Box 
                sx={{ 
                  width: {xs:'100%', md:'50%'},
                  paddingRight: {xs:'0', md:'2rem'},
                  marginBottom: {xs:'1rem', md:'0rem'}
                }}
              >
                <Typography 
                  variant='h6' 
                  sx={{ 
                    fontSize: '1rem !important',
                    lineHeight: '1.375rem !important',
                    fontWeight: '700',
                    fontVariationSettings: `'wght' 700`,
                    marginBottom: '0.75rem',
                  }}
                >
                  Default Billing Address
                </Typography>

                <Box
                    sx={{
                      marginBottom: '0.4rem'
                    }}
                  >

                  {defaultBilling && defaultBilling?.length <= 0 ? (
                    'You have not set a default billing address'
                  ) : (
                    <>
                      <AddressCard
                        sx={{ 
                          '& > div': {
                            fontSize: '1rem',
                            lineHeight: '1.4rem',
                            marginBottom: '0.25rem'
                          }
                        }}
                        {...defaultBilling?.[0]}
                        country_code={defaultBilling?.[0]?.country_code as CountryCodeEnum}
                        region={{
                          region_code: defaultBilling?.[0]?.region?.region_code,
                          region_id: defaultBilling?.[0]?.region?.region_id,
                          region: defaultBilling?.[0]?.region?.region,
                        }}
                      />
                      <Box>
                        <Typography component='span' variant='subtitle2'>T: </Typography>
                        <Typography component='span' variant='subtitle2' sx={{ color: '#006bb4' }}>
                          <Link
                            href={`tel:${defaultBilling?.[0]?.telephone}`}
                            color='#006bb4'
                            target='_self'
                            underline="hover"
                          >
                            {defaultBilling?.[0]?.telephone}
                          </Link>
                        </Typography>
                      </Box>
                    </>
                  )}

                </Box>

                <Button
                  disableRipple
                  sx={{
                    ...buttonStyle,
                    minWidth: 'initial',
                    padding: 'inherit',
                    fontWeight: '400',
                    fontVariationSettings: `'wght' 400`,
                    marginRight: '0.8rem',
                  }}
                  onClick={async () => {
                    await router.push(`/account/addresses/edit?addressId=${defaultBilling?.[0]?.id}`)
                  }}
                >
                  Change Billing Address
                </Button>

              </Box>

              <Box sx={{ width: {xs:'100%', md:'50%'} }}>
                
                <Typography 
                  variant='h6' 
                  sx={{ 
                    fontSize: '1rem !important',
                    lineHeight: '1.375rem !important',
                    fontWeight: '700',
                    fontVariationSettings: `'wght' 700`,
                    marginBottom: '0.75rem',
                  }}
                >
                  Default Shipping Address
                </Typography>

                <Box
                  sx={{
                    marginBottom: '0.4rem'
                  }}
                >

                  {defaultShipping && defaultShipping?.length <= 0 ? (
                    'You have not set a default shipping address'
                  ) : (
                    <>
                      <AddressCard
                        sx={{ 
                          '& > div': {
                            fontSize: '1rem',
                            lineHeight: '1.4rem',
                            marginBottom: '0.25rem'
                          }
                        }}
                        {...defaultShipping?.[0]}
                        country_code={defaultShipping?.[0]?.country_code as CountryCodeEnum}
                        region={{
                          region_code: defaultShipping?.[0]?.region?.region_code,
                          region_id: defaultShipping?.[0]?.region?.region_id,
                          region: defaultShipping?.[0]?.region?.region,
                        }}
                      />
                      <Box>
                        <Typography component='span' variant='subtitle2'>T: </Typography>
                        <Typography component='span' variant='subtitle2'>
                          <Link
                            href={`tel:${defaultShipping?.[0]?.telephone}`}
                            color='#006bb4'
                            target='_self'
                            underline="hover"
                          >
                            {defaultShipping?.[0]?.telephone}
                          </Link>
                        </Typography>
                      </Box>
                    </>
                  )}

                </Box>

                <Button
                  disableRipple
                  sx={{
                    ...buttonStyle,
                    minWidth: 'initial',
                    padding: 'inherit',
                    fontWeight: '400',
                    fontVariationSettings: `'wght' 400`,
                    marginRight: '0.8rem',
                  }}
                  onClick={async () => {
                    await router.push(`/account/addresses/edit?addressId=${defaultShipping?.[0]?.id}`)
                  }}
                >
                  Change Shipping Address
                </Button>

              </Box>

            </Box>

            <Box sx={{ width: '100%' }}>
              <Typography
                variant='h4'
                sx={{
                  color: '#333',
                  fontSize: {xs:'1rem', md:'1.375rem'},
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #c6c6c6',
                  marginBottom: {xs:'0.875rem', md:'1.5rem'},
                  ...(additionalAddresses &&
                    additionalAddresses?.length >= 1 && { marginBottom: '2rem' }),
                }}
              >
                Additional Address Entries
              </Typography>
              {additionalAddresses && additionalAddresses?.length >= 1 ? (
                <AddressTable additionalAddresses={additionalAddresses} />
              ) : (
                <Typography
                  variant='body1'
                  component='p'
                  sx={{
                    color: '#333',
                  }}>
                  <Trans id='You have no other address entries in your address book.' />
                </Typography>
              )}
              <Button
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#1979c3',
                  marginTop: '3rem',
                  '&:hover, &:active': { backgroundColor: '#006bb4' },
                }}
                disableRipple
                variant='contained'
                size='medium'
                onClick={async () => {
                  await router.push('/account/addresses/add')
                }}
              >
                Add New Address
              </Button>
            </Box>
          </Box>
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
AccountAddressesPage.pageOptions = pageOptions

export default AccountAddressesPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  const countryRegions = staticClient.query({
    query: CountryRegionsDocument,
  })

  return {
    props: {
      ...(await countryRegions).data,
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      up: { href: '/account', title: 'Account' },
    },
  }
}
