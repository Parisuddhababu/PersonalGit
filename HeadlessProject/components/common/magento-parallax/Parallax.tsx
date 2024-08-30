import React, { FC, useRef, useEffect, useState } from 'react'
import s from './Parallax.module.scss'
import cn from 'classnames'
/**
 * A simple Parallax module
 * ToDo: Scroll value in pixcels. Not it is working with percentage only
 */
type propTypes = {
    classes?: [string]
    children?: any
}

const Parallax: FC<propTypes> = ({ classes, children }) => {
    const getYValue = (classes: [string]) => {
        let yVal = '100'
        classes.forEach((value, index) => {
            if (value.match(/^parallax-y(.*)$/gm) !== null) {
                yVal = value.replace('parallax-y-', '')
            }
        })
        return yVal
    }

    const getYUnit = (yVal: string) => {
        let yUnitVal = '%'

        if (yVal.match(/^[0-9](.*px)$/gm) !== null) {
            yUnitVal = 'px'
        }

        return yUnitVal
    }

    const divRef = useRef<HTMLDivElement>(null)!

    const isScrollParallax = classes?.includes('parallax-scroll')
    const isReverseScroll = classes?.includes('parallax-scroll-reverse')
    const isFadeOnScroll = classes?.includes('parallax-fade')
    const yValTmp = getYValue(classes!)

    const yUnitVal = yValTmp !== '' ? getYUnit(yValTmp) : '%'

    const yVal = parseInt(yValTmp?.replace(yUnitVal, ''))

    const [y, setY] = useState<number>(yVal > 0 ? yVal : 100)

    const handleScroll = (el: HTMLElement) => {
        if (null !== el) {
            const rect = el.getBoundingClientRect()
            const scrollPercentage =
                yUnitVal == 'px' ? yVal : (rect.height * yVal) / 100
            const reverseTop = isScrollParallax
                ? rect.bottom - scrollPercentage
                : rect.bottom
            const scrollStraight = isScrollParallax
                ? rect.top - scrollPercentage
                : rect.top
            const rectTop = isReverseScroll ? reverseTop : scrollStraight

            const windowHeight =
                window.innerHeight || document.documentElement.clientHeight
            const isInView = rectTop <= windowHeight || rectTop <= 0

            if (isInView) {
                if (isScrollParallax) {
                    setY(
                        (rectTop / windowHeight) * 100 +
                            (yUnitVal == 'px' ? 1 : 0)
                    )
                    if (isFadeOnScroll) {
                        const fadePercentage = rect.bottom / windowHeight
                        if (fadePercentage < 0.4) {
                            divRef.current!.style.opacity = `${0}`
                        } else {
                            divRef.current!.style.opacity = `${1}`
                        }
                    }
                } else {
                    setY(0)
                }
            } else if (!isScrollParallax) {
                setY(yVal)
            }

            return isInView
        }
    }

    useEffect(() => {
        if (divRef !== null) {
            window.addEventListener(
                'scroll',
                function () {
                    handleScroll(divRef.current!)!
                },
                false
            )
            handleScroll(divRef.current!)!
            return () =>
                window.removeEventListener(
                    'scroll',
                    function () {
                        handleScroll(divRef.current!)!
                    },
                    false
                )
        }
    }, [divRef])

    return (
        <div
            style={{
                transform: `translate3d(0,${
                    isReverseScroll ? y * -1 : y
                }${yUnitVal},0)`
            }}
            ref={divRef}
            className={cn(
                s['parallax-wrapper'],
                isScrollParallax ? s['transition-none'] : '',
                'parallax-wrapper'
            )}
        >
            {children}
        </div>
    )
}
export default Parallax
