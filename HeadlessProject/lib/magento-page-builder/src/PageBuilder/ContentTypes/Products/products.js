/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-extraneous-dependencies */
import { useQuery } from '@apollo/client'
// import { useIsMobile } from '@lib/magento-page-builder/src/isMobile/useIsMobile'
import cn from 'classnames'
import dynamic from 'next/dynamic'
import { arrayOf, bool, number, oneOf, shape, string, object } from 'prop-types'
import React from 'react'
// import PerfectScrollbar from 'react-perfect-scrollbar'
import { getProductsBySkuDocument } from '../../../../../../graphql/GetProductsBySku.gql'
import Gallery from '../../../Gallery'
import GalleryItem from '../../../Gallery/item'
import { GET_PRODUCTS_BY_SKU_QUERY } from '../../../Queries/getProductsBySku'
import { mergeClasses } from '../../classify'
import slickStyles from './SlickExtend.module.scss'
import defaultClasses from './products.module.scss'
import {Box, CircularProgress} from "@mui/material";
import {Trans} from "@lingui/react";

/**
 * Page Builder Products component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page
 * Builder.
 *
 * @typedef Products
 * @param {props} props React component props
 * @returns {React.Element} A React component that displays a Products based on a number of skus.
 * @kind functional component
 */
const Products = (props) => {
  // const [t] = useTranslation();
  const t = (string) => string
  const classes = mergeClasses(defaultClasses, props.classes)
  const {
    appearance,
    autoplay,
    autoplaySpeed,
    infinite,
    arrows,
    dots,
    draggable = false,
    carouselMode,
    centerPadding,
    skus,
    textAlign,
    border,
    borderColor,
    borderWidth,
    borderRadius,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    cssClasses = [],
    slidesToShow = 5,
    slideToShowSmall = 2,
    slideToShowSmallCenterMode = 1,
    AddToWishlist,
    AddToWishlistLabel,
    ProductTile,
    globalOptions = {},
  } = props

  const dynamicStyles = {
    textAlign,
    border,
    borderColor,
    borderWidth,
    borderRadius,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }
  // const isMobile = useIsMobile()
  const { loading, error, data } = useQuery(getProductsBySkuDocument, {
    variables: { skus },
  })

  if (loading) return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </Box>
  )

  if (error || data.products.items.length === 0) {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          No products available.
        </Box>
    )
  }

  const renderNoProducts = () => (
      <div style={dynamicStyles} className={[classes.root, ...cssClasses].join(' ')}>
        <div className={classes.error}>
          {t('No products to display')}
          {skus.length ? (
              <>
                {t('Should be requested products with SKUs')} {skus.join(', ')}
              </>
          ) : (
              ''
          )}
        </div>
      </div>
  )

  if (!skus?.length) return renderNoProducts()

  if (!data && !error) return <CircularProgress />

  if (error || !data?.products || data?.products?.items?.length === 0) return renderNoProducts()

  const items = restoreSortOrder(skus, data.products.items)

  if (cssClasses.includes('tacony-schematic-parts-list')) {
    return items.length > 0 ? (
        <ol className='parts-list'>
          {items.map((item) => (
              <li key={item.name}>
                <a href={`/p/${item.url_key}`}>
                  {item.name} #{item.sku}
                </a>
              </li>
          ))}
        </ol>
    ) : null
  }

  if (appearance === 'carousel') {
    const galleryItems = items.map((item) =>
        ProductTile ? (
            <ProductTile product={item} />
        ) : (
            <GalleryItem key={item.name} item={mapGalleryItem(item)} />
        ),
    )

    // if (isMobile) {
    //   return (
    //     <PerfectScrollbar>
    //       <div
    //         style={dynamicStyles}
    //         className={[classes.carousel, ...cssClasses, 'mobile-scrollbar'].join(' ')}
    //       >
    //         {galleryItems}
    //       </div>
    //     </PerfectScrollbar>
    //   )
    // }

    // Settings conditions was made due to react-slick issues
    const carouselCenterMode = carouselMode === 'continuous' && items.length > slidesToShow
    const carouselSmallCenterMode =
        carouselMode === 'continuous' && items.length > slideToShowSmallCenterMode
    let carouselSettings = {
      slidesToShow,
      slidesToScroll: slidesToShow,
      draggable,
      autoplay,
      autoplaySpeed,
      arrows,
      dots,
      centerMode: carouselCenterMode,
      responsive: [
        {
          breakpoint: 640,
          settings: {
            slidesToShow: carouselSmallCenterMode ? slideToShowSmallCenterMode : slideToShowSmall,
            slidesToScroll: carouselSmallCenterMode ? slideToShowSmallCenterMode : slideToShowSmall,
            centerMode: carouselSmallCenterMode,
            ...(carouselSmallCenterMode && { centerPadding }),
            ...{
              infinite: items.length > slideToShowSmall && infinite,
            },
          },
        },
      ],
      ...(carouselCenterMode && { centerPadding }),
      ...{ infinite: items.length > slidesToShow && infinite },
    }

    const centerModeClass = carouselCenterMode ? classes.centerMode : null
    const centerModeSmallClass = carouselSmallCenterMode ? classes.centerModeSmall : null

    let extraConfig = {}
    try {
      extraConfig = JSON.parse(props.additionalConfig)
    } catch (e) {
      console.warn('Additional Slider Configuration JSON format issue')
    }

    if (extraConfig) {
      carouselSettings = { ...carouselSettings, ...extraConfig }
    }

    return (
        <div
            style={dynamicStyles}
            className={[classes.carousel, ...cssClasses, centerModeClass, centerModeSmallClass].join(
                ' ',
            )}
        >
          <SlickSlider {...carouselSettings} className={cn(slickStyles.root)}>
            {galleryItems}
          </SlickSlider>
        </div>
    )
  }

  return (
      <div style={dynamicStyles} className={[classes.root, ...cssClasses].join(' ')}>
        <Gallery
            AddToWishlist={AddToWishlist}
            AddToWishlistLabel={AddToWishlistLabel}
            items={items}
            classes={{ items: classes.galleryItems }}
            globalOptions={globalOptions}
            ProductTile={ProductTile}
        />
      </div>
  )
}
const SlickSlider = dynamic(() => import('react-slick'))

