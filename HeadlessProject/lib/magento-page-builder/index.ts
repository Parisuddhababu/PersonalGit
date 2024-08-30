import RichContentBase from './src/richContent'
import React from 'react'
import { Maybe } from '@graphql/schema/magentoSchema'

type RichContentProps = {
    classes?: {
        root: string
    }
    html?: Maybe<string>
    extend?: boolean
    config?: any
    isLazyLoad?: boolean
    ProductTile?: React.ElementType
    productQuery?: string
    extendedContentTypeConfig?: any
}

export const RichContent = RichContentBase as React.FC<RichContentProps>
