import { getAdvanced } from '../../utils'

const configAggregator = (node) => {
    return {
        minHeight: node.style.minHeight,
        autoplay: node.getAttribute('data-autoplay') === 'true',
        autoplaySpeed: parseInt(node.getAttribute('data-autoplay-speed')),
        fade: node.getAttribute('data-fade') === 'true',
        infinite: node.getAttribute('data-infinite-loop') === 'true',
        showArrows: node.getAttribute('data-show-arrows') === 'true',
        showDots: node.getAttribute('data-show-dots') === 'true',
        additionalConfig: node.getAttribute('data-additional-config'),
        ...getAdvanced(node)
    }
}

export default configAggregator
