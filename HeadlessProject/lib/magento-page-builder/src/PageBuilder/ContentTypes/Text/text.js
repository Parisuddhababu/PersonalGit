import React, { useEffect } from 'react'
import { arrayOf, shape, string } from 'prop-types'
import { mergeClasses } from '../../classify'
import defaultClasses from './text.module.scss'
import { useAnchorNavigation } from '../../useAnchorNavigation'
import { getFastlyUrl } from '@components/common/magento-image'

const toHTML = (str) => ({ __html: str })
const HEADER_OFFSET = 55
/**
 * Page Builder Text component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Text
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Text content type which contains content.
 */
const Text = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const {
        content: contentRaw,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props

    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    }

    const textRef = useAnchorNavigation(contentRaw)

    let content = contentRaw

    // Social media images are rendered through dangerouslySetInnerHTML, meaning
    // images can not be customized directly by modifying attributes.
    // The solution is to replace them manually inside content.
    if (cssClasses.includes('socialmedia-icons')) {
        const optimizedUrl = getFastlyUrl({
            src: '.png',
            quality: 80,
            width: 32,
            ignoreBaseUrl: true
        })

        content = content.replace(/\.png/g, optimizedUrl)
    }

    useEffect(() => {
        const radioBtn = document.querySelectorAll(
            'input[type="radio"][name="accordion"]'
        )

        if (radioBtn.length > 0) {
            radioBtn.forEach((button) => {
                button.onclick = closeFooterAccordion
                return function cleanUp() {
                    button.onclick = null
                }
            })
        }

        function closeFooterAccordion() {
            radioBtn.forEach((radio) => {
                if (radio === this) {
                    if (radio.classList.contains('selected')) {
                        radio.checked = false
                        radio.classList.remove('selected')
                    } else {
                        radio.classList.add('selected')
                    }
                } else {
                    radio.classList.remove('selected')
                }
            })
        }
    }, [])

    // 'pb-text-root' class was added in order to allow modify component styles
    // from outside of pagebuilder in parent components.
    return (
        <div
            ref={textRef}
            style={dynamicStyles}
            className={[classes.root, ...cssClasses, 'pb-text-root'].join(' ')}
            dangerouslySetInnerHTML={toHTML(content)}
        />
    )
}

/**
 * Props for {@link Text}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Text
 * @property {String} classes.root CSS class for the root text element
 * @property {String} content Content to be rendered within the content type
 * @property {String} textAlign Alignment of content within the text
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Text.propTypes = {
    classes: shape({
        root: string
    }),
    content: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
}

export default Text
