import React from 'react'
import defaultClasses from './image.module.scss'
import { arrayOf, bool, oneOf, shape, string } from 'prop-types'
import resolveLinkProps from '../../resolveLinkProps'
import { mergeClasses } from '../../classify'
import Link from 'next/link'
import { makeOptimizedUrl as resourceUrl } from '../../makeUrl'
import NextImage from '@components/common/magento-image'
import { getFastlyUrl } from '@components/common/magento-image'
import Head from "next/head";
// import {Image} from "@graphcommerce/image";

const SourceFragment = ({
    mobileImage,
    fastlyOptimizeQuality,
    imageQuality
}) => {
    if (!mobileImage) return null

    return (
        <source
            media="(max-width: 767px)"
            // TODO: fix the logic with resourceURL.
            // Right now it is not used as intended and probably should be removed, as
            // one of the options is to use next image component at the end, which do not require
            // fastly-friendly url
            srcSet={resourceUrl(mobileImage, {
                type: 'image-wysiwyg',
                quality: 20
            })}
        />
    )
}

const PicturePB = (props) => {
    const {
        width,
        height,
        resourceSrc,
        classes,
        altText,
        title,
        imageStyles,
        isLazyLoad,
        imageQuality
    } = props

    const imageDimensions = { width, height }

    // TODO: think about the flag when to load image
    // with the layout fill

    // if both width and height are numbers
    if (width && height) {
        return (
            <NextImage
                src={resourceSrc}
                className={classes.img}
                alt={altText || title}
                style={imageStyles}
                quality="20"
                {...imageDimensions}
            />
        )
    }

    // const resourceSrcOptimized = getFastlyUrl({
    //     src: resourceSrc,
    //     quality: 20
    // })

    return (
        // <img
        //     src={resourceSrc}
        //     className={classes.img}
        //     alt={altText || title}
        //     style={imageStyles}
        //     {...(width) && { width }}
        //     {...(height) && { height }}
        // />
        <NextImage
            src={resourceSrc}
            className={classes.img}
            alt={altText || title}
            style={imageStyles}
            quality="20"
            {...imageDimensions}
        />
        // <graphImage
        //     src={resourceSrc}
        //     layout="fill"
        //     // width={640}
        //     // height={360}
        //     // objectFit="contain"
        //     // className={classes.backgroundAsImage}
        //     loading='eager'
        //     unoptimized={false}
        // />
    )
}

/**
 * Page Builder Image component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Image
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays an Image.
 */
const Image = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const {
        desktopImage,
        mobileImage,
        altText,
        title,
        link,
        linkType,
        openInNewTab,
        caption,
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
        imageQuality,
        cssClasses = [],
        globalOptions,
        isLazyLoad,
        imgWidth,
        imgHeight,
        imgWidthMob,
        imgHeightMob
    } = props

    console.log("image", props)

    const figureStyles = {
        textAlign,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    }
    const imageStyles = {
        border,
        borderColor,
        borderWidth,
        borderRadius
    }

    // TODO: think about the isMobile for bageBuilder
    const windowSize = typeof window !== 'undefined' ? window : {}
    const isMobile =
        windowSize.innerWidth <=
        (globalOptions.viewport ? globalOptions.viewport.mobile || 767 : '')

    // Don't render anything if there is no image to be rendered
    if (!desktopImage && !mobileImage) {
        return null
    }

    const resourceSrc = resourceUrl(desktopImage, {
        type: 'image-wysiwyg',
        quality: imageQuality,
        optimizeQuality: (globalOptions || {}).fastlyOptimizeQuality
    })

    const PictureWithWrapper = () => {
        const width = isMobile ? imgWidthMob : imgWidth
        const height = isMobile ? imgHeightMob : imgHeight

        const mobileUrl = mobileImage
            ? getFastlyUrl({ src: mobileImage, quality: imageQuality })
            : getFastlyUrl({ src: desktopImage, quality: imageQuality })

        return (
            <>
                {/*<picture>*/}
                {/*    /!* TODO: start utilizing this component if it brings any benefit. *!/*/}
                {/*    <SourceFragment*/}
                {/*        mobileImage={mobileUrl}*/}
                {/*        imageQuality={imageQuality}*/}
                {/*        fastlyOptimizeQuality={*/}
                {/*            (globalOptions || {}).fastlyOptimizeQuality*/}
                {/*        }*/}
                {/*    />*/}
                {/*    <PicturePB*/}
                {/*        width={width}*/}
                {/*        height={height}*/}
                {/*        resourceSrc={resourceSrc}*/}
                {/*        classes={classes}*/}
                {/*        altText={altText}*/}
                {/*        title={title}*/}
                {/*        imageStyles={imageStyles}*/}
                {/*        isLazyLoad={isLazyLoad}*/}
                {/*        imageQuality={imageQuality}*/}
                {/*    />*/}
                {/*</picture>*/}
                <graphImage
                    src={desktopImage}
                    layout="fill"
                    // width={640}
                    // height={360}
                    // objectFit="contain"
                    // className={classes.backgroundAsImage}
                    loading='eager'
                    unoptimized={false}
                />
                {caption && <figcaption>{caption}</figcaption>}
            </>
        )
    }

    // if (typeof link === 'string') {
    //     const linkProps = resolveLinkProps(link, linkType)
    //     return (
    //         <figure style={figureStyles} className={cssClasses.join(' ')}>
    //             {
    //                 linkProps.to ? (
    //                         <Link
    //                             {...linkProps}
    //                         >
    //                             <a {...(openInNewTab ? { target: '_blank' } : '')}>
    //                                 <PictureWithWrapper />
    //                             </a>
    //                         </Link>
    //                     ) :
    //                     <a
    //                         {...linkProps}
    //                         {...(openInNewTab ? { target: '_blank' } : '')}
    //                     >
    //                         <PictureWithWrapper />
    //                     </a>
    //             }
    //         </figure>
    //     )
    // }

    return (
        // <figure style={figureStyles} className={cssClasses.join(' ')}>
        //     <PictureWithWrapper />
        // </figure>
        <>
            <Head>
                <link href={mobileImage} rel="preload" as="image" />
                <link href={desktopImage} rel="preload" as="image" />
            </Head>
            <NextImage
                src={desktopImage}
                className={cssClasses.join(' ') + ' banner-desktop-image'}
                quality="30"
                fill={true}
                loading="eager"
                style={{ objectFit: "cover" }}
            />
            <NextImage
                src={mobileImage}
                className={cssClasses.join(' ') + ' banner-mobile-image'}
                quality="30"
                fill={true}
                loading="eager"
                style={{ objectFit: "cover" }}
            />
        </>
    )
}

/**
 * Props for {@link Image}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Image
 * @property {String} classes.img CSS classes for the img element
 * @property {String} desktopImage URL src of the desktop image
 * @property {String} mobileImage URL src of the mobile image
 * @property {String} altText Alternate text
 * @property {String} title Title of the image
 * @property {String} link URL to redirect to
 * @property {String} linkType Type of link
 * @property {bool} openInNewTab Flag to indicate if link should be opened in a new tab
 * @property {String} caption Caption for the image
 * @property {String} textAlign Alignment of the divider within the parent container
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
 */
Image.propTypes = {
    classes: shape({
        img: string
    }),
    desktopImage: string,
    mobileImage: string,
    altText: string,
    title: string,
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
    caption: string,
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
    cssClasses: arrayOf(string)
}

export default Image
