import { LayoutNavigation, LayoutNavigationProps, LayoutOverlayProps } from '@components/Layout'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, LayoutTitle } from '@graphcommerce/next-ui'
import { Box, Container, Typography } from '@mui/material'
import { LayoutDocument } from '@components/Layout/Layout.gql'
import Breadcrumb from '@components/Breadcrumb/Breadcrumb'
import { graphqlSharedClient, graphqlSsrClient } from '@lib/graphql/graphqlSsrClient'
import { useRouter } from 'next/router'
import { formatDate } from '@components/common/utils'
import { useEffect, useRef, useState } from 'react'
import { Trans } from '@lingui/react'
import { OrderStatusLabel } from '@components/AccountMyOrders/OrderStatusLabel/OrderStatusLabel'
import { ReOrderBtn } from '@components/AccountMyOrders/ReOrderBtn'
import PrinterSvgIcon from '@components/common/PrinterSvg/PrinterSvgIcon'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { OrderInvoiceDetails } from '@components/AccountMyOrders/OrderInvoice/OrderInvoiceDetails'
import { OrderShipmentDetails } from '@components/AccountMyOrders/OrderShipmentDetails/OrderShipmentDetails'
import { OrderRefundDetails } from '@components/AccountMyOrders/OrderRefundDetails/OrderRefundDetails'
import { OrderItemDetails } from '@components/AccountMyOrders/OrderItemsDetails/OrderItemDetail'
import { PrintPreview } from '@components/AccountMyOrders/PrintPreview/PrintPreview'

type GetPageStaticProps = GetStaticProps<LayoutOverlayProps>

