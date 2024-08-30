import {i18n} from "@lingui/core";
import {CountryRegionsDocument, PageMeta, StoreConfigDocument} from "@graphcommerce/magento-store";
import {
    FormActions,
    FullPageMessage,
    GetStaticProps,
    LayoutTitle,
    IconSvg
} from "@graphcommerce/next-ui";
import {LayoutMinimal, LayoutMinimalProps} from "@components/Layout";
import {PageOptions} from "@graphcommerce/framer-next-pages";
import {graphqlSharedClient, graphqlSsrClient} from "@lib/graphql/graphqlSsrClient";
import {DefaultPageDocument} from "@graphql/DefaultPage.gql";
import {LayoutDocument} from "@components/Layout/Layout.gql";
import {useRouter} from "next/router";
import {
    ApolloCartErrorAlert,
    useCartQuery,
    useMergeCustomerCart
} from "@graphcommerce/magento-cart";
import {ShippingPageDocument} from "@graphcommerce/magento-cart-checkout";
import {CustomerDocument, useCustomerQuery} from "@graphcommerce/magento-customer";
import {getShippingSummaryDocument, getShippingSummaryQuery} from "@graphql/common/getShippingSummary.gql";
import {useApolloClient, useLazyQuery, useQuery} from "@graphcommerce/graphql";
import {useContext, useEffect, useState} from "react";
import {Button, CircularProgress, Container, Divider, Grid, Step, StepButton, Stepper, Typography, Box, IconButton} from "@mui/material";
import {ComposedForm, ComposedSubmit, ComposedSubmitButton, WaitForQueries} from "@graphcommerce/ecommerce-ui";
import {getCountryCode, getRegionLabelFromId} from "../../components/common/utils";
import {UIContext} from "../../components/common/contexts/UIContext";
import {AlertToast} from "../../components/AlertToast";
import {Trans} from "@lingui/react";
import {
    CheckoutEmailForm,
    CheckoutOrderSummary,
    CheckoutShippingAddressForm,
    CheckoutShippingMethodForm
} from "../../components/checkout";
import {CheckoutCustomerAddressForm} from "@components/checkout/components/CheckoutCustomerAddressForm";
import {ShoppingCartErrorMessage} from "@components/checkout/components/ShoppingCartErrorMessage";
import { CartIcon } from '@components/Icons'
import { Closemenu } from '../../components/Icons'
export const stepsList = ['Shipping', 'Review & Payments'] // Virtual billing address

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutMinimalProps, Props>