/**
 * Sort products based on the original order of SKUs
 *
 * @param {Array} skus
 * @param {Array} products
 * @returns {Array}
 */
const restoreSortOrder = (skus, products) => {
  const productsBySku = new Map()
  products?.forEach((product) => {
    productsBySku.set(product.sku, product)
  })
  return skus.map((sku) => productsBySku.get(sku)).filter(Boolean)
}

const mapGalleryItem = (item) => {
  const { small_image } = item
  return {
    ...item,
    small_image: typeof small_image === 'object' ? small_image.url : small_image,
  }
}

/**
 * Props for {@link Products}
 *
 * @typedef props
 * @property {Object} classes An object containing the class names for the Products
 * @property {String} classes.root CSS class for products
 * @property {String} classes.carousel CSS class for products carousel appearance
 * @property {String} classes.centerMode CSS class for products carousel appearance with center mode
 * @property {String} classes.centerModeSmall CSS class for products carousel appearance with center
 *   mode on small screen
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {String} appearance Sets products appearance
 * @property {Boolean} autoplay Whether the carousel should autoplay
 * @property {Number} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {Boolean} infinite Whether to infinitely scroll the carousel
 * @property {Boolean} arrows Whether to show arrows on the slide for navigation
 * @property {Boolean} dots Whether to show navigation dots at the bottom of the carousel
 * @property {Boolean} draggable Enable scrollable via dragging on desktop
 * @property {String} carouselMode Carousel mode
 * @property {String} centerPadding Horizontal padding in centerMode
 * @property {Array} skus List of SKUs to load into product list
 * @property {String} textAlign Alignment of content within the products list
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 * @property {Number} slidesToShow # of slides to show at a time
 * @property {Number} slidesToShowSmall # of slides to show at a time on small screen
 * @property {Number} slidesToShowSmallCenterMode # of slides to show at a time on small screen in
 *   centerMode
 *
 *   - @property {Array} pathNames List of Url path names to load into product list
 */
Products.propTypes = {
  classes: shape({
    root: string,
    carousel: string,
    centerMode: string,
    centerModeSmall: string,
    galleryItems: string,
    error: string,
  }),
  appearance: oneOf(['grid', 'carousel']),
  autoplay: bool,
  autoplaySpeed: number,
  infinite: bool,
  arrows: bool,
  dots: bool,
  draggable: bool,
  carouselMode: oneOf(['default', 'continuous']),
  centerPadding: string,
  skus: arrayOf(string),
  textAlign: string,
  border: string,
  borderColor: string,
  borderWidth: string,
  borderRadius: string,
  marginTop: string,
  marginRight: string,
  marginBottom: string,
  marginLeft: string,
  paddingTop: string,
  paddingRight: string,
  paddingBottom: string,
  paddingLeft: string,
  cssClasses: arrayOf(string),
  slidesToShow: number,
  slidesToShowSmall: number,
  slidesToShowSmallCenterMode: number,
  globalOptions: object,
  pathNames: arrayOf(string),
}

Products.defaultProps = {
  productQuery: GET_PRODUCTS_BY_SKU_QUERY,
}

export default Products
