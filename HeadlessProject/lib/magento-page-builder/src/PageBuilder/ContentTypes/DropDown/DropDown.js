import React, { useState, useEffect } from 'react'
import { arrayOf, number, string, object, bool } from 'prop-types'
import Select from 'react-select'
import { useCookies, Cookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'

const REGIONAL_COOKIE = 'regional-preference-url'

const DropDown = (props) => {
    const [t] = useTranslation()
    const [selectedOption, setSelectedOption] = useState()
    const [loading, setLoading] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies([REGIONAL_COOKIE])

    /**
     * Props
     * @type {number}
     */
    const {
        defaultIndex = 0,
        headers = [],
        textAlign,
        children,
        settings
    } = props

    const optionArray = []
    const { cookieAllowed, cookieConfig } = settings

    useEffect(() => {
        setSelectedOption(getOptions()[defaultIndex])
    }, [])

    const hasListedDomain = (value) => {
        return cookieAllowed.some((allowed) => value.includes(allowed))
    }

    const onShopButton = () => {
        //set loading
        setLoading(true)
        //remoev if any cookie present
        if (hasListedDomain(selectedOption.value)) {
            if (cookies[REGIONAL_COOKIE]) removeCookie(REGIONAL_COOKIE)
            setCookie(REGIONAL_COOKIE, selectedOption, cookieConfig)
        }
        window.location.replace(selectedOption.value)
    }

    //Recurrening method to get the child
    const getOptions = () => {
        let value = []

        if (children.length) {
            children.map((child) => {
                function innerChild(inner) {
                    if (inner.length) {
                        inner.map((innerchildren) => {
                            if (
                                innerchildren.contentType === 'button-item' &&
                                innerchildren.cssClasses.includes(
                                    'drop-down-option'
                                )
                            ) {
                                value.push({
                                    label: innerchildren.text,
                                    value: innerchildren.link
                                })
                            }
                            innerChild(innerchildren.children)
                        })
                    }
                }
                innerChild(child.props.data.children)
            })
        }

        return value
    }

    return (
        <div className="tab-dropdown">
            <Select
                defaultValue={getOptions()[defaultIndex]}
                disabled={loading}
                className="react-select-container"
                classNamePrefix="react-select"
                onChange={(value) => setSelectedOption(value)}
                isSearchable={false}
                options={getOptions()}
            />
            <button
                onClick={onShopButton}
                disabled={loading}
                variant="secondary"
            >
                {'Shop'}
            </button>
        </div>
    )
}

DropDown.propTypes = {
    defaultIndex: number,
    headers: arrayOf(string),
    textAlign: string,
    settings: object,
    showTabLinks: bool
}

DropDown.defaultProps = {
    settings: {
        sliderSettings: {},
        showTabLinks: false
    }
}

export default DropDown
