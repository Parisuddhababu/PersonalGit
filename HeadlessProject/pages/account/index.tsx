/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { CountryCodeEnum } from '@graphcommerce/graphql-mesh'
import {
  AccountDashboardDocument,
  AccountDashboardOrdersDocument,
  AddressMultiLine,
  useCustomerQuery,
  WaitForCustomer,
} from '@graphcommerce/magento-customer'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps } from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Alert, Box, Button, Container, Link, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { AccountOrdersList } from '../../components/AccountMyOrders/AccountOrdersList'
import { AlertToast } from '../../components/AlertToast'
import { AccountLayoutNav, LayoutNavigationProps } from '../../components/Layout/AccountLayoutNav'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { UIContext } from '../../components/common/contexts/UIContext'
import { DefaultPageDocument } from '../../graphql/DefaultPage.gql'
import { graphqlSsrClient, graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

function AccountIndexPage() {
  const dashboard = useCustomerQuery(AccountDashboardDocument, {
    fetchPolicy: 'cache-and-network',
  })
  const [pagesize, setPageSize] = useState<number>(10)
  const router = useRouter()
  const [state] = useContext(UIContext)

  const orders = useCustomerQuery(AccountDashboardOrdersDocument, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: pagesize,
      currentPage: Number(router?.query?.page ?? 1),
    },
  })

  const customer = dashboard.data?.customer
  const defaultBilling = customer?.addresses?.filter((a) => a?.default_billing)
  const defaultShipping = customer?.addresses?.filter((a) => a?.default_shipping)

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
    <WaitForCustomer waitFor={dashboard}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0px 0px !important',
          flexBasis: 0,
          flexGrow: 1,
          maxWidth: { xs: '100%', md: 'calc( 100% - 17.25rem )' },
        }}
      >
        {state?.alerts?.length > 0 && <AlertToast alerts={state?.alerts} link={router?.pathname} />}

        <Box>
          <PageMeta title={i18n._(/* i18n */ 'Account')} metaRobots={['noindex']} />

          <Box sx={{ width: '100%', paddingLeft: { xs: '0', md: '1rem', lg: '1.563rem' } }}>
            <Typography
              variant='h2'
              sx={{
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
                paddingBottom: { xs: '1rem', md: '2rem' },
                marginTop: { xs: '0', md: '-0.25rem' },
              }}
            >
              My Account
            </Typography>

            <Typography
              variant='h4'
              sx={{
                color: '#333',
                fontSize: { xs: '1rem', md: '1.375rem' },
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #c6c6c6',
                marginBottom: { xs: '0.875rem', md: '1.5rem' },
              }}
            >
              Account Information
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                paddingBottom: { xs: '1rem', md: '2rem', lg: '3rem' },
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  paddingRight: { xs: '0', md: '2rem' },
                  marginBottom: { xs: '1rem', md: '0rem' },
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
                  Contact Information
                </Typography>

                <Typography
                  variant='subtitle2'
                  component='p'
                  sx={{ marginBottom: '0' }}
                >{`${customer?.firstname} ${customer?.lastname}`}</Typography>

                <Typography variant='subtitle2' component='p' sx={{ marginBottom: '0' }}>
                  {customer?.email}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '0.4rem',
                    '& .btn-divider': {
                      padding: '0 0.875rem 0 0',
                      position: 'relative',
                      '&:after': {
                        content: "''",
                        height: '0.75rem',
                        width: '0.063rem',
                        position: 'absolute',
                        right: '0rem',
                        backgroundColor: '#a6a6a6',
                      },
                    },
                  }}
                >
                  <Button
                    disableRipple
                    className='btn-divider'
                    sx={{
                      ...buttonStyle,
                      minWidth: 'initial',
                      padding: 'inherit',
                      fontWeight: '400',
                      fontVariationSettings: `'wght' 400`,
                      marginRight: '0.8rem',
                    }}
                    onClick={() => router.push('/account/account-information')}
                  >
                    Edit
                  </Button>
                  <Button
                    disableRipple
                    sx={{
                      ...buttonStyle,
                      fontWeight: '400',
                      fontVariationSettings: `'wght' 400`,
                      padding: '0',
                      minWidth: 'initial',
                    }}
                    onClick={() =>
                      router.push({
                        pathname: '/account/account-information',
                        query: { data: 'changePassword' },
                      })
                    }
                  >
                    Change Password
                  </Button>
                </Box>
              </Box>

              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
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
                  Newsletter
                </Typography>

                <Typography variant='body1' component='p'>
                  {customer?.is_subscribed
                    ? 'You are subscribed to General Subscription'
                    : "You aren't subscribed to to General Subscription"}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '0.4rem',
                    '& .btn-divider': {
                      padding: '0 0.875rem 0 0',
                      position: 'relative',
                      '&:after': {
                        content: "''",
                        height: '0.75rem',
                        width: '0.063rem',
                        position: 'absolute',
                        right: '0rem',
                        backgroundColor: '#a6a6a6',
                      },
                    },
                  }}
                >
                  <Button
                    onClick={() => router.push('/account/newsletter')}
                    disableRipple
                    sx={{
                      ...buttonStyle,
                      minWidth: 'initial',
                      padding: 'inherit',
                      fontWeight: '400',
                      fontVariationSettings: `'wght' 400`,
                      marginRight: '0.8rem',
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                // flexDirection: { xs:'column', md:'row' },
                alignItems: 'center',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #c6c6c6',
                marginBottom: { xs: '0.875rem', md: '1.65rem' },
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  color: '#333',
                  fontSize: { xs: '1rem', md: '1.375rem' },
                  fontWeight: '300',
                  fontVariationSettings: `'wght' 300`,
                  marginRight: { xs: '0.6rem', md: '1.25rem' },
                }}
              >
                Address Book
              </Typography>
              <Button
                disableRipple
                sx={{
                  ...buttonStyle,
                  paddingLeft: '20px',
                  fontWeight: '400',
                  fontVariationSettings: `'wght' 400`,
                  padding: '0',
                  minWidth: 'initial',
                  marginTop: { xs: '0', md: '0.25rem' },
                }}
                onClick={async () => {
                  await router.push('/account/addresses')
                }}
              >
                Manage Addresses
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                paddingBottom: { xs: '1rem', md: '2rem', lg: '3rem' },
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  marginBottom: { xs: '1rem', md: '0' },
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
                    marginBottom: '0.4rem',
                  }}
                >
                  {defaultBilling && defaultBilling?.length <= 0 ? (
                    <Typography>'You have not set a default billing address'</Typography>
                  ) : (
                    <>
                      <AddressMultiLine
                        sx={{
                          '& > div': {
                            fontSize: '1rem',
                            lineHeight: '1.4rem',
                            marginBottom: '0.25rem',
                          },
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
                        <Typography component='span' variant='subtitle2'>
                          T:{' '}
                        </Typography>
                        <Typography component='span' variant='subtitle2'>
                          <Link
                            href={`tel:${defaultBilling?.[0]?.telephone}`}
                            color='#006bb4'
                            target='_self'
                            underline='hover'
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
                    await router.push(
                      `/account/addresses/edit?addressId=${defaultBilling?.[0]?.id}`,
                    )
                  }}
                >
                  Edit Address
                </Button>
              </Box>

              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
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
                    marginBottom: '0.4rem',
                  }}
                >
                  {defaultShipping && defaultShipping?.length <= 0 ? (
                    <Typography>'You have not set a default shipping address'</Typography>
                  ) : (
                    <>
                      <AddressMultiLine
                        sx={{
                          '& > div': {
                            fontSize: '1rem',
                            lineHeight: '1.4rem',
                            marginBottom: '0.25rem',
                          },
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
                        <Typography component='span' variant='subtitle2'>
                          T:{' '}
                        </Typography>
                        <Typography component='span' variant='subtitle2'>
                          <Link
                            href={`tel:${defaultShipping?.[0]?.telephone}`}
                            color='#006bb4'
                            target='_self'
                            underline='hover'
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
                    await router.push(
                      `/account/addresses/edit?addressId=${defaultShipping?.[0]?.id}`,
                    )
                  }}
                >
                  Edit Address
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                ...(orders?.data?.customer?.orders?.items &&
                  orders?.data?.customer?.orders?.items?.length <= 0 && { display: 'none' }),
                marginBottom: { xs: '0.875rem', md: '0' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid #c6c6c6',
                  marginBottom: '0',
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    color: '#333',
                    fontSize: { xs: '1rem', md: '1.375rem' },
                    fontWeight: '300',
                    fontVariationSettings: `'wght' 300`,
                    marginRight: { xs: '0.6rem', md: '1.25rem' },
                  }}
                >
                  Recent Orders
                </Typography>

                <Button
                  disableRipple
                  sx={{
                    ...buttonStyle,
                    paddingLeft: '20px',
                    fontWeight: '400',
                    fontVariationSettings: `'wght' 400`,
                    padding: '0',
                    minWidth: 'initial',
                    marginTop: { xs: '0', md: '0.25rem' },
                  }}
                  onClick={async () => {
                    await router.push('/account/my-orders')
                  }}
                >
                  View All
                </Button>
              </Box>

              {orders?.data?.customer?.orders?.items &&
                orders?.data?.customer?.orders?.items?.length > 0 && (
                  <AccountOrdersList
                    sx={{
                      '& .SectionHeader-root': {
                        padding: 0,
                      },
                    }}
                    {...orders?.data?.customer}
                    setPageSize={setPageSize}
                    pagesize={pagesize}
                  />
                )}
            </Box>
          </Box>
        </Box>
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: AccountLayoutNav,
}

AccountIndexPage.pageOptions = pageOptions

export default AccountIndexPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const staticClient = graphqlSsrClient(locale)
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  const page = staticClient.query({ query: DefaultPageDocument, variables: { url: 'account' } })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      up: { href: '/', title: 'Home' },
      apolloState: await conf.then(() => client.cache.extract()),
    },
    revalidate: 60 * 20,
  }
}
