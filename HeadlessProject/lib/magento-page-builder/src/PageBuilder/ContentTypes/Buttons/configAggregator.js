import { getAdvanced } from '../../utils'

const configAggregator = (node) => {
    return {
        isSameWidth: node.getAttribute('data-same-width') === 'true',
        ...getAdvanced(node)
    }
}

export default configAggregator