function OrderViewPage() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleTabSelect = (index: number) => {
    setSelectedIndex(index)
  }
  const orderData = router?.query?.orderData?.toString() ?? ''
  const decodedString = decodeURIComponent(orderData)
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = elementRef.current
    if (element) {
      element.style.display = 'none'
    }
  }, [])
  let parsedData
  try {
    parsedData = JSON.parse(decodedString)
  } catch (error) {
    return null
  }

  const { GetOrdersAndReturns } = parsedData
  const {
    incrementId,
    orderDate,
    orderStatus,
    items,
    storeCredit,
    hasInvoices,
    hasRefunds,
    hasShipments,
  } = GetOrdersAndReturns

  const isLoading = false
  const DateOfOrder = orderDate && formatDate(orderDate)

  return (
    <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: 'column' }}>
      <Breadcrumb
        breadcrumb={[]}
        name='Order Information'
        sx={{
          marginTop: '24px',
          display: { xs: 'none', sm: 'block' },
        }}
      />
      <LayoutTitle
        sx={{
          // alignItems: 'self-start',
          // marginBottom: '1rem',
          width: '100%',
          marginBottom: '1.5rem',
          '.MuiTypography-h3': {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: '0.75rem', md: '1.5rem', lg: '2rem' },
            width: '100%',
            fontWeight: '300',
            color: '#333333',
            fontSize: '2.7rem',
            fontFamily: 'system-ui',
          },
        }}
        gutterTop={false}
        gutterBottom={false}
      >
        <Trans id={`Order #${incrementId}`} />

        <OrderStatusLabel
          sx={{
            border: '2px solid #cccccc',
            padding: '0.313rem 0.625rem',
            color: '#333333',
            fontSize: '0.875rem',
            fontWeight: '400',
            fontVariationSettings: "'wght' 400",
          }}
          status={orderStatus}
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
      </LayoutTitle>

      {orderDate && (
        <Typography variant='h6' sx={{ marginBottom: '1.35rem' }}>
          {DateOfOrder}
        </Typography>
      )}

      {incrementId && items?.[0] && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '0.5rem',
            }}
          >
            <Box />
            <Box
              sx={{
                display: 'flex',
                cursor: 'pointer',
                borderRadius: '5px',
              }}
            >
              <Box
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  '& svg': {
                    height: '1rem',
                    width: '1rem',
                    marginRight: '0.5rem',
                    display: 'inline-block',
                    '& circle': {
                      fill: '#1979c3',
                    },
                    '& path, & line': {
                      stroke: '#1979c3',
                    },
                  },
                }}
              >
                <PrinterSvgIcon />
                <PrintPreview
                  {...GetOrdersAndReturns}
                  items={items}
                  orderDate={orderDate}
                  store_credit={storeCredit}
                  location='orderItems'
                  name=' Print Order'
                  sx={{
                    display: 'inline-block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    color: '#069',
                  }}
                />
              </Box>
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
                  flexDirection: { xs: 'column', md: 'row' },
                  '& .react-tabs__tab': {
                    padding: { xs: '0px 1.25rem', md: '1px 2.188rem' },
                    backgroundColor: '#f6f6f6',
                    color: '#6d6d6d',
                    border: '1px solid #cccccc',
                    minHeight: '2.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:not(:last-child)': {
                      borderRight: { md: '0' },
                    },
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.react-tabs__tab--selected': {
                      backgroundColor: '#ffffff',
                      borderBottomColor: '#ffffff',
                    },
                  },
                },
                '& .react-tabs__tab-panel': {
                  '&.react-tabs__tab-panel--selected': {
                    '& .react-tabs__tab-panel-inner': {
                      border: '1px solid #cccccc',
                      marginBottom: '2.5rem',
                      padding: { xs: '0.65rem', md: '1.563rem' },
                    },
                  },
                },
              },
              '& .MuiTable-root': {
                '& .MuiTableBody-root': {
                  '& .MuiTableCell-body': {
                    verticalAlign: 'top',
                    border: '0',
                    paddingTop: { md: '1rem' },
                    paddingBottom: { md: '1.25rem' },
                    borderBottom: { xs: '0', md: '1px solid rgba(224, 224, 224, 1)' },
                  },
                  '&:last-child': {
                    '& .MuiTableCell-body': {
                      borderBottom: '0',
                    },
                  },
                },
                '& .MuiTableFooter-root': {
                  display: { xs: 'block', md: 'table-footer-group' },
                  '& .MuiTableRow-footer': {
                    display: { xs: 'flex', md: 'table-row' },
                    '& .MuiTableCell-footer': {
                      display: { xs: 'inline-block', md: 'table-cell' },
                      width: { xs: '50%', md: 'auto' },
                      verticalAlign: 'top',
                      border: '0',
                      color: '#333333',
                      '&:first-child': {
                        textAlign: { xs: 'left', md: 'right' },
                      },
                      '& .total-text': {
                        fontWeight: '700',
                        fontVariationSettings: "'wght' 700",
                      },
                    },
                    '&:last-child': {
                      '& .MuiTableCell-footer': {
                        borderBottom: '1px solid #cccccc',
                      },
                    },
                  },
                },
              },
            }}
          >
            <Tabs selectedIndex={selectedIndex} onSelect={handleTabSelect}>
              <TabList>
                <Tab>
                  <Trans id='Items Ordered' />
                </Tab>
                {hasInvoices >= 1 && (
                  <Tab>
                    <Trans id='Invoices' />
                  </Tab>
                )}
                {hasShipments >= 1 && (
                  <Tab>
                    <Trans id='Order Shipments' />
                  </Tab>
                )}
                {hasRefunds >= 1 && (
                  <Tab>
                    <Trans id='Refunds' />
                  </Tab>
                )}
              </TabList>

              <TabPanel>
                <OrderItemDetails {...GetOrdersAndReturns} items={items} loading={isLoading} />
              </TabPanel>

              <TabPanel>
                <OrderInvoiceDetails {...GetOrdersAndReturns} items={items} />
              </TabPanel>

              <TabPanel>
                <OrderShipmentDetails {...GetOrdersAndReturns} items={items} />
              </TabPanel>

              <TabPanel>
                <OrderRefundDetails
                  {...GetOrdersAndReturns}
                  items={items}
                  store_credit={storeCredit}
                />
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
            <PrintPreview
              {...GetOrdersAndReturns}
              items={items}
              orderDate={orderDate}
              store_credit={storeCredit}
              location='orderItems'
              name=' Print Order'
              sx={{
                display: 'inline-block',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer',
                borderRadius: '5px',
                color: '#069',
              }}
            />
          </div>
        </>
      )}
    </Container>
  )
}

const pageOptions: PageOptions<LayoutNavigationProps> = {
  Layout: LayoutNavigation,
}
OrderViewPage.pageOptions = pageOptions

export default OrderViewPage

export const getStaticProps: GetPageStaticProps = async ({ locale, params }) => {
  const staticClient = graphqlSsrClient(locale)
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      up: { href: '/account', title: 'Account' },
    },
  }
}
