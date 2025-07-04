import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment,
    getIsHidden
} from '../../utils'

const configAggregator = (node, props) => {
    // Determine which node holds the data for the appearance
    const dataNode =
        props.appearance === 'contained' ? node.childNodes[0] : node
    const videoOverlayColor =
        props.appearance === 'full-width' || props.appearance === 'full-bleed'
            ? node.childNodes[0] &&
              node.childNodes[0].getAttribute('data-video-overlay-color')
            : dataNode.childNodes[0] &&
              dataNode.childNodes[0].getAttribute('data-video-overlay-color')

    return {
        minHeight: dataNode.style.minHeight ? dataNode.style.minHeight : null,
        ...getVerticalAlignment(dataNode),
        backgroundColor: dataNode.style.backgroundColor
            ? dataNode.style.backgroundColor
            : null,
        ...getBackgroundImages(dataNode),
        enableParallax: dataNode.getAttribute('data-enable-parallax') === '1',
        parallaxSpeed: parseFloat(dataNode.getAttribute('data-parallax-speed')),
        backgroundType: dataNode.getAttribute('data-background-type'),
        videoSrc: dataNode.getAttribute('data-video-src'),
        videoFallbackSrc: dataNode.getAttribute('data-video-fallback-src'),
        videoLoop: dataNode.getAttribute('data-video-loop') === 'true',
        videoPlayOnlyVisible:
            dataNode.getAttribute('data-video-play-only-visible') === 'true',
        videoLazyLoading:
            dataNode.getAttribute('data-video-lazy-load') === 'true',
        videoOverlayColor: videoOverlayColor || null,
        ...getAdvanced(dataNode),
        ...getIsHidden(node)
    }
}

export default configAggregator
