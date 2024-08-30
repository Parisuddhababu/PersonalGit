import { getAdvanced } from '../../utils'

const configAggregator = (node) => {
    return {
        content: node.innerHTML,
        ...getAdvanced(node)
    }
}

export default configAggregator
