import { getAdvanced } from '../../utils'

export const configAggregator = (node) => {
    return {
        text: node.textContent,
        headingType: node.nodeName.toLowerCase(),
        ...getAdvanced(node)
    }
}

export default configAggregator
