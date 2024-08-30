import { getAdvanced } from '../../utils'

const configAggregator = (node) => {
    const childNode = Array.from(node.childNodes)
    const htmlContent = childNode.find(
        (element) => element.innerHTML && element.innerHTML.length > 0
    )

    return {
        richContent: htmlContent ? htmlContent.innerHTML : '',
        ...getAdvanced(node)
    }
}

export default configAggregator
