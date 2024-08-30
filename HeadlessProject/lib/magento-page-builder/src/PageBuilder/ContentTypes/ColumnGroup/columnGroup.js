import React, { useContext } from 'react'
import defaultClasses from './columnGroup.module.scss'
import { mergeClasses } from '../../classify'
import { shape, string } from 'prop-types'

import dynamic from 'next/dynamic'
const SlickSlider = dynamic(() => import('react-slick'))
// import { useWindowSize } from '@magento/peregrine';
// import { OptionsStore } from '@corratech/context-provider';
/**
 * Page Builder ColumnGroup component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef ColumnGroup
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that wraps {@link Column} components.
 */
const ColumnGroup = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes)
    const { display, children } = props
    // const windowSize = useWindowSize();
    const windowSize = typeof window !== 'undefined' ? window : {}
    // const projectConfig = useContext(OptionsStore) || {};
    const projectConfig = {}
    const columnGroupConfig = projectConfig.pageBuilder
        ? projectConfig.pageBuilder.columnGroup
        : {}
    const sliderSettings = columnGroupConfig.slider || {}
    const sliderPort = columnGroupConfig.sliderPort || 767
    const dynamicStyles = {
        display
    }
    const defaultSettings = {
        dots: true,
        arrows: true,
        infinite: false,
        autoplay: false,
        slidesToShow: 1
    }
    const isMobile = windowSize.innerWidth < sliderPort

    const hasSliderClass = () => {
        let result = true
        const sliderClass = columnGroupConfig.sliderClass || 'device-slider'

        for (let child in children) {
            if (!children[child]?.props?.data?.cssClasses?.includes(sliderClass)) {
                result = false
                break
            }
        }
        return result
    }

    /**
     * Merge slider configuarations
     * @type {{}}
     */
    const mergeSettings = { ...defaultSettings, ...sliderSettings }

    const columnSlider = () => {
        return isMobile ? (
            <SlickSlider {...mergeSettings}>{children}</SlickSlider>
        ) : (
            children
        )
    }

    return (
        <div style={dynamicStyles} className={classes.root}>
            {hasSliderClass() ? columnSlider() : children}
        </div>
    )
}

/**
 * Props for {@link ColumnGroup}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the ColumnGroup
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} display CSS display property
 */
ColumnGroup.propTypes = {
    classes: shape({
        root: string
    }),
    display: string
}

export default ColumnGroup