function CheckoutShipping() {
    useMergeCustomerCart()
    const router = useRouter()
    const [state, setState] = useContext(UIContext)
    const [ activeClass,setActiveClass] = useState(false);
    const shippingPage = useCartQuery(ShippingPageDocument, { fetchPolicy: 'cache-and-network' })
    const customerAddresses = useCustomerQuery(CustomerDocument, { fetchPolicy: 'cache-and-network' })
    const countryQuery = useQuery(CountryRegionsDocument, { fetchPolicy: 'cache-and-network' })
    const countries = countryQuery.data?.countries ?? countryQuery.previousData?.countries
    const [getShippingMethods] = useLazyQuery(getShippingSummaryDocument)
    const [shippingMethodList, setShippingMethodList] = useState<getShippingSummaryQuery | undefined | null>(null);
    const handleActiveclass =()=>{
        setActiveClass(true);
    }
    useEffect(() => {
        if (shippingPage.data?.cart && !shippingPage?.loading) {
            const shippingData = shippingPage?.data
            getShippingMethods({
                variables: {
                    cartId: shippingPage?.data?.cart?.id,
                    country: getCountryCode(shippingData?.cart?.selectedData?.selectedCountryId as string, countries),
                    state: getRegionLabelFromId(shippingData?.cart?.selectedData?.selectedRegionId, countries, shippingData?.cart?.selectedData?.selectedCountryId),
                    zipCode: shippingData?.cart?.selectedData?.selectedPostcode ?? '',
                    discountCode: shippingData?.cart?.applied_coupons?.[0]?.code ?? '',
                    shippingMethodName: shippingData?.cart?.shipping_selected_methods?.carrierTitle ?? '',
                }
            }).then((response) => {
                setShippingMethodList(response.data)
            }).catch((error) => {
                setState((prev) => ({
                    ...prev,
                    alerts: [
                        {
                            type: 'error',
                            message: `<span>Something went wrong!</span>`,
                            timeout: 10000,
                            targetLink: router.pathname,
                        },
                    ],
                }))
            })
        }
    }, [shippingPage?.loading])

    const cartExists =
        typeof shippingPage.data?.cart !== 'undefined' &&
        (shippingPage.data.cart?.items?.length ?? 0) > 0


    useEffect(() => {
        if (shippingPage.error) {
            router.push("/checkout/emptyCart")
        }
    }, [shippingPage.error]);

    const composedSubmitFn = (renderProps) => (
        <>
            <ApolloCartErrorAlert
                error={renderProps.buttonState.isSubmitting ? undefined : renderProps.error}
            />
            <FormActions
                sx={{
                    display: 'flex',
                    padding: {xs:'1rem 0', md:'0 0 2rem 0'},
                    justifyContent: {md:'flex-end'},
                }}
            >
                <ComposedSubmitButton {...renderProps}
                    id='next'
                    variant='contained'
                    size='large'
                    color='secondary'
                    sx={{
                        width: {xs:'100%', md:'auto'}
                    }}
                >
                    <Trans id='Next' />
                </ComposedSubmitButton>
            </FormActions>
        </>
    )

    const gridStyles = (theme) => ({
        fontSize: '1.625rem !important',
        mb: theme.spacings.sm,
        paddingTop: '0.875rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #cccccc',
    })

    const checkoutCustomerAddressFormStyles = (theme) => ({ mt: 0 })

    const gridStyles2 = (theme) => ({
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

    const composedSubmitRouteFn = () => router.push('/checkout/payment')

    return (
        <>
            {state?.alerts?.length > 0 && (
                <Container maxWidth='lg'
                           sx={{
                               padding: '2rem 0',
                           }}
                >
                    <AlertToast
                        sx={{ marginLeft: '0 !important' }}
                        alerts={state?.alerts}
                        link={router?.pathname}
                    />
                </Container>
            )}
            <PageMeta title={i18n._(/* i18n */ 'Shipping')} metaRobots={['noindex']} />
            <WaitForQueries
                waitFor={[shippingPage, customerAddresses, countryQuery]}
                fallback={
                    <FullPageMessage icon={<CircularProgress />} title={<Trans id='Loading' />}>
                        <Trans id='This may take a second' />
                    </FullPageMessage>
                }
            >
                {shippingPage.error && <ShoppingCartErrorMessage />}
                {!shippingPage.error && !cartExists && <ShoppingCartErrorMessage />}
                {!shippingPage.error && cartExists && (
                    <ComposedForm>
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
                                    onClick={handleActiveclass}
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

                            <Grid container rowSpacing={2.5} columnSpacing={4}>

                                <Grid item xs={12} md={8} sx={{display:{xs:'none', md:'grid'}}}>
                                    <Stepper activeStep={1}
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
                                        {stepsList.map((label) => (
                                            <Step key={label}>
                                                <StepButton disableRipple color="inherit" sx={{cursor: 'auto'}}>
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
                                                sx={gridStyles}
                                            >
                                                <Trans id='Shipping Address' />
                                            </Typography>

                                            {(customerAddresses.data?.customer?.addresses?.length ?? 0) >= 1 ? (
                                                <>
                                                    <CheckoutCustomerAddressForm step={1} sx={checkoutCustomerAddressFormStyles} />
                                                </>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        maxWidth: {md:'31.25rem'}
                                                    }}
                                                >
                                                    <CheckoutEmailForm />
                                                    <Divider sx={{marginTop: '2rem', marginBottom: '1rem'}}/>
                                                    <CheckoutShippingAddressForm />
                                                </Box>
                                            )}


                                            {!shippingPage.data?.cart?.is_virtual && shippingMethodList?.GetSummaryShoppingCart && (
                                            <CheckoutShippingMethodForm shippingMethodList={shippingMethodList} step={4} />
                                            )}

                                            <ComposedSubmit
                                                onSubmitSuccessful={composedSubmitRouteFn}
                                                render={composedSubmitFn}
                                            />

                                        </Grid>
                                        <Grid item xs={12} md={4.2} className={`order-summary-nav ${activeClass && 'show'}`}
                                            sx={gridStyles2}
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
                                                <CheckoutOrderSummary/>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Container>
                    </ComposedForm>
                )}
            </WaitForQueries>
        </>
    )
}

const pageOptions: PageOptions<LayoutMinimalProps> = {
    Layout: LayoutMinimal,
    sharedKey: () => 'checkout',
}
CheckoutShipping.pageOptions = pageOptions

export default CheckoutShipping

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
    const client = graphqlSharedClient(locale)
    const conf = client.query({ query: StoreConfigDocument })
    const staticClient = graphqlSsrClient(locale)

    const page = staticClient.query({ query: DefaultPageDocument, variables: { url: `checkout` } })
    const layout = staticClient.query({ query: LayoutDocument })

    return {
        props: {
            ...(await page).data,
            ...(await layout).data,
            up: { href: '/cart', title: 'Cart' },
            apolloState: await conf.then(() => client.cache.extract()),
        },
    }
}
