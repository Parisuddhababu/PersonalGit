import { PageOptions, usePageContext } from '@graphcommerce/framer-next-pages'
import { useScrollerContext, useScrollTo } from '@graphcommerce/framer-scroller'
import { useMotionValueValue } from '@graphcommerce/framer-utils'
import { useQuery } from '@graphcommerce/graphql'
import { Image } from '@graphcommerce/image'
import { CartAddedDocument, CrosssellsDocument, useCartQuery } from '@graphcommerce/magento-cart'
import { AddProductsToCartForm } from '@graphcommerce/magento-product'
import { PageMeta, StoreConfigDocument } from '@graphcommerce/magento-store'
import {
  Button,
  filterNonNullableKeys,
  GetStaticProps,
  iconChevronRight,
  IconSvg,
  ItemScroller,
  RenderType,
  responsiveVal,
} from '@graphcommerce/next-ui'
import { LayoutHeaderClose } from '@graphcommerce/next-ui/Layout/components/LayoutHeaderClose'
import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, Container, Divider, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import { LayoutOverlay, LayoutOverlayProps, productListRenderer } from '../../components'
import { graphqlSharedClient } from '../../lib/graphql/graphqlSsrClient'

type Props = Record<string, unknown>
type GetPageStaticProps = GetStaticProps<LayoutOverlayProps, Props>

function CheckoutAdded() {
  const cartAdded = useCartQuery(CartAddedDocument)
  const items = filterNonNullableKeys(cartAdded.data?.cart?.items)
  const router = useRouter()
  const { sku } = router.query
  const lastItem = items.find((item) => item.product.sku === sku)

  const crosssels = useQuery(CrosssellsDocument, {
    variables: { pageSize: 1, filters: { sku: { eq: lastItem?.product.sku } } },
    skip: !lastItem?.product.sku,
    ssr: false,
  })
  const crossSellItems = useMemo(
    () =>
      filterNonNullableKeys(
        crosssels.data?.products?.items?.[0]?.crosssell_products ??
          crosssels.previousData?.products?.items?.[0]?.crosssell_products,
      ).filter(
        (item) =>
          items.every((i) => i.product.sku !== item.sku) && item.stock_status === 'IN_STOCK',
      ),
    [crosssels.data?.products?.items, crosssels.previousData?.products?.items, items],
  )

  const { direction } = usePageContext()
  const readyOnce = useRef(direction !== 1)
  const ready = useMotionValueValue(useScrollerContext().snap, (snapV) => {
    if (snapV) readyOnce.current = true
    return readyOnce.current
  })

  const { getSnapPosition } = useScrollerContext()
  const scrollTo = useScrollTo()

  const showCrossSell = crossSellItems.length > 0 && ready

  useEffect(() => {
    if (showCrossSell) setTimeout(() => scrollTo(getSnapPosition('down')), 10)
  }, [getSnapPosition, scrollTo, showCrossSell])
  const containerStyles = (theme) => ({
    display: 'grid',
    py: 2,
    alignItems: { xs: 'start', md: 'center' },
    gap: theme.spacings.xxs,
    gridTemplate: {
      xs: `"icon children close"
         "action action   action"`,
      md: '"icon children action close"',
    },
    gridTemplateColumns: {
      xs: 'min-content 1fr auto',
      md: 'min-content 1fr max-content auto',
    },

    '&.IconSvg': {
      gridArea: 'children',
    },
  })
  const typographyStyles = (theme) => ({
    display: { xs: 'block', md: 'none' },
    my: theme.spacings.sm,
    textAlign: 'center',
  })
  const itemScrollerStyles = (theme) => ({
    width: 'auto',
    mb: theme.page.vertical,
  })
  
  return (
    <>
      <PageMeta title={i18n._(/* i18n */ 'Cart')} metaRobots={['noindex']} />

      <Container
        maxWidth={false}
        sx={containerStyles}
      >
        {lastItem?.product.thumbnail?.url ? (
          <Image
            src={lastItem?.product.thumbnail?.url}
            width={50}
            height={50}
            layout='fill'
            sx={{
              width: responsiveVal(50, 80),
              height: responsiveVal(50, 80),
              display: 'block',
              borderRadius: 1,
              objectFit: 'contain',
            }}
            pictureProps={{ sx: { gridArea: 'icon', alignSelf: 'stretch' } }}
            sizes='100px'
          />
        ) : (
          <Box
            sx={{
              gridArea: 'icon',
              alignSelf: 'stretch',
              width: responsiveVal(50, 80),
              height: responsiveVal(50, 80),
            }}
          />
        )}

        <Box gridArea='children'>
          <Box sx={{ typography: 'h6' }}>
            <Trans
              id='<0>{name}</0> has been added to your shopping cart!'
              components={{ 0: <strong /> }}
              values={{ name: lastItem?.product.name }}
            />
          </Box>
          {showCrossSell && (
            <Box sx={{ typography: 'body1', display: { xs: 'none', md: 'block' } }}>
              <Trans id='Complete your purchase' />
            </Box>
          )}
        </Box>
        <Box gridArea='action'>
          <Button
            href='/cart'
            id='view-shopping-cart-button'
            size='large'
            variant='pill'
            color='secondary'
            endIcon={<IconSvg src={iconChevronRight} />}
            sx={{ display: 'flex' }}
          >
            <Trans id='View shopping cart' />
          </Button>
        </Box>
        <LayoutHeaderClose />
      </Container>

      {showCrossSell && (
        <>
          <Container maxWidth={false}>
            <Divider />
            <Typography
              variant='h6'
              gutterBottom
              sx={typographyStyles}
            >
              <Trans id='Complete your purchase' />
            </Typography>
          </Container>
          <AddProductsToCartForm>
            <ItemScroller
              sx={itemScrollerStyles}
            >
              {crossSellItems.map((item) => (
                <RenderType
                  key={item.uid ?? ''}
                  renderer={productListRenderer}
                  {...item}
                  sizes={responsiveVal(200, 300)}
                />
              ))}
            </ItemScroller>
          </AddProductsToCartForm>
        </>
      )}
    </>
  )
}

const pageOptions: PageOptions<LayoutOverlayProps> = {
  overlayGroup: 'checkout',
  Layout: LayoutOverlay,
  layoutProps: {
    variantMd: 'bottom',
    variantSm: 'bottom',
    sizeMd: 'floating',
    sizeSm: 'minimal',
    justifyMd: 'stretch',
    justifySm: 'stretch',
  },
}
CheckoutAdded.pageOptions = pageOptions

export default CheckoutAdded

export const getStaticProps: GetPageStaticProps = async ({ locale }) => {
  const client = graphqlSharedClient(locale)
  const conf = client.query({ query: StoreConfigDocument })

  return {
    props: {
      apolloState: await conf.then(() => client.cache.extract()),
    },
  }
}
