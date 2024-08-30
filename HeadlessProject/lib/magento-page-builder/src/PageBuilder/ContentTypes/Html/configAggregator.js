import { getAdvanced } from '../../utils'

const configAggregator = (node) => {
    if (typeof window === 'undefined') {
        return {
            html: node.textContent,
            ...getAdvanced(node)
        }
    }
    
    const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + node.textContent,
        'text/html'
    )
    return {
        html: dom.body.innerHTML,
        ...getAdvanced(node)
    }
}

export default configAggregator
