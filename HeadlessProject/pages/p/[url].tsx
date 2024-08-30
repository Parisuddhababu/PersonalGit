import { PageOptions } from '@graphcommerce/framer-next-pages'
import {
  AddProductsToCartButton,
  AddProductsToCartError,
  AddProductsToCartForm,
  AddProductsToCartFormProps,
  getProductStaticPaths,
  jsonLdProduct,
  jsonLdProductOffer,
  productPageCategory,
  ProductPageMeta,
  ProductPagePrice,
  ProductPagePriceTiers,
} from '@graphcommerce/magento-product'
import {
  ConfigurablePriceTiers,
  ConfigurableProductOptions,
  ConfigurableProductPageGallery,
  defaultConfigurableOptionsSelection,
} from '@graphcommerce/magento-product-configurable'

import { jsonLdProductReview, ProductReviewSummary } from '@graphcommerce/magento-review'
import { redirectOrNotFound, Money, StoreConfigDocument } from '@graphcommerce/magento-store'
import { ProductWishlistChipDetail } from '@graphcommerce/magento-wishlist'
import {
  GetStaticProps,
  JsonLd,
  LayoutHeader,
  LayoutTitle,
  isTypename,
  iconChevronDown,
  IconSvg,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import {
  Box,
  Button,
  Divider,
  Typography,
  Grid,
  Card,
  CardMedia,
  Container,
  Link,
  InputLabel,
} from '@mui/material'
import { GetStaticPaths } from 'next'
import router, { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { LayoutNavigation, LayoutNavigationProps, RowProduct, RowRenderer } from '../../components'
import { AlertToast } from '../../components/AlertToast'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import { Related, Reviews, Specs } from '../../components/GraphCMS/RowProduct/variant'
import { LayoutDocument } from '../../components/Layout/Layout.gql'
import BundleProductCategoryOption from '../../components/ProductDetails/BundleProductCategoryOption/BundleProductCategoryOption'
import GiftCardProductOptions from '../../components/ProductDetails/GiftCardProductOptions/GiftCardProductOptions'
import GroupProductOptions from '../../components/ProductDetails/GroupProductOptions/GroupProductOptions'
import { ProductDescription } from '../../components/ProductDetails/ProductDescription/ProductDescription'
import { ProductShortDesc } from '../../components/ProductDetails/ProductDescription/ProductShortDesc/ProductShortDesc'
import { UIContext } from '../../components/common/contexts/UIContext'
import { ProductPage2Document, ProductPage2Query } from '../../graphql/ProductPage2.gql'
import {
  GetMoreInformationDocument,
  GetMoreInformationQuery,
} from '../../graphql/ProductSpecs/GetMoreInformation.gql'
import { useAddToCompareList } from '../../graphql/hooks'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { QuantityInput } from '@components/QuantityInput'
import { UpdateCartButton } from '@components/UpdateCartButton'
import { DownloadableProductOption } from '@components/ProductDetails/DownloadableProductOption/DownloadableProductOption'
import { CompareIcon } from '../../components/Icons'
import FullPageOverlaySpinner from '@components/common/FullPageOverlaySpinner'

type Props = ProductPage2Query &
  GetMoreInformationQuery &
  Pick<AddProductsToCartFormProps, 'defaultValues'>

type RouteProps = { url: string }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps, Props, RouteProps>

function ProductPage(props: Props) {
  const { products, pages, defaultValues, GetMoreInformation } = props
  const router = useRouter()
  const product = products?.items?.[0]
  let cartDetails
  try {
    if (router.query.data) {
      const decodedData = decodeURIComponent(router.query.data.toString())
      cartDetails = JSON.parse(decodedData)
    }
  } catch {}

  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[] | undefined>([])
  const [outofStock, setOutOfStock] = useState<string | undefined>('')
  const [groupProducts, setGroupProducts] = useState<any>([])
  const [downloadableProductsLinks, setDownloadableProductsLinks] = useState<any>([])
  const [openBundleOptions, setOpenBundleOptions] = useState(false)
  const [bundleProducts, setBundleProducts] = useState([])
  const [giftCardFormData, setgiftCardFormData] = useState({})
  const { addToCompareList, loading } = useAddToCompareList()
  const [state] = useContext(UIContext)
  const selected_related_products = selectedRelatedProducts?.map((sku) => ({ quantity: 1, sku }))
  const isDescriptionAvailable = product?.description && product?.description?.html.length > 0
  const isSpecificationAvailable =
    GetMoreInformation?.allAttributeRecords && GetMoreInformation?.allAttributeRecords?.length > 0
  const isReviewsAvailable = !!product?.reviews

  const [selectedIndex, setSelectedIndex] = useState(() => {
    let index: number
    switch (true) {
      case isReviewsAvailable:
        index = 0
        break
      case isSpecificationAvailable:
        index = 1
        break
      case isDescriptionAvailable:
        index = 2
        break
      default:
        index = 0
        break
    }
    return index
  })

  const handleTabSelect = (index: number) => {
    setSelectedIndex(index)
  }
  const scrollDown = (id: string) => {
    if (id === 'reviewsID') {
      const index =
        isDescriptionAvailable && isSpecificationAvailable
          ? 2
          : isDescriptionAvailable || isSpecificationAvailable
          ? 1
          : 0
      setSelectedIndex(index)
    }
    const element = document.getElementById(`${id}`)
    if (!element) return
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: element.offsetTop,
        left: 0,
        behavior: 'smooth',
      })
    })
  }

  useEffect(() => {
    if (cartDetails?.qty && product?.__typename === 'BundleProduct') {
      setOpenBundleOptions(true)
      setTimeout(() => {
        scrollDown('bundleID' as string)
      }, 200)
    }
    if (router?.query?.data === 'review') {
      scrollDown('reviewsID')
    }
  }, [])

  if (!product?.sku || !product.url_key) return null

  const handleAddToCompareList = async () => {
    await addToCompareList([String(product?.id)], String(product?.name), router?.pathname)
  }

  const configurableProductStyles = (theme) => ({
    '& .SidebarGallery-sidebar': {
      display: 'grid',
      rowGap: theme.spacings.sm,
    },
  })

  const boxStyles = (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.spacings.xs,
    marginBottom: '0.5rem',
  })

  const boxStyles2 = (theme) => ({
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
    alignItems: 'start',
    columnGap: theme.spacings.xs,
    '& button': {
      width: { xs: '100%', md: 'auto' },
      minWidth: { xs: '100%', md: '243px' },
    },
  })

  const boxStyles3 = [
    (theme) => ({
      padding: '0',
      marginBottom: '1.875rem',
      '& .react-tabs': {
        margin: { xs: '0 -15px', md: '0' },
        borderTop: { xs: '1px solid #cccccc', md: '0' },
        '& .mobile-tab-list-btn': {
          display: { xs: 'flex', md: 'none' },
        },
        '& .react-tabs__tab-list': {
          margin: '0',
          padding: '0',
          listStyle: 'none',
          display: { xs: 'none', md: 'flex' },
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
              // border: '1px solid #cccccc',
              borderTop: { xs: '0', md: '1px solid #cccccc' },
              borderBottom: '1px solid #cccccc',
              borderLeft: { xs: '0', md: '1px solid #cccccc' },
              borderRight: { xs: '0', md: '1px solid #cccccc' },
              marginBottom: { md: '2.5rem' },
              padding: { xs: '1rem', md: '2.188rem' },
            },
          },
        },
      },
      '& .mobile-tab-list-btn': {
        minHeight: '2.688rem',
        width: '100%',
        borderRadius: '0',
        backgroundColor: 'transparent',
        color: '#000000',
        justifyContent: 'flex-start',
        borderBottom: '1px solid #cccccc',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '& .MuiButton-endIcon': {
          marginLeft: 'auto',
          // '& svg': {
          //   transform: 'rotate(180deg)',
          // }
        },
        '&.react-tabs__tab--selected': {
          borderBottom: '0',
          '& .MuiButton-endIcon': {
            '& svg': {
              transform: 'rotate(180deg)',
            },
          },
        },
      },
    }),
  ]
  
  return (
    <>
      {loading && <FullPageOverlaySpinner />}
      <LayoutHeader floatingMd>
        <LayoutTitle size='small' component='span'>
          {product.name}
        </LayoutTitle>
      </LayoutHeader>
      <Container maxWidth='lg'>
        <Breadcrumb breadcrumb={[]} name={product?.name || ''} sx={{ marginTop: '2rem' }} />
        {state?.alerts?.length > 0 && (
          <Box sx={{ padding: '1rem 0' }}>
            <AlertToast alerts={state?.alerts} link={router?.pathname} />
          </Box>
        )}
        <JsonLd
          item={{
            '@context': 'https://schema.org',
            ...jsonLdProduct(product),
            ...jsonLdProductOffer(product),
            ...jsonLdProductReview(product),
          }}
        />
        <ProductPageMeta {...product} />
        <AddProductsToCartForm
          key={product.uid}
          defaultValues={defaultValues}
          selected_related_products={selected_related_products}
          groupProducts={groupProducts}
          bundleProducts={bundleProducts}
          giftCardFormData={giftCardFormData}
          productName={product.name}
          downloadableProductsLinks={downloadableProductsLinks}
          sx={{
            '& .SidebarGallery-root': {
              gridTemplateColumns: {
                xs: '1fr',
                md: 'minmax(450px, 1fr) 1fr',
                lg: 'minmax(706px, 1fr) 1fr',
              },
              gridGap: '2.5rem',
            },
            '& .zoomed': {
              '& .SidebarGallery-root': {
                '& .SidebarGallery-scrollerContainer': {
                  '&.zoomed': {
                    position: 'fixed',
                    inset: '0 0',
                    zIndex: '10',

                    '& .SidebarGallery-centerLeft, & .SidebarGallery-centerRight': {
                      top: '50%',
                      marginTop: '-4%',
                    },
                  },
                },
              },
            },
            '& .SidebarGallery-sidebarWrapper': {
              width: '100%',
            },
            '& .SidebarGallery-sidebar': {
              padding: '0',
            },
            '& .SidebarGallery-scrollerContainer': {
              width: { xs: '100%' },
            },
          }}
        >
          <ConfigurableProductPageGallery
            url_key={product.url_key}
            media_gallery={product.media_gallery}
            sx={configurableProductStyles}
          >
            <div>
              {product.name && (
                <Typography
                  variant='h2'
                  gutterBottom
                  dangerouslySetInnerHTML={{ __html: product.name }}
                  sx={{
                    fontWeight: 300,
                    fontVariationSettings: "'wght' 300",
                  }}
                />
              )}
              <Box
                sx={boxStyles}
              >
                {product?.review_count !== 0 && (
                  <Box
                    sx={{
                      '& > div': {
                        alignItems: 'center',
                      },
                      '& .ProductReviewSummary-root': {
                        '& .ProductReviewSummary-iconStarDisabled': {
                          fill: '#e0e0e0',
                          fontSize: { xs: '1rem', md: '1.25rem' },
                        },
                        '& .ProductReviewSummary-iconStar': {
                          fill: '#ff5501',
                          fontSize: { xs: '1rem', md: '1.25rem' },
                        },
                      },
                      '& .MuiTypography-root': {
                        display: 'none',
                      },
                    }}
                  >
                    <ProductReviewSummary {...product} />
                  </Box>
                )}

                {product?.review_count === 0 ? (
                  <Typography
                    variant='body1'
                    component={Link}
                    onClick={() => scrollDown('reviewsID')}
                    underline='hover'
                    sx={{
                      color: '#1979c3',
                      cursor: 'pointer',
                    }}
                  >
                    <Trans id='Be the first one to give a review' />
                  </Typography>
                ) : (
                  <Link
                    // color='secondary'
                    underline='hover'
                    sx={{
                      color: '#006bb4',
                      cursor: 'pointer',
                    }}
                    onClick={() => scrollDown('reviewsID')}
                  >
                    <Typography
                      component='span'
                      sx={{
                        marginRight: '0.5rem',
                        display: 'inline-block',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {`${product?.review_count}`}{' '}
                      {product?.review_count === 1 ? <Trans id='Review' /> : <Trans id='Reviews' />}
                    </Typography>
                  </Link>
                )}

                {product?.review_count !== 0 && (
                  <Link
                    color='secondary'
                    underline='hover'
                    sx={{
                      color: '#006bb4',
                      cursor: 'pointer',
                    }}
                    onClick={() => scrollDown('reviewsID')}
                  >
                    Add Review
                  </Link>
                )}
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={7}>
                  {' '}
                  <AddProductsToCartError>
                    {isTypename(product, ['ConfigurableProduct']) && (
                      <>
                        <Typography
                          variant='h4'
                          color='#575757'
                          sx={{
                            fontSize: { xs: '0.875rem !important', md: '1.313rem !important' },
                            lineHeight: { xs: '1.25rem !important', md: '1.875rem !important' },
                            fontWeight: 400,
                            fontVariationSettings: "'wght' 400",
                          }}
                        >
                          As Low as
                        </Typography>
                        <Typography
                          variant='h2'
                          color='#575757'
                          sx={{
                            fontSize: { xs: '1.375rem', md: '2.25rem' },
                            fontWeight: 600,
                            fontVariationSettings: "'wght' 600",
                          }}
                        >
                          <Trans
                            id=' <0/>'
                            components={{
                              0: <Money {...product.price_range.minimum_price.final_price} />,
                            }}
                          />
                        </Typography>
                      </>
                    )}
                    {isTypename(product, ['DownloadableProduct']) && (
                      <DownloadableProductOption product={product} />
                    )}
                    {isTypename(product, ['BundleProduct']) && (
                      <>
                        <Typography
                          variant='h4'
                          color='#575757'
                          sx={{
                            fontSize: { xs: '0.875rem !important', md: '1.313rem !important' },
                            lineHeight: { xs: '1.25rem !important', md: '1.875rem !important' },
                            fontWeight: 400,
                            fontVariationSettings: "'wght' 400",
                          }}
                        >
                          From
                        </Typography>
                        <Typography
                          variant='h2'
                          color='#575757'
                          sx={{
                            fontSize: '2.25rem',
                            fontWeight: 600,
                            fontVariationSettings: "'wght' 600",
                          }}
                        >
                          <Trans
                            id=' <0/>'
                            components={{
                              0: <Money {...product.price_range.minimum_price.final_price} />,
                            }}
                          />
                        </Typography>
                        <Typography
                          variant='h4'
                          color='#575757'
                          sx={{
                            fontSize: { xs: '0.875rem !important', md: '1.313rem !important' },
                            lineHeight: { xs: '1.25rem !important', md: '1.875rem !important' },
                            fontWeight: 400,
                            fontVariationSettings: "'wght' 400",
                          }}
                        >
                          To
                        </Typography>
                        <Typography
                          variant='h2'
                          color='#575757'
                          sx={{
                            fontSize: '2.25rem',
                            fontWeight: 600,
                            fontVariationSettings: "'wght' 600",
                          }}
                        >
                          {product.price_range.maximum_price && (
                            <Trans
                              id=' <0/>'
                              components={{
                                0: <Money {...product.price_range.maximum_price.final_price} />,
                              }}
                            />
                          )}
                        </Typography>
                      </>
                    )}
                    {!isTypename(product, [
                      'ConfigurableProduct',
                      'BundleProduct',
                      'GroupedProduct',
                      'GiftCardProduct',
                    ]) && (
                      <Typography
                        variant='h2'
                        color='#333'
                        fontWeight='500'
                        fontFamily='system-ui'
                        marginTop='1rem'
                        marginLeft='0'
                      >
                        <ProductPagePrice product={product} />
                      </Typography>
                    )}
                  </AddProductsToCartError>
                </Grid>
                {isTypename(product, ['ConfigurableProduct']) && (
                  <Grid
                    item
                    xs={5}
                    sx={{
                      textAlign: 'right',
                    }}
                  >
                    {' '}
                    <Typography
                      variant='body1'
                      component='div'
                      gutterBottom
                      sx={{
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontVariationSettings: "'wght' 700",
                      }}
                    >
                      {outofStock === 'NotAvailable' ? (
                        <Trans id='Out of Stock' />
                      ) : (
                        <Trans id='In Stock' />
                      )}
                    </Typography>
                    <Trans id='SKU#:' /> {product.sku}
                  </Grid>
                )}
                {!isTypename(product, ['ConfigurableProduct']) && (
                  <Grid
                    item
                    xs={5}
                    sx={{
                      textAlign: 'right',
                    }}
                  >
                    {' '}
                    <Typography
                      variant='body1'
                      component='div'
                      gutterBottom
                      sx={{
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontVariationSettings: "'wght' 700",
                      }}
                    >
                      {product.stock_status === 'IN_STOCK' ? (
                        <Trans id='In Stock' />
                      ) : (
                        <Trans id='Out Of Stock' />
                      )}
                    </Typography>
                    <Trans id='SKU#:' /> {product.sku}
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ bgcolor: '#3B3B3B', mb: 2, marginTop: '0.6rem' }} />
            </div>
            {isTypename(product, ['ConfigurableProduct']) && (
              <ConfigurableProductOptions setOutOfStock={setOutOfStock} product={product} />
            )}

            {isTypename(product, ['GroupedProduct']) && (
              <GroupProductOptions product={product} setGroupProducts={setGroupProducts} />
            )}
            {isTypename(product, ['GiftCardProduct']) && (
              <GiftCardProductOptions
                cartDetails={cartDetails}
                product={product}
                giftCardData={giftCardFormData}
                setgiftCardFormData={setgiftCardFormData}
              />
            )}

            {!isTypename(product, [
              'GroupedProduct',
              'BundleProduct',
              'GiftCardProduct',
              'DownloadableProduct',
            ]) && (
              <Box>
                <InputLabel htmlFor='Qty'>
                  <Trans id='Qty' />
                </InputLabel>
                <QuantityInput cartDetails={cartDetails} sx={{ flexShrink: '0' }} />
              </Box>
            )}

            {isTypename(product, ['ConfigurableProduct']) ? (
              <ConfigurablePriceTiers product={product} />
            ) : (
              <ProductPagePriceTiers product={product} />
            )}
            {isTypename(product, ['DownloadableProduct']) && (
              <DownloadableProductOption product={product} linkType='sample' />
            )}
            {!isTypename(product, ['BundleProduct', 'GiftCardProduct']) && (
              <Box
                sx={boxStyles2}
              >
                {router?.query?.data && product?.__typename !== 'DownloadableProduct' ? (
                  <UpdateCartButton
                    fullWidth
                    product={product}
                    editDetails={cartDetails}
                    sx={{
                      backgroundColor: '#1979c3',
                      color: '#ffffff',
                      borderRadius: '0',
                      fontWeight: '500',
                      ':hover': { backgroundColor: '#006bb4' },
                    }}
                  />
                ) : (
                  <AddProductsToCartButton
                    fullWidth
                    product={product}
                    variant='contained'
                    size='large'
                    color='secondary'
                  />
                )}
              </Box>
            )}
            {product.stock_status === 'IN_STOCK' && isTypename(product, ['BundleProduct']) && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  alignItems: 'start',
                }}
              >
                <Button
                  variant='contained'
                  size='large'
                  color='secondary'
                  onClick={() => {
                    setOpenBundleOptions(true)
                    setTimeout(() => {
                      scrollDown('bundleID' as string)
                    }, 200)
                  }}
                >
                  <Trans id='Customize and Add to Cart' />
                </Button>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: '1.5rem',
                '& button': {
                  borderRadius: '0',
                  padding: '0',
                  color: '#666666',
                  '& > svg': {
                    fontSize: '1.125rem !important',
                    marginRight: '0.313rem',
                    display: 'inline-block',
                    padding: '0',
                  },
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: 'transparent',
                    '& > svg': {
                      color: '#000000',
                    },
                  },
                },
              }}
            >
              <ProductWishlistChipDetail {...product} />
              <Button
                onClick={handleAddToCompareList}
                startIcon={<CompareIcon />}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Trans id='ADD TO COMPARE' />
              </Button>
            </Box>

            <ProductShortDesc short_description={product?.short_description} />
          </ConfigurableProductPageGallery>

          {openBundleOptions && (
            <div id='bundleID'>

              <BundleProductCategoryOption
                product={product}
                cartDetails={cartDetails}
                setBundleProducts={setBundleProducts}
                setOpenBundleOptions={setOpenBundleOptions}
              />
            </div>
          )}

          <Box
            sx={boxStyles3}
          >
            <Box
              sx={{
                maxWidth: '706px',
                position: 'relative',
                display: { xs: 'none', md: 'block' },
                marginBottom: '1.688rem',
              }}
            >
              {product?.media_gallery && product.media_gallery.length > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: '2px',
                  }}
                >
                  {product.media_gallery?.map((image, index) => (
                    <Box key={image?.url ?? index}>
                      <Card>
                        {image && image.url && (
                          <CardMedia
                            component='img'
                            src={image.url}
                            sx={{
                              width: { xs: 'auto', md: '80px' },
                              height: { xs: 'auto', md: '110px' },
                            }}
                          />
                        )}{' '}
                      </Card>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            {isTypename(product, ['DownloadableProduct']) && (
              <DownloadableProductOption
                product={product}
                linkType='link'
                setDownloadableProductsLinks={setDownloadableProductsLinks}
              />
            )}
            <Tabs
              selectedIndex={selectedIndex}
              onSelect={handleTabSelect}
              // style={{ border: '2px solid black', position: 'relative', bottom: '0px' }}
              id='reviewsID'
            >
              <TabList>
                {isDescriptionAvailable && (
                  <Tab>
                    <Trans id='Description' />
                  </Tab>
                )}
                {isSpecificationAvailable && (
                  <Tab>
                    <Trans id='More Information' />
                  </Tab>
                )}

                {isReviewsAvailable && (
                  <Tab>
                    {product?.review_count <= 1 ? (
                      <Trans id='Reviews' />
                    ) : (
                      <>
                        <Trans id='Reviews' />
                        {`(${product.review_count})`}
                      </>
                    )}
                  </Tab>
                )}
              </TabList>
              {isDescriptionAvailable && (
                <>
                  <Button
                    variant='contained'
                    size='medium'
                    // color='secondary'
                    className={`mobile-tab-list-btn ${
                      selectedIndex === 0 ? 'react-tabs__tab--selected' : ''
                    }`}
                    onClick={() => setSelectedIndex(0)}
                    endIcon={<IconSvg src={iconChevronDown} />}
                  >
                    Description
                  </Button>
                  <TabPanel>
                    <Box className='react-tabs__tab-panel-inner'>
                      <ProductDescription {...product} />
                    </Box>
                  </TabPanel>
                </>
              )}
              {isSpecificationAvailable && (
                <>
                  <Button
                    variant='contained'
                    size='medium'
                    // color='secondary'
                    className={`mobile-tab-list-btn ${
                      selectedIndex === 1 ? 'react-tabs__tab--selected' : ''
                    }`}
                    onClick={() => setSelectedIndex(1)}
                    endIcon={<IconSvg src={iconChevronDown} />}
                  >
                    More Information
                  </Button>
                  <TabPanel>
                    <Box className='react-tabs__tab-panel-inner'>
                      <Specs GetMoreInformation={GetMoreInformation} />
                    </Box>
                  </TabPanel>
                </>
              )}
              {isReviewsAvailable && (
                <>
                  <Button
                    variant='contained'
                    size='medium'
                    // color='secondary'
                    className={`mobile-tab-list-btn ${
                      selectedIndex === 2 ? 'react-tabs__tab--selected' : ''
                    }`}
                    onClick={() => setSelectedIndex(2)}
                    endIcon={<IconSvg src={iconChevronDown} />}
                  >
                    {product?.review_count <= 1 ? 'Reviews' : `Reviews (${product?.review_count})`}
                  </Button>
                  <TabPanel>
                    <Box className='react-tabs__tab-panel-inner'>
                      <Reviews
                        identity=''
                        title=''
                        pageLinks={[]}
                        {...product}
                        setSelectedIndex={setSelectedIndex}
                      />
                    </Box>
                  </TabPanel>
                </>
              )}
            </Tabs>
          </Box>
        </AddProductsToCartForm>
        {/* @ts-ignore */}
        <Related
          {...product}
          setSelectedRelatedProducts={setSelectedRelatedProducts}
          selectedRelatedProducts={selectedRelatedProducts}
        />
        {pages?.[0] && (
          <RowRenderer
            content={pages?.[0].content}
            renderer={{
              RowProduct: (rowProps) => (
                <RowProduct
                  {...rowProps}
                  {...product}
                  items={products?.items}
                  aggregations={products?.aggregations}
                />
              ),
            }}
          />
        )}
      </Container>
    </>
  )
}

ProductPage.pageOptions = {
  Layout: LayoutNavigation,
} as PageOptions

export default ProductPage

export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
  if (import.meta.graphCommerce.legacyProductRoute) return { paths: [], fallback: false }
  if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

  const path = (locale: string) => getProductStaticPaths(graphqlSsrClient(locale), locale)
  const paths = (await Promise.all(locales.map(path))).flat(1)

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetPageStaticProps = async ({ params, locale }) => {
  if (import.meta.graphCommerce.legacyProductRoute) return { notFound: true }

  const client = graphqlSharedClient(locale)
  const staticClient = graphqlSsrClient(locale)
  const urlKey = params?.url ?? '??'

  const conf = client.query({ query: StoreConfigDocument })
  const productPage = staticClient.query({
    query: ProductPage2Document,
    variables: { url: 'product/global', urlKey },
  })
  const product = (await productPage).data.products?.items?.find((p) => p?.url_key === urlKey)
  const productSku = product?.sku

  const aggregations = staticClient.query({
    query: GetMoreInformationDocument,
    variables: { sku: productSku as string },
  })

  const layout = staticClient.query({ query: LayoutDocument })
  if (!product) return redirectOrNotFound(staticClient, params, locale)

  const category = productPageCategory(product)
  const up =
    category?.url_path && category?.name
      ? { href: `/${category.url_path}`, title: category.name }
      : { href: `/`, title: 'Home' }

  return {
    props: {
      ...(await aggregations).data,
      ...defaultConfigurableOptionsSelection(urlKey, client, (await productPage).data),
      ...(await layout).data,
      apolloState: await conf.then(() => client.cache.extract()),
      up,
    },
    revalidate: 30,
  }
}
