import {
    getBorder,
    getCssClasses,
    getIsHidden,
    getMargin,
    getPadding,
    getTextAlign
} from '../../utils'

const configAggregator = (node) => {
    const iframe = node.querySelector('iframe')
    const video = node.querySelector('video')
    const wrapper = node.querySelector('[data-element="wrapper"]')

    return {
        url:
            (iframe && iframe.getAttribute('src')) ||
            (video && video.getAttribute('src')) ||
            null,
        mobVideoURL: iframe.getAttribute('data-mobile-video-source'),
        loop: iframe.getAttribute('data-video-loop'),
        autoplay: !!(video && video.getAttribute('autoplay') === 'true'),
        muted: !!(video && video.getAttribute('muted') === 'true'),
        maxWidth: node.childNodes[0].style.maxWidth || null,
        ...getTextAlign(node),
        ...getMargin(node),
        ...getBorder(wrapper),
        ...getPadding(wrapper),
        ...getCssClasses(node),
        ...getIsHidden(node)
    }
}

export default configAggregator
