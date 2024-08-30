import React, { Suspense } from 'react'
import getContentTypeConfig from './config'
import dynamic from 'next/dynamic'

import 'react-perfect-scrollbar/dist/css/styles.css'
const Parallax = dynamic(() => import('@components/common/magento-parallax'))
const PerfectScrollbar = dynamic(() => import('react-perfect-scrollbar'))

/**
 * Render a content type
 * @param Component
 * @param data
 * @returns {*}
 */
const renderContentType = (
    Component,
    data,
    AddToWishlist,
    AddToWishlistLabel,
    globalOptions,
    isLazyLoad,
    ProductTile,
    productQuery,
    extendedContentTypeConfig
) => {
    return (
        <Component
            {...data}
            AddToWishlist={AddToWishlist}
            AddToWishlistLabel={AddToWishlistLabel}
            globalOptions={globalOptions}
            isLazyLoad={isLazyLoad}
            ProductTile={ProductTile}
            productQuery={productQuery}
        >
            {data.children.map((childTreeItem, i) => (
                <ContentTypeFactory
                    key={i}
                    data={childTreeItem}
                    AddToWishlist={AddToWishlist}
                    AddToWishlistLabel={AddToWishlistLabel}
                    globalOptions={globalOptions}
                    isLazyLoad={isLazyLoad}
                    ProductTile={ProductTile}
                    productQuery={productQuery}
                    extendedContentTypeConfig={extendedContentTypeConfig}
                />
            ))}
        </Component>
    )
}

/**
 * Create an instance of a content type component based on configuration
 *
 * @param data
 * @returns {*}
 * @constructor
 */
const ContentTypeFactory = ({
    data,
    AddToWishlist,
    AddToWishlistLabel,
    isLazyLoad,
    ProductTile,
    productQuery,
    extendedContentTypeConfig
}) => {
    const { isHidden, ...props } = data

    const globalOptions = {}

    if (isHidden) {
        return null
    }

    const contentTypeConfig = getContentTypeConfig(
        props.contentType,
        extendedContentTypeConfig
    )
    if (contentTypeConfig && contentTypeConfig.component) {
        const renderComponent = (
            <Suspense fallback="">
                {renderContentType(
                    contentTypeConfig.component,
                    props,
                    AddToWishlist,
                    AddToWishlistLabel,
                    globalOptions,
                    isLazyLoad,
                    ProductTile,
                    productQuery,
                    extendedContentTypeConfig
                )}
            </Suspense>
        )

        if (props.cssClasses && props.cssClasses.includes('magento-parallax')) {
            return (
                <Parallax classes={props.cssClasses}>
                    {renderComponent}
                </Parallax>
            )
        } else if (
            props.cssClasses &&
            props.cssClasses.includes('magento-scrollbar')
        ) {
            return (
                <PerfectScrollbar>
                    <div className="scrollbar-wrap">{renderComponent}</div>
                </PerfectScrollbar>
            )
        } else {
            return renderComponent
        }
    }

    return null
}

export default ContentTypeFactory
