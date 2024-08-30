import React from 'react'
import parseStorageHtml from './parseStorageHtml'
import ContentTypeFactory from './factory'
import renderContentType from './changeContentType'
import { string, object } from 'prop-types'

const PageBuilderExtend = ({
    masterFormat,
    contentType = {},
    isLazyLoad,
    ProductTile,
    productQuery,
    extendedContentTypeConfig
}) => {
    const data = parseStorageHtml(masterFormat)
    const { isHidden, ...props } = data

    if (isHidden) {
        return null
    }

    const renderContent = renderContentType(data, contentType).children

    if (!renderContent) return null

    return renderContent.map((child, i) => {
        return (
            <ContentTypeFactory
                key={i}
                data={child}
                isLazyLoad={isLazyLoad}
                ProductTile={ProductTile}
                productQuery={productQuery}
                extendedContentTypeConfig={extendedContentTypeConfig}
            />
        )
    })
}

PageBuilderExtend.propTypes = {
    masterFormat: string,
    contentType: object
}

export default PageBuilderExtend
