import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment
} from '../../utils'

export const configAggregator = (node) => {
    return {
        minHeight: node.style.minHeight ? node.style.minHeight : null,
        display: node.style.display,
        width: node.style.width,
        backgroundColor: node.style.backgroundColor,
        ...getAdvanced(node),
        ...getBackgroundImages(node),
        ...getVerticalAlignment(node)
    }
}

export default configAggregator
