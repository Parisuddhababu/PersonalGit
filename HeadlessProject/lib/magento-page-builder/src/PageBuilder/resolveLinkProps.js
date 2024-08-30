// import { getStoreConfig } from 'config'
import { deepValue } from '@components/common/utils'

const config = {}

const getPylotBaseUrl = () => {
    const pylotBaseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : deepValue(config, ['base', 'url', 'baseUrl'], '')
    return pylotBaseUrl.replace(/\/$/, '')
}

/**
 * create Pylot format link
 * @param {string} link
 * @param {product / category / page} linkType
 */
const buildPylotLink = (link, linkType) => {
    const pylotBaseUrl = getPylotBaseUrl()
    const urlObj = new URL(link, pylotBaseUrl)
    const extension = /.html/i
    const slugEnding = `${urlObj.pathname}${urlObj.search}`.replace(
        extension,
        ''
    )
    let slug

    switch (linkType) {
        case 'product':
            slug = '/product' + slugEnding
            break
        case 'category':
            slug = '/category' + slugEnding
            break
        case 'page':
            slug = '/content' + slugEnding
            break
        default:
            slug = slugEnding
    }
    return pylotBaseUrl + slug
}
/**
 * Resolve link properties
 *
 * @param {string} link
 * @param {string} linkType
 */
const linkResolver = (link, linkType) => {
    const linkProps = {}
    const pylotBaseUrl = getPylotBaseUrl()
    const magentoUrl = deepValue(config, ['base', 'url', 'magentoBaseUrl'], '')
    const baseUrl = deepValue(config, ['base', 'url', 'baseUrl'], '')

    try {
        const backendUrlObj = magentoUrl ? new URL(magentoUrl) : ''
        const pylotUrlObj = new URL(pylotBaseUrl)
        const baseUrlObj = new URL(baseUrl)
        const urlObj = new URL(link, pylotBaseUrl)
        const isExternalUrl =
            urlObj.host !== pylotUrlObj.host &&
            urlObj.host !== backendUrlObj.host &&
            urlObj.host !== baseUrlObj.host

        if (isExternalUrl) {
            linkProps['href'] =
                linkType != 'default' ? buildPylotLink(link, linkType) : link
        } else {
            linkProps['to'] = buildPylotLink(link, linkType)
            linkProps['href'] = linkProps['to']
        }
    } catch (e) {
        console.log(e)
    }

    return linkProps
}

export default linkResolver
