import React, { useCallback } from 'react'
import { arrayOf, oneOf, string, bool } from 'prop-types'
import resolveLinkProps from '../../resolveLinkProps'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '@mui/material/Button';

/**
 * Page Builder ButtonItem component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef ButtonItem
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a button.
 */
const ButtonItem = (props) => {
    const {
        buttonType,
        link,
        linkType,
        openInNewTab = false,
        text,
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

    const dynamicInnerStyles = {
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

    const history = useRouter()
    let linkProps = {}
    let url = ''
    if (typeof link === 'string') {
        linkProps = resolveLinkProps(link, linkType)
        url = (linkProps.to ? linkProps.to : linkProps.href).trim()
    }

    const handleClick = useCallback(() => {
        if (!url) {
            return
        }

        if (openInNewTab) {
            window.open(url, '_blank')
        } else if (linkProps.to) {
            history.push(url)
        } else {
            window.location.assign(url)
        }
    }, [openInNewTab, url, linkProps.to]) // eslint-disable-line react-hooks/exhaustive-deps

    const justifyMap = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
    }
    if (textAlign) {
        dynamicInnerStyles.justifyContent = justifyMap[textAlign] || 'center'
        dynamicInnerStyles.textAlign = textAlign
    }

    return (
        <div className={cssClasses.length ? cssClasses.join(' ') : undefined}>
            {buttonType == 'link' ? (
                linkProps.to ? (
                        <Link
                            type="link"
                            className="links"
                            {...linkProps}
                            style={dynamicInnerStyles}
                        >
                            <a {...(openInNewTab ? { target: '_blank' } : '')}>
                                {text}
                            </a>
                        </Link>
                    ) :
                    <a
                        {...linkProps}
                        {...(openInNewTab ? { target: '_blank' } : '')}
                    >
                        {text}
                    </a>
            ) : (
                <Button variant={buttonType} onClick={handleClick}>
                    {text}
                </Button>
            )}
        </div>
    )
}

/**
 * Props for {@link ButtonItem}
 *
 * @typedef props
 *
 * @property {String} buttonType Sets button type option
 * @property {String} link Url to the page opened when button clicked
 * @property {String} linkType Type of the linked page
 * @property {String} openInNewTab Toggles the option to open linked page in the new tab
 * @property {String} text Button text
 * @property {String} textAlign Button text align
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
ButtonItem.propTypes = {
    buttonType: oneOf(['primary', 'secondary', 'link']),
    link: string,
    linkType: oneOf(['default', 'category', 'product', 'page']),
    openInNewTab: bool,
    text: string,
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
    paddingLeft: string,
    cssClasses: arrayOf(string)
}

export default ButtonItem
