import React from 'react'
import ContentTypeFactory from './factory'
import parseStorageHtml from './parseStorageHtml'

/**
 * Page Builder component for rendering Page Builder master storage format in React
 *
 * @param data
 * @returns {*}
 * @constructor
 */
const PageBuilder = ({
    masterFormat,
    isLazyLoad,
    ProductTile,
    productQuery
}) => {
    const data = parseStorageHtml(masterFormat)
    if (!data.children) {
        return null
    }

    return data.children.map((child, i) => {
        return (
            <ContentTypeFactory
                key={i}
                data={child}
                isLazyLoad={isLazyLoad}
                ProductTile={ProductTile}
                productQuery={productQuery}
            />
        )
    })
}

export default PageBuilder
