import { CreateProductReviewForm } from '@components/ProductDetails/ProductReview/CreateProductReviewForm'
import { useQuery } from '@graphcommerce/graphql'
import { ApolloCustomerErrorFullPage, CustomerDocument } from '@graphcommerce/magento-customer'
import {
  ProductReviewProductNameDocument,
  ProductReviews,
  ProductReviewsProps,
} from '@graphcommerce/magento-review'

import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { FullPageMessage, IconSvg, LayoutTitle, Row, iconBox } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { CircularProgress, Typography, Box } from '@mui/material'
import { useRouter } from 'next/router'
import { RowProductFragment } from '../RowProduct.gql'

type ReviewsProps = RowProductFragment &
  Partial<ProductReviewsProps> & {
    setSelectedIndex: any
  }

export function Reviews(props: ReviewsProps) {
  const router = useRouter()
  const { data: customerData, loading: customerLoading, error } = useQuery(CustomerDocument)
  const urlKey = router.query.url as string

  const { data: productData, loading: productLoading } = useQuery(
    ProductReviewProductNameDocument,
    { variables: { urlKey } },
  )
  const { data: storeConfigData, loading: loadingStoreConfig } = useQuery(StoreConfigDocument)

  const storeConfig = storeConfigData?.storeConfig
  const customer = customerData?.customer
  const product = productData?.products?.items?.[0]

  const { reviews, url_key, review_count, sku, setSelectedIndex } = props
  const { data, loading } = useQuery(StoreConfigDocument)

  if (!reviews || loading) return null

  if (!data?.storeConfig?.product_reviews_enabled) return null

  if (
    !storeConfig?.product_reviews_enabled ||
    productLoading ||
    loadingStoreConfig ||
    customerLoading
  )
    return (
      <FullPageMessage
        icon={<CircularProgress />}
        title={<Trans id='Loading Reviews' />}
        sx={{ marginTop: 0 }}
      >
        <Trans id='This may take a second' />
      </FullPageMessage>
    )

  if (error && !customer && !storeConfig.allow_guests_to_write_product_reviews)
    return (
      <ApolloCustomerErrorFullPage
        error={error}
        signInHref='/account/signin'
        signUpHref='/account/signin'
      />
    )
  return (
    <Row
      maxWidth='md'
      id='reviews'
      sx={{
        padding: '0 !important',
        maxWidth: 'initial !important',
        marginBottom: '0 !important',
        '& p': {
          marginTop: '0',
        },
      }}
    >
      {reviews?.items?.length > 0 && (
        <>
          <Typography
            variant='h3'
            sx={{
              fontSize: '1.625rem !important',
              fontWeight: '300',
              fontVariationSettings: "'wght' 300",
            }}
          >
            Customer Reviews
          </Typography>

          <ProductReviews
            reviews={reviews}
            url_key={url_key ?? ''}
            sku={sku}
            review_count={review_count ?? 0}
          />
        </>
      )}

      <Box
        sx={{
          maxWidth: '31.25rem',
        }}
      >
        {product?.name && (
          <Box sx={{ paddingBottom: '0.875rem' }}>
            <Typography
              variant='h6'
              component='h6'
              sx={{
                marginBottom: '0.35rem',
              }}
            >
              <Trans id='You are reviewing' />
            </Typography>
            <Typography
              variant='h6'
              component='h6'
              sx={{
                fontWeight: '600',
                fontVariationSettings: "'wght' 600",
              }}
              dangerouslySetInnerHTML={{ __html: product?.name }}
            />
          </Box>
        )}

        <CreateProductReviewForm
          sku={product?.sku ?? ''}
          nickname={customer ? `${customer?.firstname} ${customer?.lastname}` : undefined}
          setSelectedIndex={setSelectedIndex}
        />
      </Box>
    </Row>
  )
}
