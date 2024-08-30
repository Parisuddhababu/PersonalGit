import React, { memo } from 'react'
import detectPageBuilder from './PageBuilder/detectPageBuilder'
import PageBuilder from './PageBuilder'
import PageBuilderExtend from './PageBuilder/PageBuilderExtend'
import { mergeClasses } from './PageBuilder/classify'
import defaultClasses from './richContent.module.scss'
import { shape, string, bool, object } from 'prop-types'
import { useAnchorNavigation } from './PageBuilder/useAnchorNavigation'

const toHTML = (str) => ({ __html: str })

const emptyCheck = () => {
    const visited = new WeakSet()
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (visited.has(value)) {
                return
            }
            visited.add(value)
        }
        return value
    }
}

/**
 * RichContent component.
 *
 * This component serves as the pool to determine which type of content is being rendered
 * and pass the data off to the correct system.
 *
 * @typedef RichContent
 * @kind functional component
 *
 * @param {Object} props React component props
 *
 * @returns {React.Element} A React component that renders Heading with optional styling properties.
 */
const RichContent = (props) => {
    const {
        html,
        config,
        extend,
        isLazyLoad,
        ProductTile,
        productQuery,
        extendedContentTypeConfig
    } = props

    const classes = mergeClasses(defaultClasses, props.classes)

    if (detectPageBuilder(html)) {
        if (extend) {
            return (
                <div className={classes.root}>
                    <PageBuilderExtend
                        masterFormat={html}
                        contentType={config}
                        isLazyLoad={isLazyLoad}
                        ProductTile={ProductTile}
                        productQuery={productQuery}
                        extendedContentTypeConfig={extendedContentTypeConfig}
                    />
                </div>
            )
        } else {
            return (
                <div className={classes.root}>
                    <PageBuilder
                        masterFormat={html}
                        isLazyLoad={isLazyLoad}
                        ProductTile={ProductTile}
                        productQuery={productQuery}
                    />
                </div>
            )
        }
    }

    return <PlainHtmlComponent classes={classes} html={html} />
}

const PlainHtmlComponent = ({ html, classes }) => {
    const wrapperRef = useAnchorNavigation(html)
    return (
        <div
            ref={wrapperRef}
            className={classes.root}
            dangerouslySetInnerHTML={toHTML(html)}
        />
    )
}

/**
 * Props for {@link RichContent}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the RichContent
 * @property {String} classes.root CSS class for the root container element
 * @property {String} html Content
 */
RichContent.propTypes = {
    classes: shape({
        root: string
    }),
    html: string,
    extend: bool,
    config: object,
    isLazyLoad: bool
}

RichContent.defaultProps = {
    isLazyLoad: true
}

export default memo(
    RichContent,
    (prevProps, nextProps) =>
        // The order of object key-value pairs is always the same
        // therefore JSON.stringify is acceptable here
        JSON.stringify(prevProps, emptyCheck()) ===
        JSON.stringify(nextProps, emptyCheck())
)
