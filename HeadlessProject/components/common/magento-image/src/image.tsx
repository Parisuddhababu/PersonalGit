import NextImage, { ImageProps } from 'next/image'

const Image = (props: ImageProps): JSX.Element => (
    <NextImage {...props} />
)

const mediaBaseEnv = process.env.NEXT_PUBLIC_MEDIA_BASE_URL

// Tests if a URL begins with `http:` or `https:` or `data:`
const patternForAbsoluteUrl = /^(data|http|https)?:/i

// Simple path joiner that guarantees one and only one slash between segments
const joinUrls = (base: string, url: string): string =>
    `${base.endsWith('/') ? base.slice(0, -1) : base}/${
        url.startsWith('/') ? url.slice(1) : url
    }`

// If the URL is relative, we need an absolute URL to make the URL object
const buildUrlFromRelative = (relative: string): string =>
    `https://example.com${relative}`

type ImageLoaderProps = {
    src: string
    ignoreBaseUrl?: boolean
    width?: number
    quality?: number
}

export const getFastlyUrl = ({
    src,
    width,
    quality = 50,
    ignoreBaseUrl = false
}: ImageLoaderProps): string => {
    const isSourceAbsolute = patternForAbsoluteUrl.test(src)

    // if the URL is relative, add a sample base to it, just for purpose of creating the URL object
    const url = new URL(isSourceAbsolute ? src : buildUrlFromRelative(src))

    // if the media base env var is provided, use that as the media base url
    // if the env var is not provided, use the origin of the URL object
    const mediaBaseUrl =
        mediaBaseEnv && mediaBaseEnv !== '' ? mediaBaseEnv : url.origin

    const searchParams = new URLSearchParams(url.search)

    if (width) {
        searchParams.set('width', String(width))
    }

    searchParams.set('quality', String(quality))
    searchParams.set('auto', 'webp')
    searchParams.set('format', 'pjpg')

    if (ignoreBaseUrl) {
        return `${src}?${searchParams.toString()}`
    }

    return `${joinUrls(mediaBaseUrl, url.pathname)}?${searchParams.toString()}`
}

export default Image
