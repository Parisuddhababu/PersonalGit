import React from 'react'
import rowConfigAggregator from './ContentTypes/Row/configAggregator'
import Row from './ContentTypes/Row'
import columnConfigAggregator from './ContentTypes/Column/configAggregator'
import Column from './ContentTypes/Column'
import columnGroupConfigAggregator from './ContentTypes/ColumnGroup/configAggregator'
import ColumnGroup from './ContentTypes/ColumnGroup'
import imageConfigAggregator from './ContentTypes/Image/configAggregator'
import Image from './ContentTypes/Image'
import headingConfigAggregator from './ContentTypes/Heading/configAggregator'
import Heading from './ContentTypes/Heading'
import textConfigAggregator from './ContentTypes/Text/configAggregator'
import Text from './ContentTypes/Text'
import tabsConfigAggregator from './ContentTypes/Tabs/configAggregator'
import tabItemConfigAggregator from './ContentTypes/TabItem/configAggregator'
import blockConfigAggregator from './ContentTypes/Block/configAggregator'
import productsConfigAggregator from './ContentTypes/Products/configAggregator'
import buttonsConfigAggregator from './ContentTypes/Buttons/configAggregator'
import buttonItemConfigAggregator from './ContentTypes/ButtonItem/configAggregator'
import htmlConfigAggregator from './ContentTypes/Html/configAggregator'
import dividerConfigAggregator from './ContentTypes/Divider/configAggregator'
import videoConfigAggregator from './ContentTypes/Video/configAggregator'
import mapConfigAggregator from './ContentTypes/Map/configAggregator'
import bannerConfigAggregator from './ContentTypes/Banner/configAggregator'
import ButtonItem from './ContentTypes/ButtonItem'
import sliderConfigAggregator from './ContentTypes/Slider/configAggregator'
import multiSliderConfigAggregator from './ContentTypes/SliderMultiCarousel/configAggregator'
import columnWrapperConfigAggregator from './ContentTypes/ColumnWithWrapper/configAggregator'
import dynamic from 'next/dynamic'

/* istanbul ignore next */
const contentTypesConfig = {
    row: {
        configAggregator: rowConfigAggregator,
        component: Row
    },
    column: {
        configAggregator: columnConfigAggregator,
        component: Column
    },
    'column-group': {
        configAggregator: columnGroupConfigAggregator,
        component: ColumnGroup
    },
    image: {
        configAggregator: imageConfigAggregator,
        component: Image
    },
    heading: {
        configAggregator: headingConfigAggregator,
        component: Heading
    },
    text: {
        configAggregator: textConfigAggregator,
        component: Text
    },
    tabs: {
        configAggregator: tabsConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Tabs'))
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: dynamic(() => import('./ContentTypes/TabItem'))
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Buttons'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Block'))
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Products'))
    },
    html: {
        configAggregator: htmlConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Html'))
    },
    divider: {
        configAggregator: dividerConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Divider'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Video'))
    },
    map: {
        configAggregator: mapConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Map'))
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Banner'))
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Slider'))
    },
    // Slide is just a banner wrapped inside a slider
    slide: {
        configAggregator: bannerConfigAggregator,
        component: dynamic(() => import('./ContentTypes/Banner'))
    },
    // Multi Slide converted out of content type tabs
    'slider-multi': {
        configAggregator: multiSliderConfigAggregator,
        component: dynamic(() => import('./ContentTypes/SliderMultiCarousel'))
    },
    'wrapper-column': {
        configAggregator: columnWrapperConfigAggregator,
        component: dynamic(() => import('./ContentTypes/ColumnWithWrapper'))
    },
}

/**
 * Retrieve a content types configuration
 *
 * @param {string} contentType
 * @param extendedContentTypeConfig
 * @returns {*}
 */
export default function getContentTypeConfig(
    contentType,
    extendedContentTypeConfig = {}
) {
    const mergedContentTypesConfig = {
        ...contentTypesConfig,
        ...extendedContentTypeConfig
    }
    if (mergedContentTypesConfig[contentType]) {
        return mergedContentTypesConfig[contentType]
    }
}

/**
 * Set content types configuration with new one
 *
 * @param {string} contentType
 * @param {*} config
 * @returns {*}
 */
export function setContentTypeConfig(contentType, config) {
    return (contentTypesConfig[contentType] = config)
}
