import {
    getAdvanced,
    getBackgroundImages,
    getVerticalAlignment
} from '../../utils'

const configAggregator = (node) => {
    return {
        tabName: node.getAttribute('data-tab-name'),
        minHeight: node.style.minHeight,
        ...getVerticalAlignment(node),
        backgroundColor: node.style.backgroundColor,
        ...getBackgroundImages(node),
        ...getAdvanced(node)
    }
}

export default configAggregator
