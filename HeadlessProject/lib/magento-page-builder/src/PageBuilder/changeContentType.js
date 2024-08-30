/**
 * Set the content type for Page Builder
 * Custom functionlaity
 */
const renderContentType = (data, contentType) => {
    const { children } = data

    if (children && children.length) {
        children.map((child, index) => {
            if (
                contentType[child.contentType] &&
                child.cssClasses.includes(
                    contentType[child.contentType]['classes']
                )
            ) {
                if ('props' in contentType[child.contentType]) {
                    child['settings'] = contentType[child.contentType]['props']
                }
                child.contentType = contentType[child.contentType]['type']
            }
            renderContentType(child, contentType)
        })
    }

    return data
}

export default renderContentType
