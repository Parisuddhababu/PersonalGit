/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OrderInformation } from '@components/AccountMyOrders/OrderInformation/OrderInformation'
import { OrderInvoiceDetails } from '@components/AccountMyOrders/OrderInvoice/OrderInvoiceDetails'
import { OrderItemDetails } from '@components/AccountMyOrders/OrderItemsDetails/OrderItemDetail'
import { OrderRefundDetails } from '@components/AccountMyOrders/OrderRefundDetails/OrderRefundDetails'

import { OrderShipmentDetails } from '@components/AccountMyOrders/OrderShipmentDetails/OrderShipmentDetails'
import { OrderStatusLabel } from '@components/AccountMyOrders/OrderStatusLabel/OrderStatusLabel'
import { PrintPreview } from '@components/AccountMyOrders/PrintPreview/PrintPreview'

import { ReOrderBtn } from '@components/AccountMyOrders/ReOrderBtn'

import { AccountLayoutNav } from '@components/Layout/AccountLayoutNav'
import { LayoutDocument } from '@components/Layout/Layout.gql'
import { formatDate } from '@components/common/utils'

import { PageOptions } from '@graphcommerce/framer-next-pages'
import { useCustomerQuery, WaitForCustomer } from '@graphcommerce/magento-customer'
import { CountryRegionsDocument, PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import { IconHeader, GetStaticProps, iconBox, LayoutTitle } from '@graphcommerce/next-ui'
import { OrderItemDetailsPageDocument } from '@graphql/MyOrders/OrderItemDetailsPage.gql'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { LayoutOverlayProps } from '../../../components'
import { graphqlSsrClient, graphqlSharedClient } from '../../../lib/graphql/graphqlSsrClient'
import PrinterSvgIcon from '@components/common/PrinterSvg/PrinterSvgIcon'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function OrderDetailPage() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleTabSelect = (index: number) => {
    setSelectedIndex(index)
  }
  const { orderId } = router.query

  const orders = useCustomerQuery(OrderItemDetailsPageDocument, {
    fetchPolicy: 'cache-and-network',
    variables: { orderNumber: orderId as string },
  })
  const { data, loading } = orders
  const store_credit = data?.customer?.store_credit
  const order = data?.customer?.orders?.items?.[0]
  const { quantity_refunded, quantity_shipped, quantity_invoiced } = order?.items?.[0] || {}

  const isLoading = orderId ? loading : true
  const order_date = order?.order_date
  const DateOfOrder = order_date && formatDate(order_date)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (element) {
      element.style.display = 'none'
    }
  }, [])

  return (
    <WaitForCustomer waitFor={orders}>
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

        <Box sx={{ width: '100%', paddingLeft: { xs: '0', md: '1rem', lg: '1.563rem' } }}>
          
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '1.5rem',
              gap: { xs: '0.75rem', md: '1.5rem', lg: '2rem' },
            }}
          >
            <Typography
              variant='h2'
              sx={{
                fontWeight: '300',
                fontVariationSettings: `'wght' 300`,
              }}
            >
              <Trans id='Order #{orderId}' values={{ orderId }} />{' '}
            </Typography>

            <OrderStatusLabel
              sx={{
                border: '2px solid #cccccc',
                padding: '0.313rem 0.625rem',
                color: '#333333',
                fontSize: '0.875rem',
                fontWeight: '400',
                fontVariationSettings: "'wght' 400",
              }}
              items={order?.items}
              renderer={{
                Ordered: () => <Trans id='PENDING' />,
                Invoiced: () => <Trans id='COMPLETED' />,
                Shipped: () => <Trans id='PROCESSING' />,
                Refunded: () => <Trans id='CLOSED' />,
                Canceled: () => <Trans id='CANCELED' />,
                Returned: () => <Trans id='RETURNED' />,
                Partial: () => <Trans id='PENDING' />,
              }}
            />
          </Box>

          {(!orderId || !order) && (
            <IconHeader src={iconBox} size='large'>
              <Trans id='Order not found' />
            </IconHeader>
          )}

          {order_date && (
            <Typography variant='h6' sx={{ marginBottom: '1.35rem' }}>
              {DateOfOrder}
            </Typography>
          )}

          {orderId && order && (
            <>
              <PageMeta
                title={i18n._(/* i18n */ 'Order #{orderId}', { orderId })}
                metaRobots={['noindex']}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: '1.4rem',
                }}
              >
                <ReOrderBtn number={order?.number} />
                <Box
                  sx={{
                    display: {xs: 'none', md: 'inline-flex'},
                    '& svg': {
                      height: '1rem',
                      width: '1rem',
                      marginRight: '0.5rem',
                      display: 'inline-block',
                      '& circle': {
                        fill: '#1979c3'
                      },
                      '& path, & line': {
                        stroke: '#1979c3',
                      }
                    }
                  }}
                >
                  <PrinterSvgIcon />
                  <PrintPreview
                    {...order}
                    location='orderItems'
                    name=' Print Order'
                    sx={{
                      display: 'inline-block',
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  '& .react-tabs': {
                    '& .react-tabs__tab-list': {
                      margin: '0',
                      padding: '0',
                      listStyle: 'none',
                      display: 'flex',
                      marginBottom: '-1px',
                      zIndex: '1',
                      position: 'relative',
                      flexDirection: {xs:'column', md: 'row'},
                      '& .react-tabs__tab': {
                        padding: {xs: '0px 1.25rem', md:'1px 2.188rem'},
                        backgroundColor: '#f6f6f6',
                        color: '#6d6d6d',
                        border: '1px solid #cccccc',
                        minHeight: '2.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:not(:last-child)': {
                          borderRight: {md:'0'},
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                        '&.react-tabs__tab--selected' :{
                          backgroundColor: '#ffffff',
                          borderBottomColor: '#ffffff',
                        }
                      },
                    },
                    '& .react-tabs__tab-panel': {
                      '&.react-tabs__tab-panel--selected': {
                        '& .react-tabs__tab-panel-inner': {
                          border: '1px solid #cccccc',
                          marginBottom: '2.5rem',
                          padding: {xs: '0.65rem', md: '1.563rem'},
                        }
                      },
                    }
                  },
                  '& .MuiTable-root': {
                    '& .MuiTableBody-root': {
                      '& .MuiTableCell-body': {
                        verticalAlign: 'top',
                        border: '0',
                        paddingTop: {md:'1rem'},
                        paddingBottom: {md:'1.25rem'},
                        borderBottom: {xs:'0', md:'1px solid rgba(224, 224, 224, 1)'},
                      },
                      '&:last-child': {
                        '& .MuiTableCell-body': {
                          borderBottom: '0',
                        }
                      }
                    },
                    '& .MuiTableFooter-root': {
                      display: {xs: 'block', md: 'table-footer-group'},
                      '& .MuiTableRow-footer': {
                        display: {xs: 'flex', md: 'table-row'},
                        '& .MuiTableCell-footer' :{
                          display: {xs: 'inline-block', md: 'table-cell'},
                          width: {xs:'50%', md:"auto"},
                          verticalAlign: 'top',
                          border: '0',
                          color: '#333333',
                          '&:first-child' :{
                            textAlign: {xs:'left', md:'right'}
                          },
                          '& .total-text' :{
                            fontWeight: '700',
                            fontVariationSettings: "'wght' 700",
                          }
                        },
                        '&:last-child': {
                          '& .MuiTableCell-footer': {
                            borderBottom: '1px solid #cccccc',
                          }
                        }
                      },
                    }
                  }
                }}
              >

                <Tabs selectedIndex={selectedIndex} onSelect={handleTabSelect}>

                  <TabList>
                    <Tab>
                      <Trans id='Items Ordered' />
                    </Tab>
                    {quantity_invoiced! >= 1 && (
                      <Tab>
                        <Trans id='Invoices' />
                      </Tab>
                    )}
                    {quantity_shipped! >= 1 && (
                      <Tab>
                        <Trans id='Order Shipments' />
                      </Tab>
                    )}
                    {quantity_refunded! >= 1 && (
                      <Tab>
                        <Trans id='Refunds' />
                      </Tab>
                    )}
                  </TabList>

                  <TabPanel>
                    <OrderItemDetails {...order} loading={isLoading} />
                  </TabPanel>

                  <TabPanel>
                    <OrderInvoiceDetails {...order} />
                  </TabPanel>

                  <TabPanel>
                    <OrderShipmentDetails {...order} />
                  </TabPanel>

                  <TabPanel>
                    <OrderRefundDetails {...order} store_credit={store_credit} />
                  </TabPanel>

                </Tabs>

              </Box>

              <div
                ref={elementRef}
                style={{
                  top: 13,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PrintPreview {...order} location='orderItems' />
              </div>
            </>
          )}
        </Box>
      </Box>
    </WaitForCustomer>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  Layout: AccountLayoutNav,
}
OrderDetailPage.pageOptions = pageOptions

export default OrderDetailPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const config = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  const countryRegions = staticClient.query({
    query: CountryRegionsDocument,
  })

  return {
    props: {
      ...(await layout).data,
      ...(await countryRegions).data,
      apolloState: await config.then(() => client.cache.extract()),
      variantMd: 'bottom',
      size: 'max',
      up: { href: '/account/my-orders', title: 'Orders' },
    },
  }
}
