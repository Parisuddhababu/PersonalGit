import { CheckoutOrderSummary } from '@components/checkout'
import { CheckoutPaymentMethodActionCardListForm } from '@components/checkout/components/CheckoutPayment'
import { ComposedForm, WaitForQueries } from '@graphcommerce/ecommerce-ui'
import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  ApolloCartErrorFullPage,
  EmptyCart,
  useCartQuery,
} from '@graphcommerce/magento-cart'
import { BillingPageDocument } from '@graphcommerce/magento-cart-checkout'
import { CouponAccordion } from '@graphcommerce/magento-cart-coupon'
import {
  PaymentMethodButton,
  useCartLock,
  PaymentMethodContextProvider,
  PaymentMethodPlaceOrder,
} from '@graphcommerce/magento-cart-payment-method'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  FormActions,
  FullPageMessage,
  GetStaticProps,
  iconChevronRight,
  IconSvg,
  LayoutTitle,
} from '@graphcommerce/next-ui'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { CircularProgress, Container, Dialog, Grid, Step, StepButton, Typography, Stepper, Divider, Box, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import {stepsList as steps} from '.'
import { LayoutMinimal, LayoutMinimalProps } from '../../components'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import { DefaultPageDocument } from '../../graphql/DefaultPage.gql'
import { graphqlSsrClient, graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'
import { CartIcon } from '@components/Icons'
import { useState } from 'react'
import { Closemenu } from '../../components/Icons'

type GetPageStaticProps = GetStaticProps<LayoutMinimalProps>

function PaymentPage() {
  const router = useRouter()
  const [ activeClass,setActiveClass] = useState(false);
  const billingPage = useCartQuery(BillingPageDocument, { fetchPolicy: 'cache-and-network' })
  const [{ locked }] = useCartLock()

  const handleRedirection = (label: string) => {
    label === 'Shipping' && router.push('/checkout')
  }

  const cartExists =
    typeof billingPage.data?.cart !== 'undefined' && (billingPage.data.cart?.items?.length ?? 0) > 0

  const gridStyles = (theme) => ({ 
    '&.order-summary-nav': {
        [theme.breakpoints.down('md')]: {
            backgroundColor: '#f4f4f4',
            position: 'fixed',
            top: '0 !important',
            right: '0',
            bottom: '0',
            left: '100%',
            height: '100%',
            maxHeight: '100%',
            padding: '0 !important',
            zIndex: '99999',
            width: 'calc( 100% - 10% )',
            transition: '.3s all ease-in-out',
            '&:before': {
                content: `''`,
                position: 'fixed',
                top: '0',
                right: '0',
                bottom: '0',
                left: '100%',
                backgroundColor: 'rgba(51,51,51,0.55)',
                zIndex: '-2',
                transition: '.3s all ease-in-out',
            },
            '&:after': {
                content: `''`,
                position: 'absolute',
                inset: '0 0',
                backgroundColor: '#f4f4f4',
                zIndex: '-1',
            }
        },
        '&.show': {
            left: '2.75rem',
            '&:before': {
                left: '0',
            }
        }
    },                                                
})
  
  const typographyStyles = (theme) => ({ 
    fontSize: '1.625rem !important',
    mb: theme.spacings.sm, 
    paddingTop: '0.875rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #cccccc',
})

  return (
    <ComposedForm>
      <PageMeta title={i18n._(/* i18n */ 'Payment')} metaRobots={['noindex']} />

      <WaitForQueries
        waitFor={[billingPage]}
        fallback={
          <FullPageMessage icon={<CircularProgress />} title={<Trans id='Loading' />}>
            <Trans id='This may take a second' />
          </FullPageMessage>
        }
      >
        {billingPage.error && <ApolloCartErrorFullPage sx={{margin: 0}} error={billingPage.error} />}
        {(!cartExists && !billingPage.error) && <EmptyCart />}
        {cartExists && !billingPage.error && (
          <>
            <Box
                sx={{
                    background: '#f4f4f4',
                    borderBottom: '1px solid #ccc',
                    borderTop: '1px solid #ccc',
                    padding: '18px 15px',
                    display: {xs:'flex', md:'none'},
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box>
                    <Typography variant="body1" component='h6'>Estimated Total</Typography>
                    <Typography variant="body1" component='h6'>$94.00</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <IconButton
                        aria-label='toggle order summary'
                        onClick={()=>setActiveClass(true)}
                    >
                        <IconSvg src={CartIcon} size='medium' />
                    </IconButton>

                    <Box 
                        sx={{
                            padding: '0 0.313rem',
                            backgroundColor: '#ff5501',
                            textShadow: '0 0 0.438rem #000000',
                            color: '#ffffff',
                            minWidth: '24px',
                            textAlign: 'center',
                            borderRadius: '0.125rem',
                            height: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& span': {
                                width: '1.25rem !important',
                                height: '1.25rem !important',
                                margin: '0.2rem 0',
                                display: 'flex',
                                color: '#ffffff'
                            }
                        }}
                    >
                        2
                    </Box>
                </Box>
            </Box>
            <Container maxWidth='lg'>
              
              <Dialog open={!!locked} fullWidth>
                <FullPageMessage
                  disableMargin
                  icon={<CircularProgress />}
                  title={<Trans id='Processing your payment' />}
                >
                  <Trans id='We’re processing your payment, this will take a few seconds.' />
                </FullPageMessage>
              </Dialog>
              
              <Grid container rowSpacing={2.5} columnSpacing={4} sx={{paddingBottom: {xs:'2rem', md:'3.5rem'}}}>

                <Grid item xs={12} md={8} sx={{display:{xs:'none', md:'grid'}}}>

                  <Stepper activeStep={2}
                    sx={{
                        '& .MuiStepConnector-root': {
                            display: 'none'
                        },
                        '& .MuiStep-root' : {
                            padding: '0',
                            '& .MuiStepButton-root': {
                                padding: '0',
                                margin: '0',
                                width: '11.563rem',
                                position: 'relative',
                                '&:before': {
                                    content: `''`,
                                    position: 'absolute',
                                    top: '1.125rem',
                                    left: '0',
                                    right: '0',
                                    borderRadius: '0.375rem 0 0 0.375rem',
                                    height: '0.438rem',
                                    backgroundColor: '#e4e4e4',
                                    border: '1px solid #cccccc',
                                    zIndex: '0',
                                }
                            },
                            '&.Mui-completed': {
                              '&:not(:first-child)': {
                                  '& .MuiStepButton-root': {
                                      '&:before': {
                                          backgroundColor: '#ff5501',
                                          borderColor: '#ff5501',
                                      },
                                      '& .MuiStepLabel-root': {
                                          '& > .MuiStepLabel-iconContainer': {
                                              borderColor: '#ff5501',
                                              outlineColor: '#ff5501',
                                              '& > .MuiSvgIcon-root': {
                                                  outlineColor: '#ff5501',
                                              }
                                          },
                                          '& .MuiStepLabel-labelContainer': {
                                              '& .MuiTypography-root': {
                                                  fontWeight: '600',
                                                  fontVariationSettings: "'wght' 600",
                                              }
                                          }
                                      }
                                  },
                              },
                            },
                            '&:last-child': {
                                '& .MuiStepButton-root': {
                                    '&:before': {
                                        borderRadius: '0 0.375rem 0.375rem 0',
                                    }
                                },
                            }
                        },
                        '& .MuiStepLabel-root': {
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: '1',
                            '& > .MuiStepLabel-iconContainer': {
                                paddingRight: '0',
                                border: '0.438rem solid #e4e4e4',
                                outline: '1px solid #cccccc',
                                height: '2.5rem',
                                width: '2.5rem',
                                borderRadius: '100%',
                                boxSizing: 'border-box',
                                backgroundColor: '#333333',
                                marginBottom: '0.5rem',
                                '& > .MuiSvgIcon-root': {
                                    height: '100%',
                                    width: '100%',
                                    color: '#ffffff',
                                    outline: '1px solid #cccccc',
                                    borderRadius: '100%',
                                    '& .MuiStepIcon-text': {
                                        fill: '#333333',
                                        fontSize: '1.125rem',
                                        fontWeight: '500',
                                        fontVariationSettings: "'wght' 500",
                                        transform: 'translateY(-0.05rem)',
                                    }
                                }
                            }
                        }
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepButton disableRipple color="inherit" sx={{cursor: 'auto'}} onClick={() => handleRedirection(label)}>
                          <Typography variant="h6">
                              {label}
                          </Typography>
                        </StepButton>
                      </Step>
                    ))}
                  </Stepper>

                </Grid>

                <Grid item xs={12}>

                  <Grid container rowSpacing={2.5} columnSpacing={4}>

                    <Grid item xs={12} md={7.8}>

                      <Typography
                        variant='h4'
                        gutterBottom
                          sx={typographyStyles}
                      >
                        <Trans id='Payment method' />
                      </Typography>

                      <PaymentMethodContextProvider>

                        <CheckoutPaymentMethodActionCardListForm step={4}>

                          <PaymentMethodPlaceOrder step={5} />

                          <FormActions
                            sx={{
                              display: {xs:'block', md: 'flex'},
                              padding: '0',
                              marginTop: '1rem',
                              justifyContent: {md:'flex-end'},
                              '& .MuiButton-root ': {
                                minWidth: {xs: '100%', md: 'auto'}
                              }
                            }}
                          >
                            <PaymentMethodButton
                              id='place-order'
                              type='submit'
                              color='secondary'
                              button={{ variant: 'contained', size: 'large' }}
                              breakpoint='xs'
                              endIcon={<IconSvg src={iconChevronRight} />}                             
                            >
                              <Trans id='Place order' />
                            </PaymentMethodButton>
                          </FormActions>

                        </CheckoutPaymentMethodActionCardListForm>

                        <CouponAccordion 
                          sx={{
                            '&.MuiAccordion-root': {
                              borderTop: '0',
                              '& .MuiAccordionSummary-root': {
                                padding: '0 2rem',
                                minHeight: '3.75rem',
                                justifyContent: 'flex-start',
                                '& .MuiAccordionSummary-content': {
                                  flexGrow: '0',
                                  paddingRight: '0.45rem',
                                  color: '#1979c3',
                                }
                              },
                              '& .MuiAccordionDetails-root': {
                                padding: '0 2rem 2rem',
                                '& .ApplyCouponForm-couponForm': {
                                  gridGap: '0',
                                  '& .MuiButtonBase-root': {
                                    borderRadius: '0'
                                  }
                                }
                              }
                            }
                          }}
                        />

                        {/* <PaymentMethodPlaceOrder step={5} /> */}
                      </PaymentMethodContextProvider>
                    </Grid>

                    <Grid item xs={12} md={4.2} className={`order-summary-nav ${activeClass && 'show'}`}
                      sx={gridStyles} 
                    >
                      <IconButton
                          aria-label='toggle order summary'
                          onClick={()=>{setActiveClass(false)}}
                          className="order-summary-close-nav"
                          sx={{
                              display: {xs:'flex', md:'none'},
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              backgroundColor: '#f4f4f4',
                          }}
                      >
                          <Closemenu />
                      </IconButton>  
                      <Box
                        sx={{
                          height: '100%',
                          overflow: 'auto',
                        }}
                      >
                        <CheckoutOrderSummary />
                      </Box>
                    </Grid>

                  </Grid>

                </Grid>

              </Grid>

            </Container>
          </>
        )}
      </WaitForQueries>
    </ComposedForm>
  )
}

const pageOptions: PageOptions<LayoutMinimalProps> = {
  Layout: LayoutMinimal,
  sharedKey: () => 'checkout',
}
PaymentPage.pageOptions = pageOptions

export default PaymentPage

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)

  const conf = client.query({ query: StoreConfigDocument })

  const page = staticClient.query({
    query: DefaultPageDocument,
    variables: { url: `checkout/payment` },
  })
  const layout = staticClient.query({ query: LayoutDocument })

  return {
    props: {
      ...(await page).data,
      ...(await layout).data,
      up: { href: '/checkout', title: 'Shipping' },
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
